import { notFound } from "next/navigation";
import { QuoteRequestPanel } from "@/components/QuoteRequestPanel";
import { getProducts } from "@/lib/content";
import { isLocale } from "@/lib/i18n";
import { Locale } from "@/lib/types";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const language: Locale = locale === "ar" ? "ar" : "en";
  return {
    title: language === "en" ? "Request a Quote | AgroCapital Egypt" : "طلب عرض سعر | أجرو كابيتال مصر",
    description: language === "en"
      ? "Select AgroCapital agricultural products and send one consolidated quotation request."
      : "اختر منتجات أجرو كابيتال الزراعية وأرسل طلب عرض سعر مجمعاً.",
    alternates: { languages: { en: "/en/quote", ar: "/ar/quote" } }
  };
}

export default async function QuotePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const products = await getProducts();

  return (
    <main className="quote-page">
      <section className="quote-page-intro">
        <div className="container">
          <span className="eyebrow">{locale === "en" ? "Commercial inquiry" : "استفسار تجاري"}</span>
          <h1>{locale === "en" ? "Request a product quote" : "اطلب عرض سعر للمنتجات"}</h1>
          <p>{locale === "en" ? "Review multiple products, set the required quantities, and send one clear request to the AgroCapital team." : "راجع عدة منتجات وحدد الكميات المطلوبة، ثم أرسل طلباً واحداً واضحاً إلى فريق أجرو كابيتال."}</p>
        </div>
      </section>
      <section className="quote-page-workspace">
        <div className="container">
          <QuoteRequestPanel locale={locale} products={products} />
        </div>
      </section>
    </main>
  );
}
