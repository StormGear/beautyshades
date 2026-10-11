"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export type CategoryTileItem = {
  href: string;
  title: string;
  cta: string;
  image: string;
};

export function CategoryTiles({ items = [] }: { items?: CategoryTileItem[] }) {
  if (items.length === 0) return null;

  return (
    <section className="mx-auto grid max-w-6xl gap-6 px-6 md:grid-cols-2">
      {items.map((tile) => (
        <Link key={tile.title} href={tile.href} className="group relative isolate block overflow-hidden rounded-2xl">
          <div className="relative aspect-[16/8]">
            <img
              src={tile.image}
              alt={tile.title}
              className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-5">
              <h2 className="font-serif text-3xl text-white md:text-4xl">{tile.title}</h2>
              <motion.span
                whileHover={{ y: -2 }}
                className="rounded-full bg-white px-6 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-black"
              >
                {tile.cta}
              </motion.span>
            </div>
          </div>
        </Link>
      ))}
    </section>
  );
}
