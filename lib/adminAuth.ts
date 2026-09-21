import crypto from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "agrocapital_admin";
const defaultAdminEmails = ["agrocapital916.eg@gmail.com", "abahrawy20@gmail.com"];

export const ADMIN_EMAILS = Array.from(
  new Set(
    (process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || defaultAdminEmails.join(","))
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean)
  )
);

export function isAdminEmail(email?: string | null) {
  return Boolean(email && ADMIN_EMAILS.includes(email.trim().toLowerCase()));
}

function authSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.RESEND_API_KEY;
  if (!secret) throw new Error("Admin authentication is not configured");
  return secret;
}

function sign(payload: string) {
  return crypto.createHmac("sha256", authSecret()).update(payload).digest("base64url");
}

function createToken(payload: Record<string, string | number>) {
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${encoded}.${sign(encoded)}`;
}

function readToken(value?: string) {
  if (!value) return null;
  const [encoded, signature] = value.split(".");
  if (!encoded || !signature) return null;
  const expected = sign(encoded);
  if (signature.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  try {
    return JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as { kind?: string; email?: string; exp?: number };
  } catch {
    return null;
  }
}

export function createMagicLinkToken(email: string) {
  return createToken({
    kind: "magic-link",
    email: email.trim().toLowerCase(),
    exp: Date.now() + 10 * 60 * 1000,
    nonce: crypto.randomBytes(16).toString("hex")
  });
}

export function verifyMagicLinkToken(value?: string) {
  const payload = readToken(value);
  if (!payload || payload.kind !== "magic-link" || !isAdminEmail(payload.email) || !payload.exp || payload.exp < Date.now()) return null;
  return payload.email;
}

export function createAdminSession(email: string) {
  return createToken({ kind: "session", email: email.trim().toLowerCase(), exp: Date.now() + 8 * 60 * 60 * 1000 });
}

export function isAdminCookie(value?: string) {
  const payload = readToken(value);
  return Boolean(payload && payload.kind === "session" && isAdminEmail(payload.email) && payload.exp && payload.exp >= Date.now());
}

export async function requireAdmin() {
  const cookieStore = await cookies();
  return isAdminCookie(cookieStore.get(ADMIN_COOKIE)?.value);
}
