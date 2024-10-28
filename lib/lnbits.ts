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
