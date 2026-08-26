import { Localized, Product } from "./types";

export type CatalogCategory = {
  slug: string;
  name: Localized;
  eyebrow: Localized;
  description: Localized;
  image: string;
  alt: Localized;
  matchTerms: string[];
};

export const catalogCategories: CatalogCategory[] = [
  {
    slug: "fertilizers",
    name: { en: "Fertilizers", ar: "الأسمدة" },
    eyebrow: { en: "Crop nutrition", ar: "تغذية المحاصيل" },
    description: {
      en: "Agricultural nutrient inputs presented through AgroCapital's official catalogue. Composition, packaging, and use information are shown only when supplied by the company.",
      ar: "مدخلات غذائية زراعية ضمن الكتالوج الرسمي لأجرو كابيتال. تُعرض بيانات التركيب والعبوات والاستخدام فقط عند اعتمادها من الشركة."
    },
    image: "/generated/catalog/fertilizers.webp",
    alt: { en: "Fertilizer granules beside a young greenhouse crop", ar: "حبيبات سماد بجوار نبات صغير داخل صوبة زراعية" },
    matchTerms: ["fertilizer", "fertiliser"]
  },
  {
    slug: "micronutrients",
    name: { en: "Micronutrients", ar: "العناصر الصغرى" },
    eyebrow: { en: "Targeted nutrition", ar: "تغذية متخصصة" },
    description: {
      en: "Micronutrient product lines for professional plant-nutrition programmes, with exact ingredients and technical directions reserved for approved product pages.",
      ar: "خطوط منتجات العناصر الصغرى لبرامج تغذية النبات المتخصصة، مع عرض المكونات الدقيقة والإرشادات الفنية في صفحات المنتجات المعتمدة."
    },
    image: "/generated/catalog/micronutrients.webp",
    alt: { en: "Mineral granules and healthy greenhouse leaves", ar: "حبيبات معدنية وأوراق نبات صحية داخل صوبة" },
    matchTerms: ["micronutrient", "micro nutrient", "trace element"]
  },
  {
    slug: "npk-fertilizers",
    name: { en: "NPK Fertilizers", ar: "أسمدة NPK" },
    eyebrow: { en: "Core nutrition", ar: "التغذية الأساسية" },
    description: {
      en: "NPK fertilizer options for inclusion in professional crop programmes. Official grades, rates, and pack sizes appear only with supplied product documentation.",
      ar: "خيارات أسمدة NPK ضمن برامج المحاصيل المتخصصة. لا تُعرض الدرجات ومعدلات الاستخدام وأحجام العبوات إلا وفق مستندات المنتج الرسمية."
    },
    image: "/generated/catalog/npk-fertilizers.webp",
    alt: { en: "Mixed fertilizer granules beside young field crops", ar: "حبيبات سماد مختلطة بجوار نباتات حقلية صغيرة" },
    matchTerms: ["npk"]
  },
  {
    slug: "humic-fulvic",
    name: { en: "Humic and Fulvic Products", ar: "منتجات الهيوميك والفولفيك" },
    eyebrow: { en: "Root-zone inputs", ar: "مدخلات منطقة الجذور" },
    description: {
      en: "Humic and fulvic product categories for soil and root-zone programmes. Each commercial product retains its official composition and application information.",
      ar: "فئات منتجات الهيوميك والفولفيك لبرامج التربة ومنطقة الجذور. يحتفظ كل منتج تجاري بتركيبه وبيانات استخدامه الرسمية."
    },
    image: "/generated/catalog/humic-fulvic.webp",
    alt: { en: "Humic material beside a visible healthy root zone", ar: "مادة هيوميكية بجوار منطقة جذور صحية ظاهرة" },
    matchTerms: ["humic", "fulvic"]
  },
  {
    slug: "soil-conditioners",
    name: { en: "Soil Conditioners", ar: "محسنات التربة" },
    eyebrow: { en: "Soil health", ar: "صحة التربة" },
    description: {
      en: "Soil-conditioning categories selected for professional agricultural programmes. Product-specific properties and recommendations are published only from approved data.",
      ar: "فئات محسنات التربة المختارة للبرامج الزراعية المتخصصة. تُنشر خصائص كل منتج وتوصياته فقط من البيانات المعتمدة."
    },
    image: "/generated/catalog/soil-conditioners.webp",
    alt: { en: "Hands examining rich structured agricultural soil", ar: "يدان تفحصان تربة زراعية غنية ومتجانسة" },
    matchTerms: ["soil conditioner", "soil enhancer", "soil improvement"]
  },
  {
    slug: "growth-regulators",
    name: { en: "Plant Growth Regulators", ar: "منظمات نمو النبات" },
    eyebrow: { en: "Crop development", ar: "تطور المحصول" },
    description: {
      en: "Plant growth regulator categories for managed crop programmes. Application timing, crops, and rates remain specific to each officially documented product.",
      ar: "فئات منظمات نمو النبات للبرامج المنظمة للمحاصيل. يظل توقيت الاستخدام والمحاصيل والمعدلات خاصاً بكل منتج موثق رسمياً."
    },
    image: "/generated/catalog/growth-regulators.webp",
    alt: { en: "Agricultural specialist measuring greenhouse crop growth", ar: "متخصص زراعي يقيس نمو النباتات داخل صوبة" },
    matchTerms: ["growth regulator", "pgr"]
  },
  {
    slug: "biostimulants",
    name: { en: "Biostimulants", ar: "المنشطات الحيوية" },
    eyebrow: { en: "Plant support", ar: "دعم النبات" },
    description: {
      en: "Biostimulant product categories for professional plant-support programmes, presented without replacing the official directions supplied for each commercial product.",
      ar: "فئات المنشطات الحيوية لبرامج دعم النبات المتخصصة، مع الالتزام بالإرشادات الرسمية الموردة لكل منتج تجاري."
    },
    image: "/generated/catalog/biostimulants.webp",
    alt: { en: "Healthy young plant with a visible root system", ar: "نبات صغير صحي مع مجموع جذري ظاهر" },
    matchTerms: ["biostimulant", "bio stimulant"]
  },
  {
    slug: "crop-protection",
    name: { en: "Crop Protection Solutions", ar: "حلول حماية المحاصيل" },
    eyebrow: { en: "Crop care", ar: "رعاية المحاصيل" },
    description: {
      en: "Crop-protection categories represented in the official AgroCapital catalogue. Active ingredients, registrations, safety details, and rates are never generalized across products.",
      ar: "فئات حماية المحاصيل الواردة في كتالوج أجرو كابيتال الرسمي. لا يتم تعميم المواد الفعالة أو التسجيلات أو بيانات السلامة أو المعدلات بين المنتجات."
    },
    image: "/generated/catalog/crop-protection.webp",
    alt: { en: "Agricultural engineer inspecting a crop leaf", ar: "مهندس زراعي يفحص ورقة نبات" },
    matchTerms: ["crop protection", "fungicide", "insecticide", "herbicide", "pesticide"]
  }
];

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

export function getCatalogCategory(slug: string) {
  return catalogCategories.find((category) => category.slug === slug);
}

export function getCategoryProducts(products: Product[], category: CatalogCategory) {
  return products.filter((product) => {
    const categoryName = normalize(product.category.en);
    return category.matchTerms.some((term) => categoryName.includes(normalize(term)));
  });
}

export function getCategoryForProduct(product: Product) {
  const categoryName = normalize(product.category.en);
  return catalogCategories.find((category) => category.matchTerms.some((term) => categoryName.includes(normalize(term))));
}
