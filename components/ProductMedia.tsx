"use client";

import Image from "next/image";
import { ImageIcon, Pause, Play, Rotate3D } from "lucide-react";
import { useRef, useState } from "react";
import { Locale } from "@/lib/types";

export function ProductMedia({
  locale,
  image,
  video,
  alt
}: {
  locale: Locale;
  image: string;
  video?: string;
  alt: string;
}) {
  const [mode, setMode] = useState<"image" | "rotation">("image");
  const [playing, setPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlayback = async () => {
    const element = videoRef.current;
    if (!element) return;
    if (element.paused) {
      await element.play();
      setPlaying(true);
    } else {
      element.pause();
      setPlaying(false);
    }
  };

  return (
    <div className="product-detail-image product-media">
      {video && (
        <div className="media-mode-toggle" role="group" aria-label={locale === "en" ? "Product media" : "وسائط المنتج"}>
          <button
            type="button"
            className={mode === "image" ? "is-active" : ""}
            aria-pressed={mode === "image"}
            onClick={() => setMode("image")}
          >
            <ImageIcon size={17} aria-hidden="true" />
            {locale === "en" ? "Pack" : "العبوة"}
          </button>
          <button
            type="button"
            className={mode === "rotation" ? "is-active" : ""}
            aria-pressed={mode === "rotation"}
            onClick={() => {
              setMode("rotation");
              setPlaying(true);
            }}
          >
            <Rotate3D size={17} aria-hidden="true" />
            360°
          </button>
        </div>
      )}
      {mode === "rotation" && video ? (
        <>
          <video ref={videoRef} src={video} poster={image} autoPlay muted loop playsInline preload="metadata" aria-label={alt} />
          <button
            className="media-playback"
            type="button"
            onClick={togglePlayback}
            aria-label={playing ? (locale === "en" ? "Pause rotation" : "إيقاف الدوران") : (locale === "en" ? "Play rotation" : "تشغيل الدوران")}
            title={playing ? (locale === "en" ? "Pause rotation" : "إيقاف الدوران") : (locale === "en" ? "Play rotation" : "تشغيل الدوران")}
          >
            {playing ? <Pause size={18} aria-hidden="true" /> : <Play size={18} aria-hidden="true" />}
          </button>
        </>
      ) : (
        <Image src={image} alt={alt} fill priority sizes="(max-width: 900px) 100vw, 48vw" />
      )}
    </div>
  );
}
