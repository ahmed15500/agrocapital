import type { MetadataRoute } from "next";
import { catalogCategories } from "@/lib/catalog";
import { getPosts, getProducts } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.SITE_URL || "https://agrocapital-eg.com";
  const [products, posts] = await Promise.all([getProducts(), getPosts()]);
  const pageNames = ["", "/about", "/products", "/solutions", "/news", "/contact", "/quote", "/privacy", "/terms"];
  const routes = pageNames.flatMap((page) => [`/en${page}`, `/ar${page}`]);
  const dynamic = [
    ...catalogCategories.flatMap((category) => [`/en/products/${category.slug}`, `/ar/products/${category.slug}`]),
    ...products.flatMap((p) => [`/en/products/${p.slug}`, `/ar/products/${p.slug}`]),
    ...posts.flatMap((p) => [`/en/news/${p.slug}`, `/ar/news/${p.slug}`])
  ];
  return [...routes, ...dynamic].map((url) => ({ url: `${base}${url}`, lastModified: new Date() }));
}
