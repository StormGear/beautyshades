import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const categoryMeta = {
  frames: {
    name: "Prescription Glasses",
    description: "Hand-selected frames for everyday comfort and unmistakable style.",
    image:
      "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&q=80&w=1200",
  },
  sunglasses: {
    name: "Sunglasses",
    description: "Sun-ready silhouettes that finish a look with modern confidence.",
    image:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=1200",
  },
  lenses: {
    name: "Lenses",
    description: "Photochromic and blue-light lenses custom-crafted to your prescription.",
    image:
      "https://images.unsplash.com/photo-1483416796010-9483cc70eb90?auto=format&fit=crop&q=80&w=1200",
  },
  accessories: {
    name: "Lens Care",
    description: "Cleaners and essentials to keep every pair crystal clear.",
    image:
      "https://images.unsplash.com/photo-1582142306909-195724d33ffc?auto=format&fit=crop&q=80&w=1200",
  },
} as const;

async function main() {
  const categories = await Promise.all(
    Object.entries(categoryMeta).map(([slug, meta]) =>
      prisma.category.upsert({
        where: { slug },
        update: { ...meta },
        create: { slug, ...meta },
      }),
    ),
  );

  const existingAnnouncements = await prisma.announcement.count();
  if (existingAnnouncements === 0) {
    await prisma.announcement.createMany({
      data: [
        {
          label: "Special Offer",
          text: "Flash Offer: Enjoy up to 25% off selected luxury frames & sunglasses this week!",
          href: "/gallery",
          cta: "Shop Collection",
          order: 1,
          active: true,
        },
        {
          label: "Free Delivery",
          text: "Complimentary door-to-door delivery across Cape Coast on all orders above GHS 500.",
          href: "/contact",
          cta: "Order Now",
          order: 2,
          active: true,
        },
        {
          label: "Prescription",
          text: "Upload your prescription online for precision custom-crafted optical lenses.",
          href: "/prescription",
          cta: "Upload Prescription",
          order: 3,
          active: true,
        },
      ],
    });
    console.log("Seeded 3 initial announcements.");
  }

  console.log(`Seeded ${categories.length} categories.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });

