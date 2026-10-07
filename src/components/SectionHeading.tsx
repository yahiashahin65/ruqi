export function SectionHeading({
  eyebrow,
  title,
  text
}: {
  eyebrow: string;
  title: React.ReactNode;
  text?: string;
}) {
  return (
    <div className="section-heading" data-reveal>
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {text && <p className="section-heading__text">{text}</p>}
    </div>
  );
}
