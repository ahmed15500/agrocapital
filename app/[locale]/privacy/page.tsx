import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";
import { Locale } from "@/lib/types";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return { title: locale === "ar" ? "سياسة الخصوصية" : "Privacy Policy" };
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  return (
    <main className="legal-page">
      <div className="container legal-copy">
        <span className="eyebrow">{locale === "en" ? "Legal" : "قانوني"}</span>
        <h1>{locale === "en" ? "Privacy Policy" : "سياسة الخصوصية"}</h1>
        <p>{locale === "en" ? "This page is reserved for AgroCapital's approved legal privacy text. No policy wording has been invented." : "هذه الصفحة مخصصة لنص سياسة الخصوصية القانوني المعتمد من أجرو كابيتال. لم تتم إضافة صياغة قانونية غير معتمدة."}</p>
      </div>
    </main>
  );
}
