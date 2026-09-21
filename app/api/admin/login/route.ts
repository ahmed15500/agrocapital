import { NextResponse } from "next/server";
import { createMagicLinkToken, isAdminEmail } from "@/lib/adminAuth";

const recentRequests = new Map<string, number>();

export async function POST(request: Request) {
  const { email } = await request.json() as { email?: string };
  const normalizedEmail = email?.trim().toLowerCase();
  const genericResponse = { ok: true, message: "If this email is authorized, a sign-in link has been sent." };
  if (!normalizedEmail || !isAdminEmail(normalizedEmail)) return NextResponse.json(genericResponse);

  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL || "AgroCapital Website <onboarding@resend.dev>";
  if (!resendApiKey) return NextResponse.json({ error: "Email delivery is not configured" }, { status: 503 });

  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const rateLimitKey = `${forwardedFor}:${normalizedEmail}`;
  const lastRequest = recentRequests.get(rateLimitKey) || 0;
  if (Date.now() - lastRequest < 60_000) {
    return NextResponse.json({ error: "Please wait one minute before requesting another link." }, { status: 429 });
  }
  recentRequests.set(rateLimitKey, Date.now());

  const verifyUrl = new URL("/api/admin/verify", request.url);
  verifyUrl.searchParams.set("token", createMagicLinkToken(normalizedEmail));
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${resendApiKey}`, "content-type": "application/json" },
    body: JSON.stringify({
      from: fromEmail,
      to: [normalizedEmail],
      subject: "رابط دخول لوحة إدارة AgroCapital",
      text: `افتح الرابط التالي لتسجيل الدخول إلى لوحة إدارة AgroCapital. الرابط صالح لمدة 10 دقائق:\n\n${verifyUrl.toString()}\n\nإذا لم تطلب هذا الرابط فتجاهل الرسالة.`,
      html: `<div dir="rtl" style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#173d2e"><h2>تسجيل الدخول إلى AgroCapital</h2><p>اضغط الزر التالي للدخول إلى لوحة الإدارة. الرابط صالح لمدة 10 دقائق.</p><p style="margin:28px 0"><a href="${verifyUrl.toString()}" style="background:#1d633e;color:#fff;padding:13px 22px;border-radius:7px;text-decoration:none;font-weight:bold">دخول لوحة الإدارة</a></p><p style="color:#718078;font-size:13px">إذا لم تطلب هذا الرابط فتجاهل الرسالة.</p></div>`
    })
  });
  if (!response.ok) {
    recentRequests.delete(rateLimitKey);
    console.error("Admin magic link email failed", response.status, await response.text());
    return NextResponse.json({ error: "Could not send the sign-in email" }, { status: 502 });
  }
  return NextResponse.json(genericResponse);
}
