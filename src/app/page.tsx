import { prisma } from "@/lib/prisma";
import { Hero } from "@/components/Hero";
import { CategoryTiles } from "@/components/CategoryTiles";
import { ProductCard } from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featured, latestProducts, categories] = await Promise.all([
    prisma.product.findMany({
      where: { featured: true },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  const displayProducts = featured.length > 0 ? featured : latestProducts;

  // Build Hero slides from uploaded products or categories in database
  const heroSlides =
    latestProducts.length > 0
      ? latestProducts.map((p) => ({
          src: p.image,
          alt: `${p.name} from Beauty Shades`,
        }))
      : categories.map((c) => ({
          src: c.image,
          alt: `${c.name} from Beauty Shades`,
        }));

  // Build category tiles from categories stored in database
  const categoryTiles = categories
    .filter((c) => ["frames", "sunglasses"].includes(c.slug))
    .map((c) => ({
      href: c.slug === "frames" ? "/prescription" : `/gallery?category=${c.slug}`,
      title: c.name,
      cta: c.slug === "frames" ? "Add Prescription" : "Shop Now",
      image: c.image,
    }));

  return (
    <>
      <Hero slides={heroSlides} />
      {categoryTiles.length > 0 && (
        <div className="mt-6">
          <CategoryTiles items={categoryTiles} />
        </div>
      )}
      <section className="mx-auto mt-24 max-w-6xl px-6 text-center">
        <h2 className="font-serif text-5xl md:text-6xl">The Edit.</h2>
        <div className="mx-auto mt-3 h-px w-10 bg-gold" />
        <p className="mt-4 italic text-muted">A curated selection of our most coveted frames.</p>
        <div className="mt-14 grid gap-10 md:grid-cols-2">
          {displayProducts.map((product) => (
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
      </section>
    </>
  );
}
