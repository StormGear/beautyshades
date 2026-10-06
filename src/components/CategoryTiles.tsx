"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const tiles = [
  {
    href: "/prescription",
    title: "Prescription Glasses",
    cta: "Add Prescription",
    image: "https://specswura.com/wp-content/uploads/2026/09/IMG_4082.jpeg",
  },
  {
    href: "/gallery?category=sunglasses",
    title: "Sunglasses",
    cta: "Shop Now",
    image: "https://specswura.com/wp-content/uploads/2026/09/IMG_4122.jpeg",
  },
];

export function CategoryTiles() {
  return (
    <section className="mx-auto grid max-w-6xl gap-6 px-6 md:grid-cols-2">
      {tiles.map((tile) => (
        <Link key={tile.title} href={tile.href} className="group relative isolate block overflow-hidden rounded-2xl">
          <div className="relative aspect-[16/8]">
            <img src={tile.image} alt={tile.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/25" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-5">
              <h2 className="font-serif text-3xl text-white md:text-4xl">{tile.title}</h2>
              <motion.span
                whileHover={{ y: -2 }}
                className="rounded-full bg-white px-6 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink"
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
