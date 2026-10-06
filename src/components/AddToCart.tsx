"use client";

import { useState } from "react";
import { useCart } from "./CartProvider";

export function AddToCart({ productId, disabled }: { productId: string; disabled?: boolean }) {
  const { add, pending } = useCart();
  const [qty, setQty] = useState(1);

  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center rounded-full border border-black/15">
        <button type="button" className="px-4 py-2" onClick={() => setQty((q) => Math.max(1, q - 1))}>
          −
        </button>
        <span className="w-8 text-center text-sm">{qty}</span>
        <button type="button" className="px-4 py-2" onClick={() => setQty((q) => q + 1)}>
          +
        </button>
      </div>
      <button
        type="button"
        disabled={disabled || pending}
        onClick={() => add(productId, qty)}
        className="rounded-full bg-pink px-8 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white disabled:opacity-40"
      >
        {disabled ? "Sold Out" : pending ? "Adding…" : "Add to Bag"}
      </button>
    </div>
  );
}
