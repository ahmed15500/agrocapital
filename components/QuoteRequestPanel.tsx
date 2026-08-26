"use client";

import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Minus, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { ContactForm } from "@/components/ContactForm";
import { useQuote } from "@/components/QuoteProvider";
import { Locale, Product } from "@/lib/types";

export function QuoteRequestPanel({ locale, products }: { locale: Locale; products: Product[] }) {
  const { items, setQuantity, removeProduct, clearQuote } = useQuote();
  const [submitted, setSubmitted] = useState(false);
  const productMap = useMemo(() => new Map(products.map((product) => [product.id, product])), [products]);
  const selected = items.flatMap((item) => {
    const product = productMap.get(item.productId);
    return product ? [{ ...item, product }] : [];
  });

  if (submitted) {
    return (
      <div className="quote-success" role="status">
        <CheckCircle2 size={38} aria-hidden="true" />
        <h2>{locale === "en" ? "Quote request sent" : "تم إرسال طلب عرض السعر"}</h2>
        <p>{locale === "en" ? "Your selected products and contact details were sent to the AgroCapital team." : "تم إرسال المنتجات المختارة وبيانات التواصل إلى فريق أجرو كابيتال."}</p>
        <Link className="btn primary" href={`/${locale}/products`}>
          {locale === "en" ? "Return to products" : "العودة إلى المنتجات"}
        </Link>
      </div>
    );
  }

  if (selected.length === 0) {
    return (
      <div className="quote-empty-state">
        <h2>{locale === "en" ? "Your quote list is empty" : "قائمة عرض السعر فارغة"}</h2>
        <p>{locale === "en" ? "Add one or more products, then return here to send one consolidated request." : "أضف منتجاً أو أكثر، ثم ارجع هنا لإرسال طلب واحد مجمع."}</p>
        <Link className="btn primary" href={`/${locale}/products`}>
          {locale === "en" ? "Explore products" : "استكشف المنتجات"}
        </Link>
      </div>
    );
  }

  const quoteItems = JSON.stringify(selected.map(({ product, quantity }) => ({
    id: product.id,
    slug: product.slug,
    nameEn: product.name.en,
    nameAr: product.name.ar,
    quantity
  })));
  const productSummary = selected.map(({ product, quantity }) => `${product.name.en} x ${quantity}`).join("; ");

  return (
    <div className="quote-workspace-grid">
      <section className="quote-review" aria-labelledby="quote-review-title">
        <div className="quote-review-heading">
          <div>
            <span className="meta">{locale === "en" ? "Step 1" : "الخطوة 1"}</span>
            <h2 id="quote-review-title">{locale === "en" ? "Review products" : "راجع المنتجات"}</h2>
          </div>
          <span>{locale === "en" ? `${selected.length} products` : `${selected.length} منتجات`}</span>
        </div>

        <div className="quote-review-list">
          {selected.map(({ product, quantity }) => (
            <article className="quote-review-row" key={product.id}>
              <Link className="quote-review-image" href={`/${locale}/products/${product.slug}`}>
                <Image src={product.image} alt={product.name[locale]} width={104} height={124} />
              </Link>
              <div className="quote-review-copy">
                <span className="meta">{product.category[locale]}</span>
                <Link href={`/${locale}/products/${product.slug}`}><h3>{product.name[locale]}</h3></Link>
                <p>{product.composition[locale]}</p>
                <span>{locale === "en" ? "Package" : "العبوة"}: {product.packageSize[locale]}</span>
              </div>
              <div className="quote-review-controls">
                <div className="quantity-control" aria-label={locale === "en" ? "Quantity" : "الكمية"}>
                  <button
                    type="button"
                    onClick={() => setQuantity(product.id, quantity - 1)}
                    disabled={quantity <= 1}
                    title={locale === "en" ? "Decrease quantity" : "تقليل الكمية"}
                    aria-label={locale === "en" ? "Decrease quantity" : "تقليل الكمية"}
                  >
                    <Minus size={16} />
                  </button>
                  <span aria-live="polite">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(product.id, quantity + 1)}
                    title={locale === "en" ? "Increase quantity" : "زيادة الكمية"}
                    aria-label={locale === "en" ? "Increase quantity" : "زيادة الكمية"}
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <button
                  className="icon-btn quote-remove"
                  type="button"
                  onClick={() => removeProduct(product.id)}
                  title={locale === "en" ? "Remove product" : "حذف المنتج"}
                  aria-label={`${locale === "en" ? "Remove" : "حذف"} ${product.name[locale]}`}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="quote-form-panel" aria-labelledby="quote-form-title">
        <div className="quote-form-heading">
          <span className="meta">{locale === "en" ? "Step 2" : "الخطوة 2"}</span>
          <h2 id="quote-form-title">{locale === "en" ? "Your contact details" : "بيانات التواصل"}</h2>
          <p>{locale === "en" ? "Send one request for all selected products." : "أرسل طلباً واحداً لكل المنتجات المختارة."}</p>
        </div>
        <ContactForm
          locale={locale}
          products={products}
          quoteMode
          quoteItems={quoteItems}
          productSummary={productSummary}
          onSuccess={() => {
            clearQuote();
            setSubmitted(true);
          }}
        />
      </section>
    </div>
  );
}
