import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin, ORDER_STATUSES } from "@/lib/admin";
import { formatGhs } from "@/lib/money";

export const dynamic = "force-dynamic";
export const metadata = { title: "Orders" };

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const orders = await prisma.order.findMany({
    where: params.status ? { status: params.status } : {},
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-pink">Sales</p>
      <h1 className="mt-2 font-serif text-4xl">Orders</h1>
      <div className="mt-6 flex flex-wrap gap-2">
        <Link href="/admin/orders" className={`rounded-full px-3 py-1 text-[11px] uppercase tracking-widest ${!params.status ? "bg-ink text-white" : "bg-white ring-1 ring-black/10"}`}>
          All
        </Link>
        {ORDER_STATUSES.map((status) => (
          <Link
            key={status}
            href={`/admin/orders?status=${status}`}
            className={`rounded-full px-3 py-1 text-[11px] uppercase tracking-widest ${params.status === status ? "bg-ink text-white" : "bg-white ring-1 ring-black/10"}`}
          >
            {status}
          </Link>
        ))}
      </div>
      <div className="mt-6 overflow-x-auto rounded-2xl bg-white ring-1 ring-black/5">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-blush text-[11px] uppercase tracking-widest text-muted">
            <tr>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Fulfillment</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t border-black/5">
                <td className="px-4 py-3">
                  <Link href={`/admin/orders/${order.id}`} className="font-medium">
                    {order.name}
                  </Link>
                  <p className="text-xs text-muted">{order.phone}</p>
                </td>
                <td className="px-4 py-3 capitalize">{order.fulfillment}</td>
                <td className="px-4 py-3">{order.items.reduce((sum, item) => sum + item.quantity, 0)}</td>
                <td className="px-4 py-3">{formatGhs(Number(order.total))}</td>
                <td className="px-4 py-3 capitalize">{order.status}</td>
                <td className="px-4 py-3 text-muted">{order.createdAt.toLocaleString("en-GB")}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && <p className="p-6 text-sm text-muted">No orders in this view.</p>}
      </div>
    </div>
  );
}
