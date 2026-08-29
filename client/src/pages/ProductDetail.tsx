/**
 * Botswana in Motion product detail: gallery-led selection with transparent, non-fabricated review states.
 */
import { useEffect, useState } from "react";
import { ArrowLeft, Check, ChevronDown, Heart, Minus, Plus, Search, ShoppingBag, Star, X, ZoomIn } from "lucide-react";
import { Link, useRoute } from "wouter";
import { useSupabaseStorefront } from "@/data/supabaseStorefront";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import CartDrawer from "@/components/CartDrawer";

export default function ProductDetail() {
  const [, params] = useRoute("/products/:id");
  const { addItem, openCart, count } = useCart();
  const productId = Number(params?.id);
  const { products, content: storefrontMaterial, isLoading } = useSupabaseStorefront();
  const product = products.find((item) => item.id === productId);
  const [imageIndex, setImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState(product?.colors[0]?.name ?? "");
  const [isFavorite, setIsFavorite] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [zoomPosition, setZoomPosition] = useState("50% 50%");
  useEffect(() => {
    setImageIndex(0);
    setSelectedSize(null);
    setSelectedColor(product?.colors[0]?.name ?? "");
  }, [productId, product?.id]);
  if (isLoading && !product) return <div className="not-found-product"><span className="loader" aria-label="Loading product" /></div>;
  if (!product) return <div className="not-found-product"><h1>That style has moved on.</h1><Link href="/catalog" className="button button--red">Back to shop</Link></div>;
  const image = product.gallery[imageIndex];
  const onZoomMove = (event: React.MouseEvent<HTMLDivElement>) => { const bounds = event.currentTarget.getBoundingClientRect(); setZoomPosition(`${((event.clientX - bounds.left) / bounds.width) * 100}% ${((event.clientY - bounds.top) / bounds.height) * 100}%`); };
  const addToBag = () => { if (!selectedSize) { toast.error("Select a size first", { description: "Choose a size before adding this style." }); return; } addItem(product, selectedSize); toast.success(`${product.name} added`, { description: `Size ${selectedSize} · ${selectedColor}` }); };
    return <><div className="product-page"><header className="product-header"><Link href="/catalog"><ArrowLeft size={18} /> Continue shopping</Link><Link href="/" className="product-logo">{storefrontMaterial?.logo_url ? <img src={storefrontMaterial.logo_url} alt="Bata" /> : <span>Bata</span>}</Link><div><button onClick={() => toast("Search is ready to connect to your live catalogue") }><Search size={18} /></button><button className="product-header__cart" onClick={openCart} aria-label="Open shopping bag"><ShoppingBag size={19} /><span>{count}</span></button></div></header>
<main><nav className="breadcrumbs"><Link href="/">Home</Link><span>/</span><Link href="/catalog">Shop</Link><span>/</span><Link href={`/catalog?category=${product.category}`}>{product.category}</Link><span>/</span><b>{product.name}</b></nav><section className="product-layout"><div className="product-gallery"><div className="gallery-thumbnails">{product.gallery.map((galleryImage, index) => <button key={`${galleryImage}-${index}`} className={imageIndex === index ? "is-active" : ""} onClick={() => setImageIndex(index)}><img src={galleryImage} alt={`${product.name} ${product.galleryLabels?.[index] ?? `view ${index + 1}`}`} loading={index === 0 ? "eager" : "lazy"} decoding="async" /><span>{product.galleryLabels?.[index] ?? (["Side", "Top", "Sole"][index] ?? `View ${index + 1}`)}</span></button>)}</div><div className="product-hero-image" onMouseMove={onZoomMove} onClick={() => setZoomOpen(true)}><img key={image} src={image} alt={`${product.name}, ${product.galleryLabels?.[imageIndex] ?? `view ${imageIndex + 1}`}`} fetchPriority="high" decoding="async" /><div className="product-zoom" style={{ backgroundImage: `url(${image})`, backgroundPosition: zoomPosition }} /><span className="product-zoom__hint"><ZoomIn size={17} /> Hover to zoom</span><span className="product-hero-image__count">0{imageIndex + 1} / 0{product.gallery.length}</span></div><div className="gallery-mobile-label">{product.galleryLabels?.[imageIndex] ?? (["Side view", "Top view", "Sole view"][imageIndex] ?? "Product view")}</div></div><div className="product-information"><div className="product-information__status"><span>New</span><span>#{String(product.id).padStart(4,"0")}</span></div><p className="eyebrow">{product.brand}</p><div className="product-title-row"><h1>{product.name}</h1><button className={isFavorite ? "is-saved" : ""} onClick={() => { setIsFavorite(!isFavorite); toast(isFavorite ? "Removed from favourites" : "Saved to favourites"); }} aria-label="Save this style"><Heart size={20} fill={isFavorite ? "currentColor" : "none"} /></button></div><strong className="product-price">P {product.price}</strong><p className="product-description">{product.description}</p><div className="product-colours"><p>Colour: <strong>{selectedColor}</strong></p><div>{product.colors.map((color) => <button title={color.name} key={color.name} aria-label={`Choose ${color.name}`} className={selectedColor === color.name ? "is-selected" : ""} style={{ background: color.hex }} onClick={() => setSelectedColor(color.name)} />)}</div></div><div className="product-sizes"><div><p>Size</p><button onClick={() => toast("Bata’s size guide will be available with the live catalogue")}>Size guide <ArrowLeft size={13} /></button></div><div>{product.sizes.map((size) => <button className={selectedSize === size ? "is-selected" : ""} key={size} onClick={() => setSelectedSize(size)}>{size}</button>)}</div></div><button className="button button--red product-add" onClick={addToBag}>Add to bag <ShoppingBag size={18} /></button><div className="product-service-points"><span><Check size={15} /> Free over P 800</span><span><Check size={15} /> 30-day returns</span></div><details><summary>Product details <ChevronDown size={16} /></summary><ul>{product.details.map((detail) => <li key={detail}>{detail}</li>)}</ul></details><details><summary>Delivery & returns <ChevronDown size={16} /></summary><p>Delivery details shown at checkout.</p></details></div></section><section className="review-section"><div><p className="eyebrow">Community feedback</p><h2>Customer reviews</h2><p className="review-section__empty">No reviews yet.</p></div><div className="review-card"><div className="review-card__stars"><Star size={17} /><Star size={17} /><Star size={17} /><Star size={17} /><Star size={17} /></div><h3>Worn this pair?</h3><p>Share your fit.</p><button className="button button--outline" onClick={() => toast("Review collection can be enabled after purchase verification is connected.")}>Write a review <Plus size={16} /></button><small>Only authentic customer reviews should be published here.</small></div></section></main>{zoomOpen && <div className="zoom-modal" role="dialog" aria-modal="true" aria-label="Zoomed product image"><button onClick={() => setZoomOpen(false)} aria-label="Close image zoom"><X size={24} /></button><img src={image} alt={`${product.name} enlarged`} /><p>Click outside or use close to return to the product.</p></div>}</div><CartDrawer /></>;
  }

