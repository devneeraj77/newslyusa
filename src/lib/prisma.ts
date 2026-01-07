import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { Prisma } from "@/generated/prisma/client"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(Prisma),
  providers: [],
})

