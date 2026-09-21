"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
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
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
      <div className="site-header__inner">
        <BrandMark />
        <nav className="desktop-nav" aria-label="التنقل الرئيسي">
          {nav.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
        </nav>
        <Link className="header-cta" href="/start-project">ابدأ مشروعك</Link>
        <button className="menu-toggle" onClick={() => setOpen((v) => !v)} aria-label="فتح القائمة">
          {open ? <X size={23} /> : <Menu size={23} />}
        </button>
      </div>

      <div className={`mobile-menu ${open ? "is-open" : ""}`}>
        <div className="mobile-menu__nav">
          {nav.map(([label, href], index) => (
            <Link key={href} href={href} onClick={() => setOpen(false)}>
              <span>0{index + 1}</span>{label}
            </Link>
          ))}
          <Link className="button button--light" href="/start-project" onClick={() => setOpen(false)}>
            ابدأ مشروعك
          </Link>
        </div>
      </div>
    </header>
  );
}
