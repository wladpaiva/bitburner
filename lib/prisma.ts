import { PrismaClient } from "@prisma/client";

export type PixType = "cpf" | "cnpj" | "contaBanco" | "phone";

// ==============================
// Create the Prisma client

const prismaClientSingleton = () => {
  const client = new PrismaClient();

  return client.$extends({
    result: {
      invoice: {
        status: {
          needs: {
            lightningSettledAt: true,
            pixPaidAt: true,
          },
          compute(invoice) {
            if (invoice.lightningSettledAt) return "lightning-settled";
            if (invoice.pixPaidAt) return "completed";
            return "pending";
          },
        },
      },
    },
  });
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
