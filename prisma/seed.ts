import { PrismaClient } from "@/generated/prisma/client"


const prisma = new PrismaClient()

async function main() {
  const password = 'password' // In a real app, this should be hashed!
  
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@newsly.com' },
    update: {},
    create: {
      email: 'admin@newsly.com',
      name: 'Admin User',
      password: password,
      role: 'ADMIN',
    },
  })

  console.log({ admin })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
