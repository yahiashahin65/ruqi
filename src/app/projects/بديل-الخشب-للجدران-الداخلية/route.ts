import { NextResponse } from "next/server";

/**
 * Permanent one-hop redirect for this specific former project URL.
 * Only keep this mapping if the old "بديل الخشب" URL and the new
 * "بديل الشيبورد" URL refer to the same actual project.
 */
export function GET(request: Request) {
  const targetSlug = "بديل-الشيبورد-في-الأحساء-للجدران-الداخلية";
  const destination = new URL(
    `/projects/${encodeURIComponent(targetSlug)}`,
    request.url
  );
  return NextResponse.redirect(destination, 301);
}
