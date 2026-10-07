"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function DeleteButton({
  endpoint,
  returnTo,
  label = "حذف",
  confirmMessage = "هل أنت متأكد؟ لا يمكن التراجع عن الحذف."
}: {
  endpoint: string;
  returnTo: string;
  label?: string;
  confirmMessage?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function remove() {
    if (!window.confirm(confirmMessage)) return;

    setLoading(true);

    try {
      const response = await fetch(endpoint, {
        method: "DELETE"
      });

      const payload = await response
        .json()
        .catch(() => ({}));

      if (!response.ok) {
        window.alert(
          payload.error ||
            "تعذر الحذف. حاول مرة أخرى."
        );
        return;
      }

      router.push(returnTo);
      router.refresh();
    } catch {
      window.alert(
        "تعذر الاتصال بالخادم. حاول مرة أخرى."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      className="admin-danger-link"
      onClick={remove}
      disabled={loading}
    >
      {loading
        ? "جاري الحذف..."
        : label}
    </button>
  );
}
