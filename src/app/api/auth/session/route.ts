import { NextRequest, NextResponse } from "next/server";
import { createSessionCookie, SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS } from "@/lib/firebase/session";

function isSameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === request.nextUrl.host;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isSameOrigin(request)) return NextResponse.json({ error: "تعذر إكمال الطلب" }, { status: 403 });
    const { idToken } = await request.json();
    if (!idToken) return NextResponse.json({ error: "تعذر إكمال الطلب" }, { status: 400 });

    const sessionCookie = await createSessionCookie(idToken);
    const response = NextResponse.json({ ok: true });
    response.cookies.set(SESSION_COOKIE_NAME, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE_SECONDS
    });
    return response;
  } catch (error) {
    console.error("[admin-session]", error instanceof Error ? error.message : "session failed");
    return NextResponse.json({ error: "تعذر تسجيل الدخول" }, { status: 401 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: "تعذر إكمال الطلب" }, { status: 403 });
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0
  });
  return response;
}
