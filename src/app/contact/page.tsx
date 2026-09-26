import type { Metadata } from "next";
import Link from "next/link";

import {
  Ghost,
  MessageCircle,
  Music2,
  Phone,
  ArrowUpLeft
} from "lucide-react";

import { PageHero } from "@/components/PageHero";
import { getPublicSettings } from "@/lib/firebase/data";

import { pageMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";
import { projectWhatsapp } from "@/lib/whatsapp";

export const metadata: Metadata = pageMetadata({
  title:
    "تواصل مع رقي الجمال في المدينة المنورة",

  description:
    "تواصل مع رقي الجمال لطلب خدمات التصميم الداخلي والديكور والتنفيذ والتجديد في المدينة المنورة. ارسل تفاصيل مشروعك عبر واتساب أو تواصل معنا هاتفيا.",

  path: "/contact"
});

export default async function ContactPage() {
  const settings =
    await getPublicSettings();

  const contactUrl =
    `${SITE_URL}/contact`;

  const contactSchema = {
    "@context":
      "https://schema.org",

    "@type":
      "ContactPage",

    "@id":
      `${contactUrl}#webpage`,

    url:
      contactUrl,

    name:
      "تواصل مع رقي الجمال في المدينة المنورة",

    description:
      "صفحة التواصل مع رقي الجمال لخدمات التصميم الداخلي والديكور والتنفيذ والتجديد في المدينة المنورة.",

    inLanguage:
      "ar-SA",

    isPartOf: {
      "@type":
        "WebSite",

      "@id":
        `${SITE_URL}/#website`
    },

    about: {
      "@id":
        `${SITE_URL}/#business`
    },

    mainEntity: {
      "@id":
        `${SITE_URL}/#business`
    }
  };

  return (
    <main className="page-main">

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              contactSchema
            )
        }}
      />

      <PageHero
        eyebrow="تواصل مع رُقِيّ الجمال"
        title={
          <>
            تواصل معنا لبدء مشروعك
            <br />
            في المدينة المنورة
          </>
        }
        lead="إذا كان لديك مخطط أو صور للمساحة أو مشروع قائم، شاركنا نوع المشروع والخدمة المطلوبة والتفاصيل الأساسية لنساعدك في تحديد الخطوة التالية."
      />

      <section
        className="section"
        aria-labelledby="contact-details-title"
      >
        <div className="shell contact-grid">

          <div>

            <p className="eyebrow">
              موقع الخدمة
            </p>

            <h2
              id="contact-details-title"
              className="contact-big"
            >
              المدينة
              <br />
              المنورة
            </h2>

            <div className="contact-list">

              {settings.phone && (
                <a
                  href={`tel:${settings.phone}`}
                  aria-label={`اتصل برقي الجمال على الرقم ${settings.phone}`}
                >
                  <span
                    style={{
                      display:
                        "inline-flex",
                      alignItems:
                        "center",
                      gap:
                        "10px"
                    }}
                  >
                    <Phone
                      size={19}
                      strokeWidth={1.7}
                      aria-hidden="true"
                    />

                    اتصال
                  </span>

                  <strong>
                    {settings.phone}
                  </strong>
                </a>
              )}

              {settings.whatsapp && (
                <a
                  href={`https://wa.me/${settings.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="تواصل مع رقي الجمال عبر واتساب"
                >
                  <span
                    style={{
                      display:
                        "inline-flex",
                      alignItems:
                        "center",
                      gap:
                        "10px"
                    }}
                  >
                    <MessageCircle
                      size={19}
                      strokeWidth={1.7}
                      aria-hidden="true"
                    />

                    واتساب
                  </span>

                  <strong>
                    ابدأ محادثة
                  </strong>
                </a>
              )}

              <a
                href="https://www.tiktok.com/@laqeinaha.lak?_r=1&_t=ZS-99ytgzsSo5s"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="تابع رقي الجمال على تيك توك"
              >
                <span
                  style={{
                    display:
                      "inline-flex",
                    alignItems:
                      "center",
                    gap:
                      "10px"
                  }}
                >
                  <Music2
                    size={19}
                    strokeWidth={1.7}
                    aria-hidden="true"
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
                  rel="noopener noreferrer"
                  aria-label="تابع رقي الجمال على سناب شات"
                >
                  <span
                    style={{
                      display:
                        "inline-flex",
                      alignItems:
                        "center",
                      gap:
                        "10px"
                    }}
                  >
                    <Ghost
                      size={19}
                      strokeWidth={1.7}
                      aria-hidden="true"
                    />

                    سناب شات
                  </span>

                  <strong>
                    تابعنا
                  </strong>
                </a>
              )}

              {settings.businessHours && (
                <div>
                  <span>
                    ساعات العمل
                  </span>

                  <strong>
                    {settings.businessHours}
                  </strong>
                </div>
              )}

            </div>
          </div>

          <div
            className="prose"
            aria-labelledby="new-project-title"
          >
            <p className="eyebrow">
              للطلبات الجديدة
            </p>

            <h2 id="new-project-title">
              شاركنا تفاصيل مشروعك
              لنبدأ بصورة أوضح
            </h2>

            <p>
              ارسل نوع المشروع والخدمة المطلوبة
              والمساحة التقريبية والمرحلة الحالية،
              ويمكنك إرفاق صور للموقع أو مخطط
              للمساحة إذا كان متاحا.
            </p>

            <p>
              نقدم خدمات التصميم الداخلي والديكور
              والتنفيذ والتجديد للفلل والمنازل
              والمجالس والعيادات والمقاهي والمتاجر
              والمساحات التجارية في المدينة المنورة.
            </p>

            <a
              className="button button--solid"
              href={projectWhatsapp()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="ابدأ طلب مشروع تصميم داخلي مع رقي الجمال عبر واتساب"
            >
              ابدأ مشروعك عبر واتساب
            </a>

            <Link
              className="text-link"
              href="/services"
              style={{
                marginTop: 24
              }}
            >
              تعرف على خدماتنا
              <ArrowUpLeft
                size={18}
                aria-hidden="true"
              />
            </Link>

          </div>

        </div>
      </section>

    </main>
  );
}
