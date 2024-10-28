import { LNBITS_ADMIN_KEY, LNBITS_ENDPOINT } from "@/lib/env.server";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Create a new wallet on LNBits
    const response = await fetch(`${LNBITS_ENDPOINT}/api/v1/wallet`, {
      method: "POST",
      headers: new Headers({
        "X-Api-Key": LNBITS_ADMIN_KEY,
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        name: `Wallet ${new Date().toISOString()}`,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create wallet: ${response.statusText}`);
    }

    const wallet = (await response.json()) as {
      id: string;
      name: string;
      adminkey: string;
      inkey: string;
      balance_msat: number;
      user: string;
      currency: string | null;
      deleted: boolean;
      created_at: number;
      updated_at: number;
    };

    // Save the wallet to the database
    await prisma.burnerWallet.create({
      data: {
        id: wallet.id,
        name: wallet.name,
        adminKey: wallet.adminkey,
        invoiceKey: wallet.inkey,
        balanceMsat: wallet.balance_msat,
        userId: wallet.user,
        currency: wallet.currency,
        deleted: wallet.deleted,
        createdAt: new Date(wallet.created_at * 1000),
        updatedAt: new Date(wallet.updated_at * 1000),
      },
    });

    // Redirect to the new wallet page
    const url = request.nextUrl.clone();
    url.pathname = `/w/${wallet.id}`;
    return NextResponse.redirect(url, {
      status: 302,
    });
  } catch (error) {
    console.error("Error creating wallet:", error);
    return NextResponse.json(
      { error: "Failed to create wallet" },
      { status: 500 }
    );
  }
}
