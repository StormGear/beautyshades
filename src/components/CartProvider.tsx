"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  stock: number;
  lineTotal: number;
};

type CartPayload = {
  items: CartItem[];
  count: number;
  subtotal: number;
};

type CartContextValue = CartPayload & {
  open: boolean;
  setOpen: (open: boolean) => void;
  refresh: () => Promise<void>;
  add: (productId: string, quantity?: number) => Promise<void>;
  setQty: (productId: string, quantity: number) => Promise<void>;
  remove: (productId: string) => Promise<void>;
  pending: boolean;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [data, setData] = useState<CartPayload>({ items: [], count: 0, subtotal: 0 });

  const refresh = useCallback(async () => {
    const res = await fetch("/api/cart", { cache: "no-store" });
    if (res.ok) setData(await res.json());
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const mutate = useCallback(
    async (body: Record<string, unknown>) => {
      setPending(true);
      try {
        const res = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (res.ok) {
          setData(await res.json());
          setOpen(true);
        }
      } finally {
        setPending(false);
      }
    },
    [],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      ...data,
      open,
      setOpen,
      refresh,
      pending,
      add: (productId, quantity = 1) => mutate({ action: "add", productId, quantity }),
      setQty: (productId, quantity) => mutate({ action: "set", productId, quantity }),
      remove: (productId) => mutate({ action: "remove", productId }),
    }),
    [data, mutate, open, pending, refresh],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
