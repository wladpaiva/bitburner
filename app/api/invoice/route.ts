import { lnbits } from "@/lib/lnbits";
import { fiatToSats, SPREAD_FACTOR } from "@/lib/price";
import { prisma } from "@/lib/prisma";
import { NEXT_PUBLIC_URL } from "@/lib/env.client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createHmac } from "@/lib/webhook";
import { WEBHOOK_SECRET } from "@/lib/env.server";

const HMAC = createHmac(WEBHOOK_SECRET, "lnbits");

export const dynamic = "force-dynamic";

const schema = z.object({
  // Amount in cents (BRL)
  amount: z.coerce.number(),
  pixKey: z.string(),
  pixType: z.enum(["cpf", "cnpj", "contaBanco", "phone"]),
});

export async function POST(request: NextRequest) {
  const body = await request.json();

  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { amount, pixKey, pixType } = parsed.data;

  const sats = await fiatToSats(amount, "BRL");
  const amountSats = Math.round(sats * (1 + SPREAD_FACTOR));

  const lightningInvoice = await lnbits.wallet.createInvoice({
    out: false,
    amount: amountSats,
    memo: `🔥 sats for ${(amount / 100).toFixed(2)} BRL`,

    // @ts-expect-error -- missing type on lnbits
    expiry: 600,
    webhook: `${NEXT_PUBLIC_URL}/api/webhook/lnbits?hmac=${HMAC}`,
  });

  // criar uma invoice com o pix
  const invoice = await prisma.invoice.create({
    data: {
      amountFiat: amount,
      amountSats,
      pixType,
      pixKey,
      expiresAt: new Date(Date.now() + 1000 * 60 * 10), // 10 min
      paymentHash: lightningInvoice.payment_hash,
    },
  });

  return NextResponse.json({
    amountSats,
    paymentHash: lightningInvoice.payment_hash,
    paymentRequest: lightningInvoice.payment_request,
    id: invoice.id,
  });
}
