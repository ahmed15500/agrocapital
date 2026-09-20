import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { notFound } from "next/navigation";
import { ProductExplorer } from "@/components/ProductExplorer";
import { getProducts } from "@/lib/content";
import { isLocale } from "@/lib/i18n";
import { Locale } from "@/lib/types";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    title: locale === "ar" ? "كتالوج منتجات أوليفك" : "Olivic Product Catalogue",
    description: locale === "ar" ? "جميع منتجات أوليفك ومواصفاتها الفنية وعبواتها التجارية." : "All Olivic products, technical compositions and commercial pack information.",
    alternates: { languages: { en: "/en/products", ar: "/ar/products" } }
  };
}

export default async function ProductsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const products = await getProducts();
  const categories = new Set(products.map((product) => product.category.en)).size;

  return (
    <main className="catalogue-page">
      <section className="catalogue-hero">
        <div className="container catalogue-hero-grid">
          <div>
            <span className="eyebrow light">{locale === "en" ? "OLIVIC PRODUCT CATALOGUE" : "كتالوج منتجات أوليفك"}</span>
            <h1>{locale === "en" ? "One portfolio. Clear specifications." : "مجموعة واحدة. مواصفات واضحة."}</h1>
            <p>{locale === "en"
              ? "Browse the complete AgroCapital range by product name, formula or category. Every entry links to its official technical data sheet."
              : "تصفح مجموعة أجرو كابيتال كاملة حسب اسم المنتج أو التركيب أو الفئة، مع نشرة فنية رسمية لكل منتج."}</p>
          </div>
          <div className="catalogue-summary">
            <div><strong>{products.length}</strong><span>{locale === "en" ? "commercial products" : "منتجًا تجاريًا"}</span></div>
            <div><strong>{categories}</strong><span>{locale === "en" ? "product families" : "عائلات منتجات"}</span></div>
            <Link href={`/${locale}/quote`}>{locale === "en" ? "Request a quotation" : "اطلب عرض سعر"} <ArrowUpRight size={18} /></Link>
          </div>
        </div>
      </section>

      <section className="section catalogue-products" data-reveal>
        <div className="container">
          <ProductExplorer locale={locale} products={products} />
        </div>
      </section>
    </main>
  );
}
