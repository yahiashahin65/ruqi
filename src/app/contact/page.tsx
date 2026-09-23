import type { Metadata } from "next";
import {
  Ghost,
  MessageCircle,
  Music2,
  Phone
} from "lucide-react";

import { PageHero } from "@/components/PageHero";
import { getPublicSettings } from "@/lib/firebase/data";
import { pageMetadata } from "@/lib/seo";
import { projectWhatsapp } from "@/lib/whatsapp";

export const metadata: Metadata = pageMetadata({
  title: "تواصل مع رُقِيّ الجمال | تصميم داخلي في المدينة المنورة",
  description:
    "تواصل مع رُقِيّ الجمال لطلب تصميم داخلي أو تنفيذ أو تجديد في المدينة المنورة.",
  path: "/contact"
});

export default async function ContactPage() {
  const settings = await getPublicSettings();

  return (
    <main className="page-main">
      <PageHero
        eyebrow="تواصل معنا"
        title={
          <>
            ابدأ بمحادثة
            <br />
            واضحة.
          </>
        }
        lead="إذا عندك مخطط أو صور أو مساحة قائمة، شاركنا التفاصيل الأساسية وسنرتب الخطوة التالية."
      />

      <section className="section">
        <div className="shell contact-grid">

          <div>
            <h2 className="contact-big">
              المدينة
              <br />
              المنورة
            </h2>


            <div className="contact-list">

              <a href={`tel:${settings.phone}`}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "10px"
                  }}
                >
                  <Phone
                    size={19}
                    strokeWidth={1.7}
                  />
                  اتصال
                </span>

                <strong>
                  {settings.phone}
                </strong>
              </a>



              <a
                href={`https://wa.me/${settings.whatsapp}`}
                target="_blank"
                rel="noreferrer"
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "10px"
                  }}
                >
                  <MessageCircle
                    size={19}
                    strokeWidth={1.7}
                  />
                  واتساب
                </span>

                <strong>
                  ابدأ محادثة
                </strong>
              </a>



              <a
                href="https://www.tiktok.com/@laqeinaha.lak?_r=1&_t=ZS-99ytgzsSo5s"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "10px"
                  }}
                >
                  <Music2
                    size={19}
                    strokeWidth={1.7}
                  />
                  تيك توك
                </span>

                <strong>
                  تابعنا
                </strong>
              </a>



              {settings.snapchat && (
                <a
                  href={settings.snapchat}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "10px"
                    }}
                  >
                    <Ghost
                      size={19}
                      strokeWidth={1.7}
                    />
                    سناب شات
                  </span>

                  <strong>
                    تابعنا
                  </strong>
                </a>
              )}



              <div>
                <span>
                  ساعات العمل
                </span>

                <strong>
                  {settings.businessHours}
                </strong>
              </div>


            </div>
          </div>



          <div className="prose">

            <p className="eyebrow">
              للطلبات الجديدة
            </p>


            <h2>
              كلما كانت البداية واضحة، كان ردنا أدق.
            </h2>


            <p>
              شاركنا نوع المشروع والخدمة المطلوبة والمساحة
              التقريبية، ويمكنك إرفاق صور أو مخطط إذا كان متاحا.
            </p>


            <a
              className="button button--solid"
              href={projectWhatsapp()}
              target="_blank"
              rel="noopener noreferrer"
            >
              ابدأ مشروعك
            </a>


          </div>


        </div>
      </section>
    </main>
  );
}
