"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import {
  firebaseAuth,
  isFirebaseClientConfigured
} from "@/lib/firebase/client";

type SessionErrorPayload = {
  error?: string;
  code?: string;
  firebaseCode?: string;
  missing?: string[];
};

function translateFirebaseAuthError(code?: string) {
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "البريد الإلكتروني أو كلمة المرور غير صحيحة";

    case "auth/invalid-email":
      return "صيغة البريد الإلكتروني غير صحيحة";

    case "auth/user-disabled":
      return "حساب الإدارة معطل في Firebase Authentication";

    case "auth/too-many-requests":
      return "تم إيقاف محاولات الدخول مؤقتا بسبب كثرة المحاولات. حاول لاحقا";

    case "auth/network-request-failed":
      return "تعذر الاتصال بخدمة Firebase. تحقق من الاتصال ثم حاول مرة أخرى";

    case "auth/operation-not-allowed":
      return "تسجيل الدخول بالبريد وكلمة المرور غير مفعل في Firebase Authentication";

    case "auth/invalid-api-key":
      return "NEXT_PUBLIC_FIREBASE_API_KEY غير صحيح";

    default:
      return "حدث خطأ أثناء تسجيل الدخول إلى Firebase";
  }
}

export function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [errorCode, setErrorCode] = useState("");
  const [details, setDetails] = useState("");

  const [loading, setLoading] = useState(false);

  async function login(e: React.FormEvent) {
    e.preventDefault();

    setError("");
    setErrorCode("");
    setDetails("");

    if (!firebaseAuth || !isFirebaseClientConfigured()) {
      setError("إعداد Firebase Client غير مكتمل");
      setErrorCode("FIREBASE_CLIENT_NOT_CONFIGURED");
      setDetails(
        "راجع متغيرات NEXT_PUBLIC_FIREBASE_* في Vercel ثم اعمل Redeploy."
      );
      return;
    }

    setLoading(true);

    try {
      // Stage 1: Firebase Authentication
      const result = await signInWithEmailAndPassword(
        firebaseAuth,
        email.trim(),
        password
      );

      const idToken = await result.user.getIdToken(true);

      // Stage 2: Create secure admin session
      const response = await fetch("/api/auth/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          idToken
        }),
        cache: "no-store"
      });

      const payload = (await response
        .json()
        .catch(() => ({}))) as SessionErrorPayload;

      if (!response.ok) {
        setError(payload.error || "تعذر إنشاء جلسة الإدارة");
        setErrorCode(
          payload.code || `SESSION_HTTP_${response.status}`
        );

        const diagnosticParts: string[] = [];

        if (payload.firebaseCode) {
          diagnosticParts.push(
            `Firebase: ${payload.firebaseCode}`
          );
        }

        if (payload.missing?.length) {
          diagnosticParts.push(
            `Missing env: ${payload.missing.join(", ")}`
          );
        }

        setDetails(diagnosticParts.join(" • "));
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch (err) {
      if (err instanceof FirebaseError) {
        setError(translateFirebaseAuthError(err.code));
        setErrorCode(err.code);
        setDetails(
          "الخطأ حدث في مرحلة Firebase Client Authentication قبل إنشاء جلسة الإدارة."
        );
      } else if (err instanceof Error) {
        setError("حدث خطأ غير متوقع أثناء تسجيل الدخول");
        setErrorCode("LOGIN_UNEXPECTED_ERROR");
        setDetails(err.message);
      } else {
        setError("حدث خطأ غير متوقع أثناء تسجيل الدخول");
        setErrorCode("LOGIN_UNKNOWN_ERROR");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={login}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="البريد الإلكتروني"
        autoComplete="username"
        required
      />

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="كلمة المرور"
        autoComplete="current-password"
        required
      />

      {error && (
        <div
          className="notice"
          role="alert"
          style={{
            marginTop: 18
          }}
        >
          <div>{error}</div>

          {errorCode && (
            <code
              dir="ltr"
              style={{
                display: "block",
                marginTop: 8,
                fontSize: 12,
                overflowWrap: "anywhere"
              }}
            >
              {errorCode}
            </code>
          )}

          {details && (
            <div
              dir="ltr"
              style={{
                marginTop: 8,
                fontSize: 12,
                opacity: 0.75,
                overflowWrap: "anywhere"
              }}
            >
              {details}
            </div>
          )}
        </div>
      )}

      <button
        className="button button--light"
        style={{
          width: "100%",
          marginTop: 20
        }}
        disabled={loading}
      >
        {loading ? "جاري الدخول..." : "دخول الإدارة"}
      </button>
    </form>
  );
}
