import { prisma } from "@/lib/prisma";
import { readCart, writeCart, type CartLine } from "@/lib/cart";
import { NextResponse } from "next/server";

async function serialize(lines: CartLine[]) {
  if (lines.length === 0) {
    return { items: [], count: 0, subtotal: 0 };
  }
  const products = await prisma.product.findMany({
    where: { id: { in: lines.map((l) => l.productId) } },
  });
  const byId = Object.fromEntries(products.map((p) => [p.id, p]));
  const items = lines.flatMap((line) => {
    const product = byId[line.productId];
    if (!product) return [];
    const quantity = Math.min(line.quantity, Math.max(product.stock, 0) || line.quantity);
    const price = Number(product.price);
    return [
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        image: product.image,
        price,
        quantity,
        stock: product.stock,
        lineTotal: price * quantity,
      },
    ];
  });
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  return { items, count, subtotal };
}

export async function GET() {
  const lines = await readCart();
  return NextResponse.json(await serialize(lines));
}

export async function POST(request: Request) {
  const body = await request.json();
  const action = body.action as "add" | "set" | "remove";
  const productId = String(body.productId ?? "");
  const quantity = Number(body.quantity ?? 1);
  let lines = await readCart();

  if (action === "remove") {
    lines = lines.filter((line) => line.productId !== productId);
  } else if (action === "set") {
    if (quantity <= 0) {
      lines = lines.filter((line) => line.productId !== productId);
    } else {
      const existing = lines.find((line) => line.productId === productId);
      if (existing) existing.quantity = quantity;
      else lines.push({ productId, quantity });
    }
  } else {
    const existing = lines.find((line) => line.productId === productId);
    if (existing) existing.quantity += quantity;
    else lines.push({ productId, quantity: Math.max(1, quantity) });
  }

  await writeCart(lines);
  return NextResponse.json(await serialize(lines));
}
