import { createInvoice } from "@/lib/invoice";
import { invoiceSchema } from "@/schemas/pix";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const parsed = invoiceSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const invoice = await createInvoice(parsed.data);

  return NextResponse.json(invoice);
}
