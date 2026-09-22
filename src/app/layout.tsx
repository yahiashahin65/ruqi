import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic, Manrope } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MotionProvider } from "@/components/MotionProvider";
import { DEFAULT_SETTINGS, SITE_URL } from "@/lib/constants";
import { localBusinessJsonLd } from "@/lib/seo";

const googleVerification =
  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;

const arabicFont = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
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
      "رُقِيّ الجمال | تصميم داخلي وديكور في المدينة المنورة",
    template: "%s | رُقِيّ الجمال"
  },

  description:
    "رُقِيّ الجمال لخدمات التصميم الداخلي والديكور والتنفيذ في المدينة المنورة للفلل والمنازل والمجالس والمشاريع التجارية والضيافة.",

  keywords: [
    "تصميم داخلي المدينة المنورة",
    "ديكور المدينة المنورة",
    "شركة ديكور المدينة المنورة",
    "مصمم داخلي المدينة المنورة",
    "تشطيب فلل المدينة المنورة",
    "تصميم مجالس المدينة المنورة",
    "تنفيذ ديكور المدينة المنورة",
    "ديكور محلات المدينة المنورة"
  ],

  authors: [
    {
      name: `${DEFAULT_SETTINGS.brandNameAr} ${DEFAULT_SETTINGS.brandName}`
    }
  ],

  creator: DEFAULT_SETTINGS.brandNameAr,
  publisher: DEFAULT_SETTINGS.brandNameAr,

  alternates: {
    canonical: "/"
  },

  openGraph: {
    type: "website",
    locale: "ar_SA",

    title:
      "رُقِيّ الجمال | تصميم داخلي وديكور في المدينة المنورة",

    description:
      "تصميم داخلي وديكور وتنفيذ للمساحات السكنية والتجارية في المدينة المنورة.",

    siteName:
      "رُقِيّ الجمال | RUQI AL JAMAL",

    url: SITE_URL,

    images: [
      {
        url: "/og-cover.png",
        width: 1200,
        height: 630,
        alt:
          "رُقِيّ الجمال للتصميم الداخلي والديكور في المدينة المنورة"
      }
    ]
  },

  twitter: {
    card: "summary_large_image",

    title:
      "رُقِيّ الجمال | تصميم داخلي وديكور في المدينة المنورة",

    description:
      "تصميم داخلي وديكور وتنفيذ للمساحات السكنية والتجارية في المدينة المنورة.",

    images: ["/og-cover.png"]
  },

  icons: {
    icon: "/icon.svg",
    apple: "/icon.png"
  },

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  },

  verification: googleVerification
    ? {
        google: googleVerification
      }
    : undefined
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = localBusinessJsonLd();

  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${arabicFont.variable} ${latinFont.variable}`}
      >
        <MotionProvider />

        <Header />

        {children}

        <Footer />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd)
          }}
        />
      </body>
    </html>
  );
}
