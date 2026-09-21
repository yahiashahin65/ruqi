"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BrandMark } from "./BrandMark";

const nav = [
  ["المشاريع", "/projects"],
  ["الخدمات", "/services"],
  ["المنهج", "/process"],
  ["الاستوديو", "/about"],
  ["المجلة", "/journal"],
  ["تواصل", "/contact"]
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isHome = pathname === "/";
  const overHero = isHome && !scrolled && !open;

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 38);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.classList.toggle("is-menu-locked", open);

    const closeOnDesktop = () => {
      if (window.innerWidth > 960) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("resize", closeOnDesktop, { passive: true });
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.classList.remove("is-menu-locked");
      window.removeEventListener("resize", closeOnDesktop);
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""} ${overHero ? "is-over-hero" : ""} ${open ? "is-menu-open" : ""}`}>
      <div className="site-header__inner">
        <BrandMark />
        <nav className="desktop-nav" aria-label="التنقل الرئيسي">
          {nav.map(([label, href]) => (
            <Link key={href} href={href} className={pathname === href ? "is-active" : ""}>{label}</Link>
          ))}
        </nav>
        <Link className="header-cta" href="/start-project"><span>ابدأ مشروعك</span><i aria-hidden="true">↗</i></Link>
        <button className="menu-toggle" onClick={() => setOpen((v) => !v)} aria-label={open ? "إغلاق القائمة" : "فتح القائمة"} aria-expanded={open} aria-controls="mobile-navigation">
          {open ? <X size={23} /> : <Menu size={23} />}
        </button>
      </div>

      <div id="mobile-navigation" className={`mobile-menu ${open ? "is-open" : ""}`} aria-hidden={!open}>
        <div className="mobile-menu__nav">
          {nav.map(([label, href], index) => (
            <Link key={href} href={href}>
              <span>0{index + 1}</span>{label}
            </Link>
          ))}
          <Link className="button button--light" href="/start-project">ابدأ مشروعك</Link>
        </div>
      </div>
    </header>
  );
}
