"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { AdminButton } from "@/components/AdminButton";
import { useAdminNav } from "@/components/AdminNavContext";
import { Loader2 } from "lucide-react";

const links = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/announcements", label: "Announcements" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/prescriptions", label: "Prescriptions" },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { pendingHref, navigate } = useAdminNav();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="flex w-full flex-col justify-between border-b border-black/5 bg-white px-5 py-4 lg:h-screen lg:w-60 lg:border-b-0 lg:border-r">
      <div>
        <Logo />
        <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-pink">Admin</p>
        <nav className="mt-6 flex flex-wrap gap-2 lg:flex-col">
          {links.map((link) => {
            const isPendingTarget = pendingHref === link.href;
            const isCurrentPath = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href));
            const active = isPendingTarget || (isCurrentPath && !pendingHref);

            return (
              <Link
                key={link.href}
                href={link.href}
                prefetch={true}
                onClick={(e) => {
                  // If standard left click without modifier keys, use our transition
                  if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
                    e.preventDefault();
                    navigate(link.href);
                  }
                }}
                className={`group flex items-center justify-between rounded-full px-3.5 py-2 text-[12px] font-medium uppercase tracking-[0.12em] transition-all duration-150 ${
                  active ? "bg-ink text-white shadow-sm" : "text-ink/70 hover:bg-blush"
                }`}
              >
                <span>{link.label}</span>
                {isPendingTarget && (
                  <Loader2 className="h-3 w-3 animate-spin text-white shrink-0 ml-2" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="mt-6 flex items-center justify-between gap-3 lg:flex-col lg:items-stretch">
        <Link
          href="/"
          className="text-[11px] uppercase tracking-widest text-muted hover:text-ink transition-colors"
        >
          View shop
        </Link>
        <AdminButton
          type="button"
          onClick={logout}
          variant="text"
          className="text-left text-[11px] uppercase tracking-widest text-muted hover:text-red-600 transition-colors"
          loadingText="Logging out…"
        >
          Log out
        </AdminButton>
      </div>
    </aside>
  );
}
