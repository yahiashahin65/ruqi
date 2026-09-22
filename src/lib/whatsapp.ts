const WHATSAPP_NUMBER = "966533654669";

function createWhatsappLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function projectWhatsapp() {
  return createWhatsappLink(
`السلام عليكم،
أرغب في الحديث عن مشروع تصميم داخلي.

تفاصيل المشروع:
`
  );
}

export function serviceWhatsapp(serviceName: string) {
  return createWhatsappLink(
`السلام عليكم،
أرغب في طلب خدمة:

${serviceName}

أرغب في معرفة التفاصيل والتكلفة.
`
  );
}
