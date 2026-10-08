import Link from "next/link";
import { ArrowUpLeft, Ghost, Phone } from "lucide-react";
import { FaWhatsapp, FaTiktok } from "react-icons/fa";

import { getPublicSettings } from "@/lib/firebase/data";
import {
  CONTACT_PHONE,
  CONTACT_WHATSAPP,
  CONTACT_TIKTOK
} from "@/lib/constants";

import { BrandMark } from "./BrandMark";

export async function Footer() {
  const settings = await getPublicSettings();

  const whatsappMessage = encodeURIComponent(
    "السلام عليكم، أرغب في الاستفسار عن خدمات التصميم والديكور في الرياض."
  );

  const whatsappUrl =
    `https://wa.me/${CONTACT_WHATSAPP}?text=${whatsappMessage}`;

  const phoneUrl = `tel:+${CONTACT_WHATSAPP}`;

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

          <p style={{ maxWidth: "620px" }}>
            ديكور لاين الرياض للتصميم الداخلي والديكور
            والتنفيذ والتجديد في الرياض
            للمشاريع السكنية والتجارية.
          </p>

          <a
            className="text-link text-link--light"
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="ابدأ مشروعك مع ديكور لاين الرياض عبر واتساب"
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
            الرياض · المملكة العربية السعودية
          </p>

          <div className="footer__socials">

            {/* TikTok */}
            <a
              href={CONTACT_TIKTOK}
              target="_blank"
              rel="noopener noreferrer"
              className="floating-contact__button floating-contact__button--tiktok"
              aria-label="تابعنا على تيك توك"
              title="تيك توك"
            >
              <FaTiktok
                size={23}
                aria-hidden="true"
              />
            </a>

            {/* WhatsApp */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="floating-contact__button floating-contact__button--whatsapp"
              aria-label="تواصل معنا عبر واتساب"
              title="واتساب"
            >
              <FaWhatsapp
                size={26}
                aria-hidden="true"
              />
            </a>

            {/* Direct call */}
            <a
              href={phoneUrl}
              className="floating-contact__button floating-contact__button--phone"
              aria-label={`اتصل بنا على ${CONTACT_PHONE}`}
              title="اتصال"
            >
              <Phone
                size={22}
                aria-hidden="true"
              />
            </a>

            {/* Snapchat if configured */}
            {settings.snapchat && (
              <a
                href={settings.snapchat}
                target="_blank"
                rel="noopener noreferrer"
                className="floating-contact__button footer__social--snapchat"
                aria-label="تابعنا على سناب شات"
                title="سناب شات"
              >
                <Ghost
                  size={22}
                  aria-hidden="true"
                />
              </a>
            )}
          </div>

          <a
            href={phoneUrl}
            aria-label={`رقم ديكور لاين الرياض ${CONTACT_PHONE}`}
          >
            {CONTACT_PHONE}
          </a>

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

          <Link href="/riyadh-interior-design">
            تصميم داخلي في الرياض
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
          © {new Date().getFullYear()} ديكور لاين الرياض
        </p>
      </div>
    </footer>
  );
}
