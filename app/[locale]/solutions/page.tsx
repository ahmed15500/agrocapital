import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { isLocale } from "@/lib/i18n";
import { Locale } from "@/lib/types";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    title: locale === "ar" ? "الحلول الزراعية" : "Agricultural Solutions",
    description: locale === "ar" ? "حلول أجرو كابيتال لتغذية النبات وصحة التربة وحماية المحاصيل والدعم الفني الزراعي." : "AgroCapital solutions for plant nutrition, soil health, crop protection and technical agricultural support.",
    alternates: { languages: { en: "/en/solutions", ar: "/ar/solutions" } }
  };
}

const solutions = [
  { slug: "npk-fertilizers", image: "/generated/catalog/npk-fertilizers.webp", en: "Plant Nutrition", ar: "تغذية النبات", enBody: "Navigate fertilizer, NPK, micronutrient, and related nutrition categories by the needs of a professional crop programme.", arBody: "تصفح فئات الأسمدة وNPK والعناصر الصغرى وغيرها من فئات التغذية وفق احتياجات برنامج المحصول المتخصص." },
  { slug: "crop-protection", image: "/generated/catalog/crop-protection.webp", en: "Crop Protection", ar: "حماية المحاصيل", enBody: "Explore crop-protection categories while keeping active ingredients, safety information, and rates specific to each approved product.", arBody: "استكشف فئات حماية المحاصيل مع إبقاء المواد الفعالة وبيانات السلامة والمعدلات خاصة بكل منتج معتمد." },
  { slug: "soil-conditioners", image: "/generated/catalog/soil-conditioners.webp", en: "Soil Health", ar: "صحة التربة", enBody: "Find soil conditioner and humic or fulvic categories organized around soil and root-zone programmes.", arBody: "اعثر على فئات محسنات التربة والهيوميك والفولفيك المنظمة حول برامج التربة ومنطقة الجذور." },
  { slug: "growth-regulators", image: "/generated/catalog/growth-regulators.webp", en: "Growth and Yield Improvement", ar: "تحسين النمو والإنتاجية", enBody: "Review crop-development categories with product-specific timing, crop, and application information kept on official pages.", arBody: "راجع فئات تطور المحصول مع إبقاء معلومات التوقيت والمحصول والاستخدام الخاصة بكل منتج في صفحته الرسمية." },
  { slug: "micronutrients", image: "/generated/catalog/micronutrients.webp", en: "Micronutrient Deficiency Management", ar: "إدارة نقص العناصر الصغرى", enBody: "Connect micronutrient enquiries with the relevant official catalogue entries and technical information.", arBody: "اربط استفسارات العناصر الصغرى ببيانات الكتالوج الرسمية والمعلومات الفنية ذات الصلة." },
  { slug: "contact", image: "/uploads/crop-inspection.png", en: "Technical Agricultural Support", ar: "الدعم الفني الزراعي", enBody: "Speak with the AgroCapital team about product information, commercial enquiries, distribution, or agricultural support.", arBody: "تحدث مع فريق أجرو كابيتال بشأن معلومات المنتجات أو الاستفسارات التجارية أو التوزيع أو الدعم الزراعي." }
];

export default async function SolutionsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;

  return (
    <main>
      <PageHero
        locale={locale}
        eyebrow={{ en: "Agricultural solutions", ar: "الحلول الزراعية" }}
        title={{ en: "Start with the field need.", ar: "ابدأ من احتياج الحقل." }}
        body={{
          en: "AgroCapital organizes its agricultural offer around practical needs, helping farmers, engineers, and commercial partners reach the relevant product categories and official information.",
          ar: "تنظم أجرو كابيتال ما تقدمه حول الاحتياجات الزراعية العملية لمساعدة المزارعين والمهندسين والشركاء التجاريين في الوصول إلى فئات المنتجات والمعلومات الرسمية ذات الصلة."
        }}
        image="/uploads/soil-health.png"
        imageAlt={{ en: "Healthy plant and detailed root system", ar: "نبات صحي ومجموع جذري واضح" }}
      />

      <section className="section">
        <div className="container solution-list">
          {solutions.map((solution, index) => (
            <article className="solution-row" key={solution.en}>
              <div className="solution-index">0{index + 1}</div>
              <div className="solution-image">
                <Image src={solution.image} alt="" fill sizes="(max-width: 760px) 100vw, 34vw" />
              </div>
              <div className="solution-copy">
                <h2>{locale === "en" ? solution.en : solution.ar}</h2>
                <p>{locale === "en" ? solution.enBody : solution.arBody}</p>
                <Link className="text-link" href={solution.slug === "contact" ? `/${locale}/contact` : `/${locale}/products/${solution.slug}`}>
                  {locale === "en" ? (solution.slug === "contact" ? "Contact the team" : "View related category") : (solution.slug === "contact" ? "تواصل مع الفريق" : "عرض الفئة ذات الصلة")}
                  <ArrowUpRight size={17} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
