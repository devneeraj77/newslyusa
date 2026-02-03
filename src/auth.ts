import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { Provider } from "next-auth/providers";
import db from "@/lib/prisma";
import { authConfig } from "./auth.config";
import bcrypt from "bcryptjs";

const providers: Provider[] = [
  Credentials({
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    authorize: async (credentials) => {
      if (!credentials?.email || !credentials?.password) {
        return null;
      }

      const user = await db.admin.findUnique({
        where: {
          email: credentials.email as string,
        },
      });

      if (!user) {
        return null;
      }

      const passwordsMatch = await bcrypt.compare(
        credentials.password as string,
        user.password,
      );

      if (!passwordsMatch) {
        return null;
      }

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        image: null,
      };
    },
  }),
  ...authConfig.providers,
];

export const providerMap = providers
  .map((provider) => {
    if (typeof provider === "function") {
      const providerData = provider();
      return { id: providerData.id, name: providerData.name };
    } else {
      return { id: provider.id, name: provider.name };
    }
  })
  .filter((provider) => provider.id !== "credentials");

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers,
});
