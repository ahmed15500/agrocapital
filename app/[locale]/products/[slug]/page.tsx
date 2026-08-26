import Link from "next/link";
import { ArrowUpRight, Download, MessageCircle } from "lucide-react";
import { notFound } from "next/navigation";
import { AddToQuoteButton } from "@/components/AddToQuoteButton";
import { PageHero } from "@/components/PageHero";
import { ProductCard } from "@/components/ProductCard";
import { ProductMedia } from "@/components/ProductMedia";
import { getCatalogCategory, getCategoryForProduct, getCategoryProducts } from "@/lib/catalog";
import { getProduct, getProducts, getSiteData } from "@/lib/content";
import { dict, isLocale } from "@/lib/i18n";
import { Locale, Product } from "@/lib/types";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const language: Locale = locale === "ar" ? "ar" : "en";
  const category = getCatalogCategory(slug);
  if (category) {
    return {
      title: category.name[language],
      description: category.description[language],
      alternates: { languages: { en: `/en/products/${slug}`, ar: `/ar/products/${slug}` } }
    };
  }

  const product = await getProduct(slug);
  if (!product) return {};
  return {
    title: `${product.name[language]} | Agricultural Product`,
    description: product.shortBenefit[language] || product.composition[language],
    alternates: { languages: { en: `/en/products/${slug}`, ar: `/ar/products/${slug}` } }
  };
}

function OfficialProductPage({ locale, product, whatsapp }: { locale: Locale; product: Product; whatsapp: string }) {
  const t = dict[locale];
  const category = getCategoryForProduct(product);
  const image = product.image || category?.image || "/uploads/plant-nutrition.png";
  const specs = [
    { en: "Composition", ar: "التركيب", value: product.composition[locale] },
    { en: "Package size", ar: "حجم العبوة", value: product.packageSize[locale] },
    { en: "Application method", ar: "طريقة الاستخدام", value: product.applicationMethod[locale] },
    { en: "Usage rate", ar: "معدل الاستخدام", value: product.usageRate[locale] },
    { en: "Registration information", ar: "بيانات التسجيل", value: product.registrationInfo[locale] },
    { en: "Safety information", ar: "بيانات السلامة", value: product.safetyInfo[locale] }
  ].filter((item) => item.value);

  return (
    <main>
      <section className="product-detail-hero">
        <div className="container detail-grid">
          <ProductMedia locale={locale} image={image} video={product.rotationVideo} alt={product.name[locale]} />
          <div className="product-detail-copy" data-reveal>
            <span className="eyebrow">{product.category[locale]}</span>
            <h1>{product.name[locale]}</h1>
            <p>{product.overview[locale] || product.shortBenefit[locale]}</p>
            <div className="cta-row">
              <AddToQuoteButton className="btn primary" locale={locale} productId={product.id} />
              {whatsapp && (
                <Link className="btn secondary" href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}>
                  <MessageCircle size={18} /> {t.whatsapp}
                </Link>
              )}
              {product.technicalSheet && (
                <Link className="btn secondary" href={product.technicalSheet}>
                  <Download size={18} /> {locale === "en" ? "Technical data sheet" : "النشرة الفنية"}
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {specs.length > 0 && (
        <section className="section" data-reveal>
          <div className="container">
            <div className="section-header compact-header"><h2>{locale === "en" ? "Product information" : "معلومات المنتج"}</h2></div>
            <dl className="spec-grid">
              {specs.map((item) => (
                <div className="spec" key={item.en}>
                  <dt>{locale === "en" ? item.en : item.ar}</dt>
                  <dd>{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}

      {(product.benefits.length > 0 || product.recommendedCrops.length > 0) && (
        <section className="section soft-section" data-reveal>
          <div className="container two-column-copy">
            {product.benefits.length > 0 && (
              <div>
                <h2>{locale === "en" ? "Agricultural benefits" : "الفوائد الزراعية"}</h2>
                <ul>{product.benefits.map((benefit) => <li key={benefit.en}>{benefit[locale]}</li>)}</ul>
              </div>
            )}
            {product.recommendedCrops.length > 0 && (
              <div>
                <h2>{locale === "en" ? "Recommended crops" : "المحاصيل الموصى بها"}</h2>
                <ul>{product.recommendedCrops.map((crop) => <li key={crop.en}>{crop[locale]}</li>)}</ul>
              </div>
            )}
          </div>
        </section>
      )}
    </main>
  );
}

export default async function ProductOrCategoryPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const [site, products, product] = await Promise.all([getSiteData(), getProducts(), getProduct(slug)]);
  const category = getCatalogCategory(slug);

  if (!category) {
    if (!product) notFound();
    return <OfficialProductPage locale={locale} product={product} whatsapp={site.company.whatsapp} />;
  }

  const matchingProducts = getCategoryProducts(products, category);
  return (
    <main>
      <PageHero
        locale={locale}
        eyebrow={category.eyebrow}
        title={category.name}
        body={category.description}
        image={category.image}
        imageAlt={category.alt}
      />

      <section className="section" data-reveal>
        <div className="container category-detail-intro">
          <div>
            <span className="eyebrow">{locale === "en" ? "Official information first" : "المعلومات الرسمية أولاً"}</span>
            <h2>{locale === "en" ? "Every commercial product keeps its own specification." : "لكل منتج تجاري مواصفاته الخاصة."}</h2>
          </div>
          <div>
            <p>{locale === "en" ? "AgroCapital does not generalize composition, registration, rates, packaging, crop recommendations, or safety information across a category. Those details are shown only on the relevant approved product page." : "لا تعمم أجرو كابيتال بيانات التركيب أو التسجيل أو المعدلات أو العبوات أو توصيات المحاصيل أو معلومات السلامة على مستوى الفئة. تُعرض هذه التفاصيل فقط في صفحة المنتج المعتمد ذي الصلة."}</p>
            <Link className="text-link" href={`/${locale}/contact`}>
              {locale === "en" ? "Request category information" : "اطلب معلومات عن الفئة"} <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      <section className="section soft-section" data-reveal>
        <div className="container">
          <div className="section-header compact-header">
            <div>
              <span className="eyebrow">{locale === "en" ? "Commercial products" : "المنتجات التجارية"}</span>
              <h2>{locale === "en" ? `Products in ${category.name.en}` : `منتجات ${category.name.ar}`}</h2>
            </div>
          </div>
          {matchingProducts.length > 0 ? (
            <div className="product-grid">{matchingProducts.map((item) => <ProductCard key={item.id} locale={locale} product={item} />)}</div>
          ) : (
            <div className="catalogue-notice">
              <p>{locale === "en" ? "No approved commercial pack entries are published in this category yet. Contact AgroCapital for current official information." : "لا توجد بيانات منشورة لعبوات تجارية معتمدة في هذه الفئة حتى الآن. تواصل مع أجرو كابيتال للحصول على المعلومات الرسمية الحالية."}</p>
              <Link className="btn primary" href={`/${locale}/contact`}>{dict[locale].contactTeam}</Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
