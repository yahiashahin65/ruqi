import { FaWhatsapp, FaTiktok } from "react-icons/fa";
import { Phone } from "lucide-react";

import { getPublicSettings } from "@/lib/firebase/data";

export async function FloatingContact() {
  const settings = await getPublicSettings();
  const whatsappMessage = encodeURIComponent(
    "السلام عليكم، أرغب في الاستفسار عن خدمات التصميم والديكور في الرياض."
  );

  return (
    <div className="floating-contact">
      {settings.tiktok && (
        <a
          href={settings.tiktok}
          target="_blank"
          rel="noopener noreferrer"
          className="floating-contact__button floating-contact__button--tiktok"
          aria-label="TikTok"
        >
          <FaTiktok size={23} />
        </a>
      )}

      {settings.whatsapp && (
        <a
          href={`https://wa.me/${settings.whatsapp}?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="floating-contact__button floating-contact__button--whatsapp"
          aria-label="WhatsApp"
        >
          <FaWhatsapp size={26} />
        </a>
      )}

      {settings.phone && (
        <a
          href={`tel:${settings.phone}`}
          className="floating-contact__button floating-contact__button--phone"
          aria-label="Call"
        >
          <Phone size={22} />
        </a>
      )}
    </div>
  );
}
