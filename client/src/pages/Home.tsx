import { useEffect, useMemo, useState } from "react";
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, Heart, MapPin, Menu, PackageCheck, Search, ShoppingBag, Store, Truck, X } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import { useSupabaseStorefront } from "@/data/supabaseStorefront";
import type { CatalogProduct } from "@/data/catalog";
import { useCart } from "@/contexts/CartContext";
import CartDrawer from "@/components/CartDrawer";

type HeroSlide = { eyebrow: string; title: string; image: string; cta: string; href: string; tone: "light" | "dark" };

type Brand = { name: string; slug: string; image?: string; logo?: string; tone: string };

type Category = { title: string; slug: string; caption: string; className: string };

const CAMPAIGN_VIDEO_SRC = "https://batalebanon.com/cdn/shop/videos/c/vp/70a13a908ee141a3a256dc6b69568197/70a13a908ee141a3a256dc6b69568197.HD-1080p-7.2Mbps-79536968.mp4?v=0";

const categories: Category[] = [
  { title: "Women", slug: "women", caption: "Built for every plan.", className: "collection-card--women" },
  { title: "Men", slug: "men", caption: "Go further in comfort.", className: "collection-card--men" },
  { title: "Kids", slug: "kids", caption: "Play starts here.", className: "collection-card--kids" },
];

function BrandMark({ logo, inverse = false }: { logo?: string; inverse?: boolean }) {
  return <Link className={`brand-mark ${inverse ? "brand-mark--inverse" : ""}`} href="/" aria-label="Bata Botswana home">{logo ? <img src={logo} alt="Bata" /> : <span>Bata</span>}</Link>;
}

function ProductCard({ product, onSave, saved }: { product: CatalogProduct; onSave: (id: number) => void; saved: boolean }) {
  const { addItem } = useCart();
  return <article className="home-product-card">
    <div className="home-product-card__media">
      {product.tag && <span className="home-product-card__tag">{product.tag}</span>}
      <button className={`home-product-card__save ${saved ? "is-saved" : ""}`} aria-label={`Save ${product.name}`} onClick={() => onSave(product.id)}><Heart size={17} fill={saved ? "currentColor" : "none"} /></button>
      <Link href={`/products/${product.id}`} aria-label={`View ${product.name}`}><img src={product.image} alt={product.name} loading="lazy" decoding="async" /></Link>
      <button className="home-product-card__add" aria-label={`Add ${product.name} to bag`} onClick={() => addItem(product)}><ShoppingBag size={17} /></button>
    </div>
    <div className="home-product-card__meta"><span>{product.brand}</span><Link href={`/products/${product.id}`}>{product.name}</Link><strong>P {product.price}</strong></div>
  </article>;
}

