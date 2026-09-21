import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpLeft } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { getProjects, getServices } from "@/lib/firebase/data";
import { pageMetadata } from "@/lib/seo";
import { ProjectCard } from "@/components/ProjectCard";

export const metadata: Metadata = pageMetadata({
  title: "تصميم داخلي وديكور في المدينة المنورة | رقي الجمال",
  description: "تصميم داخلي وديكور وتنفيذ وتشطيب للفلل والمجالس والمنازل والمشاريع التجارية في المدينة المنورة.",
  path: "/madinah-interior-design"
});

export default async function MadinahInteriorDesignPage() {
  const [projects, services] = await Promise.all([getProjects(), getServices()]);
  return (
    <main className="page-main">
      <PageHero eyebrow="المدينة المنورة" title={<>تصميم داخلي<br />في المدينة المنورة.</>} lead="نخدم مشاريع المدينة المنورة من المعاينة والتصميم حتى التنسيق مع التنفيذ حسب نطاق المشروع." />
      <section className="content-page"><div className="shell content-grid"><p className="eyebrow">الخدمة المحلية</p><div className="prose"><h2>مساحة مناسبة لطريقة عيشك، لا نسخة من مشروع آخر.</h2><p>نصمم الفلل والمنازل والمجالس ومساحات الضيافة والمشاريع التجارية داخل المدينة المنورة. يبدأ العمل من فهم المساحة والحركة ثم تطوير الهوية والخامات والإضاءة والتفاصيل التنفيذية.</p><p>وجود المشروع في المدينة يتيح لنا فهم الموقع ومعاينته عند الحاجة، ومراجعة العينات والتنسيق مع الأطراف التنفيذية بشكل أوضح.</p></div></div></section>
      {services.length > 0 && <section className="section-dark section"><div className="shell"><div className="section-heading"><p className="eyebrow eyebrow--light">الخدمات</p><h2>من الفكرة<br />إلى الموقع.</h2><div>{services.map((service) => <Link key={service.slug} className="text-link text-link--light" href={`/services/${service.slug}`} style={{ display: "flex", marginTop: 14 }}>{service.title} <ArrowUpLeft size={16} /></Link>)}</div></div></div></section>}
      {projects.length > 0 && <section className="selected-work"><div className="shell"><div className="selected-work__top"><div><p className="eyebrow">أمثلة</p><h2>نوعية المشاريع</h2></div><p>نماذج من المشاريع التي تعكس أسلوبنا في التعامل مع المساحة والخامة والتفاصيل.</p></div><div className="projects-editorial">{projects.slice(0, 3).map((project, index) => <ProjectCard key={project.id} project={project} index={index} />)}</div></div></section>}
      <section className="section"><div className="shell section-heading"><p className="eyebrow">طلب مشروع</p><h2>فيلا، مجلس، عيادة،<br />مقهى أو مساحة تجارية؟</h2><div><p className="section-heading__text">أرسل التفاصيل الأساسية ونعود لك بخطوة تالية واضحة.</p><Link className="button button--solid" href="/start-project">ابدأ الطلب</Link></div></div></section>
    </main>
  );
}
