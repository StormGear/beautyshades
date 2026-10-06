import { requireAdmin } from "@/lib/admin";
import { AdminProductForm } from "@/components/AdminProductForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "New product" };

export default async function NewProductPage() {
  await requireAdmin();
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-pink">Catalog</p>
      <h1 className="mt-2 font-serif text-4xl">New product</h1>
      <AdminProductForm />
    </div>
  );
}
