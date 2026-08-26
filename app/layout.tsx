import type { Metadata } from "next";
import { Inter, Noto_Kufi_Arabic } from "next/font/google";
import "./globals.css";

const latin = Inter({ subsets: ["latin"], variable: "--font-latin", display: "swap" });
const arabic = Noto_Kufi_Arabic({ subsets: ["arabic"], variable: "--font-arabic", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || "https://agrocapital-eg.com"),
  title: {
    default: "AgroCapital Egypt | Agricultural Fertilizers, Plant Nutrition and Crop Protection",
    template: "%s | AgroCapital Egypt"
  },
  description:
    "AgroCapital for International Trade provides agricultural fertilizers, plant nutrition products, pesticides, soil enhancers and crop-protection solutions in Egypt.",
  openGraph: {
    type: "website",
    siteName: "AgroCapital for International Trade",
    images: ["/uploads/greenhouse-field.png"]
  },
  icons: {
    icon: "/uploads/site-icon.png",
    apple: "/uploads/site-icon.png"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${latin.variable} ${arabic.variable}`}>
      <body>{children}</body>
    </html>
  );
}
