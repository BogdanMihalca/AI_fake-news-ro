import { NextRequest } from "next/server";
import authConfig from "./auth.config";
import NextAuth from "next-auth";
export { auth as middleware } from "@/auth";

// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
const { auth } = NextAuth(authConfig);
export default auth(async function middleware(req: NextRequest) {
  // Your custom middleware logic goes here
});
