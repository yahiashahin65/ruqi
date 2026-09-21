import Link from "next/link";

export default function NotFound() {
  return (
    <main className="page-main">
      <section className="page-hero"><div className="shell page-hero__inner">
        <p className="eyebrow eyebrow--latin">404</p>
        <h1>المساحة التي تبحث عنها<br />ليست هنا.</h1>
        <p>يمكنك الرجوع للمشاريع أو بدء مشروع جديد.</p>
        <div style={{display:"flex",gap:12,flexWrap:"wrap",marginTop:24}}>
          <Link className="button button--solid" href="/projects">المشاريع</Link>
          <Link className="button button--ghost" href="/start-project">ابدأ مشروعك</Link>
        </div>
      </div></section>
    </main>
  );
}
