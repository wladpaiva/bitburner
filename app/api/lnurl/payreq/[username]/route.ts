import { NextRequest, NextResponse } from "next/server";
import { requireWalletByUsername } from "@/lib/wallet";
import { getBurnerLnbits } from "@/lib/lnbits";
import { z } from "zod";

const schema = z.object({
  amount: z.coerce.number().min(1000).max(10_000_000),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    const { searchParams } = new URL(request.url);
    const parsed = schema.safeParse(Object.fromEntries(searchParams));

    if (!parsed.success) {
      return NextResponse.json({
        status: "ERROR",
        reason: "Missing or invalid amount parameter",
        error: parsed.error.flatten(),
      });
    }

    const amountMsats = parsed.data.amount;

    // Get wallet and verify it exists
    const wallet = await requireWalletByUsername(username);
    const lnbits = getBurnerLnbits(wallet);

    const invoice = await lnbits.wallet.createInvoice({
      out: false,
      amount: amountMsats,
      memo: ``,
      //   metadata: [
      //     ["text/plain", `Payment to ${wallet.username}`],
      //     ["text/identifier", `${wallet.username}@${request.headers.get("host")}`],
      //   ]
    });

    return NextResponse.json({
      status: "OK",
      //   successAction: {
      //     tag: "message",
      //     message: "Thanks, sats received!",
      //   },
      pr: invoice.payment_request,
      routes: [],
      //     "verify": "https://getalby.com/lnurlp/bamotf/verify/TATx2zfqN11eADRpKo6kBQCX",
    });
  } catch (error) {
    console.error("Error creating invoice:", error);
    return NextResponse.json({
      status: "ERROR",
      reason: "Internal server error",
    });
  }
}
