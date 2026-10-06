import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { formatGhs } from "@/lib/money";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin" };

export default async function AdminHomePage() {
  await requireAdmin();
  const [products, lowStock, orders, pending, revenue, messages, prescriptions] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { stock: { gt: 0, lte: 2 } } }),
    prisma.order.count(),
    prisma.order.count({ where: { status: "pending" } }),
    prisma.order.aggregate({ _sum: { total: true } }),
    prisma.contactMessage.count({ where: { handled: false } }),
    prisma.prescription.count({ where: { handled: false } }),
  ]);

  const recent = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  const cards = [
    { label: "Products", value: products, href: "/admin/products" },
    { label: "Low stock", value: lowStock, href: "/admin/products?stock=low" },
    { label: "Orders", value: orders, href: "/admin/orders" },
    { label: "Pending orders", value: pending, href: "/admin/orders?status=pending" },
    { label: "New messages", value: messages, href: "/admin/messages" },
    { label: "New prescriptions", value: prescriptions, href: "/admin/prescriptions" },
  ];

  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-pink">Overview</p>
      <h1 className="mt-2 font-serif text-4xl">Studio</h1>
      <p className="mt-2 text-sm text-muted">Lifetime sales {formatGhs(Number(revenue._sum.total ?? 0))}</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <Link key={card.label} href={card.href} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
            <p className="text-[11px] uppercase tracking-widest text-muted">{card.label}</p>
            <p className="mt-2 font-serif text-4xl">{card.value}</p>
          </Link>
        ))}
      </div>
      <h2 className="mt-12 font-serif text-2xl">Recent orders</h2>
      <div className="mt-4 overflow-hidden rounded-2xl bg-white ring-1 ring-black/5">
        {recent.length === 0 ? (
          <p className="p-6 text-sm text-muted">No orders yet.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-blush text-[11px] uppercase tracking-widest text-muted">
              <tr>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Placed</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((order) => (
                <tr key={order.id} className="border-t border-black/5">
                  <td className="px-4 py-3">
                    <Link href={`/admin/orders/${order.id}`} className="font-medium">
                      {order.name}
                    </Link>
                    <p className="text-xs text-muted">{order.email}</p>
                  </td>
                  <td className="px-4 py-3">{formatGhs(Number(order.total))}</td>
                  <td className="px-4 py-3 capitalize">{order.status}</td>
                  <td className="px-4 py-3 text-muted">{order.createdAt.toLocaleDateString("en-GB")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
