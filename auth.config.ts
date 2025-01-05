import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { getUserFromDb, isSamePassword } from "./app/api/auth/utils";
// Notice this is only an object, not a full Auth.js instance
export default {
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
} satisfies NextAuthConfig;
