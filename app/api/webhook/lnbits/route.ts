import { WEBHOOK_SECRET } from "@/lib/env.server";
import { payPix } from "@/lib/pix";
import { prisma } from "@/lib/prisma";
import { validateHmac } from "@/lib/webhook";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  console.log("[LNBits] Webhook received ");
  const payload = await request.json();

  if (!validateHmac(request.url, WEBHOOK_SECRET, "lnbits")) {
    console.error(`Invalid HMAC for URL: ${request.url}`);
    return NextResponse.json({ error: "Invalid HMAC" }, { status: 403 });
  }

  // Validate the payment data
  if (!payload.payment_hash || !payload.status) {
    return new NextResponse("Invalid payload", { status: 400 });
  }

  // Check if payment is settled
  if (payload.status !== "success") {
    return new NextResponse("Payment not settled", { status: 200 });
  }

  try {
    // Find and update the payment in database
    const payment = await prisma.invoice.findUnique({
      where: {
        paymentHash: payload.payment_hash,
      },
    });

    if (!payment) {
      return new NextResponse("Payment not found", { status: 404 });
    }

    console.log("[LNBits] Paying PIX");
    const result = await payPix(
      {
        chave: payment.pixKey,
      },
      payment.amountFiat
    );

    if (!payment) {
      return new NextResponse("Payment not found", { status: 404 });
    }

    console.log("[LNBits] Updating invoice");
    // Find and update the payment in database
    await prisma.invoice.update({
      where: {
        paymentHash: payload.payment_hash,
      },
      data: {
        pixTransactionId: result.e2eId,
        lightningSettledAt: new Date(),
      },
    });

    // Return success response
    return NextResponse.json({
      success: true,
      message: "Payment processed successfully",
    });
  } catch (error) {
    console.error("LNBits webhook error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
