import { prisma } from "@/lib/prisma";
import { formatGhs } from "@/lib/money";
import { notFound } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });
  if (!order) notFound();

  return (
    <section className="mx-auto max-w-2xl px-6 py-20 text-center">
      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-pink">Thank you</p>
      <h1 className="mt-3 font-serif text-5xl">Order confirmed.</h1>
      <p className="mt-4 text-sm text-muted">
        We&apos;ll be in touch on {order.phone} to confirm delivery to {order.city}.
      </p>
      <ul className="mt-10 space-y-3 text-left text-sm">
        {order.items.map((item) => (
          <li key={item.id} className="flex justify-between">
            <span>
              {item.name} × {item.quantity}
            </span>
            <span>{formatGhs(Number(item.price) * item.quantity)}</span>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-sm">Total {formatGhs(Number(order.total))}</p>
      <Link href="/gallery" className="mt-10 inline-block text-[11px] uppercase tracking-[0.2em] underline">
        Continue shopping
      </Link>
    </section>
  );
}
