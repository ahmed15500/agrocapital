"use client";

import Image from "next/image";
import Link from "next/link";
import { Package } from "lucide-react";
import { useRef, type PointerEvent } from "react";
import { AddToQuoteButton } from "@/components/AddToQuoteButton";
import { dict } from "@/lib/i18n";
import { Locale, Product } from "@/lib/types";

export function ProductCard({ locale, product }: { locale: Locale; product: Product }) {
  const t = dict[locale];
  const cardRef = useRef<HTMLElement>(null);

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    const card = cardRef.current;
    if (!card || event.pointerType === "touch") return;
    const bounds = card.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    card.style.setProperty("--tilt-y", `${((x - 0.5) * 10).toFixed(2)}deg`);
    card.style.setProperty("--tilt-x", `${((0.5 - y) * 7).toFixed(2)}deg`);
  };

  const resetTilt = () => {
    cardRef.current?.style.setProperty("--tilt-y", "0deg");
    cardRef.current?.style.setProperty("--tilt-x", "0deg");
  };

  return (
    <article ref={cardRef} className="card product-card" onPointerMove={handlePointerMove} onPointerLeave={resetTilt}>
      <Link className="product-image product-image-link" href={`/${locale}/products/${product.slug}`}>
        {product.image ? <Image src={product.image} alt={product.name[locale]} width={420} height={420} loading="lazy" /> : <Package size={76} color="#1f5b3b" />}
      </Link>
      <div className="product-body">
        <span className="meta">{product.category[locale]}</span>
        <Link className="product-title-link" href={`/${locale}/products/${product.slug}`}><h3>{product.name[locale]}</h3></Link>
        <p>{product.composition[locale] || product.shortBenefit[locale]}</p>
        {product.packageSize[locale] && <p><strong>{locale === "en" ? "Package:" : "العبوة:"}</strong> {product.packageSize[locale]}</p>}
        <div className="cta-row product-actions">
          <Link className="btn secondary" href={`/${locale}/products/${product.slug}`}>{t.details}</Link>
          <AddToQuoteButton locale={locale} productId={product.id} />
        </div>
      </div>
    </article>
  );
}
