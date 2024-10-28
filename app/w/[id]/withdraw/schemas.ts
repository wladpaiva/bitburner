import { z } from "zod";

export const withdrawSchema = z.object({
  walletId: z.string(),
  invoice: z.string().min(1),
});
