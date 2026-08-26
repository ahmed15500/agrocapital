"use client";

import { useState } from "react";
import { catalogCategories } from "@/lib/catalog";
import { dict } from "@/lib/i18n";
import { Locale, Product } from "@/lib/types";

type ContactFormProps = {
  locale: Locale;
  products: Product[];
  quoteMode?: boolean;
  quoteItems?: string;
  productSummary?: string;
  onSuccess?: () => void;
};

export function ContactForm({
  locale,
  products,
  quoteMode = false,
  quoteItems = "",
  productSummary = "",
  onSuccess
}: ContactFormProps) {
  const t = dict[locale];
  const [status, setStatus] = useState("");
  const [pending, setPending] = useState(false);
  const [startedAt] = useState(() => Date.now());

  async function submit(formData: FormData) {
    setStatus("");
    setPending(true);
    try {
      const response = await fetch("/api/contact", { method: "POST", body: formData });
      if (response.ok) {
        setStatus(locale === "en" ? "Inquiry sent." : "تم إرسال الاستفسار.");
        onSuccess?.();
      } else {
        setStatus(locale === "en" ? "Could not send inquiry." : "تعذر إرسال الاستفسار.");
      }
    } catch {
      setStatus(locale === "en" ? "Could not send inquiry." : "تعذر إرسال الاستفسار.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="form contact-form" action={submit}>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="honeypot" aria-hidden="true" />
      <input type="hidden" name="startedAt" value={startedAt} />
      {quoteMode && (
        <>
          <input type="hidden" name="quoteItems" value={quoteItems} />
          <input type="hidden" name="product" value={productSummary} />
          <input type="hidden" name="inquiryType" value={locale === "en" ? "Quote request" : "طلب عرض سعر"} />
        </>
      )}

      {t.fields.slice(0, 5).map((label, index) => (
        <label key={label}>
          {label}
          <input
            required={index < 3}
            name={["name", "company", "phone", "email", "location"][index]}
            type={index === 3 ? "email" : index === 2 ? "tel" : "text"}
            autoComplete={["name", "organization", "tel", "email", "address-level1"][index]}
          />
        </label>
      ))}

      {!quoteMode && (
        <>
          <label>
            {t.fields[5]}
            <select name="product" defaultValue="">
              <option value="">{locale === "en" ? "Select product or category" : "اختر المنتج أو الفئة"}</option>
              {catalogCategories.map((category) => <option key={category.slug} value={category.name.en}>{category.name[locale]}</option>)}
              {products.map((product) => <option key={product.id} value={product.name.en}>{product.name[locale]}</option>)}
            </select>
          </label>
          <label className="full">
            {locale === "en" ? "Inquiry type" : "نوع الاستفسار"}
            <select name="inquiryType">{t.inquiryTypes.map((item) => <option key={item}>{item}</option>)}</select>
          </label>
        </>
      )}

      <label className="full">
        {t.fields[6]}
        <textarea
          required
          name="message"
          defaultValue={quoteMode
            ? (locale === "en" ? "Please provide a quotation for the selected products." : "برجاء إرسال عرض سعر للمنتجات المختارة.")
            : undefined}
        />
      </label>
      <div className="form-submit full">
        <button className="btn primary" type="submit" disabled={pending}>
          {pending
            ? (locale === "en" ? "Sending..." : "جارٍ الإرسال...")
            : quoteMode
              ? (locale === "en" ? "Send quote request" : "إرسال طلب عرض السعر")
              : t.submit}
        </button>
        {status && <p aria-live="polite">{status}</p>}
      </div>
    </form>
  );
}
