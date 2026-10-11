import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { AdminCategoryForm } from "@/components/AdminCategoryForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Categories" };

export default async function AdminCategoriesPage() {
  await requireAdmin();
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-pink">Catalog</p>
      <h1 className="mt-2 font-serif text-4xl">Categories</h1>
      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        {categories.map((category) => (
          <AdminCategoryForm
            key={category.id}
            productCount={category._count.products}
            category={{
              id: category.id,
              name: category.name,
              slug: category.slug,
              image: category.image,
              description: category.description,
            }}
          />
        ))}
        <AdminCategoryForm />
      </div>
    </div>
  );
}
