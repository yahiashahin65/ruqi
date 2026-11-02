"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();
  return (
    <button
      className="button button--light"
      style={{minHeight:36, padding:"0 12px", fontSize:11}}
      onClick={async () => {
        await fetch("/api/auth/session", { method: "DELETE" });
        router.replace("/admin/login");
        router.refresh();
      }}
    >
      تسجيل الخروج
    </button>
  );
}
