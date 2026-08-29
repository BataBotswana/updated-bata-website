import { ArrowRight, Minus, Plus, ShoppingBag, X } from "lucide-react";
import { Link } from "wouter";
import { useCart } from "@/contexts/CartContext";

export default function CartDrawer() {
  const { items, count, total, isOpen, closeCart, updateQuantity, removeItem } = useCart();
  if (!isOpen) return null;
  const checkoutProduct = items[0]?.product.id;

  return (
    <div className="cart-drawer-layer" role="presentation">
      <button className="cart-drawer-scrim" aria-label="Close shopping bag" onClick={closeCart} />
      <aside className="cart-drawer" role="dialog" aria-modal="true" aria-label="Shopping bag">
        <header className="cart-drawer__top">
          <div><span className="cart-drawer__eyebrow">Bata Botswana</span><h2>Your bag <sup>{count}</sup></h2></div>
          <button className="cart-drawer__close" onClick={closeCart} aria-label="Close shopping bag"><X size={21} /></button>
        </header>

        <div className="cart-drawer__body">
          {items.length === 0 ? (
            <div className="cart-drawer__empty"><ShoppingBag size={32} strokeWidth={1.3} /><h3>Your bag is empty</h3><p>Find your next pair.</p><Link href="/catalog" className="button button--red" onClick={closeCart}>Shop shoes <ArrowRight size={16} /></Link></div>
          ) : (
            <div className="cart-drawer__items">
              {items.map((item) => (
                <article className="cart-drawer__item" key={`${item.product.id}-${item.size ?? "any"}`}>
                  <Link href={`/products/${item.product.id}`} onClick={closeCart} className="cart-drawer__item-image"><img src={item.product.image} alt={item.product.name} /></Link>
                  <div className="cart-drawer__item-copy"><div><span>{item.product.brand}</span><button onClick={() => removeItem(item.product.id)} aria-label={`Remove ${item.product.name}`}><X size={15} /></button></div><Link href={`/products/${item.product.id}`} onClick={closeCart}><strong>{item.product.name}</strong></Link><small>{item.size ? `Size ${item.size}` : "Size to be selected"}</small><div className="cart-drawer__quantity"><button onClick={() => updateQuantity(item.product.id, -1)} aria-label="Decrease quantity"><Minus size={14} /></button><span>{item.quantity}</span><button onClick={() => updateQuantity(item.product.id, 1)} aria-label="Increase quantity"><Plus size={14} /></button><b>P {item.product.price * item.quantity}</b></div></div>
                </article>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && <footer className="cart-drawer__bottom"><div><span>Subtotal</span><strong>P {total}</strong></div><small>Delivery calculated at checkout.</small><Link href={checkoutProduct ? `/checkout?product=${checkoutProduct}` : "/checkout"} onClick={closeCart} className="button button--red">Checkout <ArrowRight size={17} /></Link></footer>}
      </aside>
    </div>
  );
}
