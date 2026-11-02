import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { getAdminDb } from "@/lib/firebase/admin";
import { verifySessionCookie } from "@/lib/firebase/session";
import {
  previewMigration, latestMigration, startMigration, applyMigrationStep,
  beginRestore, restoreMigrationStep
} from "@/lib/firebase/ahsa-admin-migration";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: { "Cache-Control": "no-store" } });
}

function sameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  if (!origin || !host) return false;
  try { return new URL(origin).host.toLowerCase() === host.toLowerCase(); }
  catch { return false; }
}

function getDb() {
  if (process.env.ENABLE_AHSA_MIGRATION !== "true")
    throw new Error("فعّل ENABLE_AHSA_MIGRATION=true في Vercel قبل تشغيل الأداة.");
  const db = getAdminDb();
  if (!db || !process.env.FIREBASE_PROJECT_ID) throw new Error("إعدادات Firebase Admin غير مكتملة.");
  return db;
}

export async function GET() {
  const admin = await verifySessionCookie();
  if (!admin) return json({ error: "غير مصرح" }, 401);
  try {
    const db = getDb();
    const [preview, latest] = await Promise.all([previewMigration(db), latestMigration(db)]);
    return json({ preview, latest, projectId: process.env.FIREBASE_PROJECT_ID });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "تعذر الاتصال بـFirebase" }, 500);
  }
}

export async function POST(request: NextRequest) {
  const admin = await verifySessionCookie();
  if (!admin) return json({ error: "غير مصرح" }, 401);
  if (!sameOrigin(request)) return json({ error: "طلب من مصدر غير مسموح" }, 403);
  try {
    const db = getDb();
    const body = await request.json() as Record<string, unknown>;
    const action = String(body.action || "");
    const runId = typeof body.runId === "string" ? body.runId : "";
    let result: unknown;

    if (action === "start") {
      if (body.confirmation !== "تأكيد الأحساء" || body.acknowledgeLocations !== true)
        return json({ error: "يجب تأكيد مراجعة مواقع المشاريع قبل تعديل قاعدة البيانات." }, 422);
      if (body.confirmProject !== process.env.FIREBASE_PROJECT_ID)
        return json({ error: "اسم مشروع Firebase غير مطابق." }, 422);
      result = await startMigration(db, admin.uid, String(body.hash || ""));
    } else if (action === "step") {
      result = await applyMigrationStep(db, runId);
    } else if (action === "beginRestore") {
      if (body.confirmation !== "استرجاع") return json({ error: "تأكيد الاسترجاع غير صحيح." }, 422);
      result = await beginRestore(db, runId);
    } else if (action === "restoreStep") {
      result = await restoreMigrationStep(db, runId);
    } else {
      return json({ error: "إجراء غير معروف" }, 400);
    }

    if ((action === "step" || action === "restoreStep") &&
      result && typeof result === "object" && "finished" in result && result.finished) {
      revalidateTag("projects", "max");
      revalidateTag("services", "max");
      revalidateTag("articles", "max");
      revalidatePath("/", "layout");
    }
    return json(result);
  } catch (e) {
    console.error("[admin-ahsa-migration]", e);
    return json({ error: e instanceof Error ? e.message : "تعذر تنفيذ العملية" }, 409);
  }
}
