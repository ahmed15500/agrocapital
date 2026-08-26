import Image from "next/image";
import { Localized, Locale } from "@/lib/types";

export function PageHero({
  locale,
  eyebrow,
  title,
  body,
  image,
  imageAlt
}: {
  locale: Locale;
  eyebrow: Localized;
  title: Localized;
  body: Localized;
  image: string;
  imageAlt: Localized;
}) {
  return (
    <section className="page-hero">
      <div className="container page-hero-grid">
        <div className="page-hero-copy">
          <span className="eyebrow">{eyebrow[locale]}</span>
          <h1>{title[locale]}</h1>
          <p>{body[locale]}</p>
        </div>
        <div className="page-hero-image">
          <Image src={image} alt={imageAlt[locale]} fill priority sizes="(max-width: 960px) 100vw, 52vw" />
        </div>
      </div>
    </section>
  );
}
