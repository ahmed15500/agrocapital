import { Locale } from "./types";

export const locales: Locale[] = ["en", "ar"];

export const dict = {
  en: {
    nav: ["Home", "About Us", "Products", "Agricultural Solutions", "News and Insights", "Contact Us"],
    quote: "Request a Quote",
    explore: "Explore Our Products",
    contactTeam: "Contact Our Team",
    aboutTitle: "About AgroCapital",
    aboutBody:
      "AgroCapital is an Egyptian agricultural company focused on high-quality fertilizers, plant nutrition products, pesticides, soil improvement solutions, and crop-support products. The company combines carefully selected products with practical technical knowledge to support farmers, agricultural engineers, distributors, and commercial partners.",
    productsTitle: "Product Catalogue",
    productsIntro: "Catalogue entries are managed from the admin dashboard and should be populated from official company product data only.",
    noProducts: "No official product data has been added yet.",
    solutionsTitle: "Agricultural Solutions",
    whyTitle: "Why Choose AgroCapital?",
    newsTitle: "News and Agricultural Insights",
    noPosts: "No posts have been published yet.",
    contactTitle: "Contact AgroCapital",
    formIntro: "Send your inquiry and the team can respond with the right product or commercial information.",
    footerDesc: "Reliable agricultural inputs and crop-support solutions for farmers, engineers, distributors, and partners.",
    details: "View Details",
    requestProduct: "Request This Product",
    whatsapp: "WhatsApp Inquiry",
    downloadCatalogue: "Download Our Catalogue",
    expert: "Ask an Agricultural Expert",
    distributor: "Become a Distributor",
    fields: ["Full name", "Company or farm name", "Phone number", "Email address", "Governorate or country", "Product of interest", "Message"],
    inquiryTypes: ["Product inquiry", "Technical support", "Distribution", "Import/export partnership", "General inquiry"],
    submit: "Send Inquiry",
    missingContact: "Contact details are ready for official data entry in the CMS."
  },
  ar: {
    nav: ["الرئيسية", "من نحن", "المنتجات", "الحلول الزراعية", "الأخبار والرؤى", "اتصل بنا"],
    quote: "اطلب عرض سعر",
    explore: "استكشف المنتجات",
    contactTeam: "تواصل مع الفريق",
    aboutTitle: "عن أجرو كابيتال",
    aboutBody:
      "أجرو كابيتال شركة زراعية مصرية تركز على توفير الأسمدة عالية الجودة، ومنتجات تغذية النبات، والمبيدات، وحلول تحسين التربة، ومنتجات دعم المحاصيل. تجمع الشركة بين المنتجات المختارة بعناية والمعرفة الفنية العملية لخدمة المزارعين والمهندسين الزراعيين والموزعين والشركاء التجاريين.",
    productsTitle: "كتالوج المنتجات",
    productsIntro: "تدار بيانات الكتالوج من لوحة التحكم، ويجب إضافتها فقط من بيانات الشركة الرسمية.",
    noProducts: "لم تتم إضافة بيانات منتجات رسمية بعد.",
    solutionsTitle: "الحلول الزراعية",
    whyTitle: "لماذا أجرو كابيتال؟",
    newsTitle: "الأخبار والرؤى الزراعية",
    noPosts: "لم يتم نشر مقالات بعد.",
    contactTitle: "تواصل مع أجرو كابيتال",
    formIntro: "أرسل استفسارك ليتمكن الفريق من الرد بالمعلومات الفنية أو التجارية المناسبة.",
    footerDesc: "مدخلات زراعية موثوقة وحلول لدعم المحاصيل للمزارعين والمهندسين والموزعين والشركاء.",
    details: "عرض التفاصيل",
    requestProduct: "اطلب هذا المنتج",
    whatsapp: "استفسار واتساب",
    downloadCatalogue: "تحميل الكتالوج",
    expert: "اسأل خبيراً زراعياً",
    distributor: "كن موزعاً",
    fields: ["الاسم بالكامل", "اسم الشركة أو المزرعة", "رقم الهاتف", "البريد الإلكتروني", "المحافظة أو الدولة", "المنتج محل الاهتمام", "الرسالة"],
    inquiryTypes: ["استفسار عن منتج", "دعم فني", "توزيع", "شراكة استيراد/تصدير", "استفسار عام"],
    submit: "إرسال الاستفسار",
    missingContact: "بيانات الاتصال جاهزة للإدخال الرسمي من خلال نظام الإدارة."
  }
} as const;

export function isLocale(value: string): value is Locale {
  return value === "en" || value === "ar";
}

export function altLocale(locale: Locale): Locale {
  return locale === "en" ? "ar" : "en";
}
