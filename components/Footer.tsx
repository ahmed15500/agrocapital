import Image from "next/image";
import Link from "next/link";
import { dict } from "@/lib/i18n";
import { Locale, Product, SiteData } from "@/lib/types";

export function Footer({ locale, site, products }: { locale: Locale; site: SiteData; products: Product[] }) {
  const t = dict[locale];
  const socialLinks = Object.entries(site.company.social).filter(([, value]) => Boolean(value));
  const quickLinks = [
    { href: `/${locale}`, label: t.nav[0] },
    { href: `/${locale}/products`, label: t.nav[2] },
    { href: `/${locale}/about`, label: t.nav[1] },
    { href: `/${locale}/contact`, label: t.nav[5] },
    { href: `/${locale}/quote`, label: t.quote }
  ];

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
            {quickLinks.map((item) => (
              <Link key={item.href} href={item.href}>{item.label}</Link>
            ))}
          </div>
          <div>
            <h4>{locale === "en" ? "Product catalogue" : "كتالوج المنتجات"}</h4>
            <p>{locale === "en" ? `${products.length} products with commercial pack and technical data.` : `${products.length} منتجًا مع بيانات العبوة والنشرة الفنية.`}</p>
            <Link href={`/${locale}/products`}>{locale === "en" ? "Explore the Olivic range" : "استكشف مجموعة أوليفك"}</Link>
          </div>
          <div>
            <h4>{locale === "en" ? "Contact" : "التواصل"}</h4>
            {site.company.address[locale] && <p>{site.company.address[locale]}</p>}
            {site.company.phone && <p>{site.company.phone}</p>}
            {site.company.email && <Link href={`mailto:${site.company.email}`}>{site.company.email}</Link>}
            <Link href={`/${locale}/privacy`}>{locale === "en" ? "Privacy Policy" : "سياسة الخصوصية"}</Link>
          </div>
        </div>
        <div className="copyright">© 2026 AgroCapital for International Trade. All rights reserved.</div>
      </div>
    </footer>
  );
}
