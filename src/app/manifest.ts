import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "رُقِيّ الجمال | RUQI AL JAMAL Interior Studio",
    short_name: "رُقِيّ الجمال",
    description: "تصميم داخلي وديكور في المدينة المنورة",
    start_url: "/",
    display: "standalone",
    background_color: "#f1ede5",
    theme_color: "#171715",
    lang: "ar",
    dir: "rtl",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml"
      }
    ]
  };
}
