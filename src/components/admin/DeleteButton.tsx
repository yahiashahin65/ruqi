"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function DeleteButton({ endpoint, returnTo, label = "حذف" }: { endpoint: string; returnTo: string; label?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function remove() {
    if (!window.confirm("هل أنت متأكد؟ لا يمكن التراجع عن الحذف.")) return;
    setLoading(true);
    const response = await fetch(endpoint, { method: "DELETE" });
    setLoading(false);
    if (!response.ok) {
      alert("تعذر الحذف. تحقق من الصلاحيات وحاول مرة أخرى.");
      return;
    }
    router.push(returnTo);
    router.refresh();
  }

  return (
    <button type="button" className="admin-danger-link" onClick={remove} disabled={loading}>
      {loading ? "جاري الحذف..." : label}
    </button>
  );
}
