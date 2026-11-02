"use client";

import { useState } from "react";
import Image from "next/image";

export function BeforeAfter({
  before,
  after,
  title = "قبل / بعد"
}: {
  before: string;
  after: string;
  title?: string;
}) {
  const [value, setValue] = useState(54);

  return (
    <div className="before-after" style={{ "--split": `${value}%` } as React.CSSProperties}>
      <Image src={after} alt={`${title} - بعد`} fill sizes="100vw" />
      <div className="before-after__before">
        <Image src={before} alt={`${title} - قبل`} fill sizes="100vw" />
      </div>
      <div className="before-after__line">
        <span>↔</span>
      </div>
      <span className="before-after__label before-after__label--before">قبل</span>
      <span className="before-after__label before-after__label--after">بعد</span>
      <input
        aria-label="مقارنة قبل وبعد"
        type="range"
        min="2"
        max="98"
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
      />
    </div>
  );
}
