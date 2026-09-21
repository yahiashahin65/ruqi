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
    const parsed = leadSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "راجع البيانات المطلوبة قبل الإرسال" }, { status: 422 });

    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
    const human = await verifyTurnstile(parsed.data.turnstileToken, ip);
    if (!human) return NextResponse.json({ error: "تعذر التحقق من الطلب. حاول مرة أخرى." }, { status: 403 });

    const db = getAdminDb();
    if (!db) return NextResponse.json({ error: "تعذر إرسال الطلب حاليا. حاول بعد قليل." }, { status: 503 });

    const uploadToken = randomBytes(24).toString("hex");
    const payload = {
      name: parsed.data.name,
      phone: parsed.data.phone,
      projectType: parsed.data.projectType,
      serviceNeed: parsed.data.serviceNeed,
      area: parsed.data.area || "",
      city: "المدينة المنورة",
      notes: parsed.data.notes || "",
      attachments: [],
      status: "new",
      source: "website",
      createdAt: new Date().toISOString(),
      uploadTokenHash: hash(uploadToken),
      uploadExpiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      uploadReservations: 0
    };

    const ref = await db.collection("leads").add(payload);
    return NextResponse.json({ id: ref.id, uploadToken }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "تعذر حفظ الطلب حاليا" }, { status: 500 });
  }
}
