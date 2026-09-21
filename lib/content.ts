import fs from "fs/promises";
import path from "path";
import { head, put } from "@vercel/blob";
import { CmsData, Product, Post, SiteData } from "./types";

const contentDir = path.join(process.cwd(), "content");
const cmsBlobPath = "cms/agrocapital-content.json";

function hasBlobStorage() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN || (process.env.BLOB_STORE_ID && process.env.VERCEL_OIDC_TOKEN));
}

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(path.join(contentDir, file), "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJson<T>(file: string, data: T) {
  await fs.mkdir(contentDir, { recursive: true });
  await fs.writeFile(path.join(contentDir, file), `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

const emptyLocalized = { en: "", ar: "" };

async function readFileCmsData(): Promise<CmsData> {
  const [site, products, posts] = await Promise.all([
    readJson<SiteData>("site.json", {} as SiteData),
    readJson<Partial<Product>[]>("products.json", []),
    readJson<Partial<Post>[]>("posts.json", [])
  ]);
  return { site, products: normalizeProducts(products), posts: normalizePosts(posts) };
}

async function readCmsData(): Promise<CmsData> {
  if (hasBlobStorage()) {
    try {
      const blob = await head(cmsBlobPath);
      const response = await fetch(blob.url, { cache: "no-store" });
      if (!response.ok) throw new Error(`CMS content returned ${response.status}`);
      const payload = await response.json() as { site?: SiteData; products?: Partial<Product>[]; posts?: Partial<Post>[] };
      if (payload.site && Array.isArray(payload.products) && Array.isArray(payload.posts)) {
        return { site: payload.site, products: normalizeProducts(payload.products), posts: normalizePosts(payload.posts) };
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (!message.toLowerCase().includes("not found")) console.error("Could not read CMS content from Blob", error);
    }
  }
  return readFileCmsData();
}

function normalizeProducts(products: Partial<Product>[]): Product[] {
  return products.map((product) => ({
    id: product.id || product.slug || "",
    slug: product.slug || product.id || "",
    name: product.name || emptyLocalized,
    category: product.category || emptyLocalized,
    image: product.image || "",
    rotationVideo: product.rotationVideo,
    composition: product.composition || emptyLocalized,
    packageSize: product.packageSize || emptyLocalized,
    shortBenefit: product.shortBenefit || emptyLocalized,
    overview: product.overview || product.shortBenefit || emptyLocalized,
    benefits: product.benefits || [],
    recommendedCrops: product.recommendedCrops || [],
    applicationMethod: product.applicationMethod || emptyLocalized,
    usageRate: product.usageRate || emptyLocalized,
    safetyInfo: product.safetyInfo || emptyLocalized,
    registrationInfo: product.registrationInfo || emptyLocalized,
    technicalSheet: product.technicalSheet || "",
    featured: Boolean(product.featured),
    status: product.status === "draft" ? "draft" : "published"
  }));
}

function normalizePosts(posts: Partial<Post>[]): Post[] {
  return posts.map((post) => ({
    id: post.id || post.slug || "",
    slug: post.slug || post.id || "",
    title: post.title || emptyLocalized,
    excerpt: post.excerpt || emptyLocalized,
    body: post.body || emptyLocalized,
    category: post.category || emptyLocalized,
    image: post.image || "",
    publishedAt: post.publishedAt || new Date().toISOString().slice(0, 10),
    featured: Boolean(post.featured),
    status: post.status === "draft" ? "draft" : "published"
  }));
}

export async function getSiteData() {
  return (await readCmsData()).site;
}

export async function getProducts() {
  return (await readCmsData()).products.filter((product) => product.status === "published");
}

export async function getPosts() {
  return (await readCmsData()).posts
    .filter((post) => post.status === "published")
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export const getAdminCmsData = () => readCmsData();

export async function getProduct(slug: string) {
  return (await getProducts()).find((product) => product.slug === slug);
}

export async function getPost(slug: string) {
  return (await getPosts()).find((post) => post.slug === slug);
}

export async function saveCmsData(payload: CmsData) {
  if (hasBlobStorage()) {
    await put(cmsBlobPath, `${JSON.stringify(payload, null, 2)}\n`, {
      access: "public",
      allowOverwrite: true,
      contentType: "application/json; charset=utf-8",
      cacheControlMaxAge: 60
    });
    return;
  }

  if (process.env.VERCEL) throw new Error("Persistent CMS storage is not connected");
  await Promise.all([
    writeJson("site.json", payload.site),
    writeJson("products.json", payload.products),
    writeJson("posts.json", payload.posts)
  ]);
}

export async function saveSubmission(submission: Record<string, string>) {
  const submissions = await readJson<Record<string, string>[]>("submissions.json", []);
  submissions.unshift(submission);
  await writeJson("submissions.json", submissions.slice(0, 500));
}
