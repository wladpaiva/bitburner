import { lnbits } from "./lnbits";

/**
 * Creates a Lightning invoice for a Lightning Address.
 *
 * @param lnAddress - The Lightning Address in the format username@domain.com
 * @param amount - The amount in satoshis
 * @returns A BOLT11 payment request string
 *
 * @example
 * const bolt11 = await createLnAddressInvoice("satoshi@ln.tips", 1000);
 */
export async function createLnAddressInvoice(
  lnAddress: string,
  amount: number
) {
  const [username, domain] = lnAddress.split("@");

  // get random number from 0 to 100 to force cache clean
  const randomNumber = Math.floor(Math.random() * 100);

  const url = `https://${domain}/.well-known/lnurlp/${username}?cache=${randomNumber}`;
  const response = await fetch(url);
  const responseJson = await response.json();

  const { callback } = responseJson;
  const invoiceUrl = `${callback}?amount=${amount * 1000}`; // amount * 1000 to convert to milisatoshi

  const invoiceResponse = await fetch(invoiceUrl);
  const { pr } = await invoiceResponse.json();
  return pr;
}

/**
 * Pays a Lightning invoice for refunding purposes.
 *
 * @param bolt11 - The BOLT11 payment request string to pay
 * @returns The payment result from LNbits
 */
export async function refundInvoice(bolt11: string) {
  // TODO: move this to another place
  return await lnbits.wallet.payInvoice({
    bolt11,
    out: true,
  });
}
