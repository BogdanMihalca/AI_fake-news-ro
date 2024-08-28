import prisma from "@/lib/prisma";

import bcryptjs from "bcryptjs";

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
