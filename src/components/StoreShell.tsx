"use client";

import { usePathname } from "next/navigation";
import { CartProvider } from "./CartProvider";
import { Ticker, type AnnouncementItem } from "./Ticker";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { CartDrawer } from "./CartDrawer";

interface StoreShellProps {
  children: React.ReactNode;
  announcements?: AnnouncementItem[];
}

export function StoreShell({ children, announcements }: StoreShellProps) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return <>{children}</>;

  return (
    <CartProvider>
      <Ticker announcements={announcements} />
      <Header />
      <main>{children}</main>
      <Footer />
      <CartDrawer />
    </CartProvider>
  );
}
