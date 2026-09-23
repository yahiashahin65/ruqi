import { Phone, MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "966533654669";
const PHONE_NUMBER = "966533654669";

export function FloatingContact() {
  const whatsappMessage = encodeURIComponent(
    "السلام عليكم، أرغب في الاستفسار عن خدمات التصميم والديكور."
  );

  return (
    <div className="floating-contact">

      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        className="floating-contact__button floating-contact__button--whatsapp"
        aria-label="WhatsApp"
      >
        <MessageCircle size={24} />
      </a>


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
