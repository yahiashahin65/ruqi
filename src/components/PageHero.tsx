export function PageHero({
  eyebrow,
  title,
  lead
}: {
  eyebrow: string;
  title: React.ReactNode;
  lead?: string;
}) {
  return (
    <section className="page-hero">
      <div className="shell page-hero__grid">
        <p className="eyebrow">{eyebrow}</p>
        <div>
          <h1>{title}</h1>
          {lead && <p className="page-hero__lead">{lead}</p>}
        </div>
      </div>
    </section>
  );
}
