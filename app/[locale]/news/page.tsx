import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { getPosts } from "@/lib/content";
import { isLocale } from "@/lib/i18n";
import { Locale } from "@/lib/types";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    title: locale === "ar" ? "الأخبار والرؤى الزراعية" : "News and Agricultural Insights",
    description: locale === "ar" ? "أخبار المنتجات والمقالات والتوصيات الزراعية من أجرو كابيتال." : "Product news, company updates and agricultural insights from AgroCapital.",
    alternates: { languages: { en: "/en/news", ar: "/ar/news" } }
  };
}

export default async function NewsIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const posts = await getPosts();

  return (
    <main>
      <PageHero
        locale={locale}
        eyebrow={{ en: "News and insights", ar: "الأخبار والرؤى" }}
        title={{ en: "Useful knowledge, clearly shared.", ar: "معرفة مفيدة تُشارك بوضوح." }}
        body={{
          en: "Product announcements, agricultural recommendations, crop-nutrition articles, pest and disease guidance, company news, events, and exhibitions.",
          ar: "إعلانات المنتجات والتوصيات الزراعية ومقالات تغذية المحاصيل وإرشادات الآفات والأمراض وأخبار الشركة والفعاليات والمعارض."
        }}
        image="/uploads/crop-inspection.png"
        imageAlt={{ en: "Agricultural specialist inspecting a crop leaf", ar: "متخصص زراعي يفحص ورقة نبات" }}
      />

      <section className="section">
        <div className="container">
          {posts.length > 0 ? (
            <div className="post-grid">
              {posts.map((post) => (
                <article className="post-card" key={post.id}>
                  <div className="post-image">
                    <Image src={post.image || "/uploads/crop-inspection.png"} alt="" fill sizes="(max-width: 700px) 100vw, 33vw" />
                  </div>
                  <div className="post-copy">
                    <span className="eyebrow">{post.category[locale]}</span>
                    <h2>{post.title[locale]}</h2>
                    <p>{post.excerpt[locale]}</p>
                    <Link className="text-link" href={`/${locale}/news/${post.slug}`}>{locale === "en" ? "Read article" : "قراءة المقال"} <ArrowUpRight size={17} /></Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <span className="eyebrow">{locale === "en" ? "Coming from AgroCapital" : "قريباً من أجرو كابيتال"}</span>
              <h2>{locale === "en" ? "The insight library is being prepared." : "يجري إعداد مكتبة الرؤى."}</h2>
              <p>{locale === "en" ? "Approved company news and agricultural articles will be published here." : "ستنشر هنا أخبار الشركة والمقالات الزراعية المعتمدة."}</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
