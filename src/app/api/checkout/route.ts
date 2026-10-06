import { prisma } from "@/lib/prisma";
import { readCart, writeCart } from "@/lib/cart";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(8),
  address: z.string().min(5),
  city: z.string().optional(),
  notes: z.string().optional(),
});

export async function POST(request: Request) {
  const json = await request.json();
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please complete every required field." }, { status: 400 });
  }

  const lines = await readCart();
  if (lines.length === 0) {
    return NextResponse.json({ error: "Your bag is empty." }, { status: 400 });
  }

  const products = await prisma.product.findMany({
    where: { id: { in: lines.map((l) => l.productId) } },
  });
  const byId = Object.fromEntries(products.map((p) => [p.id, p]));

  const items: {
    productId: string;
    name: string;
    price: (typeof products)[number]["price"];
    quantity: number;
  }[] = [];
  for (const line of lines) {
    const product = byId[line.productId];
    if (!product || product.stock <= 0) continue;
    const quantity = Math.min(line.quantity, product.stock);
    items.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
    });
  }

  if (items.length === 0) {
    return NextResponse.json({ error: "Those pieces are no longer available." }, { status: 400 });
  }

  const subtotal = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
  const delivery = subtotal >= 500 ? 0 : 30;
  const total = subtotal + delivery;

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        address: parsed.data.address,
        city: parsed.data.city || "Accra",
        notes: parsed.data.notes ?? null,
        subtotal,
        delivery,
        total,
        items: { create: items },
      },
    });

    for (const item of items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    return created;
  });

  await writeCart([]);
  return NextResponse.json({ id: order.id });
}
