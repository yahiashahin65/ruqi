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
    <header
      className="page-hero"
      aria-labelledby="page-hero-title"
    >
      <div className="shell page-hero__grid">
        <p className="eyebrow">
          {eyebrow}
        </p>

        <div>
          <h1 id="page-hero-title">
            {title}
          </h1>

          {lead && (
            <p
              className="page-hero__lead"
              id="page-hero-description"
            >
              {lead}
            </p>
          )}
        </div>
      </div>
    </header>
  );
}
