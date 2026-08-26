import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { MotionEnhancer } from "@/components/MotionEnhancer";
import { QuoteProvider } from "@/components/QuoteProvider";
import { SiteHeader } from "@/components/SiteHeader";
import { getProducts, getSiteData } from "@/lib/content";
import { dict, isLocale } from "@/lib/i18n";
import { Locale } from "@/lib/types";

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const activeLocale = locale as Locale;
  const [site, products] = await Promise.all([getSiteData(), getProducts()]);

  return (
    <div lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} className="site-shell">
      <QuoteProvider locale={activeLocale} products={products}>
        <SiteHeader locale={activeLocale} site={site} />
        <MotionEnhancer />
        {children}
        {site.company.whatsapp && (
          <Link
            className="float-whatsapp"
            href={`https://wa.me/${site.company.whatsapp.replace(/\D/g, "")}`}
            aria-label={dict[activeLocale].whatsapp}
          >
            <MessageCircle size={24} aria-hidden="true" />
          </Link>
        )}
        <Footer locale={activeLocale} site={site} products={products} />
      </QuoteProvider>
    </div>
  );
}
