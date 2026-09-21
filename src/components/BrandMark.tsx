import Link from "next/link";

function RuqiSymbol() {
  return (
    <svg
      className="brand-mark__symbol"
      viewBox="0 0 56 56"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 47V24C12 14.6 19.6 7 29 7s17 7.6 17 17v23" />
      <path d="M20 47V27.5C20 22.25 24.25 18 29.5 18S39 22.25 39 27.5V47" />
      <path d="M8 47h40" />
      <path d="M28 28h8" />
      <circle cx="16" cy="16" r="2.2" className="brand-mark__dot" />
    </svg>
  );
}

export function BrandMark({ inverted = false }: { inverted?: boolean }) {
  return (
    <Link className={`brand-mark ${inverted ? "is-inverted" : ""}`} href="/" aria-label="رقي الجمال - الرئيسية">
      <RuqiSymbol />
      <span className="brand-mark__copy">
        <strong className="brand-mark__arabic">رقي الجمال</strong>
        <small className="brand-mark__latin">RUQI AL JAMAL</small>
      </span>
    </Link>
  );
}
