"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "./Logo";
import { useCart } from "./CartProvider";

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
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/90 backdrop-blur-md">
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
          <button type="button" className="md:hidden" onClick={() => setMenu((v) => !v)} aria-label="Menu">
            <span className="mb-1.5 block h-px w-6 bg-ink" />
            <span className="block h-px w-6 bg-ink" />
          </button>
        </div>
        <div className="justify-self-center">
          <Logo />
        </div>
        <div className="flex items-center justify-end gap-3">
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
            className="hidden rounded-full border border-black/15 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] transition hover:border-ink hover:bg-ink hover:text-white sm:inline-flex"
          >
            Get In Touch
          </Link>
        </div>
      </div>
      {menu && (
        <div className="border-t border-black/5 bg-white px-5 py-4 md:hidden">
          <div className="flex flex-col gap-3 text-sm uppercase tracking-[0.16em]">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setMenu(false)}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
