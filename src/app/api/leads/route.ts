import { NextRequest, NextResponse } from "next/server";
import { randomBytes, createHash } from "node:crypto";
import { getAdminDb } from "@/lib/firebase/admin";
import { leadSchema } from "@/lib/validators";
import { verifyTurnstile } from "@/lib/turnstile";

function hash(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = leadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "راجع البيانات المطلوبة قبل الإرسال" }, { status: 422 });
    }

    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
    const human = await verifyTurnstile(parsed.data.turnstileToken, ip);
    if (!human) return NextResponse.json({ error: "فشل التحقق الأمني، حاول مرة أخرى" }, { status: 403 });

    const uploadToken = randomBytes(24).toString("hex");
    const payload = {
      name: parsed.data.name,
      phone: parsed.data.phone,
      email: parsed.data.email || "",
      projectType: parsed.data.projectType,
      serviceNeed: parsed.data.serviceNeed,
      area: parsed.data.area || "",
      city: parsed.data.city,
      district: parsed.data.district || "",
      budget: parsed.data.budget || "",
      startTime: parsed.data.startTime || "",
      notes: parsed.data.notes || "",
      attachments: [],
      status: "new",
      source: "website",
      createdAt: new Date().toISOString(),
      uploadTokenHash: hash(uploadToken)
    };

    const db = getAdminDb();
    if (!db) {
      return NextResponse.json({
        id: `demo-${Date.now()}`,
        uploadToken,
        demo: true,
        message: "Firebase غير موصل: تم اختبار الواجهة فقط"
      });
    }

    const ref = await db.collection("leads").add(payload);
    return NextResponse.json({ id: ref.id, uploadToken }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "تعذر حفظ الطلب حاليا" }, { status: 500 });
  }
}
