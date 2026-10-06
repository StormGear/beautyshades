"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const slides = [
  {
    src: "https://specswura.com/wp-content/uploads/2026/09/IMG_4122.jpeg",
    alt: "Celine sunglasses from Beauty Shades",
  },
  {
    src: "https://specswura.com/wp-content/uploads/2026/09/IMG_3947.jpeg",
    alt: "Photochromic frames from Beauty Shades",
  },
];


export function Hero() {
  const [index, setIndex] = useState(0);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-[#fff7fa] to-white">
      <div className="mx-auto grid min-h-[calc(100vh-8rem)] max-w-7xl items-center gap-10 px-6 py-10 lg:grid-cols-2">
        <div className="max-w-xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-pink">New Collection</p>
          <h1 className="mt-4 font-serif text-[3.4rem] leading-[0.95] text-ink sm:text-7xl lg:text-[5.6rem]">
            Clarity Meets
            <br />
            <span className="italic text-[#9aa0b5]">Modern</span>
            <br />
            <span className="italic text-[#9aa0b5]">Confidence.</span>
          </h1>
          <p className="mt-8 max-w-md text-sm leading-7 text-muted">
            Premium eyewear designed to match your personality. Hand-selected frames that blend everyday
            comfort with undeniable style.
          </p>
          <Link
            href="/gallery"
            className="mt-10 inline-flex rounded-full bg-pink px-8 py-3.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white shadow-lg shadow-pink/20 transition hover:-translate-y-0.5 hover:bg-[#d84c7d]"
          >
            Explore The Shop
          </Link>
        </div>

        <div className="relative mx-auto w-full max-w-xl">
          <div className="hero-polaroid relative ml-auto aspect-[5/6] w-[92%] overflow-hidden rounded-[28px] bg-white p-3 shadow-[0_30px_80px_rgba(0,0,0,0.08)] ring-1 ring-black/5">
            <div className="relative h-full overflow-hidden rounded-[20px] bg-blush">
              <AnimatePresence mode="wait">
                <motion.div
                  key={slides[index].src}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.55 }}
                  className="absolute inset-0"
                >
                  <img src={slides[index].src} alt={slides[index].alt} className="h-full w-full object-cover" />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          <div className="absolute bottom-6 left-0 flex items-center gap-3">
            {slides.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-2.5 w-2.5 rounded-full ${i === index ? "bg-ink" : "bg-ink/20"}`}
              />
            ))}
            <button aria-label="Previous slide" className="ml-2 text-xs uppercase tracking-widest" onClick={() => setIndex((i) => (i === 0 ? slides.length - 1 : i - 1))}>
              Prev
            </button>
            <button aria-label="Next slide" className="text-xs uppercase tracking-widest" onClick={() => setIndex((i) => (i + 1) % slides.length)}>
              Next
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
