
import { CONTACT_WHATSAPP } from "./constants";

/**
 * Generate WhatsApp links using the official number.
 */
function createWhatsappLink(message: string): string {
  return `https://wa.me/${CONTACT_WHATSAPP}?text=${encodeURIComponent(message)}`;
}

/**
 * Project WhatsApp inquiry.
 */
export function projectWhatsapp(projectName?: string) {
  return createWhatsappLink(
`السلام عليكم،
أرغب في تنفيذ مشروع مشابه.

اسم المشروع:
${projectName || "مشروع تصميم داخلي"}

أرغب في معرفة التفاصيل والتكلفة.
`
  );
}

/**
 * Service WhatsApp inquiry.
 */
export function serviceWhatsapp(serviceName: string) {
  return createWhatsappLink(
`السلام عليكم،
أرغب في طلب خدمة:

${serviceName}

أرغب في معرفة التفاصيل والتكلفة.
`
  );
}

/**
 * Article WhatsApp inquiry.
 */
export function articleWhatsapp(articleTitle?: string) {
  return createWhatsappLink(
`السلام عليكم،
لدي استفسار بخصوص مقال:

${articleTitle || "استشارة تصميم داخلي"}

أرغب في الحصول على استشارة ومعرفة التفاصيل.
`
  );
}
