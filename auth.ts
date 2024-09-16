import NextAuth, { NextAuthConfig } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";

import Google from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { getUserFromDb, isSamePassword } from "./app/api/auth/utils";
import { v4 as uuid } from "uuid";
import { encode as defaultEncode } from "next-auth/jwt";
import { cookies } from "next/headers";
import prisma from "./lib/prisma";

export const options: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [
    Google,
    CredentialsProvider({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        let user = null;

        try {
          //validate schema without using zod
          if (!credentials.email || !credentials.password) {
            return null;
          }

          user = await getUserFromDb(credentials.email as string);
          if (!user) {
            return null;
          }
          const isValid = await isSamePassword(
            (credentials.password as string) || "",
            (user.password as string) || "_"
          );

          if (!isValid) {
            return null;
          }

          return user;
        } catch (error) {
          return null;
        }
      },
    }),
  ],
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
};

export const { auth, handlers, signIn, signOut } = NextAuth(options);
