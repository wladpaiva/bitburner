import { headers } from "next/headers";
import crypto from "crypto";

/**
 * Fallback IP address used when no valid IP can be determined
 */
const FALLBACK_IP_ADDRESS = "0.0.0.0";

/**
 * Gets the client IP address from request headers
 * @returns Promise resolving to the client IP address string
 */
export async function getIp(): Promise<string> {
  const cookies = await headers();
  const forwardedFor = cookies.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0] ?? FALLBACK_IP_ADDRESS;
  }

  return cookies.get("x-real-ip") ?? FALLBACK_IP_ADDRESS;
}

/**
 * Validates an HMAC signature in a URL query string
 * @param url - Full URL containing the HMAC parameter
 * @param secret - Secret key used to generate the HMAC
 * @param signature - Data that was signed
 * @returns boolean indicating if HMAC is valid
 */
export function validateHmac(
  url: string,
  secret: string,
  signature: string
): boolean {
  const [, queryString] = url.split("?");
  const params = new URLSearchParams(queryString);
  const hmac = params.get("hmac");

  if (!hmac) return false;

  const calculatedHmac = createHmac(secret, signature);

  return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(calculatedHmac));
}

/**
 * Creates an HMAC signature using SHA-256
 * @param secret - Secret key to use for signing
 * @param data - Data to sign
 * @returns Hex-encoded HMAC signature
 */
export function createHmac(secret: string, data: string): string {
  return crypto.createHmac("sha256", secret).update(data).digest("hex");
}
