import { prisma } from "@/lib/prisma";
import { saveProduct } from "@/app/admin/actions";
import { ProductImageUpload } from "@/components/ProductImageUpload";

import { AdminButton } from "@/components/AdminButton";
import { deleteProduct } from "@/app/admin/actions";

type ProductValues = {
  id?: string;
  name?: string;
  slug?: string;
  description?: string;
  image?: string;
  price?: number;
  compareAt?: number | null;
  stock?: number;
  featured?: boolean;
  categoryId?: string;
};

export async function AdminProductForm({
  product,
  canDelete = false,
}: {
  product?: ProductValues;
  canDelete?: boolean;
}) {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  return (
    <form action={saveProduct} className="mt-8 max-w-2xl space-y-5">
      {product?.id && <input type="hidden" name="id" value={product.id} />}
      <input name="name" required defaultValue={product?.name} placeholder="Name *" className="underline-input" />
      <input name="slug" defaultValue={product?.slug} placeholder="Slug (optional)" className="underline-input" />
      <textarea
        name="description"
        required
        defaultValue={product?.description}
        rows={4}
        placeholder="Description *"
        className="underline-input resize-none"
      />
      <ProductImageUpload initialImage={product?.image} />
      <div className="grid gap-5 sm:grid-cols-3">
        <input name="price" required type="number" step="0.01" defaultValue={product?.price} placeholder="Price *" className="underline-input" />
        <input
          name="compareAt"
          type="number"
          step="0.01"
          defaultValue={product?.compareAt ?? ""}
          placeholder="Compare at"
          className="underline-input"
        />
        <input name="stock" type="number" defaultValue={product?.stock ?? 0} placeholder="Stock" className="underline-input" />
      </div>
      <select name="categoryId" required defaultValue={product?.categoryId ?? ""} className="underline-input bg-transparent">
        <option value="">Category *</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="featured" defaultChecked={product?.featured} />
        Feature on homepage
      </label>
      <div className="flex flex-wrap items-center gap-4 pt-2">
        <AdminButton
          type="submit"
          className="rounded-full bg-ink px-8 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white hover:bg-ink/90 transition-all"
          loadingText="Saving product…"
        >
          Save product
        </AdminButton>
        {product?.id && canDelete && (
          <AdminButton
            type="submit"
            formAction={deleteProduct}
            variant="text"
            className="text-[11px] uppercase tracking-widest text-red-600 hover:text-red-700"
            confirmMessage="Are you sure you want to delete this frame? This action cannot be undone."
            loadingText="Deleting…"
          >
            Delete frame
          </AdminButton>
        )}
      </div>
    </form>
  );
}
