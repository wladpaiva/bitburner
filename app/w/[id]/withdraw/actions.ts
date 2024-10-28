import { z } from "zod";
import { actionClient } from "@/lib/safe-action";
import { getBurnerLnbits } from "@/lib/lnbits";
import { requireWallet } from "@/lib/wallet";
import { withdrawSchema } from "./schemas";

export const withdrawAction = actionClient
  .schema(withdrawSchema)
  .action(async ({ parsedInput }) => {
    const wallet = await requireWallet(parsedInput.walletId);
    const lnbits = getBurnerLnbits(wallet);

    try {
      // Decode invoice to validate and get amount
      await lnbits.wallet.payInvoice({
        bolt11: parsedInput.invoice,
        out: true,
      });

      return { success: true };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("Failed to pay invoice");
    }
  });
