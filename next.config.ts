import type { NextConfig } from "next";

const r2PublicBaseUrl = process.env.R2_PUBLIC_BASE_URL;
let r2Host: string | null = null;
try {
  r2Host = r2PublicBaseUrl ? new URL(r2PublicBaseUrl).hostname : null;
} catch {
  r2Host = null;
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "**.r2.dev" },
      ...(r2Host ? [{ protocol: "https" as const, hostname: r2Host }] : [])
    ],
    formats: ["image/avif", "image/webp"]
  },
  poweredByHeader: false
};

export default nextConfig;
