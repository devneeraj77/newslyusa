import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("password", 10);

  const admin = await prisma.admin.upsert({
    where: { email: "admin@newsly.com" },
    update: {
      password: password,
    },
    create: {
      email: "admin@newsly.com",
      name: "Admin User",
      password: password,
      role: "ADMIN",
    },
  });

  console.log({ admin });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
