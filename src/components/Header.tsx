"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "./Logo";
import { useCart } from "./CartProvider";
import { ThemeToggle } from "./ThemeToggle";

const nav = [
  { href: "/", label: "Home" },
  { href: "/gallery", label: "Gallery / Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const { count, setOpen } = useCart();
  const [menu, setMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/90 backdrop-blur-md">
      <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 py-4">
        <div className="flex items-center">
          <nav className="hidden items-center gap-7 text-[12px] font-medium uppercase tracking-[0.16em] text-ink/70 md:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`transition hover:text-ink ${pathname === item.href ? "text-ink" : ""}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Animated Hamburger / Close Button */}
          <button
            type="button"
            className="group relative flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-blush md:hidden"
            onClick={() => setMenu((v) => !v)}
            aria-label={menu ? "Close menu" : "Open menu"}
            aria-expanded={menu}
          >
            <div className="relative flex h-3.5 w-5 flex-col justify-between">
              <span
                className={`h-[1.5px] w-5 rounded-full bg-ink transition-all duration-300 ease-in-out ${
                  menu ? "translate-y-[5.5px] rotate-45" : ""
                }`}
              />
              <span
                className={`h-[1.5px] w-5 rounded-full bg-ink transition-all duration-300 ease-in-out ${
                  menu ? "-translate-y-[5.5px] -rotate-45" : ""
                }`}
              />
            </div>
          </button>
        </div>

        <div className="justify-self-center">
          <Logo />
        </div>

        <div className="flex items-center justify-end gap-3">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="relative rounded-full p-2 text-ink/80 transition hover:bg-blush"
            aria-label="Open bag"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
              <path d="M6 8h12l-1 12H7L6 8Z" />
              <path d="M9 8V7a3 3 0 0 1 6 0v1" />
            </svg>
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-pink px-1 text-[10px] text-white">
                {count}
              </span>
            )}
          </button>
          <Link
            href="/contact"
            className="hidden rounded-full border border-line-strong px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] transition hover:border-ink hover:bg-ink hover:text-on-ink sm:inline-flex"
          >
            Get In Touch
          </Link>
        </div>
      </div>

      {/* Animated Dropdown Menu */}
      <AnimatePresence>
        {menu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-line bg-surface md:hidden"
          >
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={{
                open: { transition: { staggerChildren: 0.05, delayChildren: 0.04 } },
                closed: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
              }}
              className="flex flex-col gap-3 px-6 py-5 text-sm uppercase tracking-[0.18em]"
            >
              {nav.map((item) => (
                <motion.div
                  key={item.href}
                  variants={{
                    open: { opacity: 1, x: 0 },
                    closed: { opacity: 0, x: -10 },
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setMenu(false)}
                    className={`block py-1 transition-colors hover:text-gold ${
                      pathname === item.href ? "font-semibold text-gold" : "text-ink/80"
                    }`}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                variants={{
                  open: { opacity: 1, y: 0 },
                  closed: { opacity: 0, y: 8 },
                }}
                className="pt-2"
              >
                <Link
                  href="/contact"
                  onClick={() => setMenu(false)}
                  className="inline-flex w-full items-center justify-center rounded-full bg-gold px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-white shadow-sm transition hover:bg-gold-hover"
                >
                  Get In Touch
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
