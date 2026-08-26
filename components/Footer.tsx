import Image from "next/image";
import Link from "next/link";
import { catalogCategories } from "@/lib/catalog";
import { dict } from "@/lib/i18n";
import { Locale, Product, SiteData } from "@/lib/types";

export function Footer({ locale, site, products }: { locale: Locale; site: SiteData; products: Product[] }) {
  const t = dict[locale];
  const quickRoutes = ["", "about", "products", "solutions", "news", "contact"];
  const socialLinks = Object.entries(site.company.social).filter(([, value]) => Boolean(value));
  void products;

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Image src={site.company.logo} alt={site.company.name[locale]} width={176} height={68} />
            <p>{t.footerDesc}</p>
            {socialLinks.length > 0 && (
              <div className="footer-social">
                {socialLinks.map(([network, url]) => <Link key={network} href={url}>{network}</Link>)}
              </div>
            )}
          </div>
          <div>
            <h4>{locale === "en" ? "Quick links" : "روابط سريعة"}</h4>
            {t.nav.map((item, index) => (
              <Link key={item} href={`/${locale}${quickRoutes[index] ? `/${quickRoutes[index]}` : ""}`}>{item}</Link>
            ))}
          </div>
          <div>
            <h4>{locale === "en" ? "Product categories" : "فئات المنتجات"}</h4>
            {catalogCategories.slice(0, 5).map((category) => (
              <Link key={category.slug} href={`/${locale}/products/${category.slug}`}>{category.name[locale]}</Link>
            ))}
          </div>
          <div>
            <h4>{locale === "en" ? "Contact" : "التواصل"}</h4>
            <p>{site.company.address[locale] || t.missingContact}</p>
            {site.company.phone && <p>{site.company.phone}</p>}
            {site.company.email && <p>{site.company.email}</p>}
            <Link href={`/${locale}/privacy`}>{locale === "en" ? "Privacy Policy" : "سياسة الخصوصية"}</Link>
            <Link href={`/${locale}/terms`}>{locale === "en" ? "Terms and Conditions" : "الشروط والأحكام"}</Link>
          </div>
        </div>
        <div className="copyright">© 2026 AgroCapital for International Trade. All rights reserved.</div>
      </div>
    </footer>
  );
}
