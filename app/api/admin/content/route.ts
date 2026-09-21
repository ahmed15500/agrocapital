import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/adminAuth";
import { getAdminCmsData, saveCmsData } from "@/lib/content";
import { CmsData } from "@/lib/types";

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const content = await getAdminCmsData();
  const storageConfigured = Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);
  return NextResponse.json({ ...content, storageConfigured });
}

export async function PUT(request: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const payload = await request.json() as CmsData;
  if (!payload.site || !Array.isArray(payload.products) || !Array.isArray(payload.posts)) {
    return NextResponse.json({ error: "Expected { site, products, posts }" }, { status: 400 });
  }
  const slugs = [...payload.products.map((item) => item.slug), ...payload.posts.map((item) => item.slug)];
  if (slugs.some((slug) => !slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))) {
    return NextResponse.json({ error: "Every item needs a valid English slug" }, { status: 400 });
  }
  if (new Set(payload.products.map((item) => item.slug)).size !== payload.products.length || new Set(payload.posts.map((item) => item.slug)).size !== payload.posts.length) {
    return NextResponse.json({ error: "Product and news slugs must be unique" }, { status: 400 });
  }
  try {
    await saveCmsData(payload);
    revalidatePath("/en", "layout");
    revalidatePath("/ar", "layout");
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("CMS save failed", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not save content" }, { status: 500 });
  }
}
