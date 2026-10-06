"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { formatGhs, percentOff } from "@/lib/money";

type ProductCardProps = {
  product: {
    name: string;
    slug: string;
    image: string;
    price: number | string;
    compareAt?: number | string | null;
    stock: number;
  };
  layout?: "masonry" | "grid";
};

export function ProductCard({ product, layout = "grid" }: ProductCardProps) {
  const off = percentOff(Number(product.price), product.compareAt ? Number(product.compareAt) : null);
  const soldOut = product.stock <= 0;

  if (layout === "masonry") {
    return (
      <motion.article
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="group"
      >
        <Link href={`/product/${product.slug}`} className="block">
          <div className="product-frame relative aspect-[4/5] overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
            />
            {soldOut && (
              <span className="absolute right-4 top-4 rounded-full bg-red-600 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                Sold Out
              </span>
            )}
            {off && !soldOut && (
              <span className="absolute left-4 top-4 rounded-full bg-pink px-3 py-1 text-[10px] font-semibold text-white">
                -{off}%
              </span>
            )}
          </div>
          <div className="mt-4 flex items-start justify-between gap-4 px-1">
            <h3 className="text-[12px] font-semibold uppercase tracking-[0.14em]">{product.name}</h3>
            <p className="shrink-0 text-[12px] text-muted">{formatGhs(Number(product.price))}</p>
          </div>
        </Link>
      </motion.article>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
      className="group"
    >
      <Link href={`/product/${product.slug}`} className="block overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
        <div className="relative aspect-[4/5] bg-blush">
          <img
            src={product.image}
            alt={product.name}
            className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
          />
          <div className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium shadow-sm">
            {formatGhs(Number(product.price))}
          </div>
          {soldOut && (
            <span className="absolute bottom-3 left-3 rounded-full bg-red-600 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
              Sold Out
            </span>
          )}
          {off && (
            <span className="absolute left-3 top-3 rounded-full bg-pink px-2.5 py-1 text-[10px] font-semibold text-white">
              -{off}%
            </span>
          )}
        </div>
        <div className="px-4 py-4">
          <h3 className="truncate font-serif text-xl">{product.name}</h3>
          {product.stock > 0 && product.stock <= 2 && (
            <p className="mt-2 text-[11px] font-semibold uppercase tracking-wider text-amber-700">Only {product.stock} left</p>
          )}
          {soldOut && <p className="mt-2 text-[11px] font-semibold uppercase tracking-wider text-red-600">Sold out</p>}
        </div>
      </Link>
    </motion.article>
  );
}
