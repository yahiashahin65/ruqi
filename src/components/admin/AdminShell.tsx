import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";
import { LogoutButton } from "./LogoutButton";

const items = [
  ["لوحة التحكم", "/admin"],
  ["المشاريع", "/admin/projects"],
  ["إضافة مشروع", "/admin/projects/new"],
  ["الخدمات", "/admin/services"],
  ["المجلة", "/admin/articles"],
  ["الطلبات", "/admin/leads"],
  ["الوسائط", "/admin/media"],
  ["الإعدادات", "/admin/settings"]
];

export function AdminShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="admin-shell admin-body">
      <aside className="admin-sidebar">
        <BrandMark inverted />
        <nav>
          {items.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
          <Link href="/" target="_blank">فتح الموقع ↗</Link>
        </nav>
        <div className="admin-sidebar__bottom">
          <LogoutButton />
        </div>
      </aside>
      <section className="admin-main">
        <div className="admin-top">
          <h1>{title}</h1>
          <LogoutButton />
        </div>
        {children}
      </section>
    </div>
  );
}
