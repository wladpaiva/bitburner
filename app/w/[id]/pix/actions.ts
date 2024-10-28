"use server";
import { returnValidationErrors } from "next-safe-action";
import { createInvoice } from "@/lib/invoice";
import { getBurnerLnbits } from "@/lib/lnbits";
import { actionClient } from "@/lib/safe-action";
import { requireWallet } from "@/lib/wallet";
import { payPixActionSchema } from "@/schemas/pix";

export const payPixAction = actionClient
  .schema(payPixActionSchema)
  .action(async ({ parsedInput }) => {
    const wallet = await requireWallet(parsedInput.walletId);
    const lnbits = getBurnerLnbits(wallet);
    const balance = await lnbits.wallet.getBalance();

    const invoice = await createInvoice(parsedInput);

    if (invoice.amountSats > balance.sats) {
      returnValidationErrors(payPixActionSchema, {
        amount: {
          _errors: ["Insufficient balance"],
        },
      });
    }

    console.log("[DEBUG] Paying invoice");
    await lnbits.wallet.payInvoice({
      bolt11: invoice.paymentRequest,
      out: true,
    });

    return {
      success: false,
    };
  });
