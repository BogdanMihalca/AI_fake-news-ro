// prisma.ts

import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool } from "@neondatabase/serverless";

const prismaClientSingleton = () => {
  const neon = new Pool({
    connectionString: process.env.POSTGRES_URL_NON_POOLING,
  });
  const adapter = new PrismaNeon(neon) as any;
  return new PrismaClient({ adapter });
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
