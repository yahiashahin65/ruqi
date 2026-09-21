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

  async function login(e: React.FormEvent) {
    e.preventDefault();
    if (!firebaseAuth || !isFirebaseClientConfigured()) {
      setError("أضف إعدادات Firebase Client أولا في Environment Variables");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const result = await signInWithEmailAndPassword(firebaseAuth, email, password);
      const idToken = await result.user.getIdToken();
      const response = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken })
      });
      if (!response.ok) throw new Error("تعذر إنشاء جلسة");
      router.replace("/admin");
      router.refresh();
    } catch {
      setError("البريد أو كلمة المرور غير صحيحة أو إعداد Firebase غير مكتمل");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={login}>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="البريد الإلكتروني" required />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="كلمة المرور" required />
      {error && <div className="notice">{error}</div>}
      <button className="button button--light" style={{width:"100%", marginTop:20}} disabled={loading}>
        {loading ? "جاري الدخول..." : "دخول الإدارة"}
      </button>
    </form>
  );
}
