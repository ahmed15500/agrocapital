"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { altLocale, dict } from "@/lib/i18n";
import { Locale, SiteData } from "@/lib/types";

export function SiteHeader({ locale, site }: { locale: Locale; site: SiteData }) {
  const t = dict[locale];
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const links = [
    [`/${locale}`, t.nav[0]],
    [`/${locale}/about`, t.nav[1]],
    [`/${locale}/products`, t.nav[2]],
    [`/${locale}/solutions`, t.nav[3]],
    [`/${locale}/news`, t.nav[4]],
    [`/${locale}/contact`, t.nav[5]]
  ];
  const other = altLocale(locale);
  const languagePath = pathname ? pathname.replace(/^\/(en|ar)(?=\/|$)/, `/${other}`) : `/${other}`;

  return (
    <header className="header">
      <nav className="container nav" aria-label={locale === "en" ? "Primary navigation" : "التنقل الرئيسي"}>
        <Link className="brand" href={`/${locale}`} aria-label={site.company.name[locale]}>
          <Image src={site.company.logo} alt={site.company.name[locale]} width={170} height={64} priority />
        </Link>

        <button
          className="nav-toggle"
          type="button"
          aria-label={locale === "en" ? "Toggle navigation" : "فتح أو إغلاق القائمة"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>

        <div className={`nav-links${open ? " is-open" : ""}`}>
          {links.map(([href, label]) => {
            const active = pathname === href || (href !== `/${locale}` && pathname.startsWith(`${href}/`));
            return (
              <Link
                key={href}
                href={href}
                className={active ? "active" : ""}
                aria-current={pathname === href ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            );
          })}
        </div>

        <div className="nav-actions">
          <Link className="lang" href={languagePath} aria-label={locale === "en" ? "View in Arabic" : "View in English"}>
            EN <span>|</span> AR
          </Link>
          <Link className="btn primary nav-quote" href={`/${locale}/quote`}>{t.quote}</Link>
        </div>
      </nav>
    </header>
  );
}
