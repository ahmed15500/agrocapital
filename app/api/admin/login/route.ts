import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { adminToken } from "@/lib/adminAuth";

export async function POST(request: Request) {
  const { username, password } = await request.json();
  const configuredUsername = process.env.ADMIN_USERNAME;
  const configuredPassword = process.env.ADMIN_PASSWORD;
  if (!configuredUsername || !configuredPassword) {
    return NextResponse.json({ error: "Admin access is not configured" }, { status: 503 });
  }
  const validUser = username === configuredUsername;
  const validPass = password === configuredPassword;
  if (!validUser || !validPass) return NextResponse.json({ error: "Invalid login" }, { status: 401 });
  const cookieStore = await cookies();
  cookieStore.set("agrocapital_admin", adminToken(), { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 8 });
  return NextResponse.json({ ok: true });
}
