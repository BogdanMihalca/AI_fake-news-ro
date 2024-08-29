import NextAuth, { NextAuthConfig } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import Google from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";
import { getUserFromDb, isSamePassword } from "./app/api/auth/utils";

const prisma = new PrismaClient();

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
        console.log("credentials server --------->", credentials);

        let user = null;

        try {
          //validate with zod schema
          const schema = z.object({
            email: z.string().email(),
            password: z.string(),
          });
          schema.parse(credentials);

          user = await getUserFromDb(credentials.email as string);
          if (!user) {
            return null;
          }
          const isValid = await isSamePassword(
            (credentials.password as string) || "",
            (user.password as string) || "_"
          );

          console.log("isValid----------->", isValid);

          if (!isValid) {
            return null;
          }

          return user;
        } catch (error) {
          console.log("-------------------->", error);
          return null;
        }
      },
    }),
  ],
  // callbacks: {
  //   authorized({ request, auth }) {
  //     const { pathname } = request.nextUrl;
  //     if (pathname === "/middleware-example") return !!auth;
  //     return true;
  //   },
  //   jwt({ token, trigger, session, account }) {
  //     if (trigger === "update") token.name = session.user.name;
  //     if (account?.provider === "keycloak") {
  //       return { ...token, accessToken: account.access_token };
  //     }
  //     return token;
  //   },
  // },
  debug: process.env.NODE_ENV !== "production" ? true : false,
  session: {
    strategy: "jwt",
    maxAge: 1 * 24 * 60 * 60, // 1 day
  },
};

export const { auth, handlers, signIn, signOut } = NextAuth(options);
