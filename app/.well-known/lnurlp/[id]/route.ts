import { NEXT_PUBLIC_URL } from "@/lib/env.client";
import { prisma } from "@/lib/prisma";
import { requireWallet } from "@/lib/wallet";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const burnerWallet = await requireWallet(id);

  const result = {
    status: "OK",
    tag: "payRequest",
    callback: `${NEXT_PUBLIC_URL}/api/lnurl/payreq/${burnerWallet.id}`,
    maxSendable: 250_000_000,
    minSendable: 1_000,
    metadata: JSON.stringify([
      ["text/plain", `Pay ${burnerWallet.id} on Bitburner`],
      [
        "text/identifier",
        `${burnerWallet.id}@${new URL(NEXT_PUBLIC_URL).host}`,
      ],
    ]),
  };

  console.log("🔥", result);

  return NextResponse.json(result);
}
