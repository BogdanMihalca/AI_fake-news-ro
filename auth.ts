import NextAuth, { NextAuthConfig } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "./auth.config";
import prisma from "./lib/prisma";

export const options: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        // User is available during sign-in
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      return session;
    },
  },
  debug: process.env.NODE_ENV !== "production" ? true : false,
  session: { strategy: "jwt" },
  ...authConfig,
};

export const { auth, handlers, signIn, signOut } = NextAuth(options);
