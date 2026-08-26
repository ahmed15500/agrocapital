import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";
import { Locale } from "@/lib/types";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return { title: locale === "ar" ? "الشروط والأحكام" : "Terms and Conditions" };
}

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  return (
    <main className="legal-page">
      <div className="container legal-copy">
        <span className="eyebrow">{locale === "en" ? "Legal" : "قانوني"}</span>
        <h1>{locale === "en" ? "Terms and Conditions" : "الشروط والأحكام"}</h1>
        <p>{locale === "en" ? "This page is reserved for AgroCapital's approved terms and conditions. No legal wording has been invented." : "هذه الصفحة مخصصة للشروط والأحكام المعتمدة من أجرو كابيتال. لم تتم إضافة صياغة قانونية غير معتمدة."}</p>
      </div>
    </main>
  );
}
