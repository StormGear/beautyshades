"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";

const links = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/prescriptions", label: "Prescriptions" },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

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
            const active = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-3 py-2 text-[12px] font-medium uppercase tracking-[0.12em] ${
                  active ? "bg-ink text-white" : "text-ink/70 hover:bg-blush"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="mt-6 flex items-center justify-between gap-3 lg:flex-col lg:items-stretch">
        <Link href="/" className="text-[11px] uppercase tracking-widest text-muted">
          View shop
        </Link>
        <button type="button" onClick={logout} className="text-left text-[11px] uppercase tracking-widest text-muted">
          Log out
        </button>
      </div>
    </aside>
  );
}
