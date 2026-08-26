import { notFound } from "next/navigation";
import { CategoryCard } from "@/components/CategoryCard";
import { PageHero } from "@/components/PageHero";
import { ProductExplorer } from "@/components/ProductExplorer";
import { catalogCategories } from "@/lib/catalog";
import { getProducts } from "@/lib/content";
import { dict, isLocale } from "@/lib/i18n";
import { Locale } from "@/lib/types";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    title: locale === "ar" ? "المنتجات الزراعية" : "Agricultural Products",
    description: locale === "ar" ? "فئات الأسمدة وتغذية النبات ومحسنات التربة وحماية المحاصيل من أجرو كابيتال مصر." : "Explore fertilizer, plant nutrition, soil health and crop-protection categories from AgroCapital Egypt.",
    alternates: { languages: { en: "/en/products", ar: "/ar/products" } }
  };
}

export default async function ProductsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const products = await getProducts();
  const t = dict[locale];

  return (
    <main>
      <PageHero
        locale={locale}
        eyebrow={{ en: "Product catalogue", ar: "كتالوج المنتجات" }}
        title={{ en: "Agricultural inputs, clearly organized.", ar: "مدخلات زراعية منظمة بوضوح." }}
        body={{
          en: "Browse AgroCapital's agricultural product categories. Exact compositions, rates, registrations, packaging, and recommendations are displayed only when supplied in official product information.",
          ar: "تصفح فئات منتجات أجرو كابيتال الزراعية. تُعرض التراكيب والمعدلات والتسجيلات والعبوات والتوصيات فقط عند ورودها في معلومات المنتج الرسمية."
        }}
        image="/uploads/plant-nutrition.png"
        imageAlt={{ en: "Healthy crop growing in cultivated soil", ar: "محصول صحي ينمو في تربة مزروعة" }}
      />

      <section className="section" data-reveal>
        <div className="container">
          <div className="section-header compact-header">
            <div>
              <span className="eyebrow">{locale === "en" ? "Eight focus areas" : "ثمانية مجالات رئيسية"}</span>
              <h2>{locale === "en" ? "Explore by category." : "استكشف حسب الفئة."}</h2>
            </div>
          </div>
          <div className="category-grid">
            {catalogCategories.map((category) => <CategoryCard key={category.slug} locale={locale} category={category} />)}
          </div>
        </div>
      </section>

      <section className="section soft-section" data-reveal>
        <div className="container">
          <div className="section-header compact-header">
            <div>
              <span className="eyebrow">{locale === "en" ? "Commercial products" : "المنتجات التجارية"}</span>
              <h2>{locale === "en" ? "Official product entries." : "بيانات المنتجات الرسمية."}</h2>
            </div>
          </div>
          {products.length > 0 ? (
            <ProductExplorer locale={locale} products={products} />
          ) : (
            <div className="catalogue-notice">
              <p>{locale === "en" ? "Commercial pack details will appear here as they are approved for publication. Contact the team for current availability and official information." : "ستظهر تفاصيل العبوات التجارية هنا بعد اعتمادها للنشر. تواصل مع الفريق لمعرفة التوفر الحالي والمعلومات الرسمية."}</p>
              <a className="btn primary" href={`/${locale}/contact`}>{t.contactTeam}</a>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
