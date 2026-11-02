import { NextResponse } from "next/server";

/**
 * Exact 301 redirect for the previous local SEO URL.
 * Keeps existing search equity while Al Ahsa becomes the canonical location.
 */
export function GET(request: Request) {
  return NextResponse.redirect(
    new URL("/al-ahsa-interior-design", request.url),
    301
  );
}
