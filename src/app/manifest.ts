import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ديكور لاين الرياض | DECOR LINE RIYADH Interior Studio",
    short_name: "ديكور لاين الرياض",
    description: "تصميم داخلي وديكور في الرياض",
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
