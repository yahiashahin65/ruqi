import { NextResponse } from "next/server";

/**
 * Exact 301 redirect for the previous local SEO URL.
 * Keeps existing search equity while Riyadh becomes the canonical location.
 */
export function GET(request: Request) {
  return NextResponse.redirect(
    new URL("/riyadh-interior-design", request.url),
    301
  );
}
