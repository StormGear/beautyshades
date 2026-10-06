"use client";

import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { formatGhs } from "@/lib/money";

export default function CartPage() {
  const { items, subtotal, setQty, remove } = useCart();

  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="font-serif text-5xl">Your Bag</h1>
      {items.length === 0 ? (
        <p className="mt-8 text-muted">
          Nothing here yet.{" "}
          <Link href="/gallery" className="underline">
            Explore the shop
          </Link>
          .
        </p>
      ) : (
        <>
          <ul className="mt-10 divide-y divide-black/5">
            {items.map((item) => (
              <li key={item.productId} className="flex gap-5 py-6">
                <div className="relative h-28 w-24 overflow-hidden rounded-lg bg-blush">
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                </div>
                <div className="flex-1">
                  <Link href={`/product/${item.slug}`} className="font-medium">
                    {item.name}
                  </Link>
                  <p className="mt-1 text-sm text-muted">{formatGhs(item.price)}</p>
                  <div className="mt-3 flex gap-3">
                    <button onClick={() => setQty(item.productId, item.quantity - 1)}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => setQty(item.productId, item.quantity + 1)}>+</button>
                    <button className="ml-4 text-xs uppercase tracking-widest text-muted" onClick={() => remove(item.productId)}>
                      Remove
                    </button>
                  </div>
                </div>
                <p>{formatGhs(item.lineTotal)}</p>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex items-center justify-between">
            <p>Subtotal {formatGhs(subtotal)}</p>
            <Link href="/checkout" className="rounded-full bg-ink px-8 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
              Checkout
            </Link>
          </div>
        </>
      )}
    </section>
  );
}
