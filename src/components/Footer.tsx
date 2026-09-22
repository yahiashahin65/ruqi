import Link from "next/link";
import {
  ArrowUpLeft,
  Ghost,
  MessageCircle,
  Music2,
  Phone
} from "lucide-react";

import { getPublicSettings } from "@/lib/firebase/data";
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
            يغيّر طريقة العيش داخله.
          </h2>

          <Link
            className="text-link text-link--light"
            href="/start-project"
          >
            احك لنا عن مشروعك
            <ArrowUpLeft size={18} />
          </Link>
        </div>

        <div className="footer__contact">
          <p>المدينة المنورة</p>

          <div className="footer__socials">
            <a
              href={`tel:${settings.phone}`}
              aria-label="اتصال"
              title="اتصال"
            >
              <Phone
                size={19}
                strokeWidth={1.7}
              />
            </a>

            <a
              href={`https://wa.me/${settings.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              aria-label="واتساب"
              title="واتساب"
            >
              <MessageCircle
                size={20}
                strokeWidth={1.7}
              />
            </a>

            {settings.tiktok && (
              <a
                href={settings.tiktok}
                target="_blank"
                rel="noreferrer"
                aria-label="تيك توك"
                title="تيك توك"
              >
                <Music2
                  size={20}
                  strokeWidth={1.7}
                />
              </a>
            )}

            {settings.snapchat && (
              <a
                href={settings.snapchat}
                target="_blank"
                rel="noreferrer"
                aria-label="سناب شات"
                title="سناب شات"
              >
                <Ghost
                  size={20}
                  strokeWidth={1.7}
                />
              </a>
            )}
          </div>

          <a href={`tel:${settings.phone}`}>
            {settings.phone}
          </a>
        </div>
      </div>

      <div className="shell footer__bottom">
        <BrandMark inverted />

        <div className="footer__links">
          <Link href="/projects">
            المشاريع
          </Link>

          <Link href="/services">
            الخدمات
          </Link>

          <Link href="/madinah-interior-design">
            تصميم داخلي في المدينة
          </Link>

          <Link href="/journal">
            المجلة
          </Link>

          <Link href="/privacy">
            الخصوصية
          </Link>
        </div>

        <p>
          © {new Date().getFullYear()} رُقِيّ الجمال
        </p>
      </div>
    </footer>
  );
}
