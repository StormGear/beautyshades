import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { formatGhs } from "@/lib/money";
import { deleteProduct } from "../actions";
import { AdminButton } from "@/components/AdminButton";

export const dynamic = "force-dynamic";
export const metadata = { title: "Products" };

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; stock?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const where = {
    ...(params.q
      ? { name: { contains: params.q, mode: "insensitive" as const } }
      : {}),
    ...(params.stock === "low" ? { stock: { gt: 0, lte: 2 } } : {}),
  };
  const products = await prisma.product.findMany({
    where,
    include: { category: true, _count: { select: { orderItems: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-pink">Catalog</p>
          <h1 className="mt-2 font-serif text-4xl">Products</h1>
        </div>
        <Link href="/admin/products/new" className="rounded-full bg-pink px-5 py-2.5 text-[11px] font-semibold uppercase tracking-widest text-white">
          Add product
        </Link>
      </div>
      <form className="mt-6">
        <input name="q" defaultValue={params.q} placeholder="Search by name" className="underline-input max-w-sm" />
      </form>
      <div className="mt-6 overflow-x-auto rounded-2xl bg-white ring-1 ring-black/5">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-blush text-[11px] uppercase tracking-widest text-muted">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t border-black/5">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={product.image} alt="" className="h-12 w-10 rounded object-cover" />
                    <div>
                      <Link href={`/admin/products/${product.id}`} className="font-medium">
                        {product.name}
                      </Link>
                      {product.featured && <p className="text-[10px] uppercase tracking-widest text-pink">Featured</p>}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted">{product.category.name}</td>
                <td className="px-4 py-3">{formatGhs(Number(product.price))}</td>
                <td className="px-4 py-3">{product.stock <= 0 ? "Sold out" : product.stock}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/products/${product.id}`} className="mr-4 text-[11px] uppercase tracking-widest">
                    Edit
                  </Link>
                  {product._count.orderItems === 0 && (
                    <form action={deleteProduct} className="inline">
                      <input type="hidden" name="id" value={product.id} />
                      <AdminButton
                        type="submit"
                        variant="danger"
                        className="text-[11px] uppercase tracking-widest text-red-600 hover:text-red-700"
                        confirmMessage="Are you sure you want to delete this frame?"
                        loadingText="Deleting…"
                      >
                        Delete
                      </AdminButton>
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
