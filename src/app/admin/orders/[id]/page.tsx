import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { formatGhs } from "@/lib/money";
import { AdminOrderStatusForm } from "@/components/AdminOrderStatusForm";

export const dynamic = "force-dynamic";

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });
  if (!order) notFound();

  return (
    <div className="max-w-3xl">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-pink">Sales</p>
      <h1 className="mt-2 font-serif text-4xl">{order.name}</h1>
      <p className="mt-2 text-sm text-muted">
        {order.email} · {order.phone}
      </p>
      <p className="mt-1 text-sm text-muted">
        {order.fulfillment === "pickup" ? "Store pickup" : "Delivery"} · {order.address}, {order.city}
      </p>
      {order.notes && <p className="mt-4 text-sm italic text-muted">{order.notes}</p>}
      <ul className="mt-8 space-y-3 rounded-2xl bg-white p-6 text-sm ring-1 ring-black/5">
        {order.items.map((item) => (
          <li key={item.id} className="flex justify-between">
            <span>
              {item.name} × {item.quantity}
            </span>
            <span>{formatGhs(Number(item.price) * item.quantity)}</span>
          </li>
        ))}
        <li className="flex justify-between border-t border-black/5 pt-3">
          <span>{order.fulfillment === "pickup" ? "Pickup" : "Delivery"}</span>
          <span>
            {order.fulfillment === "pickup"
              ? "In store"
              : Number(order.delivery) === 0
                ? "Complimentary"
                : formatGhs(Number(order.delivery))}
          </span>
        </li>
        <li className="flex justify-between font-medium">
          <span>Total</span>
          <span>{formatGhs(Number(order.total))}</span>
        </li>
      </ul>
      <AdminOrderStatusForm id={order.id} status={order.status} />
    </div>
  );
}
