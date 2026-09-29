import type { Metadata } from "next";
import {
  IBM_Plex_Sans_Arabic,
  Manrope
} from "next/font/google";

import "./globals.css";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MotionProvider } from "@/components/MotionProvider";
import { FloatingContact } from "@/components/FloatingContact";

import {
  DEFAULT_SETTINGS,
  SITE_URL,
  SITE_SEO_NAME
} from "@/lib/constants";

import { localBusinessJsonLd } from "@/lib/seo";

const googleVerification =
  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;

const arabicFont = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: [
    "300",
    "400",
    "500",
    "600",
    "700"
  ],
  variable: "--font-arabic",
  display: "swap"
});

const latinFont = Manrope({
  subsets: ["latin"],
  variable: "--font-latin",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default:
      "رقي الجمال | تصميم داخلي وديكور في المدينة المنورة",

    template:
      `%s | ${SITE_SEO_NAME}`
  },

  description:
    "رقي الجمال للتصميم الداخلي والديكور والتنفيذ والتجديد في المدينة المنورة للفلل والمنازل والمجالس والمشاريع التجارية والضيافة.",

  authors: [
    {
      name:
        `${SITE_SEO_NAME} | ${DEFAULT_SETTINGS.brandName}`
    }
  ],

  creator:
    SITE_SEO_NAME,

  publisher:
    SITE_SEO_NAME,

  openGraph: {
    type: "website",

    locale: "ar_SA",

    url:
      SITE_URL,

    siteName:
      SITE_SEO_NAME,

    title:
      "رقي الجمال | تصميم داخلي وديكور في المدينة المنورة",

    description:
      "رقي الجمال للتصميم الداخلي والديكور والتنفيذ والتجديد للمشاريع السكنية والتجارية في المدينة المنورة.",

    images: [
      {
        url:
          "/og-cover.png",

        width: 1200,
        height: 630,

        alt:
          "رقي الجمال للتصميم الداخلي والديكور في المدينة المنورة"
      }
    ]
  },

  twitter: {
    card:
      "summary_large_image",

    title:
      "رقي الجمال | تصميم داخلي وديكور في المدينة المنورة",

    description:
      "رقي الجمال للتصميم الداخلي والديكور والتنفيذ والتجديد للمشاريع السكنية والتجارية في المدينة المنورة.",

    images: [
      "/og-cover.png"
    ]
  },

  icons: {
    icon:
      "/icon.svg",

    apple:
      "/icon.png"
  },

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,

      "max-image-preview":
        "large",

      "max-snippet":
        -1,

      "max-video-preview":
        -1
    }
  },

  verification:
    googleVerification
      ? {
          google:
            googleVerification
        }
      : undefined
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd =
    localBusinessJsonLd();

  return (
    <html
      lang="ar-SA"
      dir="rtl"
    >
      <body
        className={`${arabicFont.variable} ${latinFont.variable}`}
      >
        <MotionProvider />

        <Header />

        {children}

        <Footer />

        <FloatingContact />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html:
              JSON.stringify(
                jsonLd
              )
          }}
        />
      </body>
    </html>
  );
}
