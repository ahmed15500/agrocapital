import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Handshake, Leaf, SearchCheck } from "lucide-react";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { dict, isLocale } from "@/lib/i18n";
import { Locale } from "@/lib/types";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    title: locale === "ar" ? "عن أجرو كابيتال" : "About AgroCapital",
    description: locale === "ar" ? "تعرف على أجرو كابيتال للتجارة الدولية ونهجها في المدخلات والحلول الزراعية." : "Learn about AgroCapital for International Trade and its approach to agricultural inputs and crop-support solutions.",
    alternates: { languages: { en: "/en/about", ar: "/ar/about" } }
  };
}

const principles = [
  { icon: SearchCheck, en: "Careful selection", ar: "اختيار دقيق", enBody: "Products are selected with attention to their role in professional agricultural programmes.", arBody: "تُختار المنتجات بعناية وفق دورها في البرامج الزراعية المتخصصة." },
  { icon: CheckCircle2, en: "Reliable information", ar: "معلومات موثوقة", enBody: "Commercial and technical details are presented from approved company information.", arBody: "تُعرض التفاصيل التجارية والفنية وفق معلومات الشركة المعتمدة." },
  { icon: Leaf, en: "Practical agriculture", ar: "زراعة عملية", enBody: "The company focuses on the real needs of crops, farms, and agricultural professionals.", arBody: "تركز الشركة على الاحتياجات الفعلية للمحاصيل والمزارع والمتخصصين الزراعيين." },
  { icon: Handshake, en: "Long-term relationships", ar: "علاقات طويلة الأمد", enBody: "AgroCapital values dependable relationships with clients, suppliers, and commercial partners.", arBody: "تقدر أجرو كابيتال العلاقات الموثوقة مع العملاء والموردين والشركاء التجاريين." }
];

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const t = dict[locale];

  return (
    <main>
      <PageHero
        locale={locale}
        eyebrow={{ en: "About AgroCapital", ar: "عن أجرو كابيتال" }}
        title={{ en: "Agriculture first. Relationships always.", ar: "الزراعة أولاً. والعلاقات دائماً." }}
        body={{
          en: "AgroCapital is an Egyptian agricultural company providing fertilizers, plant nutrition products, pesticides, soil-improvement solutions, and crop-support products for professional and commercial customers.",
          ar: "أجرو كابيتال شركة زراعية مصرية توفر الأسمدة ومنتجات تغذية النبات والمبيدات وحلول تحسين التربة ومنتجات دعم المحاصيل للعملاء المتخصصين والتجاريين."
        }}
        image="/uploads/field-consultation.png"
        imageAlt={{ en: "Farmer and agricultural specialist reviewing field information", ar: "مزارع ومتخصص زراعي يراجعان معلومات الحقل" }}
      />

      <section className="section">
        <div className="container editorial-grid">
          <div className="editorial-copy">
            <span className="eyebrow">{locale === "en" ? "Our approach" : "نهجنا"}</span>
            <h2>{locale === "en" ? "Knowledge translated into dependable service." : "معرفة تتحول إلى خدمة موثوقة."}</h2>
            <p>{t.aboutBody}</p>
            <p>{locale === "en" ? "Our role is to connect carefully selected agricultural inputs with the farmers, engineers, distributors, farms, and companies that need clear commercial communication and responsive support." : "يتمثل دورنا في ربط المدخلات الزراعية المختارة بعناية بالمزارعين والمهندسين والموزعين والمزارع والشركات التي تحتاج إلى تواصل تجاري واضح ودعم سريع الاستجابة."}</p>
            <Link className="btn primary" href={`/${locale}/contact`}>{t.contactTeam}</Link>
          </div>
          <div className="editorial-image">
            <Image src="/uploads/plant-nutrition.png" alt={locale === "en" ? "Healthy young crop receiving professional care" : "محصول صغير صحي يحظى برعاية متخصصة"} fill sizes="(max-width: 900px) 100vw, 45vw" />
          </div>
        </div>
      </section>

      <section className="section soft-section">
        <div className="container">
          <div className="section-header compact-header">
            <div>
              <span className="eyebrow">{locale === "en" ? "What guides us" : "ما يوجهنا"}</span>
              <h2>{locale === "en" ? "Clear principles, applied every day." : "مبادئ واضحة نطبقها كل يوم."}</h2>
            </div>
          </div>
          <div className="principle-grid">
            {principles.map(({ icon: Icon, en, ar, enBody, arBody }) => (
              <article className="principle" key={en}>
                <Icon size={23} aria-hidden="true" />
                <h3>{locale === "en" ? en : ar}</h3>
                <p>{locale === "en" ? enBody : arBody}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container audience-band">
          <div>
            <span className="eyebrow">{locale === "en" ? "Who we work with" : "من نخدم"}</span>
            <h2>{locale === "en" ? "Across the agricultural value chain." : "عبر سلسلة القيمة الزراعية."}</h2>
          </div>
          <ul className="audience-list">
            {(locale === "en"
              ? ["Farmers", "Agricultural engineers", "Distributors and retailers", "Farms and agricultural companies", "Importers and exporters", "International manufacturers seeking an Egyptian partner"]
              : ["المزارعون", "المهندسون الزراعيون", "الموزعون وتجار التجزئة", "المزارع والشركات الزراعية", "المستوردون والمصدرون", "المصنعون الدوليون الباحثون عن شريك مصري"]
            ).map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
      </section>
    </main>
  );
}
