"use client";

import Link from "next/link";
import {
  Menu,
  X
} from "lucide-react";
import {
  useEffect,
  useState
} from "react";
import { usePathname } from "next/navigation";

import { BrandMark } from "./BrandMark";

const nav = [
  {
    label: "المشاريع",
    href: "/projects"
  },
  {
    label: "الخدمات",
    href: "/services"
  },
  {
    label: "طريقة العمل",
    href: "/process"
  },
  {
    label: "المجلة",
    href: "/journal"
  },
  {
    label: "من نحن",
    href: "/about"
  },
  {
    label: "تواصل معنا",
    href: "/contact"
  }
] as const;

function isActivePath(
  pathname: string,
  href: string
) {
  return (
    pathname === href ||
    pathname.startsWith(
      `${href}/`
    )
  );
}

export function Header() {
  const pathname =
    usePathname();

  const [open, setOpen] =
    useState(false);

  const [
    scrolled,
    setScrolled
  ] = useState(false);

  const isHome =
    pathname === "/";

  const overHero =
    isHome &&
    !scrolled &&
    !open;

  useEffect(() => {
    const handler = () =>
      setScrolled(
        window.scrollY > 38
      );

    handler();

    window.addEventListener(
      "scroll",
      handler,
      {
        passive: true
      }
    );

    return () =>
      window.removeEventListener(
        "scroll",
        handler
      );
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.documentElement.classList.toggle(
      "is-menu-locked",
      open
    );

    document.body.classList.toggle(
      "is-menu-locked",
      open
    );

    const closeOnDesktop = () => {
      if (
        window.innerWidth >
        960
      ) {
        setOpen(false);
      }
    };

    const closeOnEscape = (
      event: KeyboardEvent
    ) => {
      if (
        event.key ===
        "Escape"
      ) {
        setOpen(false);
      }
    };

    window.addEventListener(
      "resize",
      closeOnDesktop,
      {
        passive: true
      }
    );

    window.addEventListener(
      "keydown",
      closeOnEscape
    );

    return () => {
      document.documentElement.classList.remove(
        "is-menu-locked"
      );

      document.body.classList.remove(
        "is-menu-locked"
      );

      window.removeEventListener(
        "resize",
        closeOnDesktop
      );

      window.removeEventListener(
        "keydown",
        closeOnEscape
      );
    };
  }, [open]);

  return (
    <header
      className={[
        "site-header",
        scrolled
          ? "is-scrolled"
          : "",
        overHero
          ? "is-over-hero"
          : "",
        open
          ? "is-menu-open"
          : ""
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="site-header__inner">

        <BrandMark />

        <nav
          className="desktop-nav"
          aria-label="التنقل الرئيسي"
        >
          {nav.map(
            ({
              label,
              href
            }) => {
              const active =
                isActivePath(
                  pathname,
                  href
                );

              return (
                <Link
                  key={href}
                  href={href}
                  className={
                    active
                      ? "is-active"
                      : undefined
                  }
                  aria-current={
                    active
                      ? "page"
                      : undefined
                  }
                >
                  {label}
                </Link>
              );
            }
          )}
        </nav>

        <Link
          className="header-cta"
          href="/start-project"
          aria-label="ابدأ مشروع تصميم داخلي مع رقي الجمال"
        >
          <span>
            ابدأ مشروعك
          </span>

          <i aria-hidden="true">
            ↗
          </i>
        </Link>

        <button
          type="button"
          className="menu-toggle"
          onClick={() =>
            setOpen(
              (value) =>
                !value
            )
          }
          aria-label={
            open
              ? "إغلاق القائمة"
              : "فتح القائمة"
          }
          aria-expanded={
            open
          }
          aria-controls="mobile-navigation"
        >
          {open ? (
            <X
              size={23}
              aria-hidden="true"
            />
          ) : (
            <Menu
              size={23}
              aria-hidden="true"
            />
          )}
        </button>

      </div>

      <div
        id="mobile-navigation"
        className={`mobile-menu ${
          open
            ? "is-open"
            : ""
        }`}
        aria-hidden={
          !open
        }
      >
        <nav
          className="mobile-menu__nav"
          aria-label="التنقل الرئيسي على الهاتف"
        >
          {nav.map(
            (
              {
                label,
                href
              },
              index
            ) => {
              const active =
                isActivePath(
                  pathname,
                  href
                );

              return (
                <Link
                  key={href}
                  href={href}
                  className={
                    active
                      ? "is-active"
                      : undefined
                  }
                  aria-current={
                    active
                      ? "page"
                      : undefined
                  }
                  onClick={() =>
                    setOpen(
                      false
                    )
                  }
                >
                  <span
                    aria-hidden="true"
                  >
                    {String(
                      index + 1
                    ).padStart(
                      2,
                      "0"
                    )}
                  </span>

                  {label}
                </Link>
              );
            }
          )}

          <Link
            className="button button--light"
            href="/start-project"
            onClick={() =>
              setOpen(false)
            }
          >
            ابدأ مشروعك
          </Link>
        </nav>
      </div>
    </header>
  );
}
