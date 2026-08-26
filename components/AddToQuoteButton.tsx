"use client";

import { Check, Plus } from "lucide-react";
import { useQuote } from "@/components/QuoteProvider";
import { Locale } from "@/lib/types";

export function AddToQuoteButton({
  locale,
  productId,
  className = "btn gold"
}: {
  locale: Locale;
  productId: string;
  className?: string;
}) {
  const { addProduct, isSelected, openDrawer } = useQuote();
  const selected = isSelected(productId);

  return (
    <button
      className={`${className} quote-add-button${selected ? " is-selected" : ""}`}
      type="button"
      aria-pressed={selected}
      onClick={() => selected ? openDrawer() : addProduct(productId)}
    >
      {selected ? <Check size={17} aria-hidden="true" /> : <Plus size={17} aria-hidden="true" />}
      {selected
        ? (locale === "en" ? "In quote list" : "ضمن طلب السعر")
        : (locale === "en" ? "Add to quote" : "أضف لعرض السعر")}
    </button>
  );
}
