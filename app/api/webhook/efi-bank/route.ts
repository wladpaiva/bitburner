import { NextRequest, NextResponse } from "next/server";
import { WEBHOOK_SECRET } from "@/lib/env.server";
import { getIp, validateHmac } from "@/lib/webhook";
import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher.server";

export const dynamic = "force-dynamic";

const EFI_BANK_IP = "34.193.116.226";

interface EfiPixTransaction {
  endToEndId: string;
  chave: string;
  tipo: "SOLICITACAO";
  status: "REALIZADO" | "DEVOLVIDO" | "NAO_REALIZADO";
  valor: string;
  horario: string;
  gnExtras: Record<string, unknown>;
}

export async function POST(request: NextRequest) {
  console.log("[EfiBank] Webhook received ");

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
    if (!validateHmac(requestUrl, WEBHOOK_SECRET, "efibank")) {
      console.error(`Invalid HMAC for URL: ${requestUrl}`);
      return NextResponse.json({ error: "Invalid HMAC" }, { status: 403 });
    }

    const body = await request.json();

    if (body.evento === "teste_webhook") {
      return NextResponse.json(
        { message: "Webhook received successfully" },
        { status: 200 }
      );
    }

    if ("pix" in body && Array.isArray(body.pix)) {
      await Promise.all(
        (body.pix as EfiPixTransaction[])
          .filter((pixTransaction) => pixTransaction.status === "REALIZADO")
          .map(async (pixTransaction) => {
            console.log(
              "[EfiBank] Payment sent and confirmed for",
              pixTransaction.endToEndId
            );

            const invoice = await prisma.invoice.update({
              where: {
                pixTransactionId: pixTransaction.endToEndId,
              },
              data: {
                pixPaidAt: new Date(pixTransaction.horario),
              },
            });

            await pusherServer.trigger(
              `pix-${invoice.id}`,
              "payment-confirmed",
              {}
            );

            return invoice;
          })
      );
    }

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
