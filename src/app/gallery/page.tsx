import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ProductCard";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 12;

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page ?? 1));
  const categorySlug = params.category;

  const where = categorySlug ? { category: { slug: categorySlug } } : {};
  const [total, products, categories] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const active = categorySlug ?? "all";

  return (
    <div className="bg-gradient-to-b from-[#fff7fa] to-white pb-20">
      <div className="mx-auto max-w-7xl px-6 pt-16 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-pink">The Collection</p>
        <h1 className="mt-3 font-serif text-5xl md:text-6xl">All Frames.</h1>
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          <FilterChip href="/gallery" active={active === "all"}>
            All
          </FilterChip>
          {categories.map((category) => (
            <FilterChip
              key={category.id}
              href={`/gallery?category=${category.slug}`}
              active={active === category.slug}
            >
              {category.name}
            </FilterChip>
          ))}
        </div>
      </div>
      <div className="mx-auto mt-14 grid max-w-7xl gap-6 px-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={{
              name: product.name,
              slug: product.slug,
              image: product.image,
              price: Number(product.price),
              compareAt: product.compareAt ? Number(product.compareAt) : null,
              stock: product.stock,
            }}
          />
        ))}
      </div>
      <div className="mt-14 flex items-center justify-center gap-6 text-[11px] font-semibold uppercase tracking-[0.18em]">
        {page > 1 ? (
          <Link href={`/gallery?${query(categorySlug, page - 1)}`}>Previous</Link>
        ) : (
          <span className="text-muted">Previous</span>
        )}
        <span>
          Page {page} of {pages}
        </span>
        {page < pages ? (
          <Link href={`/gallery?${query(categorySlug, page + 1)}`}>Next</Link>
        ) : (
          <span className="text-muted">Next</span>
        )}
      </div>
    </div>
  );
}

function query(category: string | undefined, page: number) {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (page > 1) params.set("page", String(page));
  return params.toString();
}

function FilterChip({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] ${
        active ? "bg-ink text-white" : "bg-white text-ink ring-1 ring-black/10"
      }`}
    >
      {children}
    </Link>
  );
}
