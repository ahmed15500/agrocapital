import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2, Handshake, Headphones, Microscope, ShieldCheck, Sprout } from "lucide-react";
import { notFound } from "next/navigation";
import { CategoryCard } from "@/components/CategoryCard";
import { InteractiveHeroMedia } from "@/components/InteractiveHeroMedia";
import { ProductCard } from "@/components/ProductCard";
import { catalogCategories } from "@/lib/catalog";
import { getProducts, getSiteData } from "@/lib/content";
import { dict, isLocale } from "@/lib/i18n";
import { Locale } from "@/lib/types";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isAr = locale === "ar";
  return {
    title: isAr ? "أجرو كابيتال مصر | الأسمدة وتغذية النبات وحماية المحاصيل" : "AgroCapital Egypt | Fertilizers, Plant Nutrition and Crop Protection",
    description: isAr
      ? "أجرو كابيتال للتجارة الدولية شركة مصرية للمدخلات الزراعية ومنتجات تغذية النبات ومحسنات التربة وحلول حماية المحاصيل."
      : "AgroCapital for International Trade is an Egyptian company for agricultural fertilizers, plant nutrition, soil enhancers and crop-protection solutions.",
    alternates: { languages: { en: "/en", ar: "/ar" } }
  };
}

const strengths = [
  { icon: CheckCircle2, en: "Carefully selected products", ar: "منتجات مختارة بعناية" },
  { icon: ShieldCheck, en: "Reliable quality", ar: "جودة موثوقة" },
  { icon: Microscope, en: "Agricultural knowledge", ar: "معرفة زراعية" },
  { icon: Headphones, en: "Responsive support", ar: "دعم سريع الاستجابة" },
  { icon: Sprout, en: "Solutions for different crops", ar: "حلول لمحاصيل مختلفة" },
  { icon: Handshake, en: "Long-term partnerships", ar: "شراكات طويلة الأمد" }
];

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const [site, products] = await Promise.all([getSiteData(), getProducts()]);
  const t = dict[locale];
  const featuredCategories = [catalogCategories[0], catalogCategories[1], catalogCategories[4], catalogCategories[7]];
  const featuredProducts = products.filter((product) => product.featured).slice(0, 3);

  return (
    <main>
      <section className="hero">
        <div className="container hero-layout">
          <div className="hero-content">
            <span className="eyebrow">{locale === "en" ? "Agricultural inputs · Egypt" : "مدخلات زراعية · مصر"}</span>
            <h1>{site.home.headline[locale]}</h1>
            <p>{site.home.supportingText[locale]}</p>
            <div className="hero-actions">
              <Link className="btn primary" href={`/${locale}/products`}>{t.explore}</Link>
              <Link className="btn secondary" href={`/${locale}/contact`}>{t.contactTeam}</Link>
            </div>
            <div className="hero-facts" aria-label={locale === "en" ? "Company focus" : "مجالات عمل الشركة"}>
              <span>{locale === "en" ? "Plant nutrition" : "تغذية النبات"}</span>
              <span>{locale === "en" ? "Soil health" : "صحة التربة"}</span>
              <span>{locale === "en" ? "Crop protection" : "حماية المحاصيل"}</span>
            </div>
          </div>
          <InteractiveHeroMedia
            src={site.home.heroImage}
            alt={locale === "en" ? "Agricultural engineer working in a cultivated field" : "مهندس زراعي يعمل داخل حقل مزروع"}
            note={locale === "en" ? "For farmers, engineers, distributors and commercial partners" : "للمزارعين والمهندسين والموزعين والشركاء التجاريين"}
          />
        </div>
      </section>

      <section className="section" id="categories" data-reveal>
        <div className="container">
          <div className="section-header">
            <div>
              <span className="eyebrow">{locale === "en" ? "Product catalogue" : "كتالوج المنتجات"}</span>
              <h2>{locale === "en" ? "Built around the crop." : "مصمم حول احتياجات المحصول."}</h2>
            </div>
            <div className="section-intro">
              <p>{locale === "en" ? "Explore AgroCapital's main product categories. Exact commercial specifications appear only with official company data." : "استكشف فئات منتجات أجرو كابيتال الرئيسية. تظهر المواصفات التجارية الدقيقة فقط وفق بيانات الشركة الرسمية."}</p>
              <Link className="text-link" href={`/${locale}/products`}>{locale === "en" ? "See all categories" : "عرض جميع الفئات"} <ArrowUpRight size={17} /></Link>
            </div>
          </div>
          <div className="category-grid home-category-grid">
            {featuredCategories.map((category) => <CategoryCard key={category.slug} locale={locale} category={category} />)}
          </div>
        </div>
      </section>

      {featuredProducts.length > 0 && (
        <section className="section product-showcase" data-reveal>
          <div className="container">
            <div className="section-header">
              <div>
                <span className="eyebrow">{locale === "en" ? "Official products" : "المنتجات الرسمية"}</span>
                <h2>{locale === "en" ? "Meet the Olivic range." : "تعرّف على مجموعة أوليفك."}</h2>
              </div>
              <div className="section-intro">
                <p>{locale === "en" ? "Explore each commercial pack with the exact information currently supplied on its label." : "استكشف كل عبوة تجارية بالمعلومات الدقيقة المتاحة حاليًا على ملصقها."}</p>
                <Link className="text-link" href={`/${locale}/products`}>
                  {locale === "en" ? "Explore all products" : "استكشف كل المنتجات"} <ArrowUpRight size={17} />
                </Link>
              </div>
            </div>
            <div className="product-grid featured-product-grid">
              {featuredProducts.map((product) => <ProductCard key={product.id} locale={locale} product={product} />)}
            </div>
          </div>
        </section>
      )}

      <section className="section soft-section" id="solutions-preview" data-reveal>
        <div className="container story-grid">
          <div className="story-image">
            <Image src="/uploads/soil-health.png" alt={locale === "en" ? "Young plant with a visible root system" : "نبات صغير مع مجموع جذري ظاهر"} fill sizes="(max-width: 900px) 100vw, 48vw" />
          </div>
          <div className="story-copy">
            <span className="eyebrow">{locale === "en" ? "Agricultural solutions" : "الحلول الزراعية"}</span>
            <h2>{locale === "en" ? "From the root zone to crop protection." : "من منطقة الجذور إلى حماية المحصول."}</h2>
            <p>{locale === "en" ? "AgroCapital organizes its offer around practical agricultural needs: plant nutrition, soil health, crop development, protection, and technical support." : "تنظم أجرو كابيتال ما تقدمه حول الاحتياجات الزراعية العملية: تغذية النبات وصحة التربة وتطور المحصول والحماية والدعم الفني."}</p>
            <Link className="btn primary" href={`/${locale}/solutions`}>{locale === "en" ? "Explore solutions" : "استكشف الحلول"}</Link>
          </div>
        </div>
      </section>

      <section className="section deep" id="why-agrocapital" data-reveal>
        <div className="container">
          <div className="section-header">
            <div>
              <span className="eyebrow light">{locale === "en" ? "Why AgroCapital" : "لماذا أجرو كابيتال"}</span>
              <h2>{locale === "en" ? "A practical partner for the field and the market." : "شريك عملي للحقل والسوق."}</h2>
            </div>
            <p>{locale === "en" ? "Focused on dependable service, careful product selection, and relationships that support farmers and commercial partners over time." : "تركيز على الخدمة الموثوقة والاختيار الدقيق للمنتجات والعلاقات التي تدعم المزارعين والشركاء التجاريين على المدى الطويل."}</p>
          </div>
          <div className="strength-list">
            {strengths.map(({ icon: Icon, en, ar }, index) => (
              <div className="strength-item" key={en}>
                <span className="strength-number">0{index + 1}</span>
                <Icon size={22} aria-hidden="true" />
                <strong>{locale === "en" ? en : ar}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="next-step" data-reveal>
        <div className="container closing-cta">
          <div>
            <span className="eyebrow">{locale === "en" ? "Start a conversation" : "ابدأ محادثة"}</span>
            <h2>{locale === "en" ? "Let’s find the right agricultural direction." : "لنحدد الاتجاه الزراعي المناسب."}</h2>
          </div>
          <div className="cta-row">
            <Link className="btn primary" href={`/${locale}/quote`}>{t.quote}</Link>
            <Link className="btn secondary" href={`/${locale}/about`}>{locale === "en" ? "About AgroCapital" : "عن أجرو كابيتال"}</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
