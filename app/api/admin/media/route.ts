import { list } from "@vercel/blob";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!process.env.BLOB_READ_WRITE_TOKEN && !process.env.BLOB_STORE_ID) return NextResponse.json({ assets: [] });
  try {
    const result = await list({ prefix: "media/", limit: 500 });
    return NextResponse.json({ assets: result.blobs.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime()) });
  } catch (error) {
    console.error("Could not list CMS media", error);
    return NextResponse.json({ error: "Could not load media" }, { status: 500 });
  }
}
