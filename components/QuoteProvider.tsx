"use client";

import Image from "next/image";
import Link from "next/link";
import { ClipboardList, Minus, Plus, Trash2, X } from "lucide-react";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode
} from "react";
import { Locale, Product } from "@/lib/types";

type QuoteItem = {
  productId: string;
  quantity: number;
};

type QuoteContextValue = {
  locale: Locale;
  products: Product[];
  items: QuoteItem[];
  drawerOpen: boolean;
  addProduct: (productId: string) => void;
  removeProduct: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clearQuote: () => void;
  isSelected: (productId: string) => boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
};

const STORAGE_KEY = "agrocapital-quote-v1";
const QuoteContext = createContext<QuoteContextValue | null>(null);

export function QuoteProvider({
  locale,
  products,
  children
}: {
  locale: Locale;
  products: Product[];
  children: ReactNode;
}) {
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const validIds = new Set(products.map((product) => product.id));
    try {
      const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]") as QuoteItem[];
      if (Array.isArray(stored)) {
        setItems(
          stored
            .filter((item) => validIds.has(item.productId))
            .map((item) => ({
              productId: item.productId,
              quantity: Math.max(1, Math.min(999, Math.round(Number(item.quantity) || 1)))
            }))
        );
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    setHydrated(true);
  }, [products]);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [hydrated, items]);

  useEffect(() => {
    document.body.classList.toggle("quote-drawer-open", drawerOpen);
    return () => document.body.classList.remove("quote-drawer-open");
  }, [drawerOpen]);

  const value = useMemo<QuoteContextValue>(
    () => ({
      locale,
      products,
      items,
      drawerOpen,
      addProduct: (productId) => {
        setItems((current) =>
          current.some((item) => item.productId === productId)
            ? current
            : [...current, { productId, quantity: 1 }]
        );
      },
      removeProduct: (productId) => {
        setItems((current) => current.filter((item) => item.productId !== productId));
      },
      setQuantity: (productId, quantity) => {
        const nextQuantity = Math.max(1, Math.min(999, Math.round(quantity)));
        setItems((current) =>
          current.map((item) =>
            item.productId === productId ? { ...item, quantity: nextQuantity } : item
          )
        );
      },
      clearQuote: () => setItems([]),
      isSelected: (productId) => items.some((item) => item.productId === productId),
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false)
    }),
    [drawerOpen, items, locale, products]
  );

  return (
    <QuoteContext.Provider value={value}>
      {children}
      <QuoteTray />
    </QuoteContext.Provider>
  );
}

export function useQuote() {
  const context = useContext(QuoteContext);
  if (!context) throw new Error("useQuote must be used inside QuoteProvider");
  return context;
}

function QuoteTray() {
  const {
    locale,
    products,
    items,
    drawerOpen,
    openDrawer,
    closeDrawer,
    removeProduct,
    setQuantity
  } = useQuote();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const productMap = useMemo(() => new Map(products.map((product) => [product.id, product])), [products]);
  const selected = items.flatMap((item) => {
    const product = productMap.get(item.productId);
    return product ? [{ ...item, product }] : [];
  });

  useEffect(() => {
    if (!drawerOpen) return;
    closeButtonRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeDrawer();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [closeDrawer, drawerOpen]);

  return (
    <>
      <button
        className="quote-launcher"
        type="button"
        onClick={openDrawer}
        aria-expanded={drawerOpen}
        aria-controls="quote-drawer"
      >
        <ClipboardList size={20} aria-hidden="true" />
        <span>{locale === "en" ? "Quote list" : "قائمة عرض السعر"}</span>
        <strong>{items.length}</strong>
      </button>

      {drawerOpen && (
        <>
          <button
            className="quote-drawer-backdrop"
            type="button"
            onClick={closeDrawer}
            aria-label={locale === "en" ? "Close quote list" : "إغلاق قائمة عرض السعر"}
          />
          <aside
            id="quote-drawer"
            className="quote-drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby="quote-drawer-title"
          >
            <div className="quote-drawer-header">
              <div>
                <span className="meta">{locale === "en" ? "Selected products" : "المنتجات المختارة"}</span>
                <h2 id="quote-drawer-title">{locale === "en" ? "Build your quote" : "جهّز طلب عرض السعر"}</h2>
              </div>
              <button
                ref={closeButtonRef}
                className="icon-btn"
                type="button"
                onClick={closeDrawer}
                title={locale === "en" ? "Close" : "إغلاق"}
                aria-label={locale === "en" ? "Close" : "إغلاق"}
              >
                <X size={20} />
              </button>
            </div>

            <div className="quote-drawer-items">
              {selected.length > 0 ? selected.map(({ product, quantity }) => (
                <div className="quote-drawer-item" key={product.id}>
                  <Link href={`/${locale}/products/${product.slug}`} onClick={closeDrawer}>
                    <Image src={product.image} alt={product.name[locale]} width={72} height={82} />
                  </Link>
                  <div className="quote-drawer-item-copy">
                    <Link href={`/${locale}/products/${product.slug}`} onClick={closeDrawer}>
                      <strong>{product.name[locale]}</strong>
                    </Link>
                    <span>{product.packageSize[locale]}</span>
                    <div className="quantity-control" aria-label={locale === "en" ? "Quantity" : "الكمية"}>
                      <button
                        type="button"
                        onClick={() => setQuantity(product.id, quantity - 1)}
                        disabled={quantity <= 1}
                        title={locale === "en" ? "Decrease quantity" : "تقليل الكمية"}
                        aria-label={locale === "en" ? "Decrease quantity" : "تقليل الكمية"}
                      >
                        <Minus size={15} />
                      </button>
                      <span aria-live="polite">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => setQuantity(product.id, quantity + 1)}
                        title={locale === "en" ? "Increase quantity" : "زيادة الكمية"}
                        aria-label={locale === "en" ? "Increase quantity" : "زيادة الكمية"}
                      >
                        <Plus size={15} />
                      </button>
                    </div>
                  </div>
                  <button
                    className="icon-btn quote-remove"
                    type="button"
                    onClick={() => removeProduct(product.id)}
                    title={locale === "en" ? "Remove product" : "حذف المنتج"}
                    aria-label={`${locale === "en" ? "Remove" : "حذف"} ${product.name[locale]}`}
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              )) : (
                <div className="quote-drawer-empty">
                  <ClipboardList size={30} aria-hidden="true" />
                  <p>{locale === "en" ? "Choose products from the catalogue to start a quote request." : "اختر المنتجات من الكتالوج لبدء طلب عرض السعر."}</p>
                </div>
              )}
            </div>

            <div className="quote-drawer-footer">
              <span>{locale === "en" ? `${selected.length} selected` : `${selected.length} منتج مختار`}</span>
              {selected.length > 0 ? (
                <Link className="btn primary" href={`/${locale}/quote`} onClick={closeDrawer}>
                  {locale === "en" ? "Review request" : "مراجعة الطلب"}
                </Link>
              ) : (
                <Link className="btn secondary" href={`/${locale}/products`} onClick={closeDrawer}>
                  {locale === "en" ? "Browse products" : "تصفح المنتجات"}
                </Link>
              )}
            </div>
          </aside>
        </>
      )}
    </>
  );
}
