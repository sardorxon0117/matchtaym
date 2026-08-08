import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";
import { CATEGORY_SEED } from "../src/lib/utils.ts";

const adapter = new PrismaPg(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Categories
  for (const cat of CATEGORY_SEED) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name },
      create: cat,
    });
  }
  console.log(`✔ ${CATEGORY_SEED.length} kategoriya tayyor`);

  // Admin user
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME ?? "Admin";

  if (email && password) {
    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.user.upsert({
      where: { email },
      update: { passwordHash, name, role: "ADMIN" },
      create: { email, name, passwordHash, role: "ADMIN" },
    });
    console.log(`✔ Admin foydalanuvchi tayyor: ${email}`);
  } else {
    console.warn("⚠ ADMIN_EMAIL / ADMIN_PASSWORD topilmadi, admin yaratilmadi");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
