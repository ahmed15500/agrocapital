"use client";

import { upload } from "@vercel/blob/client";
import {
  CheckCircle2, ChevronLeft, Clock3, Copy, ExternalLink, FileText, ImageIcon,
  Images, LayoutDashboard, LogOut, Newspaper, Package, Plus, Save, Search,
  Trash2, UploadCloud
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import type { CmsData, Localized, MediaAsset, Post, Product } from "@/lib/types";

type AdminTab = "overview" | "products" | "posts" | "media";
type CmsResponse = CmsData & { storageConfigured: boolean };

const emptyLocalized = (): Localized => ({ en: "", ar: "" });
const today = () => new Date().toISOString().slice(0, 10);

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function newProduct(): Product {
  const id = `product-${Date.now()}`;
  return {
    id, slug: id, name: emptyLocalized(), category: emptyLocalized(), image: "",
    composition: emptyLocalized(), packageSize: emptyLocalized(), shortBenefit: emptyLocalized(),
    overview: emptyLocalized(), benefits: [], recommendedCrops: [], applicationMethod: emptyLocalized(),
    usageRate: emptyLocalized(), safetyInfo: emptyLocalized(), registrationInfo: emptyLocalized(),
    technicalSheet: "", featured: false, status: "draft"
  };
}

function newPost(): Post {
  const id = `news-${Date.now()}`;
  return {
    id, slug: id, title: emptyLocalized(), excerpt: emptyLocalized(), body: emptyLocalized(),
    category: { en: "Company news", ar: "أخبار الشركة" }, image: "", publishedAt: today(),
    featured: false, status: "draft"
  };
}

function LocalizedField({ label, value, onChange, multiline = false, required = false }: {
  label: string; value: Localized; onChange: (value: Localized) => void; multiline?: boolean; required?: boolean;
}) {
  const Control = multiline ? "textarea" : "input";
  return (
    <fieldset className="admin-localized-field">
      <legend>{label}</legend>
      <label><span>العربية</span><Control dir="rtl" value={value.ar} required={required} onChange={(event) => onChange({ ...value, ar: event.target.value })} /></label>
      <label><span>English</span><Control dir="ltr" value={value.en} required={required} onChange={(event) => onChange({ ...value, en: event.target.value })} /></label>
    </fieldset>
  );
}

function UploadButton({ label, accept, kind, onUploaded }: {
  label: string; accept: string; kind: string; onUploaded: (url: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file?: File) {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-");
      const blob = await upload(`media/${kind}/${Date.now()}-${safeName}`, file, {
        access: "public", handleUploadUrl: "/api/admin/upload", multipart: file.size > 4 * 1024 * 1024
      });
      onUploaded(blob.url);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "تعذر رفع الملف");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="admin-upload-control">
      <label className="admin-upload-button"><UploadCloud size={17} /> {busy ? "جاري الرفع…" : label}<input type="file" accept={accept} disabled={busy} onChange={(event) => void handleFile(event.target.files?.[0])} /></label>
      {error ? <small className="admin-field-error">{error}</small> : null}
    </div>
  );
}

function StatusBadge({ status }: { status: "draft" | "published" }) {
  return status === "published"
    ? <span className="admin-status published"><CheckCircle2 size={14} /> منشور</span>
    : <span className="admin-status draft"><Clock3 size={14} /> مسودة</span>;
}

function localizedLines(items: Localized[], locale: keyof Localized) {
  return items.map((item) => item[locale]).join("\n");
}

function mergeLocalizedLines(current: Localized[], locale: keyof Localized, value: string) {
  const lines = value.split("\n").map((line) => line.trim()).filter(Boolean);
  const count = Math.max(lines.length, current.length);
  return Array.from({ length: count }, (_, index) => ({
    en: locale === "en" ? (lines[index] || "") : (current[index]?.en || ""),
    ar: locale === "ar" ? (lines[index] || "") : (current[index]?.ar || "")
  })).filter((item) => item.en || item.ar);
}

function ProductEditor({ product, updateProduct, back, remove }: {
  product: Product; updateProduct: (patch: Partial<Product>) => void; back: () => void; remove: () => void;
}) {
  return (
    <div className="admin-page admin-editor-page">
      <div className="admin-editor-heading">
        <button className="admin-back" onClick={back}>→ رجوع للمنتجات</button>
        <div><div><span>تحرير منتج</span><h1>{product.name.ar || product.name.en || "منتج جديد"}</h1></div><div className="admin-editor-actions"><StatusBadge status={product.status} />{product.status === "published" ? <a href={`/ar/products/${product.slug}`} target="_blank" rel="noreferrer"><ExternalLink size={16} /> معاينة</a> : null}<button className="danger" onClick={remove}><Trash2 size={16} /> حذف</button></div></div>
      </div>
      <div className="admin-editor-grid">
        <div className="admin-editor-main">
          <section className="admin-form-card">
            <h2>المعلومات الأساسية</h2>
            <LocalizedField label="اسم المنتج" value={product.name} required onChange={(name) => updateProduct({ name, slug: product.slug.startsWith("product-") && name.en ? slugify(name.en) || product.slug : product.slug })} />
            <LocalizedField label="الفئة" value={product.category} required onChange={(category) => updateProduct({ category })} />
            <LocalizedField label="وصف مختصر" value={product.shortBenefit} multiline onChange={(shortBenefit) => updateProduct({ shortBenefit })} />
            <LocalizedField label="نبذة كاملة" value={product.overview} multiline onChange={(overview) => updateProduct({ overview })} />
          </section>
          <section className="admin-form-card">
            <h2>المواصفات الفنية</h2>
            <LocalizedField label="التركيب" value={product.composition} multiline onChange={(composition) => updateProduct({ composition })} />
            <LocalizedField label="حجم العبوة" value={product.packageSize} onChange={(packageSize) => updateProduct({ packageSize })} />
            <LocalizedField label="طريقة الاستخدام" value={product.applicationMethod} multiline onChange={(applicationMethod) => updateProduct({ applicationMethod })} />
            <LocalizedField label="معدل الاستخدام" value={product.usageRate} multiline onChange={(usageRate) => updateProduct({ usageRate })} />
            <LocalizedField label="بيانات التسجيل" value={product.registrationInfo} multiline onChange={(registrationInfo) => updateProduct({ registrationInfo })} />
            <LocalizedField label="معلومات السلامة" value={product.safetyInfo} multiline onChange={(safetyInfo) => updateProduct({ safetyInfo })} />
          </section>
          <section className="admin-form-card">
            <h2>الفوائد والمحاصيل</h2><p className="admin-form-hint">اكتب كل فائدة أو محصول في سطر مستقل، بنفس الترتيب في اللغتين.</p>
            <div className="admin-dual-textareas">
              <label><span>الفوائد — العربية</span><textarea dir="rtl" value={localizedLines(product.benefits, "ar")} onChange={(event) => updateProduct({ benefits: mergeLocalizedLines(product.benefits, "ar", event.target.value) })} /></label>
              <label><span>Benefits — English</span><textarea dir="ltr" value={localizedLines(product.benefits, "en")} onChange={(event) => updateProduct({ benefits: mergeLocalizedLines(product.benefits, "en", event.target.value) })} /></label>
              <label><span>المحاصيل — العربية</span><textarea dir="rtl" value={localizedLines(product.recommendedCrops, "ar")} onChange={(event) => updateProduct({ recommendedCrops: mergeLocalizedLines(product.recommendedCrops, "ar", event.target.value) })} /></label>
              <label><span>Crops — English</span><textarea dir="ltr" value={localizedLines(product.recommendedCrops, "en")} onChange={(event) => updateProduct({ recommendedCrops: mergeLocalizedLines(product.recommendedCrops, "en", event.target.value) })} /></label>
            </div>
          </section>
        </div>
        <aside className="admin-editor-side">
          <section className="admin-form-card"><h2>النشر</h2><label className="admin-select-label"><span>الحالة</span><select value={product.status} onChange={(event) => updateProduct({ status: event.target.value as Product["status"] })}><option value="draft">مسودة — غير ظاهر</option><option value="published">منشور على الموقع</option></select></label><label className="admin-check"><input type="checkbox" checked={product.featured} onChange={(event) => updateProduct({ featured: event.target.checked })} /><span><strong>منتج مميز</strong><small>يظهر في الأقسام البارزة</small></span></label><label className="admin-text-label"><span>رابط الصفحة (Slug)</span><input dir="ltr" value={product.slug} onChange={(event) => updateProduct({ slug: slugify(event.target.value) })} /></label></section>
          <section className="admin-form-card"><h2>صورة المنتج</h2><div className="admin-image-preview"><img src={product.image || "/uploads/plant-nutrition.png"} alt="معاينة صورة المنتج" /></div><label className="admin-text-label"><span>رابط الصورة</span><input dir="ltr" value={product.image} onChange={(event) => updateProduct({ image: event.target.value })} /></label><UploadButton label="رفع صورة جديدة" accept="image/jpeg,image/png,image/webp,image/avif" kind="products" onUploaded={(image) => updateProduct({ image })} /></section>
          <section className="admin-form-card"><h2>النشرة الفنية</h2>{product.technicalSheet ? <a className="admin-file-preview" href={product.technicalSheet} target="_blank" rel="noreferrer"><FileText size={22} /><span>فتح الملف الحالي</span><ExternalLink size={15} /></a> : null}<label className="admin-text-label"><span>رابط النشرة</span><input dir="ltr" value={product.technicalSheet} onChange={(event) => updateProduct({ technicalSheet: event.target.value })} /></label><UploadButton label="رفع نشرة PDF أو صورة" accept="application/pdf,image/jpeg,image/png,image/webp" kind="sheets" onUploaded={(technicalSheet) => updateProduct({ technicalSheet })} /></section>
        </aside>
      </div>
    </div>
  );
}

function PostEditor({ post, updatePost, back, remove }: {
  post: Post; updatePost: (patch: Partial<Post>) => void; back: () => void; remove: () => void;
}) {
  return (
    <div className="admin-page admin-editor-page">
      <div className="admin-editor-heading"><button className="admin-back" onClick={back}>→ رجوع للأخبار</button><div><div><span>تحرير خبر</span><h1>{post.title.ar || post.title.en || "خبر جديد"}</h1></div><div className="admin-editor-actions"><StatusBadge status={post.status} />{post.status === "published" ? <a href={`/ar/news/${post.slug}`} target="_blank" rel="noreferrer"><ExternalLink size={16} /> معاينة</a> : null}<button className="danger" onClick={remove}><Trash2 size={16} /> حذف</button></div></div></div>
      <div className="admin-editor-grid">
        <div className="admin-editor-main"><section className="admin-form-card"><h2>محتوى الخبر</h2><LocalizedField label="العنوان" value={post.title} required onChange={(title) => updatePost({ title, slug: post.slug.startsWith("news-") && title.en ? slugify(title.en) || post.slug : post.slug })} /><LocalizedField label="التصنيف" value={post.category} onChange={(category) => updatePost({ category })} /><LocalizedField label="الملخص" value={post.excerpt} multiline required onChange={(excerpt) => updatePost({ excerpt })} /><LocalizedField label="نص الخبر" value={post.body} multiline required onChange={(body) => updatePost({ body })} /></section></div>
        <aside className="admin-editor-side"><section className="admin-form-card"><h2>النشر</h2><label className="admin-select-label"><span>الحالة</span><select value={post.status} onChange={(event) => updatePost({ status: event.target.value as Post["status"] })}><option value="draft">مسودة — غير ظاهر</option><option value="published">منشور على الموقع</option></select></label><label className="admin-text-label"><span>تاريخ النشر</span><input type="date" value={post.publishedAt} onChange={(event) => updatePost({ publishedAt: event.target.value })} /></label><label className="admin-text-label"><span>رابط الصفحة (Slug)</span><input dir="ltr" value={post.slug} onChange={(event) => updatePost({ slug: slugify(event.target.value) })} /></label><label className="admin-check"><input type="checkbox" checked={post.featured} onChange={(event) => updatePost({ featured: event.target.checked })} /><span><strong>خبر مميز</strong><small>جاهز للأقسام البارزة مستقبلًا</small></span></label></section><section className="admin-form-card"><h2>صورة الخبر</h2><div className="admin-image-preview landscape"><img src={post.image || "/uploads/crop-inspection.png"} alt="معاينة صورة الخبر" /></div><label className="admin-text-label"><span>رابط الصورة</span><input dir="ltr" value={post.image} onChange={(event) => updatePost({ image: event.target.value })} /></label><UploadButton label="رفع صورة الخبر" accept="image/jpeg,image/png,image/webp,image/avif" kind="news" onUploaded={(image) => updatePost({ image })} /></section></aside>
      </div>
    </div>
  );
}

export function AdminDashboard() {
  const [data, setData] = useState<CmsData | null>(null);
  const [storageConfigured, setStorageConfigured] = useState(false);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("agrocapital916.eg@gmail.com");
  const [loginError, setLoginError] = useState("");
  const [loginSent, setLoginSent] = useState(false);
  const [loginBusy, setLoginBusy] = useState(false);
  const [tab, setTab] = useState<AdminTab>("overview");
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [notice, setNotice] = useState("");
  const [media, setMedia] = useState<MediaAsset[]>([]);

  async function loadContent() {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/content", { cache: "no-store" });
      if (response.status === 401) { setData(null); return; }
      if (!response.ok) throw new Error("تعذر تحميل المحتوى");
      const payload = await response.json() as CmsResponse;
      setData({ site: payload.site, products: payload.products, posts: payload.posts });
      setStorageConfigured(payload.storageConfigured);
      setDirty(false);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "تعذر تحميل المحتوى");
    } finally { setLoading(false); }
  }

  useEffect(() => { void loadContent(); }, []);
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => { if (dirty) event.preventDefault(); };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const product = data?.products.find((item) => item.id === selectedProduct) || null;
  const post = data?.posts.find((item) => item.id === selectedPost) || null;
  const filteredProducts = useMemo(() => {
    if (!data) return [];
    const term = search.trim().toLowerCase();
    return term ? data.products.filter((item) => `${item.name.ar} ${item.name.en} ${item.category.ar} ${item.category.en}`.toLowerCase().includes(term)) : data.products;
  }, [data, search]);
  const filteredPosts = useMemo(() => {
    if (!data) return [];
    const term = search.trim().toLowerCase();
    return term ? data.posts.filter((item) => `${item.title.ar} ${item.title.en} ${item.category.ar} ${item.category.en}`.toLowerCase().includes(term)) : data.posts;
  }, [data, search]);

  async function login(event: FormEvent) {
    event.preventDefault(); setLoginError(""); setLoginBusy(true);
    const response = await fetch("/api/admin/login", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email }) });
    if (!response.ok) {
      const result = await response.json().catch(() => ({})) as { error?: string };
      setLoginError(response.status === 429 ? "انتظر دقيقة قبل طلب رابط جديد." : result.error === "Email delivery is not configured" ? "خدمة إرسال البريد غير مفعلة بعد." : "تعذر إرسال رابط الدخول. حاول مرة أخرى.");
      setLoginBusy(false);
      return;
    }
    setLoginSent(true);
    setLoginBusy(false);
  }

  async function logout() { await fetch("/api/admin/logout", { method: "POST" }); setData(null); setTab("overview"); }
  function changeData(updater: (current: CmsData) => CmsData) { setData((current) => current ? updater(current) : current); setDirty(true); setNotice(""); }
  function updateProduct(patch: Partial<Product>) { if (product) changeData((current) => ({ ...current, products: current.products.map((item) => item.id === product.id ? { ...item, ...patch } : item) })); }
  function updatePost(patch: Partial<Post>) { if (post) changeData((current) => ({ ...current, posts: current.posts.map((item) => item.id === post.id ? { ...item, ...patch } : item) })); }

  async function save(nextData = data) {
    if (!nextData) return false;
    setSaving(true); setNotice("");
    try {
      const response = await fetch("/api/admin/content", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify(nextData) });
      const result = await response.json().catch(() => ({})) as { error?: string };
      if (!response.ok) throw new Error(result.error || "تعذر حفظ التغييرات");
      setDirty(false); setNotice("تم حفظ التغييرات بنجاح."); return true;
    } catch (error) { setNotice(error instanceof Error ? error.message : "تعذر حفظ التغييرات"); return false; }
    finally { setSaving(false); }
  }

  function addProduct() { const item = newProduct(); changeData((current) => ({ ...current, products: [item, ...current.products] })); setSelectedProduct(item.id); setTab("products"); }
  function addPost() { const item = newPost(); changeData((current) => ({ ...current, posts: [item, ...current.posts] })); setSelectedPost(item.id); setTab("posts"); }
  async function deleteProduct() { if (!data || !product || !window.confirm(`حذف المنتج «${product.name.ar || product.name.en || "بدون اسم"}» نهائيًا؟`)) return; const next = { ...data, products: data.products.filter((item) => item.id !== product.id) }; setData(next); setSelectedProduct(null); setDirty(true); await save(next); }
  async function deletePost() { if (!data || !post || !window.confirm(`حذف الخبر «${post.title.ar || post.title.en || "بدون عنوان"}» نهائيًا؟`)) return; const next = { ...data, posts: data.posts.filter((item) => item.id !== post.id) }; setData(next); setSelectedPost(null); setDirty(true); await save(next); }
  async function loadMedia() { const response = await fetch("/api/admin/media", { cache: "no-store" }); if (!response.ok) return; const result = await response.json() as { assets: MediaAsset[] }; setMedia(result.assets || []); }
  useEffect(() => { if (data && tab === "media") void loadMedia(); }, [data, tab]);

  if (loading) return <main className="admin-login" dir="rtl"><div className="admin-loading"><span /><p>جاري تحميل لوحة الإدارة…</p></div></main>;
  if (!data) return (
    <main className="admin-login" dir="rtl"><section className="admin-login-card"><img src="/uploads/agrocapital-logo-2026.webp" alt="AgroCapital" /><span className="admin-kicker">لوحة إدارة المحتوى</span><h1>مرحبًا بعودتك</h1><p>أدخل بريد الأدمن وسنرسل رابط دخول آمن إلى Gmail، بدون كلمة مرور.</p>{loginSent ? <div className="admin-login-sent"><CheckCircle2 size={27} /><strong>راجع بريدك الآن</strong><p>تم إرسال رابط دخول صالح لمدة 10 دقائق إلى Gmail. افتحه من نفس الجهاز أو أي جهاز موثوق.</p><button type="button" onClick={() => setLoginSent(false)}>إرسال رابط آخر</button></div> : <form onSubmit={login}><label><span>البريد الإلكتروني</span><input type="email" dir="ltr" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>{loginError ? <div className="admin-alert error">{loginError}</div> : null}<button className="admin-primary-button" type="submit" disabled={loginBusy}>{loginBusy ? "جاري الإرسال…" : "إرسال رابط الدخول"} <ChevronLeft size={18} /></button></form>}<small>الرابط ينتهي بعد 10 دقائق، والجلسة بعد 8 ساعات.</small></section></main>
  );

  const publishedProducts = data.products.filter((item) => item.status === "published").length;
  const publishedPosts = data.posts.filter((item) => item.status === "published").length;

  return (
    <main className="admin-app" dir="rtl">
      <aside className="admin-sidebar">
        <div className="admin-brand"><img src="/uploads/agrocapital-logo-2026.webp" alt="AgroCapital" /><div><strong>AgroCapital</strong><span>إدارة المحتوى</span></div></div>
        <nav aria-label="أقسام لوحة الإدارة"><button className={tab === "overview" ? "active" : ""} onClick={() => setTab("overview")}><LayoutDashboard size={19} /> نظرة عامة</button><button className={tab === "products" ? "active" : ""} onClick={() => { setTab("products"); setSelectedProduct(null); }}><Package size={19} /> المنتجات <b>{data.products.length}</b></button><button className={tab === "posts" ? "active" : ""} onClick={() => { setTab("posts"); setSelectedPost(null); }}><Newspaper size={19} /> الأخبار <b>{data.posts.length}</b></button><button className={tab === "media" ? "active" : ""} onClick={() => setTab("media")}><Images size={19} /> مكتبة الصور</button></nav>
        <div className="admin-sidebar-footer"><a href="/ar" target="_blank" rel="noreferrer"><ExternalLink size={17} /> عرض الموقع</a><button onClick={() => void logout()}><LogOut size={17} /> تسجيل الخروج</button></div>
      </aside>
      <section className="admin-workspace">
        <header className="admin-topbar"><div><span className={`admin-storage-dot ${storageConfigured ? "connected" : ""}`} />{storageConfigured ? "التخزين الدائم متصل" : "وضع التجربة المحلي"}</div><button className="admin-save-button" onClick={() => void save()} disabled={!dirty || saving}><Save size={17} /> {saving ? "جاري الحفظ…" : dirty ? "حفظ التغييرات" : "تم الحفظ"}</button></header>
        {notice ? <div className={`admin-global-notice ${notice.includes("بنجاح") ? "success" : "error"}`}>{notice}</div> : null}
        {!storageConfigured ? <div className="admin-storage-warning"><Clock3 size={19} /><div><strong>التخزين الدائم غير متصل بعد</strong><span>الواجهة جاهزة للتجربة، لكن النشر الفعلي ورفع الصور يحتاجان ربط Vercel Blob.</span></div></div> : null}

        {tab === "overview" ? <div className="admin-page"><div className="admin-page-heading"><div><span>لوحة التحكم</span><h1>صباح الخير 👋</h1><p>كل ما تحتاجه لتحديث موقع أجرو كابيتال من مكان واحد.</p></div></div><div className="admin-stat-grid"><article><div className="green"><Package size={22} /></div><span>المنتجات المنشورة</span><strong>{publishedProducts}</strong><small>{data.products.length - publishedProducts} مسودة</small></article><article><div className="blue"><Newspaper size={22} /></div><span>الأخبار المنشورة</span><strong>{publishedPosts}</strong><small>{data.posts.length - publishedPosts} مسودة</small></article><article><div className="gold"><Images size={22} /></div><span>الصور المرفوعة</span><strong>{media.length || "—"}</strong><small>في مكتبة الوسائط</small></article></div><section className="admin-quick-actions"><div className="admin-section-title"><div><span>اختصارات</span><h2>ماذا تريد أن تنشر؟</h2></div></div><div className="admin-action-grid"><button onClick={addProduct}><span><Package size={24} /></span><div><strong>إضافة منتج جديد</strong><small>البيانات الفنية، العبوة والصور</small></div><ChevronLeft size={20} /></button><button onClick={addPost}><span><Newspaper size={24} /></span><div><strong>كتابة خبر جديد</strong><small>خبر أو مقال بالعربية والإنجليزية</small></div><ChevronLeft size={20} /></button><button onClick={() => setTab("media")}><span><ImageIcon size={24} /></span><div><strong>رفع صور وملفات</strong><small>صور المنتجات والنشرات الفنية</small></div><ChevronLeft size={20} /></button></div></section><section className="admin-recent-section"><div className="admin-section-title"><div><span>آخر المحتوى</span><h2>المنتجات الحالية</h2></div><button onClick={() => setTab("products")}>عرض الكل</button></div><div className="admin-compact-list">{data.products.slice(0, 5).map((item) => <button key={item.id} onClick={() => { setSelectedProduct(item.id); setTab("products"); }}><img src={item.image || "/uploads/plant-nutrition.png"} alt="" /><div><strong>{item.name.ar || item.name.en || "منتج بدون اسم"}</strong><span>{item.category.ar || "بدون فئة"}</span></div><StatusBadge status={item.status} /><ChevronLeft size={18} /></button>)}</div></section></div> : null}

        {tab === "products" ? product ? <ProductEditor product={product} updateProduct={updateProduct} back={() => setSelectedProduct(null)} remove={() => void deleteProduct()} /> : <div className="admin-page"><div className="admin-page-heading with-action"><div><span>إدارة المحتوى</span><h1>المنتجات</h1><p>أضف المنتجات وعدّل مواصفاتها وصورها وحالة نشرها.</p></div><button className="admin-primary-button" onClick={addProduct}><Plus size={18} /> إضافة منتج</button></div><div className="admin-list-toolbar"><label><Search size={18} /><input placeholder="ابحث بالاسم أو الفئة…" value={search} onChange={(event) => setSearch(event.target.value)} /></label><span>{filteredProducts.length} منتج</span></div><div className="admin-content-list">{filteredProducts.map((item) => <button key={item.id} onClick={() => setSelectedProduct(item.id)}><img src={item.image || "/uploads/plant-nutrition.png"} alt="" /><div className="admin-list-copy"><strong>{item.name.ar || item.name.en || "منتج بدون اسم"}</strong><span>{item.category.ar || item.category.en || "بدون فئة"}</span></div><StatusBadge status={item.status} /><span className="admin-list-date">{item.packageSize.ar}</span><ChevronLeft size={19} /></button>)}</div></div> : null}

        {tab === "posts" ? post ? <PostEditor post={post} updatePost={updatePost} back={() => setSelectedPost(null)} remove={() => void deletePost()} /> : <div className="admin-page"><div className="admin-page-heading with-action"><div><span>إدارة المحتوى</span><h1>الأخبار والمقالات</h1><p>اكتب الخبر باللغتين واحفظه كمسودة لحين المراجعة.</p></div><button className="admin-primary-button" onClick={addPost}><Plus size={18} /> إضافة خبر</button></div><div className="admin-list-toolbar"><label><Search size={18} /><input placeholder="ابحث في الأخبار…" value={search} onChange={(event) => setSearch(event.target.value)} /></label><span>{filteredPosts.length} خبر</span></div>{filteredPosts.length ? <div className="admin-content-list posts">{filteredPosts.map((item) => <button key={item.id} onClick={() => setSelectedPost(item.id)}><img src={item.image || "/uploads/crop-inspection.png"} alt="" /><div className="admin-list-copy"><strong>{item.title.ar || item.title.en || "خبر بدون عنوان"}</strong><span>{item.category.ar || item.category.en}</span></div><StatusBadge status={item.status} /><span className="admin-list-date">{item.publishedAt}</span><ChevronLeft size={19} /></button>)}</div> : <div className="admin-empty"><Newspaper size={34} /><h2>لا توجد أخبار بعد</h2><p>ابدأ بإنشاء أول خبر واحفظه كمسودة للمراجعة.</p><button className="admin-primary-button" onClick={addPost}><Plus size={18} /> إنشاء أول خبر</button></div>}</div> : null}

        {tab === "media" ? <div className="admin-page"><div className="admin-page-heading"><div><span>إدارة الملفات</span><h1>مكتبة الصور والملفات</h1><p>ارفع صور المنتجات والأخبار والنشرات الفنية، ثم انسخ الرابط لأي محتوى.</p></div></div><section className="admin-media-upload-card"><UploadCloud size={30} /><div><strong>رفع ملف جديد</strong><span>صور JPG, PNG, WebP, AVIF أو PDF — بحد أقصى 20 ميجابايت</span></div><UploadButton label="اختيار ملف" accept="image/jpeg,image/png,image/webp,image/avif,application/pdf" kind="library" onUploaded={() => void loadMedia()} /></section>{media.length ? <div className="admin-media-grid">{media.map((asset) => { const isImage = asset.contentType.startsWith("image/"); return <article key={asset.url}><div className="admin-media-thumb">{isImage ? <img src={asset.url} alt="" /> : <FileText size={38} />}</div><div><strong title={asset.pathname}>{asset.pathname.split("/").pop()}</strong><span>{new Date(asset.uploadedAt).toLocaleDateString("ar-EG")} · {(asset.size / 1024 / 1024).toFixed(1)} MB</span><button onClick={() => { void navigator.clipboard.writeText(asset.url); setNotice("تم نسخ رابط الملف بنجاح."); }}><Copy size={15} /> نسخ الرابط</button></div></article>; })}</div> : <div className="admin-empty"><Images size={34} /><h2>المكتبة فارغة</h2><p>ارفع أول صورة لتظهر هنا وتستخدمها في المنتجات أو الأخبار.</p></div>}</div> : null}
      </section>
    </main>
  );
}
