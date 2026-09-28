import { FaWhatsapp, FaTiktok } from "react-icons/fa";
import { Phone } from "lucide-react";

const WHATSAPP_NUMBER = "966533654669";
const PHONE_NUMBER = "966533654669";
const TIKTOK_URL = "https://www.tiktok.com/@laqeinaha.lak?_r=1&_t=ZS-9A7df3n1GYY";

export function FloatingContact() {
  const whatsappMessage = encodeURIComponent(
    "السلام عليكم، أرغب في الاستفسار عن خدمات التصميم والديكور."
  );

  return (
    <div className="floating-contact">

      {/* TikTok */}
      <a
        href={TIKTOK_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="floating-contact__button floating-contact__button--tiktok"
        aria-label="TikTok"
      >
        <FaTiktok size={23} />
      </a>

      {/* WhatsApp */}
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        className="floating-contact__button floating-contact__button--whatsapp"
        aria-label="WhatsApp"
      >
        <FaWhatsapp size={26} />
      </a>


      {/* Phone */}
      <a
        href={`tel:${PHONE_NUMBER}`}
        className="floating-contact__button floating-contact__button--phone"
        aria-label="Call"
      >
        <Phone size={22} />
      </a>

    </div>
  );
}
