"use client";

import { usePathname } from "next/navigation";
import { AdminNav } from "./AdminNav";
import { AdminNavProvider, useAdminNav } from "./AdminNavContext";

function AdminContentArea({ children }: { children: React.ReactNode }) {
  const { isNavigating } = useAdminNav();

  return (
    <div className="relative min-w-0 flex-1">
      {/* Subtle top shimmer progress indicator for instant navigation feedback */}
      {isNavigating && (
        <div className="fixed top-0 left-0 right-0 z-50 h-0.5 overflow-hidden bg-[#faf7f8]">
          <div className="absolute inset-y-0 h-full w-1/3 bg-gradient-to-r from-pink via-gold to-espresso animate-nav-progress" />
        </div>
      )}
      <main className="px-5 py-8 lg:px-10">{children}</main>
    </div>
  );
}

export function AdminFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/admin/login") return <>{children}</>;

  return (
    <AdminNavProvider>
      <div className="min-h-screen bg-[#faf7f8] lg:flex">
        <AdminNav />
        <AdminContentArea>{children}</AdminContentArea>
      </div>
    </AdminNavProvider>
  );
}
