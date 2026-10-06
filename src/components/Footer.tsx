import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-black/5 bg-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo variant="badge" />
          <p className="mt-6 max-w-sm text-sm leading-7 text-muted">
            Beauty Shades is a fashion-forward eyewear brand that blends clarity, confidence, and everyday
            style. The brand focuses on glasses that don’t just help people see better—but help them feel
            better.
          </p>
          <div className="mt-6 flex gap-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/70">
            <a href="https://tiktok.com/@beautyshades" target="_blank" rel="noreferrer">
              TikTok
            </a>
            <a href="https://instagram.com/beautyshades" target="_blank" rel="noreferrer">
              Instagram
            </a>
            <a href="https://snapchat.com/add/beautyshades" target="_blank" rel="noreferrer">
              Snapchat
            </a>
          </div>
        </div>
        <div>
          <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em]">Useful Links</h4>
          <ul className="mt-5 space-y-3 text-sm text-muted">
            <li>
              <Link href="/privacy">Privacy Policy</Link>
            </li>
            <li>
              <Link href="/about">About Us</Link>
            </li>
            <li>
              <Link href="/contact">Contact Us</Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em]">Contact Info</h4>
          <ul className="mt-5 space-y-3 text-sm text-muted">
            <li>
              Address:
              <br />
              Accra
            </li>
            <li>
              Email:
              <br />
              <a href="mailto:maryobouragyemang@gmail.com">maryobouragyemang@gmail.com</a>
            </li>
            <li>
              Working Days/Hours:
              <br />
              Mon-Sat / 8:00AM - 6:00PM
            </li>
          </ul>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-black/5 px-6 py-4 text-[11px] uppercase tracking-[0.16em] text-muted">
        <span>©2026, Beauty Shades</span>
        <span>All rights reserved</span>
      </div>

    </footer>
  );
}
