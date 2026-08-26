import Image from "next/image";
import { notFound } from "next/navigation";
import { getPost } from "@/lib/content";
import { isLocale } from "@/lib/i18n";
import { Locale } from "@/lib/types";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  const language: Locale = locale === "ar" ? "ar" : "en";
  return {
    title: post.title[language],
    description: post.excerpt[language],
    alternates: { languages: { en: `/en/news/${slug}`, ar: `/ar/news/${slug}` } }
  };
}

export default async function NewsPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <main>
      <article className="article">
        <header className="article-header container">
          <span className="eyebrow">{post.category[locale]}</span>
          <h1>{post.title[locale]}</h1>
          <p>{post.excerpt[locale]}</p>
          <time dateTime={post.publishedAt}>{post.publishedAt}</time>
        </header>
        <div className="article-image container">
          <Image src={post.image || "/uploads/crop-inspection.png"} alt="" fill priority sizes="(max-width: 1180px) 100vw, 1180px" />
        </div>
        <div className="article-body container">{post.body[locale]}</div>
      </article>
    </main>
  );
}
