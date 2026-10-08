import { prisma } from "@/lib/prisma";

export const metadata = { title: "About" };

export default async function AboutPage() {
  const [featuredProduct, category, fallbackProduct] = await Promise.all([
    prisma.product.findFirst({
      where: { featured: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findFirst({
      where: { slug: "frames" },
    }),
    prisma.product.findFirst({
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const showcaseImage =
    featuredProduct?.image || fallbackProduct?.image || category?.image || "/logo1.jpeg";

  return (
    <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 lg:grid-cols-2">
      <div className="max-w-xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gold">Our Vision</p>
        <h1 className="mt-4 font-serif text-5xl leading-tight">
          To Serve You,
          <br />
          <span className="italic text-gold">To Comfort You.</span>
        </h1>

        <p className="mt-8 text-sm leading-7 text-muted">
          At Beauty Shades, we believe that glasses are more than just vision essentials — they are a statement of
          style and confidence. Our mission is to provide high-quality, fashionable eyewear that combines
          comfort, durability, and modern design.
        </p>
        <p className="mt-5 text-sm leading-7 text-muted">
          We carefully select frames that suit different personalities and lifestyles, ensuring that everyone
          can find the perfect pair. Whether you&apos;re looking for trendy fashion glasses or everyday
          eyewear, Beauty Shades is committed to delivering products that enhance both your vision and your style.
        </p>
        <blockquote className="mt-8 border-t border-black/10 pt-6 italic text-muted">
          &quot;Our goal is simple: to make stylish, reliable eyewear accessible to everyone.&quot;
        </blockquote>
      </div>
      <div className="relative min-h-[420px] overflow-hidden rounded-2xl bg-blush">
        <img
          src={showcaseImage}
          alt="Beauty Shades quality frames"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </section>
  );
}
