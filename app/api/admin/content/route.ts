import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getPosts, getProducts, getSiteData, saveCmsData } from "@/lib/content";
import { isAdminCookie } from "@/lib/adminAuth";

async function requireAdmin() {
  const cookieStore = await cookies();
  return isAdminCookie(cookieStore.get("agrocapital_admin")?.value);
}

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const [site, products, posts] = await Promise.all([getSiteData(), getProducts(), getPosts()]);
  return NextResponse.json({ site, products, posts });
}

export async function PUT(request: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const payload = await request.json();
  if (!payload.site || !Array.isArray(payload.products) || !Array.isArray(payload.posts)) {
    return NextResponse.json({ error: "Expected { site, products, posts }" }, { status: 400 });
  }
  await saveCmsData(payload);
  return NextResponse.json({ ok: true });
}
