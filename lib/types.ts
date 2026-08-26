export type Locale = "en" | "ar";

export type Localized = {
  en: string;
  ar: string;
};

export type Product = {
  id: string;
  slug: string;
  name: Localized;
  category: Localized;
  image: string;
  rotationVideo?: string;
  composition: Localized;
  packageSize: Localized;
  shortBenefit: Localized;
  overview: Localized;
  benefits: Localized[];
  recommendedCrops: Localized[];
  applicationMethod: Localized;
  usageRate: Localized;
  safetyInfo: Localized;
  registrationInfo: Localized;
  technicalSheet: string;
  featured: boolean;
};

export type Post = {
  id: string;
  slug: string;
  title: Localized;
  excerpt: Localized;
  body: Localized;
  category: Localized;
  image: string;
  publishedAt: string;
  featured: boolean;
};

export type SiteData = {
  company: {
    name: Localized;
    domain: string;
    logo: string;
    email: string;
    phone: string;
    whatsapp: string;
    address: Localized;
    workingHours: Localized;
    social: Record<string, string>;
  };
  home: {
    heroImage: string;
    headline: Localized;
    supportingText: Localized;
  };
  downloads: Array<{ label: Localized; url: string }>;
};
