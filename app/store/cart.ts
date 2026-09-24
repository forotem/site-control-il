"use client";
// עגלת קניות קלה: localStorage + אירוע גלובלי, בלי ספריות. נשמרת בין דפים ובין ביקורים באותו דפדפן.
import { useEffect, useState } from "react";
import { storeProducts } from "../data/store-catalog";
import { track } from "../lib/analytics";

export type CartLine = { slug: string; qty: number };
const KEY = "sc-store-cart";
const EVT = "sc-cart-change";

function read(): CartLine[] {
  try {
    const raw = localStorage.getItem(KEY);
    const arr = raw ? (JSON.parse(raw) as CartLine[]) : [];
    return Array.isArray(arr) ? arr.filter((l) => l && typeof l.slug === "string" && l.qty > 0) : [];
  } catch { return []; }
}
function write(lines: CartLine[]) {
  try { localStorage.setItem(KEY, JSON.stringify(lines)); } catch {}
  try { window.dispatchEvent(new CustomEvent(EVT)); } catch {}
}

export const cart = {
  get: read,
  add(slug: string, qty = 1) {
    const lines = read();
    const l = lines.find((x) => x.slug === slug);
    if (l) l.qty = Math.min(200, l.qty + qty); else lines.push({ slug, qty });
    write(lines);
    const p = storeProducts.find((x) => x.slug === slug);
    track.addToCart([{ item_id: slug, item_name: p ? `${p.brand} ${p.model}` : slug, item_brand: p?.brand, item_category: p?.category, price: p?.price ?? undefined, quantity: qty }]);
  },
  set(slug: string, qty: number) {
    const lines = read().filter((x) => x.slug !== slug);
    if (qty > 0) lines.push({ slug, qty: Math.min(200, qty) });
    write(lines);
  },
  remove(slug: string) { write(read().filter((x) => x.slug !== slug)); },
  clear() { write([]); },
  open() { try { window.dispatchEvent(new CustomEvent("sc-cart-open")); } catch {} },
};

/** Hook: מצב העגלה, מסונכרן בין קומפוננטות ובין טאבים */
export function useCart() {
  const [lines, setLines] = useState<CartLine[]>([]);
  useEffect(() => {
    const sync = () => setLines(read());
    sync();
    window.addEventListener(EVT, sync);
    window.addEventListener("storage", sync);
    return () => { window.removeEventListener(EVT, sync); window.removeEventListener("storage", sync); };
  }, []);
  return lines;
}
