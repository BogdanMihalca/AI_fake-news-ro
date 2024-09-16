import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";
import prisma from "@/lib/prisma";
import bcryptjs from "bcryptjs";
import { z } from "zod";

export default {
  providers: [
    Google,
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
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
} satisfies NextAuthConfig;

export async function saltAndHashPassword(password: string) {
  return bcryptjs.hash(password, 10);
}

export async function isSamePassword(password: string, hash: string) {
  return await bcryptjs.compare(password, hash);
}

export function getUserFromDb(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}
