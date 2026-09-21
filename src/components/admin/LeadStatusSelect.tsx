"use client";

import { useState } from "react";
import type { LeadStatus } from "@/lib/types";
import { LEAD_STATUS_LABELS } from "@/lib/constants";

export function LeadStatusSelect({ id, initial }: { id: string; initial: LeadStatus }) {
  const [value, setValue] = useState<LeadStatus>(initial);
  return (
    <select
      value={value}
      onChange={async (e) => {
        const status = e.target.value as LeadStatus;
        setValue(status);
        await fetch(`/api/admin/leads/${id}/status`, {
          method:"PATCH",
          headers:{ "Content-Type":"application/json" },
          body:JSON.stringify({ status })
        });
      }}
    >
      {Object.entries(LEAD_STATUS_LABELS).map(([key,label]) => <option value={key} key={key}>{label}</option>)}
    </select>
  );
}
