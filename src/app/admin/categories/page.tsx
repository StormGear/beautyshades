import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { saveCategory } from "../actions";
import { AdminButton } from "@/components/AdminButton";

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
          <form key={category.id} action={saveCategory} className="rounded-2xl bg-white p-6 ring-1 ring-black/5">
            <input type="hidden" name="id" value={category.id} />
            <p className="text-xs text-muted">{category._count.products} products</p>
            <input name="name" required defaultValue={category.name} className="underline-input" />
            <input name="slug" defaultValue={category.slug} className="underline-input" />
            <input name="image" required defaultValue={category.image} className="underline-input" />
            <textarea name="description" defaultValue={category.description ?? ""} rows={3} className="underline-input resize-none" />
            <AdminButton
              type="submit"
              className="mt-4 rounded-full bg-ink px-5 py-2 text-[11px] font-semibold uppercase tracking-widest text-white hover:bg-ink/90"
              loadingText="Saving…"
            >
              Save
            </AdminButton>
          </form>
        ))}
        <form action={saveCategory} className="rounded-2xl bg-white p-6 ring-1 ring-black/5">
          <p className="font-serif text-2xl">New category</p>
          <input name="name" required placeholder="Name *" className="underline-input" />
          <input name="slug" placeholder="Slug" className="underline-input" />
          <input name="image" required placeholder="Image URL *" className="underline-input" />
          <textarea name="description" placeholder="Description" rows={3} className="underline-input resize-none" />
          <AdminButton
            type="submit"
            className="mt-4 rounded-full bg-pink px-5 py-2 text-[11px] font-semibold uppercase tracking-widest text-white hover:bg-pink/90"
            loadingText="Creating…"
          >
            Create
          </AdminButton>
        </form>
      </div>
    </div>
  );
}
