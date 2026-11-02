"use client";

import { useState } from "react";
import type { LeadStatus } from "@/lib/types";
import { LEAD_STATUS_LABELS } from "@/lib/constants";

export function LeadStatusSelect({
  id,
  initial,
  compact = false
}: {
  id: string;
  initial: LeadStatus;
  compact?: boolean;
}) {
  const [value, setValue] = useState<LeadStatus>(initial);
  const [saving, setSaving] = useState(false);

  async function changeStatus(nextStatus: LeadStatus) {
    const previous = value;

    setValue(nextStatus);
    setSaving(true);

    try {
      const response = await fetch(
        `/api/admin/leads/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            status: nextStatus
          })
        }
      );

      if (!response.ok) {
        setValue(previous);

        const payload = await response
          .json()
          .catch(() => ({}));

        window.alert(
          payload.error ||
            "تعذر تحديث حالة الطلب."
        );
      }
    } catch {
      setValue(previous);

      window.alert(
        "تعذر الاتصال بالخادم."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className={
        compact
          ? "lead-status-control lead-status-control--compact"
          : "lead-status-control"
      }
    >
      <select
        value={value}
        disabled={saving}
        aria-label="حالة الطلب"
        onChange={(event) =>
          changeStatus(
            event.target.value as LeadStatus
          )
        }
      >
        {Object.entries(
          LEAD_STATUS_LABELS
        ).map(([key, label]) => (
          <option
            value={key}
            key={key}
          >
            {label}
          </option>
        ))}
      </select>

      {saving && (
        <small>
          جاري الحفظ...
        </small>
      )}
    </div>
  );
}
