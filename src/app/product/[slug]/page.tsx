import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatGhs, percentOff } from "@/lib/money";
import { AddToCart } from "@/components/AddToCart";
import { ProductCard } from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });
  if (!product) notFound();

  const related = await prisma.product.findMany({
    where: { categoryId: product.categoryId, id: { not: product.id } },
    take: 4,
  });
  const off = percentOff(product.price, product.compareAt);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="grid items-start gap-12 lg:grid-cols-2">
        <div className="product-frame relative aspect-[4/5]">
          <img src={product.image} alt={product.name} className="absolute inset-0 h-full w-full object-cover" />
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-pink">{product.category.name}</p>
          <h1 className="mt-3 font-serif text-5xl">{product.name}</h1>
          <div className="mt-5 flex items-baseline gap-3">
            <p className="text-lg">{formatGhs(Number(product.price))}</p>
            {product.compareAt && Number(product.compareAt) > Number(product.price) && (
              <p className="text-muted line-through">{formatGhs(Number(product.compareAt))}</p>
            )}
            {off && <span className="rounded-full bg-pink px-2 py-0.5 text-[10px] font-semibold text-white">-{off}%</span>}
          </div>
          <p className="mt-6 max-w-md text-sm leading-7 text-muted">{product.description}</p>
          <p className="mt-4 text-xs uppercase tracking-widest text-muted">
            {product.stock <= 0 ? "Sold out" : product.stock <= 2 ? `Only ${product.stock} left` : `${product.stock} in stock`}
          </p>
          <div className="mt-8">
            <AddToCart productId={product.id} disabled={product.stock <= 0} />
          </div>
        </div>
      </div>
      {related.length > 0 && (
        <section className="mt-24">
          <h2 className="font-serif text-3xl">You may also like</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item) => (
              <ProductCard
                key={item.id}
                product={{
                  name: item.name,
                  slug: item.slug,
                  image: item.image,
                  price: Number(item.price),
                  compareAt: item.compareAt ? Number(item.compareAt) : null,
                  stock: item.stock,
                }}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
