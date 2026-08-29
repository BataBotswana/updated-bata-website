import { useMemo, useState } from "react";
import { ArrowRight, ArrowUpRight, ChevronDown, Filter, Heart, ShoppingBag, X } from "lucide-react";
import { Link, useRoute } from "wouter";
import { useSupabaseStorefront } from "@/data/supabaseStorefront";
import { useCart } from "@/contexts/CartContext";
import CartDrawer from "@/components/CartDrawer";
import type { CatalogProduct } from "@/data/catalog";

type LandingSort = "featured" | "low" | "high";

const collectionInfo: Record<string, { label: string; imageKey: "women_image" | "men_image" | "kids_image" | "safari_image" | "north_star_image" | "power_image" | "toughees_image"; category?: "Women" | "Men" | "Kids"; brand?: string; fallbackCategory?: "Women" | "Men" | "Kids"; note: string }> = {
  women: { label: "Women", imageKey: "women_image", category: "Women", note: "Heels, flats, sandals." },
  men: { label: "Men", imageKey: "men_image", category: "Men", note: "Everyday, formal, active." },
  kids: { label: "Kids", imageKey: "kids_image", category: "Kids", note: "Ready for play." },
  safari: { label: "Safari", imageKey: "safari_image", brand: "Safari", fallbackCategory: "Men", note: "Easy days." },
  "north-star": { label: "North Star", imageKey: "north_star_image", brand: "North Star", fallbackCategory: "Men", note: "Everyday energy." },
  power: { label: "Power", imageKey: "power_image", brand: "Power", fallbackCategory: "Men", note: "Keep moving." },
  toughees: { label: "Toughees", imageKey: "toughees_image", brand: "Toughees", fallbackCategory: "Kids", note: "Ready for school." },
};

function LandingHeader({ logo, count, onCart }: { logo?: string; count: number; onCart: () => void }) {
  return <header className="landing-header"><Link href="/" className="landing-header__back">Bata Botswana</Link><Link href="/" className="landing-header__logo">{logo ? <img src={logo} alt="Bata" /> : "Bata"}</Link><button className="landing-header__cart" onClick={onCart} aria-label="Open shopping bag"><ShoppingBag size={19} /><span>{count}</span></button></header>;
}

function LandingProduct({ product, saved, onSave }: { product: CatalogProduct; saved: boolean; onSave: (id: number) => void }) {
  const { addItem } = useCart();
  return <article className="landing-product"><div className="landing-product__image"><button onClick={() => onSave(product.id)} className={saved ? "is-saved" : ""} aria-label={`Save ${product.name}`}><Heart size={17} fill={saved ? "currentColor" : "none"} /></button><Link href={`/products/${product.id}`}><img src={product.image} alt={product.name} loading="lazy" /></Link><button className="landing-product__add" onClick={() => addItem(product)} aria-label={`Add ${product.name} to bag`}><ShoppingBag size={16} /></button></div><div className="landing-product__meta"><span>{product.brand}</span><Link href={`/products/${product.id}`}>{product.name}</Link><b>P {product.price}</b></div></article>;
}

export default function CollectionLanding() {
  const [, routeParams] = useRoute("/collections/:slug");
  const { products, content, isLoading } = useSupabaseStorefront();
  const { count, openCart } = useCart();
  const slug = routeParams?.slug?.toLowerCase() ?? "women";
  const info = collectionInfo[slug] ?? collectionInfo.women;
  const [saved, setSaved] = useState<number[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<"All" | "Women" | "Men" | "Kids">("All");
  const [sizeFilter, setSizeFilter] = useState("All");
  const [sort, setSort] = useState<LandingSort>("featured");
  const asset = (key: keyof NonNullable<typeof content>) => content?.[key] ?? "";
  const collectionProducts = useMemo(() => {
    if (!info.brand) return products.filter((product) => product.category === info.category);
    const brand = info.brand;
    const exact = products.filter((product) => product.brand.toLowerCase().includes(brand.toLowerCase()));
    return exact.length ? exact : products.filter((product) => product.category === info.fallbackCategory);
  }, [info, products]);
  const heroImage = slug === "toughees" ? "/brand-assets/toughees-shoe.jpeg" : asset(info.imageKey);
  const availableSizes = useMemo(() => Array.from(new Set(collectionProducts.flatMap((product) => product.sizes))).sort((a, b) => a - b), [collectionProducts]);
  const filteredProducts = useMemo(() => {
    const next = collectionProducts.filter((product) => (categoryFilter === "All" || product.category === categoryFilter) && (sizeFilter === "All" || product.sizes.includes(Number(sizeFilter))));
    return [...next].sort((a, b) => sort === "low" ? a.price - b.price : sort === "high" ? b.price - a.price : a.id - b.id);
  }, [categoryFilter, collectionProducts, sizeFilter, sort]);

  return <div className="landing-page"><LandingHeader logo={asset("logo_url")} count={count} onCart={openCart} /><section className="landing-hero"><img src={heroImage} alt={`${info.label} collection`} /><div className="landing-hero__wash" /><div><span>Collection</span><h1>{info.label}</h1><p>{info.note}</p></div><Link href="/catalog" className="landing-hero__all">View all <ArrowUpRight size={18} /></Link></section><section className="landing-results"><div className="landing-results__top"><span>{isLoading ? "—" : filteredProducts.length} styles</span><Link href="/catalog">All shoes <ArrowRight size={16} /></Link></div><div className="landing-filters" aria-label="Collection filters"><div className="landing-filter-tabs"><Filter size={15} /><button className={categoryFilter === "All" ? "is-active" : ""} onClick={() => setCategoryFilter("All")}>All</button><button className={categoryFilter === "Women" ? "is-active" : ""} onClick={() => setCategoryFilter("Women")}>Women</button><button className={categoryFilter === "Men" ? "is-active" : ""} onClick={() => setCategoryFilter("Men")}>Men</button><button className={categoryFilter === "Kids" ? "is-active" : ""} onClick={() => setCategoryFilter("Kids")}>Kids</button></div><label>Size <select value={sizeFilter} onChange={(event) => setSizeFilter(event.target.value)}><option value="All">All</option>{availableSizes.map((size) => <option key={size} value={size}>{size}</option>)}</select><ChevronDown size={14} /></label><label>Sort <select value={sort} onChange={(event) => setSort(event.target.value as LandingSort)}><option value="featured">Featured</option><option value="low">Price: low</option><option value="high">Price: high</option></select><ChevronDown size={14} /></label></div>{isLoading ? <div className="home-loading">Loading shoes</div> : filteredProducts.length ? <div className="landing-grid">{filteredProducts.map((product) => <LandingProduct key={product.id} product={product} saved={saved.includes(product.id)} onSave={(id) => setSaved((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])} />)}</div> : <div className="home-loading">No styles found</div>}</section><nav className="landing-next"><Link href="/collections/women">Women</Link><Link href="/collections/men">Men</Link><Link href="/collections/kids">Kids</Link><Link href="/collections/safari">Safari</Link><Link href="/collections/north-star">North Star</Link><Link href="/collections/power">Power</Link><Link href="/collections/toughees">Toughees</Link></nav><CartDrawer /></div>;
}
