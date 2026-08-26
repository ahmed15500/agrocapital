import fs from "fs/promises";
import path from "path";
import { Product, Post, SiteData } from "./types";

const contentDir = path.join(process.cwd(), "content");

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

export const getSiteData = () => readJson<SiteData>("site.json", {} as SiteData);
export const getProducts = () => readJson<Product[]>("products.json", []);
export const getPosts = () => readJson<Post[]>("posts.json", []);

export async function getProduct(slug: string) {
  return (await getProducts()).find((product) => product.slug === slug);
}

export async function getPost(slug: string) {
  return (await getPosts()).find((post) => post.slug === slug);
}

export async function saveCmsData(payload: { site: SiteData; products: Product[]; posts: Post[] }) {
  await writeJson("site.json", payload.site);
  await writeJson("products.json", payload.products);
  await writeJson("posts.json", payload.posts);
}

export async function saveSubmission(submission: Record<string, string>) {
  const submissions = await readJson<Record<string, string>[]>("submissions.json", []);
  submissions.unshift(submission);
  await writeJson("submissions.json", submissions.slice(0, 500));
}
