import { PrismaClient } from "@prisma/client";

// ==============================
// Create the Prisma client

const prismaClientSingleton = () => {
  const client = new PrismaClient();
  return client;
};

// ==============================
// Create the Prisma singleton

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

// create the singleton
export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

// reexport all types
export * from "@prisma/client";

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
