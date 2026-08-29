/**
 * Botswana in Motion checkout: a clear four-part contact, delivery, shipping, and payment progression.
 */
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft, ArrowRight, Check, ChevronDown, CreditCard, LockKeyhole, MapPin, PackageCheck, ShoppingBag, Truck, X } from "lucide-react";
import { useSupabaseStorefront } from "@/data/supabaseStorefront";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import CartDrawer from "@/components/CartDrawer";

type CheckoutStep = "Contact" | "Delivery" | "Shipping" | "Payment";
type DeliveryMethod = "store" | "home";

const steps: CheckoutStep[] = ["Contact", "Delivery", "Shipping", "Payment"];
const collectionStores = ["Bata Railpark", "Game City", "Airport Junction", "BBS", "Palapye", "Francistown", "Maun"];

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { products, content: storefrontMaterial, isLoading } = useSupabaseStorefront();
  const { items, count, total: cartSubtotal, openCart } = useCart();
  const productId = Number(new URLSearchParams(window.location.search).get("product"));
  const product = products.find((item) => item.id === productId) ?? items[0]?.product ?? products[0];
  const checkoutItems = items.length ? items : product ? [{ product, quantity: 1 }] : [];
  const [activeStep, setActiveStep] = useState<CheckoutStep>("Contact");
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("store");
  const [store, setStore] = useState(collectionStores[0]);
  const [shipping, setShipping] = useState("standard");
  const [payment, setPayment] = useState("card");

  if (isLoading) return <div className="not-found-product"><span className="loader" aria-label="Loading checkout" /></div>;
  if (!product) return <div className="not-found-product"><h1>We could not find that style.</h1><Link href="/catalog" className="button button--red">Back to shop</Link></div>;
  const stepIndex = steps.indexOf(activeStep);
  const shippingCost = deliveryMethod === "store" || shipping === "standard" ? 0 : 120;
  const subtotal = items.length ? cartSubtotal : product.price;
  const total = subtotal + shippingCost;

  const moveForward = () => {
    if (stepIndex < steps.length - 1) {
      setActiveStep(steps[stepIndex + 1]);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    toast("Payment connection is ready for your live commerce setup", { description: "Your order details are saved in this checkout preview." });
  };

  return <><div className="checkout-page">
    <header className="checkout-header">
      <Link href="/catalog" className="checkout-back"><ArrowLeft size={18} /> Continue shopping</Link>
      <Link href="/" className="checkout-logo">{storefrontMaterial?.logo_url ? <img src={storefrontMaterial.logo_url} alt="Bata" /> : <span>Bata</span>}</Link>
      <button className="checkout-security checkout-security--button" onClick={openCart}><ShoppingBag size={15} /> Bag {count}</button>
    </header>

    <main className="checkout-main">
      <section className="checkout-intro"><p className="eyebrow">Bata Botswana</p><h1>Almost<br /><em>there.</em></h1><p>Complete your order.</p></section>
      <div className="checkout-layout">
        <section className="checkout-flow" aria-label="Checkout steps">
          <div className="checkout-steps" role="tablist" aria-label="Checkout progress">
            {steps.map((step, index) => <button key={step} onClick={() => setActiveStep(step)} role="tab" aria-selected={activeStep === step} className={`${activeStep === step ? "is-active" : ""} ${index < stepIndex ? "is-complete" : ""}`}><span>{index < stepIndex ? <Check size={13} /> : `0${index + 1}`}</span>{step}</button>)}
          </div>

          <div className="checkout-card">
            {activeStep === "Contact" && <section className="checkout-section"><div className="checkout-section__head"><span>01</span><div><h2>Contact</h2><p>Where should we send your order updates?</p></div></div><div className="checkout-fields checkout-fields--two"><label>Email address<input type="email" placeholder="you@email.com" autoComplete="email" /></label><label>Mobile number<input type="tel" placeholder="+267 71 000 000" autoComplete="tel" /></label><label>First name<input type="text" placeholder="First name" autoComplete="given-name" /></label><label>Last name<input type="text" placeholder="Last name" autoComplete="family-name" /></label></div></section>}

            {activeStep === "Delivery" && <section className="checkout-section"><div className="checkout-section__head"><span>02</span><div><h2>Delivery</h2><p>Choose the way your pair gets to you.</p></div></div><div className="delivery-choice-grid"><button onClick={() => setDeliveryMethod("store")} className={`delivery-choice ${deliveryMethod === "store" ? "is-selected" : ""}`}><StoreIcon /><span><strong>Collect from a Bata store</strong><small>Free collection · ready when you are</small></span><b>{deliveryMethod === "store" && <Check size={15} />}</b></button><button onClick={() => setDeliveryMethod("home")} className={`delivery-choice ${deliveryMethod === "home" ? "is-selected" : ""}`}><Truck size={21} /><span><strong>Deliver to my address</strong><small>Across Botswana · from 3–5 working days</small></span><b>{deliveryMethod === "home" && <Check size={15} />}</b></button></div>{deliveryMethod === "store" ? <label className="checkout-select-label">Choose your collection store<span className="checkout-select"><MapPin size={17} /><select value={store} onChange={(event) => setStore(event.target.value)}>{collectionStores.map((location) => <option key={location}>{location}</option>)}</select><ChevronDown size={15} /></span><small>Your pair will be held for 7 days after you receive collection confirmation.</small></label> : <div className="checkout-fields checkout-fields--two checkout-address"><label>Street address<input type="text" placeholder="Plot, street and suburb" autoComplete="street-address" /></label><label>Town or city<input type="text" placeholder="Gaborone" autoComplete="address-level2" /></label><label>Postal address (optional)<input type="text" placeholder="P.O. Box" autoComplete="postal-code" /></label><label>Delivery note (optional)<input type="text" placeholder="Gate, landmark or note" /></label></div>}</section>}

            {activeStep === "Shipping" && <section className="checkout-section"><div className="checkout-section__head"><span>03</span><div><h2>Shipping</h2><p>{deliveryMethod === "store" ? `Your collection point: ${store}.` : "Choose your delivery speed."}</p></div></div>{deliveryMethod === "store" ? <div className="shipping-confirmation"><PackageCheck size={30} /><div><strong>Store collection · Free</strong><p>We’ll notify you when your order is ready.</p></div></div> : <div className="shipping-options"><button onClick={() => setShipping("standard")} className={shipping === "standard" ? "is-selected" : ""}><span><b>Standard delivery</b><small>3–5 working days</small></span><strong>Free</strong></button><button onClick={() => setShipping("express")} className={shipping === "express" ? "is-selected" : ""}><span><b>Express delivery</b><small>1–2 working days in Gaborone</small></span><strong>P 120</strong></button></div>}</section>}

            {activeStep === "Payment" && <section className="checkout-section"><div className="checkout-section__head"><span>04</span><div><h2>Payment</h2><p>Choose a payment method.</p></div></div><div className="payment-options"><button onClick={() => setPayment("card")} className={payment === "card" ? "is-selected" : ""}><CreditCard size={23} /><span><strong>Card payment</strong><small>Visa · Mastercard</small></span><b>{payment === "card" && <Check size={15} />}</b></button><button onClick={() => setPayment("mobile")} className={payment === "mobile" ? "is-selected" : ""}><span className="payment-options__mobile">P</span><span><strong>Mobile payment</strong><small>Orange Money · Mascom MyZaka</small></span><b>{payment === "mobile" && <Check size={15} />}</b></button></div><div className="payment-note"><LockKeyhole size={16} /><p>Your payment details stay with the selected provider.</p></div></section>}

            <div className="checkout-card__footer"><p><LockKeyhole size={14} /> Your details are encrypted and secure.</p><button className="button button--red" onClick={moveForward}>{activeStep === "Payment" ? "Place order" : `Continue to ${steps[stepIndex + 1]}`} <ArrowRight size={17} /></button></div>
          </div>
        </section>

        <aside className="checkout-summary"><div className="checkout-summary__head"><h2>Your bag</h2><button onClick={() => setLocation("/catalog")} aria-label="Return to catalogue"><X size={18} /></button></div><div className="checkout-summary__items">{checkoutItems.map((item) => <div className="checkout-summary__product" key={item.product.id}><img src={item.product.image} alt={item.product.name} /><div><p>{item.product.brand}</p><strong>{item.product.name}</strong><span>{item.quantity} × P {item.product.price}</span></div></div>)}</div><div className="checkout-summary__totals"><p><span>Subtotal</span><strong>P {subtotal}</strong></p><p><span>Shipping</span><strong>{shippingCost ? `P ${shippingCost}` : "Free"}</strong></p><p className="checkout-summary__total"><span>Total</span><strong>P {total}</strong></p></div><div className="checkout-summary__delivery"><MapPin size={17} /><p>{deliveryMethod === "store" ? <><b>Store collection</b><span>{store}</span></> : <><b>Deliver to your address</b><span>Shipping method confirmed in the next step</span></>}</p></div><Link href="/catalog" className="checkout-summary__continue">Add another pair <ArrowRight size={15} /></Link></aside>
      </div>
    </main>
  </div><CartDrawer /></>;
}

function StoreIcon() { return <ShoppingBag size={21} />; }
