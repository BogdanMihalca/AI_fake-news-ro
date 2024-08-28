// prisma.ts

import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

export default prisma;

//export the type of the prisma client
export type Prisma = PrismaClient;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
