import { Clock3, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { notFound } from "next/navigation";
import { ContactForm } from "@/components/ContactForm";
import { PageHero } from "@/components/PageHero";
import { getProducts, getSiteData } from "@/lib/content";
import { dict, isLocale } from "@/lib/i18n";
import { Locale } from "@/lib/types";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    title: locale === "ar" ? "تواصل مع أجرو كابيتال" : "Contact AgroCapital",
    description: locale === "ar" ? "أرسل استفسار منتجات أو طلب عرض سعر إلى فريق أجرو كابيتال مصر." : "Send a product enquiry, distribution request or quotation request to the AgroCapital Egypt team.",
    alternates: { languages: { en: "/en/contact", ar: "/ar/contact" } }
  };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const [site, products] = await Promise.all([getSiteData(), getProducts()]);
  const t = dict[locale];
  const contactItems = [
    { icon: MapPin, label: locale === "en" ? "Address" : "العنوان", value: site.company.address[locale] },
    { icon: Phone, label: locale === "en" ? "Phone" : "الهاتف", value: site.company.phone },
    { icon: MessageCircle, label: "WhatsApp", value: site.company.whatsapp },
    { icon: Mail, label: locale === "en" ? "Email" : "البريد الإلكتروني", value: site.company.email },
    { icon: Clock3, label: locale === "en" ? "Working hours" : "ساعات العمل", value: site.company.workingHours[locale] }
  ].filter((item) => Boolean(item.value));

  return (
    <main>
      <PageHero
        locale={locale}
        eyebrow={{ en: "Contact AgroCapital", ar: "تواصل مع أجرو كابيتال" }}
        title={{ en: "Talk to the right person.", ar: "تحدث مع الشخص المناسب." }}
        body={{
          en: "Send a product, technical, distribution, import, export, or partnership enquiry. The form routes your request with the information the team needs to respond.",
          ar: "أرسل استفساراً عن منتج أو دعماً فنياً أو طلب توزيع أو استيراد أو تصدير أو شراكة. يجمع النموذج المعلومات التي يحتاجها الفريق للرد."
        }}
        image="/uploads/field-consultation.png"
        imageAlt={{ en: "Farmer speaking with an agricultural specialist", ar: "مزارع يتحدث مع متخصص زراعي" }}
      />

      <section className="section">
        <div className="container contact-page-grid">
          <div className="contact-aside">
            <span className="eyebrow">{locale === "en" ? "Company details" : "بيانات الشركة"}</span>
            <h2>{t.contactTitle}</h2>
            <p>{t.formIntro}</p>
            {contactItems.length > 0 ? (
              <div className="contact-details">
                {contactItems.map(({ icon: Icon, label, value }) => (
                  <div className="contact-detail" key={label}>
                    <Icon size={20} aria-hidden="true" />
                    <div><strong>{label}</strong><span>{value}</span></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="contact-pending">{t.missingContact}</div>
            )}
          </div>
          <ContactForm locale={locale} products={products} />
        </div>
      </section>
    </main>
  );
}
