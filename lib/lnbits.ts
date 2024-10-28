import LNBits from "lnbits";
import {
  LNBITS_ADMIN_KEY,
  LNBITS_INVOICE_READ_KEY,
  LNBITS_ENDPOINT,
} from "@/lib/env.server";

export const lnbits = LNBits({
  adminKey: LNBITS_ADMIN_KEY,
  invoiceReadKey: LNBITS_INVOICE_READ_KEY,
  endpoint: LNBITS_ENDPOINT,
});

export const getBurnerLnbits = async (wallet: {
  adminKey: string;
  invoiceKey: string;
}) => {
  const lnbits = LNBits({
    adminKey: wallet.adminKey,
    invoiceReadKey: wallet.invoiceKey,
    endpoint: LNBITS_ENDPOINT,
  });

  // HACK: patch the lnbits lib
  return {
    ...lnbits,
    wallet: {
      ...lnbits.wallet,
      getTransactions: (): Promise<
        [
          {
            status: string;
            pending: boolean;
            checking_id: string;
            amount: number;
            fee: number;
            memo: string;
            time: number;
            bolt11: string;
            preimage: string;
            payment_hash: string;
            expiry: number;
            extra: object;
            wallet_id: string;
            webhook: string;
            webhook_status: number;
          }
        ]
      > => {
        return fetch(`${LNBITS_ENDPOINT}/api/v1/payments`, {
          headers: new Headers({
            "X-API-KEY": wallet.adminKey,
            "Content-Type": "application/json",
          }),
        }).then((res) => res.json());
      },
    },
  };
};
