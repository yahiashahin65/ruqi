import { NextRequest, NextResponse } from "next/server";
import {
  createSessionCookie,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS
} from "@/lib/firebase/session";

function isSameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");

  if (!origin) {
    return true;
  }

  try {
    return new URL(origin).host === request.nextUrl.host;
  } catch {
    return false;
  }
}

function getMissingFirebaseAdminEnv() {
  const missing: string[] = [];

  if (!process.env.FIREBASE_PROJECT_ID?.trim()) {
    missing.push("FIREBASE_PROJECT_ID");
  }

  if (!process.env.FIREBASE_CLIENT_EMAIL?.trim()) {
    missing.push("FIREBASE_CLIENT_EMAIL");
  }

  const hasDirectKey = Boolean(
    process.env.FIREBASE_PRIVATE_KEY?.trim()
  );

  const hasBase64Key = Boolean(
    process.env.FIREBASE_PRIVATE_KEY_BASE64?.trim()
  );

  if (!hasDirectKey && !hasBase64Key) {
    missing.push("FIREBASE_PRIVATE_KEY");
  }

  return missing;
}

function getErrorCode(error: unknown) {
  if (
    error &&
    typeof error === "object" &&
    "code" in error
  ) {
    const code = (error as { code?: unknown }).code;

    if (typeof code === "string") {
      return code;
    }
  }

  return undefined;
}

function safeSessionError(error: unknown) {
  const message =
    error instanceof Error
      ? error.message
      : "Unknown session error";

  const firebaseCode = getErrorCode(error);

  const missing = getMissingFirebaseAdminEnv();

  if (missing.length) {
    return {
      status: 500,
      body: {
        error:
          "إعداد Firebase Admin غير مكتمل على Vercel",
        code: "FIREBASE_ADMIN_NOT_CONFIGURED",
        missing
      }
    };
  }

  if (message === "Firebase Admin is not configured") {
    return {
      status: 500,
      body: {
        error: "تعذر تهيئة Firebase Admin",
        code: "FIREBASE_ADMIN_INIT_FAILED"
      }
    };
  }

  if (message === "Admin access required") {
    return {
      status: 403,
      body: {
        error:
          "تم تسجيل الدخول في Firebase لكن UID المستخدم لا يطابق ADMIN_UID",
        code: "ADMIN_UID_MISMATCH"
      }
    };
  }

  if (message === "Recent sign-in required") {
    return {
      status: 401,
      body: {
        error:
          "Firebase يطلب تسجيل دخول حديث. سجل الخروج ثم حاول مرة أخرى",
        code: "RECENT_SIGN_IN_REQUIRED"
      }
    };
  }

  if (firebaseCode === "auth/id-token-expired") {
    return {
      status: 401,
      body: {
        error: "Firebase ID token انتهت صلاحيته",
        code: "FIREBASE_ID_TOKEN_EXPIRED",
        firebaseCode
      }
    };
  }

  if (firebaseCode === "auth/id-token-revoked") {
    return {
      status: 401,
      body: {
        error: "Firebase ID token تم إلغاؤه",
        code: "FIREBASE_ID_TOKEN_REVOKED",
        firebaseCode
      }
    };
  }

  if (firebaseCode === "auth/argument-error") {
    return {
      status: 500,
      body: {
        error:
          "Firebase Admin رفض بيانات الاعتماد. راجع FIREBASE_PRIVATE_KEY و FIREBASE_CLIENT_EMAIL",
        code: "FIREBASE_ADMIN_CREDENTIAL_ERROR",
        firebaseCode
      }
    };
  }

  if (firebaseCode?.includes("credential")) {
    return {
      status: 500,
      body: {
        error:
          "مشكلة في Firebase Admin credentials على Vercel",
        code: "FIREBASE_ADMIN_CREDENTIAL_ERROR",
        firebaseCode
      }
    };
  }

  return {
    status: 500,
    body: {
      error:
        "فشل إنشاء جلسة الإدارة. راجع كود الخطأ الظاهر أدناه",
      code: "ADMIN_SESSION_CREATE_FAILED",
      ...(firebaseCode
        ? {
            firebaseCode
          }
        : {})
    }
  };
}

export async function POST(request: NextRequest) {
  try {
    if (!isSameOrigin(request)) {
      return NextResponse.json(
        {
          error: "Origin غير مسموح",
          code: "INVALID_ORIGIN"
        },
        {
          status: 403
        }
      );
    }

    const contentType =
      request.headers.get("content-type") || "";

    if (!contentType.includes("application/json")) {
      return NextResponse.json(
        {
          error:
            "Content-Type يجب أن يكون application/json",
          code: "INVALID_CONTENT_TYPE"
        },
        {
          status: 415
        }
      );
    }

    const body = await request
      .json()
      .catch(() => null);

    const idToken = body?.idToken;

    if (
      !idToken ||
      typeof idToken !== "string"
    ) {
      return NextResponse.json(
        {
          error: "Firebase ID token غير موجود",
          code: "MISSING_ID_TOKEN"
        },
        {
          status: 400
        }
      );
    }

    const missing =
      getMissingFirebaseAdminEnv();

    if (missing.length) {
      return NextResponse.json(
        {
          error:
            "إعداد Firebase Admin غير مكتمل على Vercel",
          code: "FIREBASE_ADMIN_NOT_CONFIGURED",
          missing
        },
        {
          status: 500
        }
      );
    }

    if (!process.env.ADMIN_UID?.trim()) {
      return NextResponse.json(
        {
          error:
            "متغير ADMIN_UID غير موجود على Vercel",
          code: "ADMIN_UID_NOT_CONFIGURED"
        },
        {
          status: 500
        }
      );
    }

    const sessionCookie =
      await createSessionCookie(idToken);

    const response =
      NextResponse.json({
        ok: true
      });

    response.cookies.set(
      SESSION_COOKIE_NAME,
      sessionCookie,
      {
        httpOnly: true,
        secure:
          process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: SESSION_MAX_AGE_SECONDS
      }
    );

    return response;
  } catch (error) {
    const diagnostic =
      safeSessionError(error);

    console.error("[admin-session]", {
      code: diagnostic.body.code,
      firebaseCode: getErrorCode(error),
      message:
        error instanceof Error
          ? error.message
          : "Unknown error"
    });

    return NextResponse.json(
      diagnostic.body,
      {
        status: diagnostic.status
      }
    );
  }
}

export async function DELETE(
  request: NextRequest
) {
  if (!isSameOrigin(request)) {
    return NextResponse.json(
      {
        error: "Origin غير مسموح",
        code: "INVALID_ORIGIN"
      },
      {
        status: 403
      }
    );
  }

  const response =
    NextResponse.json({
      ok: true
    });

  response.cookies.set(
    SESSION_COOKIE_NAME,
    "",
    {
      httpOnly: true,
      secure:
        process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0
    }
  );

  return response;
}
