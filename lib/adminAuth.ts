import crypto from "crypto";

export function adminToken() {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) throw new Error("ADMIN_PASSWORD is not configured");
  return crypto.createHash("sha256").update(`agrocapital:${secret}`).digest("hex");
}

export function isAdminCookie(value?: string) {
  if (!value || !process.env.ADMIN_PASSWORD) return false;
  const expected = adminToken();
  if (value.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(value), Buffer.from(expected));
}
