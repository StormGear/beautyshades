"use client";

import React, { createContext, useContext, useState, useTransition, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

type AdminNavContextType = {
  isNavigating: boolean;
  pendingHref: string | null;
  navigate: (href: string) => void;
};

const AdminNavContext = createContext<AdminNavContextType>({
  isNavigating: false,
  pendingHref: null,
  navigate: () => {},
});

export const useAdminNav = () => useContext(AdminNavContext);

export function AdminNavProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  useEffect(() => {
    setPendingHref(null);
  }, [pathname]);

  const navigate = (href: string) => {
    if (pathname === href) return;
    setPendingHref(href);
    startTransition(() => {
      router.push(href);
    });
  };

  const isNavigating = Boolean(isPending || (pendingHref && pendingHref !== pathname));

  return (
    <AdminNavContext.Provider value={{ isNavigating, pendingHref, navigate }}>
      {children}
    </AdminNavContext.Provider>
  );
}
