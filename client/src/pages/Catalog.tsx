/**
 * Botswana in Motion catalogue: filter-first browsing with composed, campaign-grade product presentation.
 */
import { useMemo, useState } from "react";
import { ArrowRight, Check, ChevronDown, Filter, Heart, Search, ShoppingBag, SlidersHorizontal, X } from "lucide-react";
import { Link } from "wouter";
import type { CatalogProduct, ProductCategory } from "@/data/catalog";
import { useSupabaseStorefront } from "@/data/supabaseStorefront";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import CartDrawer from "@/components/CartDrawer";

type SortOption = "featured" | "low" | "high" | "name";

const priceBands = [
  { label: "Under P 500", min: 0, max: 499 },
  { label: "P 500 – P 799", min: 500, max: 799 },
  { label: "P 800 and over", min: 800, max: 9999 },
];

export default function Catalog() {
  const { products: storefrontProducts, content: storefrontMaterial, isLoading, isError } = useSupabaseStorefront();
  const { count, openCart } = useCart();
  const [category, setCategory] = useState<ProductCategory | "All">("All");
  const [sizes, setSizes] = useState<number[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [bands, setBands] = useState<string[]>([]);
  const [sort, setSort] = useState<SortOption>("featured");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [saved, setSaved] = useState<number[]>([]);

  const availableColors = useMemo(() => Array.from(new Set(storefrontProducts.flatMap((product) => product.colors.map((color) => color.name)))), [storefrontProducts]);
  const availableSizes = useMemo(() => Array.from(new Set(storefrontProducts.flatMap((product) => product.sizes))).sort((a, b) => a - b), [storefrontProducts]);
  const filtered = useMemo(() => {
    const result = storefrontProducts.filter((product) => {
      const categoryMatch = category === "All" || product.category === category;
      const sizeMatch = sizes.length === 0 || sizes.some((size) => product.sizes.includes(size));
      const colorMatch = colors.length === 0 || colors.some((color) => product.colors.some((productColor) => productColor.name === color));
      const priceMatch = bands.length === 0 || bands.some((label) => { const band = priceBands.find((item) => item.label === label)!; return product.price >= band.min && product.price <= band.max; });
      return categoryMatch && sizeMatch && colorMatch && priceMatch;
    });
    return [...result].sort((a, b) => sort === "low" ? a.price - b.price : sort === "high" ? b.price - a.price : sort === "name" ? a.name.localeCompare(b.name) : a.id - b.id);
  }, [storefrontProducts, category, sizes, colors, bands, sort]);

  const toggleValue = <T,>(value: T, items: T[], setItems: (items: T[]) => void) => setItems(items.includes(value) ? items.filter((item) => item !== value) : [...items, value]);
  const clearFilters = () => { setCategory("All"); setSizes([]); setColors([]); setBands([]); setSort("featured"); };
  const activeCount = sizes.length + colors.length + bands.length + (category !== "All" ? 1 : 0);

  return <div className="catalog-page">
    <header className="catalog-header"><Link href="/" className="catalog-wordmark"><span>←</span> Bata Botswana</Link><Link href="/" className="product-logo">{storefrontMaterial?.logo_url ? <img src={storefrontMaterial.logo_url} alt="Bata" /> : <span>Bata</span>}</Link><div className="catalog-header__actions"><Link href="/stores">Find a store <ArrowRight size={16} /></Link><button className="catalog-header__cart" onClick={openCart} aria-label="Open shopping bag"><ShoppingBag size={18} /><span>{count}</span></button></div></header>
    <main>
      <section className="catalog-hero"><div className="catalog-hero__index">SHOP ALL</div><h1>All<br /><em>shoes.</em></h1><div className="catalog-hero__proof"><strong>{isLoading ? "—" : storefrontProducts.length}</strong><span>styles</span></div></section>
      <section className="catalog-toolbar" aria-label="Catalogue controls">
        <div className="catalog-categories"><button className={category === "All" ? "is-active" : ""} onClick={() => setCategory("All")}>All styles</button>{(["Women", "Men", "Kids", "Industrial"] as ProductCategory[]).map((item) => <button className={category === item ? "is-active" : ""} key={item} onClick={() => setCategory(item)}>{item}</button>)}</div>
        <div className="catalog-actions"><button onClick={() => setFiltersOpen(true)}><Filter size={16} /> Filters {activeCount > 0 && <b>{activeCount}</b>}</button><label>Sort <select value={sort} onChange={(event) => setSort(event.target.value as SortOption)}><option value="featured">Featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option><option value="name">Name: A to Z</option></select><ChevronDown size={15} /></label></div>
      </section>
      <section className="catalog-content"><aside className="catalog-filters"><FilterPanel title="Filter styles" category={category} setCategory={setCategory} sizes={sizes} setSizes={setSizes} colors={colors} setColors={setColors} bands={bands} setBands={setBands} availableColors={availableColors} availableSizes={availableSizes} toggleValue={toggleValue} onClear={clearFilters} /></aside><div className="catalog-results"><div className="catalog-results__meta"><span>{isLoading ? "Loading styles…" : isError ? "The live catalogue could not be loaded" : `${filtered.length} ${filtered.length === 1 ? "style" : "styles"} found`}</span>{activeCount > 0 && <button onClick={clearFilters}>Clear filters <X size={14} /></button>}</div><ProductGrid products={filtered} saved={saved} setSaved={setSaved} /></div></section>
    </main>
    {filtersOpen && <div className="filter-drawer" role="dialog" aria-modal="true" aria-label="Product filters"><div className="filter-drawer__header"><h2>Filter styles</h2><button onClick={() => setFiltersOpen(false)}><X /></button></div><FilterPanel title="" category={category} setCategory={setCategory} sizes={sizes} setSizes={setSizes} colors={colors} setColors={setColors} bands={bands} setBands={setBands} availableColors={availableColors} availableSizes={availableSizes} toggleValue={toggleValue} onClear={clearFilters} /><button className="button button--red filter-drawer__apply" onClick={() => setFiltersOpen(false)}>Show {filtered.length} styles <ArrowRight size={17} /></button></div>}
    <CartDrawer />
  </div>;
}

function FilterPanel({ title, category, setCategory, sizes, setSizes, colors, setColors, bands, setBands, availableColors, availableSizes, toggleValue, onClear }: { title: string; category: ProductCategory | "All"; setCategory: (value: ProductCategory | "All") => void; sizes: number[]; setSizes: (value: number[]) => void; colors: string[]; setColors: (value: string[]) => void; bands: string[]; setBands: (value: string[]) => void; availableColors: string[]; availableSizes: number[]; toggleValue: <T,>(value: T, items: T[], setItems: (items: T[]) => void) => void; onClear: () => void; }) {
  return <div className="filter-panel">{title && <div className="filter-panel__title"><h2>{title}</h2><button onClick={onClear}>Reset</button></div>}<fieldset><legend>Category</legend>{(["All", "Women", "Men", "Kids", "Industrial"] as const).map((item) => <label className="filter-check" key={item}><input type="checkbox" checked={category === item} onChange={() => setCategory(item)} /><span>{category === item && <Check size={12} />}</span>{item}</label>)}</fieldset><fieldset><legend>Size</legend><div className="size-filter">{availableSizes.map((size) => <button className={sizes.includes(size) ? "is-selected" : ""} key={size} onClick={() => toggleValue(size, sizes, setSizes)}>{size}</button>)}</div></fieldset><fieldset><legend>Colour</legend><div className="colour-filter">{availableColors.map((color) => <button className={colors.includes(color) ? "is-selected" : ""} key={color} onClick={() => toggleValue(color, colors, setColors)}><span style={{ background: "#555" }} />{color}</button>)}</div></fieldset><fieldset><legend>Price</legend>{priceBands.map((band) => <label className="filter-check" key={band.label}><input type="checkbox" checked={bands.includes(band.label)} onChange={() => toggleValue(band.label, bands, setBands)} /><span>{bands.includes(band.label) && <Check size={12} />}</span>{band.label}</label>)}</fieldset></div>;
}

function ProductGrid({ products, saved, setSaved }: { products: CatalogProduct[]; saved: number[]; setSaved: (ids: number[]) => void; }) {
  const { addItem } = useCart();
  const toggleSaved = (id: number) => { const wasSaved = saved.includes(id); setSaved(wasSaved ? saved.filter((item) => item !== id) : [...saved, id]); toast(wasSaved ? "Removed from favourites" : "Saved to favourites"); };
  if (!products.length) return <div className="no-results"><SlidersHorizontal size={27} /><h2>No styles match those filters.</h2><p>Try removing a size, colour or price filter to broaden your selection.</p></div>;
  return <div className="catalog-grid">{products.map((product) => <article className="catalog-card" key={product.id}><div className="catalog-card__visual">{product.tag && <span>{product.tag}</span>}<button className={saved.includes(product.id) ? "is-saved" : ""} onClick={() => toggleSaved(product.id)} aria-label={`Save ${product.name}`}><Heart size={18} fill={saved.includes(product.id) ? "currentColor" : "none"} /></button><Link href={`/products/${product.id}`} className="catalog-card__image-link"><img src={product.image} alt={product.name} /></Link><button className="catalog-card__quick-add" onClick={() => addItem(product)} aria-label={`Add ${product.name} to bag`}><ShoppingBag size={16} /></button></div><div className="catalog-card__info"><p>{product.brand}</p><div><Link href={`/products/${product.id}`}>{product.name}</Link><strong>P {product.price}</strong></div><span>{product.colors.map((color) => color.name).join(" · ")}</span></div></article>)}</div>;
}
