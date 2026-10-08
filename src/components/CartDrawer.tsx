"use client";

import Link from "next/link";
import { formatGhs } from "@/lib/money";
import { useCart } from "./CartProvider";

export function CartDrawer() {
  const { open, setOpen, items, subtotal, setQty, remove, pending } = useCart();
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button className="absolute inset-0 bg-ink/30 backdrop-blur-[2px]" onClick={() => setOpen(false)} aria-label="Close bag" />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-black/5 px-6 py-5">
          <h2 className="font-serif text-2xl">Your Bag</h2>
          <button onClick={() => setOpen(false)} className="text-sm uppercase tracking-widest">
            Close
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <p className="py-12 text-center text-muted">Your bag is waiting for a favourite frame.</p>
          ) : (
            <ul className="space-y-5">
              {items.map((item) => (
                <li key={item.productId} className="flex gap-4">
                  <Link href={`/product/${item.slug}`} className="relative h-24 w-20 shrink-0 overflow-hidden rounded-md bg-blush">
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{item.name}</p>
                    <p className="mt-1 text-sm text-muted">{formatGhs(item.price)}</p>
                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex items-center rounded-full border border-black/10">
                        <button className="px-3 py-1" onClick={() => setQty(item.productId, item.quantity - 1)} disabled={pending}>
                          −
                        </button>
                        <span className="px-2 text-sm">{item.quantity}</span>
                        <button className="px-3 py-1" onClick={() => setQty(item.productId, item.quantity + 1)} disabled={pending}>
                          +
                        </button>
                      </div>
                      <button className="text-xs uppercase tracking-wider text-muted" onClick={() => remove(item.productId)}>
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="border-t border-black/5 px-6 py-5">
          <div className="mb-4 flex items-center justify-between text-sm">
            <span>Subtotal</span>
            <span className="font-medium">{formatGhs(subtotal)}</span>
          </div>
          <p className="mb-4 text-xs text-muted">Complimentary Cape Coast delivery on orders above GHS 500.</p>
          <Link
            href="/checkout"
            onClick={() => setOpen(false)}
            className="block rounded-full bg-ink py-3 text-center text-xs font-semibold uppercase tracking-[0.18em] text-white"
          >
            Checkout
          </Link>
        </div>
      </aside>
    </div>
  );
}
