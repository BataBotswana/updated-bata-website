import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { CatalogProduct } from "@/data/catalog";

export type CartItem = {
  product: CatalogProduct;
  quantity: number;
  size?: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  total: number;
  isOpen: boolean;
  addItem: (product: CatalogProduct, size?: number) => void;
  updateQuantity: (productId: number, delta: number) => void;
  removeItem: (productId: number) => void;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "bata-bw-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]") as CartItem[];
      return Array.isArray(stored) ? stored : [];
    } catch {
      return [];
    }
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const value = useMemo<CartContextValue>(() => ({
    items,
    count: items.reduce((sum, item) => sum + item.quantity, 0),
    total: items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    isOpen,
    addItem: (product, size) => {
      setItems((current) => {
        const existing = current.find((item) => item.product.id === product.id && item.size === size);
        if (existing) return current.map((item) => item === existing ? { ...item, quantity: item.quantity + 1 } : item);
        return [...current, { product, size, quantity: 1 }];
      });
      setIsOpen(true);
    },
    updateQuantity: (productId, delta) => {
      setItems((current) => current.flatMap((item) => item.product.id === productId ? (item.quantity + delta > 0 ? [{ ...item, quantity: item.quantity + delta }] : []) : [item]));
    },
    removeItem: (productId) => setItems((current) => current.filter((item) => item.product.id !== productId)),
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
  }), [isOpen, items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
