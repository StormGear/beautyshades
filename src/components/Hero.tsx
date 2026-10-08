"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

export type HeroSlide = {
  src: string;
  alt: string;
};

export function Hero({ slides = [] }: { slides?: HeroSlide[] }) {
  const [index, setIndex] = useState(0);

  const displaySlides =
    slides.length > 0
      ? slides
      : [
          {
            src: "/logo1.jpeg",
            alt: "Beauty Shades eyewear",
          },
        ];

  // Auto-play slideshow animation
  useEffect(() => {
    if (displaySlides.length <= 1) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % displaySlides.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [displaySlides.length]);

  const currentSlide = displaySlides[Math.min(index, displaySlides.length - 1)];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-[#faf4ea] to-white">
      <div className="mx-auto grid min-h-[calc(100vh-8rem)] max-w-7xl items-center gap-10 px-6 py-10 lg:grid-cols-2">
        <div className="max-w-xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gold">New Collection</p>
          <h1 className="mt-4 font-serif text-[3.4rem] leading-[0.95] text-ink sm:text-7xl lg:text-[5.6rem]">
            Clarity Meets
            <br />
            <span className="italic text-gold">Modern</span>
            <br />
            <span className="italic text-gold">Confidence.</span>
          </h1>
          <p className="mt-8 max-w-md text-sm leading-7 text-muted">
            Premium eyewear designed to match your personality. Hand-selected frames that blend everyday
            comfort with undeniable style.
          </p>
          <Link
            href="/gallery"
            className="mt-10 inline-flex rounded-full bg-gold px-8 py-3.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white shadow-lg shadow-gold/25 transition hover:-translate-y-0.5 hover:bg-gold-hover"
          >
            Explore The Shop
          </Link>
        </div>

        <div className="relative mx-auto w-full max-w-xl">
          <div className="hero-polaroid relative ml-auto aspect-[5/6] w-[92%] overflow-hidden rounded-[28px] bg-white p-3 shadow-[0_30px_80px_rgba(0,0,0,0.08)] ring-1 ring-black/5">
            <div className="relative h-full overflow-hidden rounded-[20px] bg-blush">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide.src}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.7, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  <img src={currentSlide.src} alt={currentSlide.alt} className="h-full w-full object-cover" />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {displaySlides.length > 1 && (
            <div className="absolute bottom-6 left-0 flex items-center gap-2">
              {displaySlides.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === index ? "w-6 bg-gold" : "w-2 bg-ink/20 hover:bg-ink/40"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
