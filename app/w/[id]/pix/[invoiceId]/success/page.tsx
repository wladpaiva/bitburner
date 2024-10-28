import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { numberFormatter } from "@/lib/format";

export default async function SuccessPage({
  params,
}: {
  params: Promise<{ id: string; invoiceId: string }>;
}) {
  const { id, invoiceId } = await params;

  const invoice = await prisma.invoice.findUnique({
    where: {
      id: invoiceId,
    },
  });

  if (!invoice || invoice.status !== "completed") {
    return notFound();
  }

  const formatter = numberFormatter({
    style: "currency",
    currency: "BRL",
  });

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" />
        <h1 className="mt-4 text-2xl font-semibold">Payment Confirmed!</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your {formatter.format(invoice.amountFiat / 100)} payment has been
          successfully processed
        </p>

        <div className="mt-6">
          <Button asChild>
            <Link href={`/w/${id}`}>Return to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
