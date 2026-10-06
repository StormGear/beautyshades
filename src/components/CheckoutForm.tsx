"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "./CartProvider";
import { formatGhs } from "@/lib/money";

export function CheckoutForm() {
  const router = useRouter();
  const { items, subtotal, refresh } = useCart();
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [error, setError] = useState("");
  const delivery = subtotal >= 500 ? 0 : 30;
  const total = subtotal + delivery;

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    setStatus("saving");
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const body = await res.json();
    if (!res.ok) {
      setError(body.error ?? "Checkout failed.");
      setStatus("error");
      return;
    }
    await refresh();
    router.push(`/order/${body.id}`);
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-5">
        <input name="name" required placeholder="Full name *" className="underline-input" />
        <input name="email" type="email" required placeholder="Email *" className="underline-input" />
        <input name="phone" required placeholder="Phone *" className="underline-input" />
        <input name="address" required placeholder="Delivery address *" className="underline-input" />
        <input name="city" defaultValue="Accra" placeholder="City" className="underline-input" />
        <textarea name="notes" placeholder="Order notes (optional)" rows={3} className="underline-input resize-none" />
        {status === "error" && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={status === "saving" || items.length === 0}
          className="rounded-full bg-ink px-8 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white disabled:opacity-40"
        >
          {status === "saving" ? "Placing order…" : "Place Order"}
        </button>
      </div>
      <aside className="rounded-3xl bg-blush p-6">
        <h2 className="font-serif text-2xl">Summary</h2>
        <ul className="mt-5 space-y-3 text-sm">
          {items.map((item) => (
            <li key={item.productId} className="flex justify-between gap-4">
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>{formatGhs(item.lineTotal)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-6 space-y-2 border-t border-black/10 pt-4 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatGhs(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery</span>
            <span>{delivery === 0 ? "Complimentary" : formatGhs(delivery)}</span>
          </div>
          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span>{formatGhs(total)}</span>
          </div>
        </div>
      </aside>
    </form>
  );
}
