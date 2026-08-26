"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { Locale, Product } from "@/lib/types";

export function ProductExplorer({ locale, products }: { locale: Locale; products: Product[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const categories = useMemo(
    () => Array.from(new Map(products.map((product) => [product.category.en, product.category])).entries()),
    [products]
  );
  const normalizedQuery = query.trim().toLocaleLowerCase(locale === "ar" ? "ar" : "en");
  const filteredProducts = products.filter((product) => {
    const matchesCategory = category === "all" || product.category.en === category;
    const searchable = [product.name[locale], product.category[locale], product.composition[locale]]
      .join(" ")
      .toLocaleLowerCase(locale === "ar" ? "ar" : "en");
    return matchesCategory && (!normalizedQuery || searchable.includes(normalizedQuery));
  });

  return (
    <div className="product-explorer">
      <div className="product-toolbar">
        <label className="product-search">
          <span className="sr-only">{locale === "en" ? "Search products" : "ابحث عن منتج"}</span>
          <Search size={19} aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={locale === "en" ? "Search by product or composition" : "ابحث بالمنتج أو التركيب"}
          />
        </label>
        <div className="product-filters" role="group" aria-label={locale === "en" ? "Filter products" : "تصفية المنتجات"}>
          <button className={category === "all" ? "is-active" : ""} type="button" onClick={() => setCategory("all")}>
            {locale === "en" ? "All products" : "كل المنتجات"}
          </button>
          {categories.map(([key, label]) => (
            <button className={category === key ? "is-active" : ""} type="button" key={key} onClick={() => setCategory(key)}>
              {label[locale]}
            </button>
          ))}
        </div>
      </div>
      <p className="product-count" aria-live="polite">
        {locale === "en"
          ? `${filteredProducts.length} ${filteredProducts.length === 1 ? "product" : "products"}`
          : `${filteredProducts.length} ${filteredProducts.length === 1 ? "منتج" : "منتجات"}`}
      </p>
      {filteredProducts.length > 0 ? (
        <div className="product-grid">
          {filteredProducts.map((product) => <ProductCard key={product.id} locale={locale} product={product} />)}
        </div>
      ) : (
        <div className="catalogue-notice compact-notice">
          <p>{locale === "en" ? "No products match this search." : "لا توجد منتجات مطابقة لهذا البحث."}</p>
        </div>
      )}
    </div>
  );
}
