import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/submit-button";
import { requireWallet } from "@/lib/wallet";
import { getBurnerLnbits } from "@/lib/lnbits";
import { withdrawAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function WithdrawPage({
  params,
}: {
  params: { id: string };
}) {
  return <div>TBD</div>;
  // TODO: implementar ação de withdraw
  //   const wallet = await requireWallet(params.id);
  //   const lnbits = getBurnerLnbits(wallet);
  //   const balance = await lnbits.wallet.getBalance();

  //   return (
  //     <div className="container max-w-md mx-auto p-4 space-y-4">
  //       <Card>
  //         <CardHeader>
  //           <CardTitle>Withdraw</CardTitle>
  //         </CardHeader>
  //         <CardContent>
  //           <form action={withdrawAction} className="space-y-4">
  //             <input type="hidden" name="walletId" value={params.id} />

  //             <div className="space-y-2">
  //               <Label htmlFor="invoice">Lightning Invoice</Label>
  //               <Input
  //                 id="invoice"
  //                 name="invoice"
  //                 placeholder="lnbc..."
  //                 required
  //               />
  //             </div>

  //             <div className="text-sm text-muted-foreground">
  //               Available balance: {balance.sats.toLocaleString()} sats
  //             </div>

  //             <SubmitButton>Pay Invoice</SubmitButton>
  //           </form>
  //         </CardContent>
  //       </Card>
  //     </div>
  //   );
}
