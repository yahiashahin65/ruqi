import { FaWhatsapp, FaTiktok } from "react-icons/fa";
import { Phone } from "lucide-react";

import {
  CONTACT_PHONE,
  CONTACT_WHATSAPP,
  CONTACT_TIKTOK
} from "@/lib/constants";

export function FloatingContact() {
  const whatsappMessage = encodeURIComponent(
    "السلام عليكم، أرغب في الاستفسار عن خدمات التصميم والديكور في الرياض."
  );

  const whatsappUrl =
    `https://wa.me/${CONTACT_WHATSAPP}?text=${whatsappMessage}`;

  const phoneUrl = `tel:+${CONTACT_WHATSAPP}`;

  return (
    <div className="floating-contact">

      {/* TikTok */}
      <a
        href={CONTACT_TIKTOK}
        target="_blank"
        rel="noopener noreferrer"
        className="floating-contact__button floating-contact__button--tiktok"
        aria-label="تابعنا على تيك توك"
        title="TikTok"
      >
        <FaTiktok size={23} />
      </a>

      {/* WhatsApp */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="floating-contact__button floating-contact__button--whatsapp"
        aria-label="تواصل معنا عبر واتساب"
        title="WhatsApp"
      >
        <FaWhatsapp size={26} />
      </a>

      {/* Phone */}
      <a
        href={phoneUrl}
        className="floating-contact__button floating-contact__button--phone"
        aria-label={`اتصل بنا على ${CONTACT_PHONE}`}
        title={`اتصل بنا ${CONTACT_PHONE}`}
      >
        <Phone size={22} />
      </a>

    </div>
  );
}
