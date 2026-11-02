import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ديكور لاين الأحساء | DECOR LINE AL AHSA Interior Studio",
    short_name: "ديكور لاين الأحساء",
    description: "تصميم داخلي وديكور في الأحساء",
    start_url: "/",
    display: "standalone",
    background_color: "#f8f4ec",
    theme_color: "#252924",
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
