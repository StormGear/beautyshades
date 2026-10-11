import { prisma } from "@/lib/prisma";
import { AdminProductFields } from "@/components/AdminProductFields";

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
    <AdminProductFields
      canDelete={canDelete}
      categories={categories.map((category) => ({ id: category.id, name: category.name }))}
      product={
        product
          ? {
              ...product,
              compareAt: product.compareAt ?? "",
            }
          : undefined
      }
    />
  );
}
