import { lnbits } from "@/lib/lnbits";
import { fiatToSats, SPREAD_FACTOR } from "@/lib/price";
import { prisma } from "@/lib/prisma";
import { createHmac } from "@/lib/webhook";
import { WEBHOOK_SECRET } from "@/lib/env.server";
import { headers } from "next/headers";

const HMAC = createHmac(WEBHOOK_SECRET, "lnbits");
const EXPIRATION_TIME = 10 * 60; // 10 minutes

export async function createInvoice({
  amount,
  pixType,
  pixKey,
  refundLnAddress,
}: {
  amount: number;
  pixType: string;
  pixKey: string;
  refundLnAddress?: string;
}) {
  const headersList = await headers();
  const domain = headersList.get("x-forwarded-host") || "";
  const protocol = headersList.get("x-forwarded-proto") || "";

  const sats = await fiatToSats(amount, "BRL");
  const amountSats = Math.round(sats * (1 + SPREAD_FACTOR));

  const lightningInvoice = await lnbits.wallet.createInvoice({
    out: false,
    amount: amountSats,
    memo: `🔥 sats for ${(amount / 100).toFixed(2)} BRL`,

    // @ts-expect-error -- missing types on lnbits but it's there on the api docs
    expiry: EXPIRATION_TIME,
    webhook: `${protocol}://${domain}/api/webhook/lnbits?hmac=${HMAC}`,
  });

  // criar uma invoice com o pix
  const invoice = await prisma.invoice.create({
    data: {
      amountFiat: amount,
      amountSats,
      pixType,
      pixKey,
      expiresAt: new Date(Date.now() + 1000 * EXPIRATION_TIME),
      paymentHash: lightningInvoice.payment_hash,
      paymentRequest: lightningInvoice.payment_request,
      refundLnAddress,
    },
  });

  return invoice;
}
