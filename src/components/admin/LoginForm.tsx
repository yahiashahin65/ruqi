"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth, isFirebaseClientConfigured } from "@/lib/firebase/client";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function login(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    if (!firebaseAuth || !isFirebaseClientConfigured()) {
      setError("تعذر تسجيل الدخول حاليا. حاول مرة أخرى بعد قليل.");
      return;
    }

    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(firebaseAuth, email.trim(), password);
      const idToken = await result.user.getIdToken(true);
      const response = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
        cache: "no-store"
      });
      if (!response.ok) throw new Error("session");
      router.replace("/admin");
      router.refresh();
    } catch {
      setError("تعذر تسجيل الدخول. تأكد من البريد وكلمة المرور ثم حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={login}>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="البريد الإلكتروني" autoComplete="username" required />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="كلمة المرور" autoComplete="current-password" required />
      {error && <div className="notice" role="alert">{error}</div>}
      <button className="button button--light" style={{ width: "100%", marginTop: 20 }} disabled={loading}>
        {loading ? "جاري الدخول..." : "دخول الإدارة"}
      </button>
    </form>
  );
}
