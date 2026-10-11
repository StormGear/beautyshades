import { prisma } from "@/lib/prisma";
import { readCart, writeCart } from "@/lib/cart";
import { deliveryFee, isFulfillment, PICKUP_ADDRESS, PICKUP_CITY } from "@/lib/fulfillment";
import { checkoutSchema } from "@/lib/validators";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const json = await request.json();
  const parsed = checkoutSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please complete every required field." }, { status: 400 });
  }

  const fulfillment = isFulfillment(parsed.data.fulfillment) ? parsed.data.fulfillment : "delivery";

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
  const delivery = deliveryFee(subtotal, fulfillment);
  const total = subtotal + delivery;

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        fulfillment,
        address: fulfillment === "pickup" ? PICKUP_ADDRESS : parsed.data.address!.trim(),
        city: fulfillment === "pickup" ? PICKUP_CITY : parsed.data.city || PICKUP_CITY,
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
