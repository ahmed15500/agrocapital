"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function MotionEnhancer() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const items = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (reducedMotion.matches || !("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    root.classList.add("motion-ready");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -48px" }
    );

    items.forEach((item) => observer.observe(item));

    return () => {
      observer.disconnect();
      root.classList.remove("motion-ready");
    };
  }, [pathname]);

  return null;
}
