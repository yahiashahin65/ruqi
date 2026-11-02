import { DeleteObjectsCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";

import { getAdminDb } from "@/lib/firebase/admin";
import { isAdminRequest } from "@/lib/firebase/session";
import {
  getR2Client,
  getR2PrivateBucket
} from "@/lib/r2";

import type { LeadAttachment } from "@/lib/types";

export async function DELETE(
  _: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  if (!(await isAdminRequest())) {
    return NextResponse.json(
      {
        error: "غير مصرح"
      },
      {
        status: 401
      }
    );
  }

  const { id } = await context.params;
  const db = getAdminDb();

  if (!db) {
    return NextResponse.json(
      {
        error: "تعذر حذف الطلب حاليا"
      },
      {
        status: 503
      }
    );
  }

  const ref = db
    .collection("leads")
    .doc(id);

  const snapshot = await ref.get();

  if (!snapshot.exists) {
    return NextResponse.json(
      {
        error: "الطلب غير موجود"
      },
      {
        status: 404
      }
    );
  }

  const attachments =
    (snapshot.data()?.attachments ||
      []) as LeadAttachment[];

  const keys = attachments
    .map((attachment) => attachment.key)
    .filter(
      (key): key is string =>
        Boolean(
          key &&
            key.startsWith("leads/")
        )
    );

  if (keys.length) {
    const client = getR2Client();
    const bucket =
      getR2PrivateBucket();

    if (client && bucket) {
      try {
        await client.send(
          new DeleteObjectsCommand({
            Bucket: bucket,
            Delete: {
              Objects: keys.map(
                (Key) => ({
                  Key
                })
              ),
              Quiet: true
            }
          })
        );
      } catch (error) {
        console.error(
          "[lead-delete] failed to remove private attachments",
          error
        );
      }
    }
  }

  await ref.delete();

  return NextResponse.json({
    ok: true
  });
}
