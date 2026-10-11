import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-surface">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo variant="badge" />
          <p className="mt-6 max-w-sm text-sm leading-7 text-muted">
            Beauty Shades is a fashion-forward eyewear brand that blends clarity, confidence, and everyday
            style. The brand focuses on glasses that don’t just help people see better—but help them feel
            better.
          </p>
          <div className="mt-6 flex items-center gap-5 text-ink/70">
            <a
              href="https://tiktok.com/@beautyshadesghana"
              target="_blank"
              rel="noreferrer"
              aria-label="TikTok"
              className="inline-flex items-center text-ink/80 transition-colors hover:text-pink"
            >
              <svg
                className="h-5 w-5 fill-current"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.68 6.34 6.34 0 0 0 9.34 22a6.34 6.34 0 0 0 6.34-6.32V8.92a8.28 8.28 0 0 0 4.84 1.56V7.03a4.83 4.83 0 0 1-.93-.34z" />
              </svg>
            </a>
            {/* <a href="https://instagram.com/beautyshades" target="_blank" rel="noreferrer">
              Instagram
            </a>
            <a href="https://snapchat.com/add/beautyshades" target="_blank" rel="noreferrer">
              Snapchat
            </a> */}
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
              Cape Coast
            </li>
            <li>
              Direct Line:
              <br />
              <a href="tel:0552383203" className="hover:text-ink">0552383203</a>
            </li>
            <li>
              Email:
              <br />
              <a href="mailto:lilianababaise@gmail.com" className="hover:text-ink">lilianababaise@gmail.com</a>
            </li>
            <li>
              Working Days/Hours:
              <br />
              Mon-Sat / 8:00AM - 6:00PM
            </li>
          </ul>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-line px-6 py-4 text-[11px] uppercase tracking-[0.16em] text-muted">
        <span>©2026, Beauty Shades</span>
        <span>All rights reserved</span>
      </div>

    </footer>
  );
}
