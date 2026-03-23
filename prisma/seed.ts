import { PrismaClient } from "@prisma/client";
import { PERSPECTIVE_BADGES } from "../src/lib/badges";

const prisma = new PrismaClient();

async function main() {
  for (const b of PERSPECTIVE_BADGES) {
    await prisma.badge.upsert({
      where: { slug: b.slug },
      create: {
        slug: b.slug,
        label: b.label,
        tagline: b.tagline,
        variant: b.variant,
        sortOrder: b.sortOrder,
      },
      update: {
        label: b.label,
        tagline: b.tagline,
        variant: b.variant,
        sortOrder: b.sortOrder,
      },
    });
  }
}

main()
  .then(() => {
    console.log("Seeded perspective badges.");
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => void prisma.$disconnect());
