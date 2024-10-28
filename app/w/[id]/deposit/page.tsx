import { notFound } from "next/navigation";
import { requireWallet } from "@/lib/wallet";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CopyButton } from "@/components/copy-button";
import { NEXT_PUBLIC_URL } from "@/lib/env.client";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

export default async function DepositPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const wallet = await requireWallet(id);

  if (!wallet) {
    notFound();
  }

  const lightningAddress = `${wallet.username}@${
    new URL(NEXT_PUBLIC_URL).host
  }`;

  return (
    <div className="container max-w-md mx-auto p-4">
      <Button variant="ghost" className="mb-4" asChild>
        <Link href={`/w/${id}`}>
          <ArrowLeftIcon className="h-6 w-6" />
        </Link>
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>Deposit Funds</CardTitle>
          <CardDescription>
            Send funds to your Lightning address to deposit into your wallet
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
            <span className="text-sm font-medium break-all">
              {lightningAddress}
            </span>
            <CopyButton value={lightningAddress} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
