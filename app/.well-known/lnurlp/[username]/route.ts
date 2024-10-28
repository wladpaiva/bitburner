import { NEXT_PUBLIC_URL } from "@/lib/env.client";
import { requireWalletByUsername } from "@/lib/wallet";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;

  const burnerWallet = await requireWalletByUsername(username);

  const result = {
    status: "OK",
    tag: "payRequest",
    callback: `${NEXT_PUBLIC_URL}/api/lnurl/payreq/${burnerWallet.username}`,
    maxSendable: 250_000_000,
    minSendable: 1_000,
    metadata: JSON.stringify([
      ["text/plain", `Pay on Bitburner`],
      [
        "text/identifier",
        `${burnerWallet.username}@${new URL(NEXT_PUBLIC_URL).host}`,
      ],
    ]),
  };

  return NextResponse.json(result);
}
