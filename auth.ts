import NextAuth, { NextAuthConfig } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";

import { v4 as uuid } from "uuid";
import { encode as defaultEncode } from "next-auth/jwt";
import { cookies } from "next/headers";
import prisma from "./lib/prisma";
import authConfig from "./auth.config";

export const options: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  callbacks: {
    session({ session, user }) {
      session.user = user;
      return session;
    },
    async jwt({ token, account }) {
      if (account?.provider === "credentials") {
        token.credentials = true;
      }
      return token;
    },
  },
  jwt: {
    encode: async function (params) {
      if (params.token?.credentials) {
        const sessionToken = uuid();
        await prisma.session.create({
          data: {
            sessionToken,
            userId: params.token.sub as string,
            expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
          },
        });

        const cks = cookies();
        cks.set({
          name: "next-auth.session-token",
          value: sessionToken,
          expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        });

        return sessionToken;
      }
      return defaultEncode(params);
    },
  },
  debug: process.env.NODE_ENV !== "production" ? true : false,
  session: {
    strategy: "database",
    maxAge: 1 * 24 * 60 * 60, // 1 day
  },
  ...authConfig,
};

export const { auth, handlers, signIn, signOut } = NextAuth(options);
