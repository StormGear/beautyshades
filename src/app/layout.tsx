import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { StoreShell } from "@/components/StoreShell";
import { prisma } from "@/lib/prisma";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: {
    default: "Beauty Shades — Clarity Meets Modern Confidence",
    template: "%s · Beauty Shades",
  },
  description:
    "Premium eyewear from Cape Coast. Frames, sunglasses, photochromic lenses, and lens care with nationwide delivery.",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  let announcements;
  try {
    announcements = await prisma.announcement.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
      select: {
        id: true,
        label: true,
        text: true,
        href: true,
        cta: true,
      },
    });
  } catch (err) {
    console.error("Failed to load announcements:", err);
  }

  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} antialiased`}>
        <StoreShell announcements={announcements}>{children}</StoreShell>
      </body>
    </html>
  );
}
