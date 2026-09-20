import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, FileText, PackageCheck } from "lucide-react";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { getProducts, getSiteData } from "@/lib/content";
import { dict, isLocale } from "@/lib/i18n";
import { Locale } from "@/lib/types";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isAr = locale === "ar";
  return {
    title: isAr ? "أجرو كابيتال مصر | تغذية نبات متخصصة" : "AgroCapital Egypt | Professional Crop Nutrition",
    description: isAr
      ? "مجموعة أوليفك من الأسمدة المتخصصة والعناصر الصغرى ومحسنات التربة للاستخدام الزراعي الاحترافي."
      : "The Olivic range of specialty fertilizers, micronutrients and soil inputs for professional agriculture.",
    alternates: { languages: { en: "/en", ar: "/ar" } }
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const [site, products] = await Promise.all([getSiteData(), getProducts()]);
  const t = dict[locale];
  const featuredProducts = products.filter((product) => product.featured).slice(0, 8);
  const heroIds = ["olivic-iron-6", "olivic-alga", "olivic-city-npk-6-6-43"];
  const heroProducts = heroIds.map((id) => products.find((product) => product.id === id)).filter(Boolean);

  return (
    <main>
      <section className="hero premium-hero">
        <Image className="premium-hero-bg" src={site.home.heroImage} alt="" fill priority sizes="100vw" />
        <div className="premium-hero-shade" />
        <div className="container hero-layout premium-hero-layout">
          <div className="hero-content premium-hero-copy">
            <span className="eyebrow light">{locale === "en" ? "AGROCAPITAL · EGYPT" : "أجرو كابيتال · مصر"}</span>
            <h1>{locale === "en" ? "Crop nutrition, built for performance." : "تغذية نبات مصممة للأداء."}</h1>
            <p>{locale === "en"
              ? "Specialty fertilizers, chelated micronutrients and soil inputs presented with clear specifications and commercial pack information."
              : "أسمدة متخصصة وعناصر صغرى مخلّبة ومدخلات للتربة، بمواصفات واضحة وبيانات دقيقة للعبوات التجارية."}</p>
            <div className="hero-actions">
              <Link className="btn gold" href={`/${locale}/products`}>{t.explore} <ArrowUpRight size={18} /></Link>
              <Link className="btn hero-ghost" href={`/${locale}/quote`}>{t.quote}</Link>
            </div>
            <div className="hero-metric-row">
              <div><strong>{products.length}</strong><span>{locale === "en" ? "products" : "منتجًا"}</span></div>
              <div><strong>6</strong><span>{locale === "en" ? "product families" : "عائلات منتجات"}</span></div>
              <div><strong>AR · EN</strong><span>{locale === "en" ? "technical catalogue" : "كتالوج فني"}</span></div>
            </div>
          </div>

          <div className="hero-product-stage" aria-label={locale === "en" ? "Featured Olivic products" : "منتجات أوليفك المختارة"}>
            <div className="hero-stage-glow" />
            {heroProducts.map((product, index) => product && (
              <Link
                className={`hero-pack hero-pack-${index + 1}`}
                href={`/${locale}/products/${product.slug}`}
                key={product.id}
                aria-label={product.name[locale]}
              >
                <Image src={product.image} alt={product.name[locale]} fill priority sizes="(max-width: 900px) 38vw, 22vw" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="catalogue-band">
        <div className="container catalogue-band-grid">
          <div><PackageCheck size={22} /><span>{locale === "en" ? "Commercial pack photography" : "صور واضحة للعبوات التجارية"}</span></div>
          <div><FileText size={22} /><span>{locale === "en" ? "Technical sheet for every product" : "نشرة فنية لكل منتج"}</span></div>
          <div><span className="catalogue-band-mark">NPK</span><span>{locale === "en" ? "Specialty fertilizers and micronutrients" : "أسمدة متخصصة وعناصر صغرى"}</span></div>
        </div>
      </section>

      <section className="section premium-products" data-reveal>
        <div className="container">
          <div className="section-header premium-section-header">
            <div>
              <span className="eyebrow">{locale === "en" ? "THE OLIVIC RANGE" : "مجموعة أوليفك"}</span>
              <h2>{locale === "en" ? "Products made easy to compare" : "منتجات واضحة وسهلة المقارنة"}</h2>
            </div>
            <div className="section-intro">
              <p>{locale === "en"
                ? "Each product page includes the official composition, pack size and its original technical data sheet."
                : "تتضمن صفحة كل منتج التركيب الرسمي وحجم العبوة والنشرة الفنية الأصلية."}</p>
              <Link className="text-link" href={`/${locale}/products`}>
                {locale === "en" ? `View all ${products.length} products` : `عرض جميع المنتجات وعددها ${products.length}`} <ArrowUpRight size={17} />
              </Link>
            </div>
          </div>
          <div className="product-grid featured-product-grid premium-product-grid">
            {featuredProducts.map((product) => <ProductCard key={product.id} locale={locale} product={product} />)}
          </div>
        </div>
      </section>

      <section className="section brand-story" data-reveal>
        <div className="container brand-story-grid">
          <div className="brand-story-image">
            <Image src="/uploads/field-consultation.png" alt={locale === "en" ? "Agricultural field consultation" : "استشارة زراعية داخل الحقل"} fill sizes="(max-width: 900px) 100vw, 52vw" />
          </div>
          <div className="brand-story-copy">
            <span className="eyebrow light">{locale === "en" ? "AGRICULTURAL TRADE" : "التجارة الزراعية"}</span>
            <h2>{locale === "en" ? "A focused portfolio for professional agriculture" : "مجموعة مركزة للزراعة الاحترافية"}</h2>
            <p>{locale === "en"
              ? "AgroCapital brings the Olivic portfolio together in one clear catalogue, from chelated micronutrients to NPK, phosphorus, potassium and organic soil inputs."
              : "تجمع أجرو كابيتال منتجات أوليفك في كتالوج واضح، من العناصر الصغرى المخلّبة إلى أسمدة NPK والفوسفور والبوتاسيوم والمدخلات العضوية للتربة."}</p>
            <Link className="btn hero-ghost" href={`/${locale}/about`}>{locale === "en" ? "About AgroCapital" : "عن أجرو كابيتال"}</Link>
          </div>
        </div>
      </section>

      <section className="section final-cta-section" data-reveal>
        <div className="container closing-cta premium-closing-cta">
          <div>
            <span className="eyebrow">{locale === "en" ? "COMMERCIAL ENQUIRIES" : "الاستفسارات التجارية"}</span>
            <h2>{locale === "en" ? "Tell us what your crop programme needs." : "أخبرنا باحتياجات برنامجك الزراعي."}</h2>
          </div>
          <div className="cta-row">
            <Link className="btn primary" href={`/${locale}/quote`}>{t.quote}</Link>
            <Link className="btn secondary" href={`/${locale}/contact`}>{t.contactTeam}</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
