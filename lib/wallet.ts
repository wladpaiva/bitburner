import { notFound } from "next/navigation";
import { prisma } from "./prisma";

export const getWallet = async (id: string) => {
  const wallet = await prisma.burnerWallet.findUnique({
    where: {
      id,
    },
  });

  return wallet;
};

export const requireWallet = async (id: string) => {
  const wallet = await getWallet(id);
  if (!wallet) {
    notFound();
  }
  return wallet;
};

export const getWalletByUsername = async (username: string) => {
  const wallet = await prisma.burnerWallet.findUnique({
    where: {
      username,
    },
  });

  return wallet;
};

export const requireWalletByUsername = async (username: string) => {
  const wallet = await getWalletByUsername(username);
  if (!wallet) {
    notFound();
  }
  return wallet;
};
