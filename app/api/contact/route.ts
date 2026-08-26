import { NextResponse } from "next/server";
import { saveSubmission } from "@/lib/content";

export async function POST(request: Request) {
  const data = await request.formData();
  if (String(data.get("website") || "")) return NextResponse.json({ ok: true });
  const startedAt = Number(data.get("startedAt") || 0);
  if (startedAt && Date.now() - startedAt < 1800) {
    return NextResponse.json({ error: "Spam protection triggered" }, { status: 400 });
  }

  const required = ["name", "phone", "message"];
  for (const field of required) {
    if (!String(data.get(field) || "").trim()) {
      return NextResponse.json({ error: `Missing ${field}` }, { status: 400 });
    }
  }

  const submission: Record<string, string> = { submittedAt: new Date().toISOString() };
  for (const [key, value] of data.entries()) {
    if (key !== "website" && key !== "startedAt") submission[key] = String(value).slice(0, 3000);
  }
  await saveSubmission(submission);
  return NextResponse.json({ ok: true });
}
