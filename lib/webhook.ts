import { headers } from "next/headers";
import crypto from "crypto";

const FALLBACK_IP_ADDRESS = "0.0.0.0";

export async function getIp(): Promise<string> {
  const cookies = await headers();
  const forwardedFor = cookies.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0] ?? FALLBACK_IP_ADDRESS;
  }

  return cookies.get("x-real-ip") ?? FALLBACK_IP_ADDRESS;
}

export function validateHmac(url: string, secret: string): boolean {
  const [, queryString] = url.split("?");
  const params = new URLSearchParams(queryString);
  const hmac = params.get("hmac");

  if (!hmac) return false;

  const calculatedHmac = crypto
    .createHmac("sha256", secret)
    .update("efibank")
    .digest("hex");

  return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(calculatedHmac));
}
