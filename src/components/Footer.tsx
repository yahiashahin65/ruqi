import Link from "next/link";
import {
  ArrowUpLeft,
  Ghost,
  MessageCircle,
  Music2,
  Phone
} from "lucide-react";

import { getPublicSettings } from "@/lib/firebase/data";
import { projectWhatsapp } from "@/lib/whatsapp";
import { BrandMark } from "./BrandMark";

export async function Footer() {
  const settings = await getPublicSettings();

  return (
    <footer className="footer">
      <div className="shell footer__top">
        <div className="footer__statement">
          <p className="eyebrow">
            مشروعك القادم
          </p>

          <h2>
            المكان الجيد لا يلفت النظر فقط.
            <br />
            يغير طريقة العيش داخله.
          </h2>

          <p
            style={{
              maxWidth: "620px"
            }}
          >
            رُقِيّ الجمال للتصميم الداخلي والديكور
            والتنفيذ والتجديد في المدينة المنورة
            للمشاريع السكنية والتجارية.
          </p>

          <a
            className="text-link text-link--light"
            href={projectWhatsapp()}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="ابدأ مشروعك مع رقي الجمال عبر واتساب"
          >
            احك لنا عن مشروعك

            <ArrowUpLeft
              size={18}
              aria-hidden="true"
            />
          </a>
        </div>

        <div className="footer__contact">
          <p>
            المدينة المنورة · المملكة العربية السعودية
          </p>

          <div className="footer__socials">
            {settings.phone && (
              <a
                href={`tel:${settings.phone}`}
                aria-label={`اتصل برقي الجمال على ${settings.phone}`}
                title="اتصال"
              >
                <Phone
                  size={19}
                  strokeWidth={1.7}
                  aria-hidden="true"
                />
              </a>
            )}

            {settings.whatsapp && (
              <a
                href={`https://wa.me/${settings.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="تواصل مع رقي الجمال عبر واتساب"
                title="واتساب"
              >
                <MessageCircle
                  size={20}
                  strokeWidth={1.7}
                  aria-hidden="true"
                />
              </a>
            )}

            <a
              href="https://www.tiktok.com/@laqeinaha.lak?_r=1&_t=ZS-99ytgzsSo5s"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="تابع رقي الجمال على تيك توك"
              title="تيك توك"
            >
              <Music2
                size={20}
                strokeWidth={1.7}
                aria-hidden="true"
              />
            </a>

            {settings.snapchat && (
              <a
                href={settings.snapchat}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="تابع رقي الجمال على سناب شات"
                title="سناب شات"
              >
                <Ghost
                  size={20}
                  strokeWidth={1.7}
                  aria-hidden="true"
                />
              </a>
            )}
          </div>

          {settings.phone && (
            <a
              href={`tel:${settings.phone}`}
              aria-label={`رقم رقي الجمال ${settings.phone}`}
            >
              {settings.phone}
            </a>
          )}

          {settings.businessHours && (
            <p>
              {settings.businessHours}
            </p>
          )}
        </div>
      </div>

      <div className="shell footer__bottom">
        <BrandMark inverted />

        <nav
          className="footer__links"
          aria-label="روابط الموقع"
        >
          <Link href="/services">
            الخدمات
          </Link>

          <Link href="/projects">
            المشاريع
          </Link>

          <Link href="/madinah-interior-design">
            تصميم داخلي في المدينة المنورة
          </Link>

          <Link href="/process">
            طريقة العمل
          </Link>

          <Link href="/journal">
            المجلة
          </Link>

          <Link href="/about">
            من نحن
          </Link>

          <Link href="/contact">
            تواصل معنا
          </Link>

          <Link href="/privacy">
            الخصوصية
          </Link>
        </nav>

        <p>
          © {new Date().getFullYear()} رُقِيّ الجمال
        </p>
      </div>
    </footer>
  );
}