export default function Home() {
  const { products, content, isLoading, isError } = useSupabaseStorefront();
  const { count, openCart } = useCart();
  const [activeHero, setActiveHero] = useState(0);
  const [saved, setSaved] = useState<number[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [newsletterOpen, setNewsletterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const asset = (key: keyof NonNullable<typeof content>, fallback = "") => content?.[key] ?? fallback;
  const whatsappCatalogUrl = String(import.meta.env.NEXT_PUBLIC_WHATSAPP_CATALOG_URL ?? "https://wa.me/c/26775303767");
  const lineBreak = { whiteSpace: "pre-line" as const };
  const heroSlides = useMemo<HeroSlide[]>(() => [
    { eyebrow: "Women", title: "Explore heels", image: asset("hero_image"), cta: "Shop women", href: "/collections/women", tone: "light" as const },
    { eyebrow: "Summer edit", title: "Explore beach", image: asset("newsletter_image") || asset("women_image"), cta: "Shop women", href: "/collections/women", tone: "light" as const },
    { eyebrow: "Limited edit", title: "Sale 50%", image: asset("sale_image") || asset("campaign_image"), cta: "Shop sale", href: "/catalog", tone: "dark" as const },
  ].filter((slide) => slide.image), [content]);
  const brands: Brand[] = [
    { name: "Safari", slug: "safari", image: asset("safari_image"), logo: asset("safari_logo"), tone: "Easy days." },
    { name: "North Star", slug: "north-star", image: asset("north_star_image"), logo: asset("north_star_logo"), tone: "Everyday energy." },
    { name: "Power", slug: "power", image: asset("power_image"), logo: asset("power_logo"), tone: "Keep moving." },
    { name: "Toughees", slug: "toughees", image: "/brand-assets/toughees-shoe.jpeg", logo: "/brand-assets/toughees-logo.png", tone: "Ready for school." },
  ];
  const newArrivals = products.slice(0, 4);
  const currentHero = heroSlides[activeHero] ?? heroSlides[0];
  const filteredSuggestions = searchTerm.trim() ? products.filter((product) => `${product.name} ${product.brand}`.toLowerCase().includes(searchTerm.toLowerCase())).slice(0, 5) : [];

  const featureNotice = (label: string) => {
    toast(`${label} is coming soon`, {
      description: "This prototype is ready for the next storefront integration step.",
    });
  };

  useEffect(() => {
    if (heroSlides.length < 2) return;
    const timer = window.setInterval(() => setActiveHero((slide) => (slide + 1) % heroSlides.length), 5500);
    return () => window.clearInterval(timer);
  }, [heroSlides.length]);

  useEffect(() => {
    if (window.sessionStorage.getItem("bata-bw-offer-dismissed") === "1") return;
    const timer = window.setTimeout(() => setNewsletterOpen(true), 7000);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen || searchOpen || newsletterOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen, newsletterOpen, searchOpen]);

  const dismissNewsletter = () => { window.sessionStorage.setItem("bata-bw-offer-dismissed", "1"); setNewsletterOpen(false); };
  const toggleSave = (id: number) => { setSaved((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]); toast(saved.includes(id) ? "Removed" : "Saved"); };

  return <div className="home-page" id="top">
    <div className="announcement-bar"><span>Free delivery over P 800</span><span className="announcement-bar__dot" /><span>Find your step</span></div>
    <header className="site-header site-header--minimal">
      <div className="site-header__top">
        <button className="header-icon header-icon--mobile" onClick={() => setMenuOpen(true)} aria-label="Open menu"><Menu size={20} /></button>
        <nav className="main-nav" aria-label="Primary navigation"><Link href="/collections/women">Women</Link><Link href="/collections/men">Men</Link><Link href="/collections/kids">Kids</Link><Link className="main-nav__sale" href="/catalog">Sale</Link><Link href="#brands">Brands</Link><Link href="/stores">Stores</Link></nav>
        <BrandMark logo={asset("logo_url")} />
        <div className="header-actions"><button className="header-icon" onClick={() => setSearchOpen(true)} aria-label="Search"><Search size={19} /></button><button className="header-icon header-cart" onClick={openCart} aria-label="Open shopping bag"><ShoppingBag size={19} /><span className="header-cart__count">{count}</span></button></div>
      </div>
    </header>

    <main>
      <section className={`hero-slideshow hero-slideshow--${currentHero?.tone ?? "light"}`} aria-label="Bata Botswana campaigns">
        {heroSlides.map((slide, index) => <img key={slide.title} className={`hero-slideshow__image ${index === activeHero ? "is-active" : ""}`} src={slide.image} alt={slide.title} aria-hidden={index !== activeHero} />)}
        <div className="hero-slideshow__shade" />
        <div className="hero-slideshow__frame" aria-hidden="true"><span>{String(activeHero + 1).padStart(2, "0")}</span><span>Botswana in motion</span></div>
        {currentHero && <div key={`${currentHero.title}-${activeHero}`} className="hero-slideshow__copy"><span className="hero-slideshow__tag"><b>New</b> Season 2026 · Botswana</span><span className="hero-slideshow__eyebrow">{currentHero.eyebrow}</span><h1>{currentHero.title}</h1><Link href={currentHero.href} className="hero-slideshow__cta">{currentHero.cta}<ArrowRight size={17} /></Link></div>}
        <div className="hero-slideshow__season">AUTUMN<br />2026</div>
        <a href="#collections" className="hero-slideshow__scroll"><span /> Scroll to explore</a>
        <div className="hero-slideshow__controls"><span>{String(activeHero + 1).padStart(2, "0")} / {String(heroSlides.length).padStart(2, "0")}</span><div><button onClick={() => setActiveHero((activeHero - 1 + heroSlides.length) % heroSlides.length)} aria-label="Previous slide"><ChevronLeft size={18} /></button><button onClick={() => setActiveHero((activeHero + 1) % heroSlides.length)} aria-label="Next slide"><ChevronRight size={18} /></button></div></div>
        <div className="hero-slideshow__dots">{heroSlides.map((slide, index) => <button key={slide.title} onClick={() => setActiveHero(index)} className={index === activeHero ? "is-active" : ""} aria-label={`Go to ${slide.title}`} />)}</div>
      </section>

      <section id="collections" className="collections-section">
        <span className="section-number">01 / Collections</span>
        <div className="section-heading section-heading--split">
          <div>
            <p className="eyebrow">For every stride</p>
            <h2 style={lineBreak}>{asset("collections_heading", "The collection\nstarts here.")}</h2>
          </div>
          <p className="section-heading__intro">{asset("collections_copy", "Every step tells a different story. Find an easy favourite for yours.")}</p>
        </div>
        <div className="collection-grid">
          {categories.map((category) => (
            <Link className={`collection-card ${category.className}`} href={`/collections/${category.slug}`} key={category.title}>
              {asset(`${category.slug}_image`) && <img src={asset(`${category.slug}_image`)} alt={`${category.title}'s footwear collection`} loading="lazy" decoding="async" />}
              <div className="collection-card__shade" />
              <div className="collection-card__content">
                <p>{asset(`${category.slug}_caption`, category.caption)}</p>
                <h3>{category.title}</h3>
                <span>Explore collection <ArrowRight size={16} /></span>
              </div>
            </Link>
          ))}
          <button className="collection-card collection-card--shoecare" onClick={() => featureNotice("Shoe care")}>
            <span className="collection-card--shoecare__line" />
            <span className="collection-card--shoecare__line" />
            <p>Make every pair last.</p>
            <h3>Shoe<br />Care</h3>
            <span>Care essentials <ArrowRight size={16} /></span>
          </button>
        </div>
      </section>

      <section id="new-arrivals" className="arrivals-section" aria-label="New arrivals">
        <div className="arrivals-heading"><h2>New arrivals</h2><Link href="/catalog">Shop all <ArrowRight size={16} /></Link></div>
        {isLoading && <div className="home-loading">Loading shoes</div>}
        {isError && <div className="home-loading">Catalogue unavailable</div>}
        <div className="arrivals-grid">{!isLoading && newArrivals.map((product) => <ProductCard key={product.id} product={product} onSave={toggleSave} saved={saved.includes(product.id)} />)}</div>
      </section>

      <section className="campaign-video" aria-label="Featured shoe campaign">
        <video className="campaign-video__media" autoPlay muted loop playsInline preload="metadata" poster={asset("campaign_image") || asset("power_image")}>
          <source src={CAMPAIGN_VIDEO_SRC} type="video/mp4" />
        </video>
        <div className="campaign-video__shade" />
        <div className="campaign-video__copy"><span>Bata / In motion</span><h2>Move in comfort.</h2><Link href="/catalog" className="hero-slideshow__cta">Explore shoes <ArrowRight size={17} /></Link></div>
      </section>

      <section id="brands" className="brands-screen" aria-label="Brands">
        {brands.map((brand) => <Link key={brand.slug} href={`/collections/${brand.slug}`} className="brand-screen-card"><img src={brand.image} alt={`${brand.name} footwear`} loading="lazy" /><div className="brand-screen-card__wash" />{brand.logo ? <img className="brand-screen-card__logo" src={brand.logo} alt={brand.name} /> : <strong>{brand.name}</strong>}<ArrowUpRight className="brand-screen-card__arrow" size={22} /></Link>)}
      </section>

      <section className="service-strip">
        <button onClick={() => featureNotice("Delivery information")}><Truck size={22} /><span><strong>Delivery across Botswana</strong><small>Free on orders over P 800</small></span><ArrowRight size={17} /></button>
        <Link href="/stores" className="service-strip__link"><Store size={22} /><span><strong>Shop close to you</strong><small>Find a Bata store</small></span><ArrowRight size={17} /></Link>
        {whatsappCatalogUrl && <a href={whatsappCatalogUrl} target="_blank" rel="noreferrer" className="service-strip__link"><ShoppingBag size={22} /><span><strong>Browse on WhatsApp</strong><small>Open the Bata catalog</small></span><ArrowRight size={17} /></a>}
        <button onClick={() => featureNotice("Returns and exchanges")}><PackageCheck size={22} /><span><strong>Easy returns</strong><small>Simple 30-day returns</small></span><ArrowRight size={17} /></button>
      </section>

      <section className="newsletter-section">
        <div>
          <p className="eyebrow">A step ahead</p>
          <h2 style={lineBreak}>{asset("newsletter_heading", "The pair you want,\nbefore it goes.")}</h2>
        </div>
        <form onSubmit={(event) => { event.preventDefault(); toast.success("You're on the list", { description: "We'll share new drops and local offers first." }); }}>
          <label htmlFor="newsletter">Email address</label>
          <div className="newsletter-input"><input id="newsletter" type="email" placeholder="you@email.com" required /><button type="submit">Join us <ArrowRight size={18} /></button></div>
          <small>By signing up, you agree to hear from Bata Botswana. You can unsubscribe at any time.</small>
        </form>
      </section>
    </main>

    <footer className="site-footer">
      <div className="site-footer__brand">
        <BrandMark inverse logo={asset("logo_url")} />
        <p>{asset("footer_tagline", "Comfort, quality and every reason to keep moving.")}</p>
        <Link className="footer-locator" href="/stores"><MapPin size={17} /> Find your nearest store</Link>
      </div>
      <div className="site-footer__links">
        <div><h3>Shop</h3><Link href="/collections/women">Women</Link><Link href="/collections/men">Men</Link><Link href="/collections/kids">Kids</Link><Link href="/catalog">Sale</Link></div>
        <div><h3>Customer care</h3><button onClick={() => featureNotice("Contact us")}>Contact us</button><button onClick={() => featureNotice("Delivery information")}>Delivery & returns</button><button onClick={() => featureNotice("Size guide")}>Size guide</button><button onClick={() => featureNotice("Frequently asked questions")}>FAQ</button></div>
        <div><h3>Bata Botswana</h3><Link href="#brands">Our brands</Link><button onClick={() => featureNotice("Careers")}>Careers</button><button onClick={() => featureNotice("Privacy information")}>Privacy</button><button onClick={() => featureNotice("Terms and conditions")}>Terms & conditions</button></div>
      </div>
      <div className="site-footer__bottom"><span>© 2026 Bata Botswana. All rights reserved.</span><span>Follow @batabotswana</span><span>Visa · Mastercard · Orange Money</span></div>
    </footer>

    {menuOpen && <div className="mobile-menu mobile-menu--minimal" role="dialog" aria-modal="true" aria-label="Mobile navigation"><div className="mobile-menu__top"><BrandMark logo={asset("logo_url")} /><button className="header-icon" onClick={() => setMenuOpen(false)} aria-label="Close menu"><X size={22} /></button></div><nav><Link onClick={() => setMenuOpen(false)} href="/collections/women">Women</Link><Link onClick={() => setMenuOpen(false)} href="/collections/men">Men</Link><Link onClick={() => setMenuOpen(false)} href="/collections/kids">Kids</Link><Link onClick={() => setMenuOpen(false)} href="#brands">Brands</Link><Link onClick={() => setMenuOpen(false)} href="/stores">Stores</Link></nav></div>}

    {searchOpen && <div className="search-dialog search-dialog--minimal" role="dialog" aria-modal="true" aria-label="Search Bata Botswana"><div className="search-dialog__bar"><Search size={21} /><input autoFocus value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search shoes" /><button onClick={() => { setSearchOpen(false); setSearchTerm(""); }} aria-label="Close search"><X size={22} /></button></div><div className="search-dialog__results">{filteredSuggestions.map((product) => <Link key={product.id} href={`/products/${product.id}`} onClick={() => setSearchOpen(false)}><img src={product.image} alt="" /><span>{product.name}<small>{product.brand} · P {product.price}</small></span><ArrowRight size={16} /></Link>)}{searchTerm && !filteredSuggestions.length && <p>No shoes found.</p>}</div></div>}

    <CartDrawer />

    {newsletterOpen && <div className="newsletter-popup__scrim" role="presentation" onClick={dismissNewsletter}><div className="newsletter-popup newsletter-popup--refined" role="dialog" aria-modal="true" aria-labelledby="newsletter-popup-title" onClick={(event) => event.stopPropagation()}><button className="newsletter-popup__close" onClick={dismissNewsletter} aria-label="Close offer"><X size={18} /></button><div className="newsletter-popup__art">{asset("newsletter_image") && <img src={asset("newsletter_image")} alt="" />}<span>10%</span></div><div className="newsletter-popup__content"><span className="newsletter-popup__eyebrow">Bata Botswana</span><h2 id="newsletter-popup-title">Your next pair<br /><em>starts here.</em></h2><p>Join for 10% off.</p><form onSubmit={(event) => { event.preventDefault(); dismissNewsletter(); toast.success("You're on the list"); }}><label htmlFor="popup-email">Email</label><div><input id="popup-email" type="email" placeholder="you@email.com" required /><button type="submit" aria-label="Join"><ArrowRight size={17} /></button></div></form><button className="newsletter-popup__dismiss" onClick={dismissNewsletter}>Not now</button></div></div></div>}
  </div>;
}
