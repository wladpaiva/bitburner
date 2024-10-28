import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowDownIcon, ArrowUpIcon, PixIcon } from "@/components/icons";
import Link from "next/link";
import { requireWallet } from "@/lib/wallet";
import { getBurnerLnbits } from "@/lib/lnbits";
import { getPrice } from "@/lib/price";
import { numberFormatter } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const wallet = await requireWallet(id);
  const lnbits = getBurnerLnbits(wallet);

  const balance = await lnbits.wallet.getBalance();
  const balanceInSats = balance.sats;
  const balanceInBTC = balance.btc;

  const price = await getPrice("BRL");
  const balanceBRL = Math.floor(balanceInBTC * price * 100) / 100;

  const formatter = numberFormatter({
    style: "currency",
    currency: "BRL",
  });

  const transactions = await lnbits.wallet.getTransactions();
  const filteredTransactions = transactions
    .filter((t) => t.status === "success")
    .map((transaction) => ({
      id: transaction.checking_id,
      type: transaction.amount > 0 ? "deposit" : "withdraw",
      amount: transaction.amount,
      memo: transaction.memo,
      date: new Date(transaction.time * 1000).toLocaleDateString(),
    }));

  return (
    <div className="container max-w-md mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm text-gray-500">
            Wallet Balance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-3xl font-bold">{formatter.format(balanceBRL)}</p>
          <p className="text-sm text-gray-500">
            {balanceInSats.toLocaleString("en-US", {
              maximumFractionDigits: 0,
            })}{" "}
            sats
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-3 gap-4 text-center">
        <Button
          variant="ghost"
          className="flex flex-col items-center space-y-2 h-auto"
          asChild
        >
          <Link href={`/w/${id}/pix`}>
            <div className="p-2 rounded-full bg-primary-foreground/10">
              <PixIcon className="h-6 w-6 text-white" />
            </div>
            Pix
          </Link>
        </Button>
        <Button
          variant="ghost"
          className="flex flex-col items-center space-y-2 h-auto"
          asChild
        >
          <Link href={`/w/${id}/deposit`}>
            <div className="p-2 rounded-full bg-primary-foreground/10">
              <ArrowDownIcon className="h-6 w-6 text-white" />
            </div>
            Deposit
          </Link>
        </Button>
        <Button
          variant="ghost"
          className="flex flex-col items-center space-y-2 h-auto"
          asChild
        >
          <Link href={`/w/${id}/withdraw`}>
            <div className="p-2 rounded-full bg-primary-foreground/10">
              <ArrowUpIcon className="h-6 w-6 text-white" />
            </div>
            Withdraw
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px]">
            <ul className="space-y-4">
              {filteredTransactions.length === 0 ? (
                <li className="text-center text-muted-foreground py-8">
                  No transactions yet
                </li>
              ) : (
                filteredTransactions.map((transaction) => (
                  <li
                    key={transaction.id}
                    className="flex justify-between items-center"
                  >
                    <div className="flex items-center">
                      {transaction.type === "deposit" ? (
                        <ArrowDownIcon className="mr-2 h-4 w-4 text-emerald-400" />
                      ) : (
                        <ArrowUpIcon className="mr-2 h-4 w-4 text-burnt" />
                      )}
                      <span>
                        {transaction.memo ??
                          (transaction.type === "deposit"
                            ? "Deposit"
                            : "Withdraw")}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span
                        className={
                          transaction.type === "deposit"
                            ? "text-primary-foreground"
                            : "text-burnt"
                        }
                      >
                        {(transaction.amount / 1000).toLocaleString("en-US", {
                          maximumFractionDigits: 0,
                          signDisplay: "always",
                        })}{" "}
                        sats
                      </span>
                      <span className="text-gray-500 text-sm">
                        {transaction.date}
                      </span>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
