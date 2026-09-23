const WHATSAPP_NUMBER = "966533654669";

function createWhatsappLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}


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


export function serviceWhatsapp(serviceName: string) {
  return createWhatsappLink(
`السلام عليكم،
أرغب في طلب خدمة:

${serviceName}

أرغب في معرفة التفاصيل والتكلفة.
`
  );
}


export function articleWhatsapp(articleTitle?: string) {
  return createWhatsappLink(
`السلام عليكم،
لدي استفسار بخصوص مقال:

${articleTitle || "استشارة تصميم داخلي"}

أرغب في الحصول على استشارة ومعرفة التفاصيل.
`
  );
}
