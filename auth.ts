import NextAuth, { NextAuthConfig } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "./auth.config";
import prisma from "./lib/prisma";

export const options: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  debug: process.env.NODE_ENV !== "production" ? true : false,
  session: { strategy: "jwt" },
  ...authConfig,
};

export const { auth, handlers, signIn, signOut } = NextAuth(options);
