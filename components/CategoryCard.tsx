import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CatalogCategory } from "@/lib/catalog";
import { Locale } from "@/lib/types";

export function CategoryCard({ locale, category }: { locale: Locale; category: CatalogCategory }) {
  return (
    <Link className="category-card" href={`/${locale}/products/${category.slug}`}>
      <div className="category-image">
        <Image
          src={category.image}
          alt={category.alt[locale]}
          fill
          sizes="(max-width: 680px) 100vw, (max-width: 1080px) 50vw, 25vw"
          loading="lazy"
        />
      </div>
      <div className="category-copy">
        <span className="eyebrow">{category.eyebrow[locale]}</span>
        <h3>{category.name[locale]}</h3>
        <p>{category.description[locale]}</p>
        <span className="text-link">
          {locale === "en" ? "View category" : "عرض الفئة"}
          <ArrowUpRight size={17} aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
