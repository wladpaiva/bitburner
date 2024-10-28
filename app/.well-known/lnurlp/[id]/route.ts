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

  const headersList = await headers();
  const domain = headersList.get("x-forwarded-host") || "";
  const protocol = headersList.get("x-forwarded-proto") || "";

  const result = {
    status: "OK",
    tag: "payRequest",
    callback: `${protocol}://${domain}/api/lnurl/payreq/${burnerWallet.id}`,
    maxSendable: 250_000_000,
    minSendable: 1_000,
    metadata: JSON.stringify([
      ["text/plain", `Pay ${burnerWallet.id} on Bitburner`],
      ["text/identifier", `${burnerWallet.id}@${domain}`],
    ]),
  };

  console.log("🔥", result);

  return NextResponse.json(result);
}
