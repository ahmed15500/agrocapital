"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { useRef, type PointerEvent } from "react";

export function InteractiveHeroMedia({ src, alt, note }: { src: string; alt: string; note: string }) {
  const mediaRef = useRef<HTMLDivElement>(null);

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const media = mediaRef.current;
    if (!media || event.pointerType === "touch") return;
    const bounds = media.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    media.style.setProperty("--media-x", x.toFixed(3));
    media.style.setProperty("--media-y", y.toFixed(3));
  };

  const resetPointer = () => {
    mediaRef.current?.style.setProperty("--media-x", "0");
    mediaRef.current?.style.setProperty("--media-y", "0");
  };

  return (
    <div
      ref={mediaRef}
      className="hero-media interactive-hero-media"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
    >
      <Image src={src} alt={alt} fill priority sizes="(max-width: 960px) 100vw, 55vw" />
      <div className="hero-note">
        <span>{note}</span>
        <ArrowUpRight size={20} aria-hidden="true" />
      </div>
    </div>
  );
}
