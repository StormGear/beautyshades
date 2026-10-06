import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Hero } from "@/components/Hero";
import { CategoryTiles } from "@/components/CategoryTiles";
import { ProductCard } from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const featured = await prisma.product.findMany({
    where: { featured: true },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  return (
    <>
      <Hero />
      <div className="mt-6">
        <CategoryTiles />
      </div>
      <section className="mx-auto mt-24 max-w-6xl px-6 text-center">
        <h2 className="font-serif text-5xl md:text-6xl">The Edit.</h2>
        <div className="mx-auto mt-3 h-px w-10 bg-pink" />
        <p className="mt-4 italic text-muted">A curated selection of our most coveted frames.</p>
        <div className="mt-14 grid gap-10 md:grid-cols-2">
          {featured.slice(0, 6).map((product) => (
            <ProductCard
              key={product.id}
              layout="masonry"
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
        <Link
          href="/gallery"
          className="mt-12 inline-flex text-[11px] font-semibold uppercase tracking-[0.22em] underline underline-offset-8"
        >
          View Complete Collection
        </Link>
      </section>
      <section className="mx-auto mt-24 grid max-w-5xl gap-10 px-6 text-center sm:grid-cols-3">
        {[
          ["300+", "Happy Clients"],
          ["4+", "Years Curating"],
          ["24/7", "Dedicated Support"],
        ].map(([stat, label]) => (
          <div key={label}>
            <p className="font-serif text-5xl">{stat}</p>
            <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">{label}</p>
          </div>
        ))}
      </section>
    </>
  );
}
