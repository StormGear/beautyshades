import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { AdminProductForm } from "@/components/AdminProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { _count: { select: { orderItems: true } } },
  });
  if (!product) notFound();

  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-pink">Catalog</p>
      <h1 className="mt-2 font-serif text-4xl">Edit {product.name}</h1>
      <AdminProductForm
        canDelete={product._count.orderItems === 0}
        product={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          description: product.description,
          image: product.image,
          price: Number(product.price),
          compareAt: product.compareAt ? Number(product.compareAt) : null,
          stock: product.stock,
          featured: product.featured,
          categoryId: product.categoryId,
        }}
      />
    </div>
  );
}
