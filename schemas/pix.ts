import { z } from "zod";

export const pixSchema = z.object({
  // Amount in cents (BRL)
  amount: z.coerce
    .number()
    .min(1, "Amount must be at least 1 cent")
    .max(30, "Restricted to 0.30 BRL during testing"),

  pixKey: z.string().min(1, "Pix key is required"),
  pixType: z.enum(["cpf", "cnpj", "phone"], {
    errorMap: () => ({ message: "Please select a Pix type" }),
  }),
});

export const invoiceSchema = pixSchema.extend({
  refundLnAddress: z.string().optional(),
});

export const payPixActionSchema = pixSchema.extend({
  walletId: z.string().min(1, "Wallet ID is required"),
});
