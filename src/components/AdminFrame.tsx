"use client";

import { usePathname } from "next/navigation";
import { AdminNav } from "./AdminNav";

export function AdminFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/admin/login") return <>{children}</>;

  return (
    <div className="min-h-screen bg-[#faf7f8] lg:flex">
      <AdminNav />
      <div className="min-w-0 flex-1 px-5 py-8 lg:px-10">{children}</div>
    </div>
  );
}
