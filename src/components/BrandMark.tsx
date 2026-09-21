import Link from "next/link";

export function BrandMark({ inverted = false }: { inverted?: boolean }) {
  return (
    <Link className={`brand-mark ${inverted ? "is-inverted" : ""}`} href="/" aria-label="رقي الجمال - الرئيسية">
      <span className="brand-mark__latin">RUQI AL JAMAL</span>
      <span className="brand-mark__arabic">رقي الجمال</span>
    </Link>
  );
}
