import { NextResponse } from "next/server";

export const runtime = "nodejs";

const contactRecipient = process.env.CONTACT_TO_EMAIL || "agrocapital916.eg@gmail.com";
const contactSender = process.env.RESEND_FROM_EMAIL || "AgroCapital Website <onboarding@resend.dev>";

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;"
  })[character] || character);
}

function getField(data: FormData, key: string, maxLength = 3000) {
  return String(data.get(key) || "").trim().slice(0, maxLength);
}

type QuoteItem = {
  nameEn?: string;
  nameAr?: string;
  quantity?: number;
};

function readQuoteItems(raw: string) {
  if (!raw) return [] as QuoteItem[];
  try {
    const value = JSON.parse(raw);
    return Array.isArray(value) ? value.slice(0, 50) as QuoteItem[] : [];
  } catch {
    return [] as QuoteItem[];
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    if (getField(data, "website")) return NextResponse.json({ ok: true });

    const startedAt = Number(data.get("startedAt") || 0);
    if (startedAt && Date.now() - startedAt < 1800) {
      return NextResponse.json({ error: "Spam protection triggered" }, { status: 400 });
    }

    const name = getField(data, "name", 160);
    const company = getField(data, "company", 160);
    const phone = getField(data, "phone", 80);
    const email = getField(data, "email", 254);
    const location = getField(data, "location", 160);
    const product = getField(data, "product", 2000);
    const inquiryType = getField(data, "inquiryType", 160) || "Website inquiry";
    const message = getField(data, "message", 3000);
    const quoteItems = readQuoteItems(getField(data, "quoteItems", 12000));

    if (!name || !phone || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("RESEND_API_KEY is not configured");
      return NextResponse.json({ error: "Email service is not configured" }, { status: 503 });
    }

    const productRows = quoteItems.length
      ? quoteItems.map((item) => {
          const label = item.nameEn || item.nameAr || "Selected product";
          const quantity = Math.max(1, Number(item.quantity) || 1);
          return `<li><strong>${escapeHtml(label)}</strong> &times; ${quantity}</li>`;
        }).join("")
      : product
        ? `<li>${escapeHtml(product)}</li>`
        : "<li>No product selected</li>";

    const replyTo = email || undefined;
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: contactSender,
        to: [contactRecipient],
        ...(replyTo ? { reply_to: replyTo } : {}),
        subject: `[AgroCapital] ${inquiryType} - ${name}`,
        html: `
          <div style="font-family:Arial,sans-serif;color:#172018;line-height:1.6;max-width:680px;margin:auto">
            <h1 style="color:#155c36">New AgroCapital website inquiry</h1>
            <table style="border-collapse:collapse;width:100%">
              <tbody>
                <tr><td style="padding:8px;border-bottom:1px solid #ddd"><strong>Name</strong></td><td style="padding:8px;border-bottom:1px solid #ddd">${escapeHtml(name)}</td></tr>
                <tr><td style="padding:8px;border-bottom:1px solid #ddd"><strong>Company / Farm</strong></td><td style="padding:8px;border-bottom:1px solid #ddd">${escapeHtml(company || "—")}</td></tr>
                <tr><td style="padding:8px;border-bottom:1px solid #ddd"><strong>Phone</strong></td><td style="padding:8px;border-bottom:1px solid #ddd">${escapeHtml(phone)}</td></tr>
                <tr><td style="padding:8px;border-bottom:1px solid #ddd"><strong>Email</strong></td><td style="padding:8px;border-bottom:1px solid #ddd">${escapeHtml(email || "—")}</td></tr>
                <tr><td style="padding:8px;border-bottom:1px solid #ddd"><strong>Location</strong></td><td style="padding:8px;border-bottom:1px solid #ddd">${escapeHtml(location || "—")}</td></tr>
                <tr><td style="padding:8px;border-bottom:1px solid #ddd"><strong>Inquiry type</strong></td><td style="padding:8px;border-bottom:1px solid #ddd">${escapeHtml(inquiryType)}</td></tr>
              </tbody>
            </table>
            <h2 style="color:#155c36">Products</h2>
            <ul>${productRows}</ul>
            <h2 style="color:#155c36">Message</h2>
            <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
          </div>
        `,
        text: [
          "New AgroCapital website inquiry",
          `Name: ${name}`,
          `Company / Farm: ${company || "—"}`,
          `Phone: ${phone}`,
          `Email: ${email || "—"}`,
          `Location: ${location || "—"}`,
          `Inquiry type: ${inquiryType}`,
          `Products: ${product || quoteItems.map((item) => `${item.nameEn || item.nameAr || "Selected product"} x ${Math.max(1, Number(item.quantity) || 1)}`).join("; ") || "None"}`,
          `Message: ${message}`
        ].join("\n")
      })
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      console.error("Resend error", response.status, result);
      return NextResponse.json({ error: "Could not send inquiry" }, { status: 502 });
    }

    return NextResponse.json({ ok: true, id: result.id });
  } catch (error) {
    console.error("Contact form error", error);
    return NextResponse.json({ error: "Could not send inquiry" }, { status: 500 });
  }
}
