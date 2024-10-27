import { NextRequest, NextResponse } from "next/server";
import { EFI_WEBHOOK_SECRET } from "@/lib/env.server";
import { getIp, validateHmac } from "@/lib/webhook";

export const dynamic = "force-dynamic";

const EFI_BANK_IP = "34.193.116.226";

export async function POST(request: NextRequest) {
  try {
    // Verificar o IP de origem
    if (process.env.NODE_ENV === "production") {
      const clientIp = await getIp();
      if (clientIp !== EFI_BANK_IP) {
        console.error(`Unauthorized IP: ${clientIp}`);
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      }
    }

    // Validar o HMAC
    const requestUrl = request.url;
    if (!validateHmac(requestUrl, EFI_WEBHOOK_SECRET)) {
      console.error(`Invalid HMAC for URL: ${requestUrl}`);
      return NextResponse.json({ error: "Invalid HMAC" }, { status: 403 });
    }

    const body = (await request.json()) as {
      evento: "teste_webhook";
      data_criacao: string;
    };

    console.log("Received webhook:", body);

    return NextResponse.json(
      { message: "Webhook received successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
