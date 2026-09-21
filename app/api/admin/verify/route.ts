import { NextResponse } from "next/server";
import { ADMIN_COOKIE, createAdminSession, verifyMagicLinkToken } from "@/lib/adminAuth";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const email = verifyMagicLinkToken(url.searchParams.get("token") || undefined);
  if (!email) return NextResponse.redirect(new URL("/admin?login=invalid", request.url));

  const response = NextResponse.redirect(new URL("/admin?login=success", request.url));
  response.cookies.set(ADMIN_COOKIE, createAdminSession(email), {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8
  });
  response.headers.set("Referrer-Policy", "no-referrer");
  return response;
}
