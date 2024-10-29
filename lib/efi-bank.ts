import EfiPay from "sdk-node-apis-efi";
import {
  EFI_CLIENT_ID,
  EFI_CLIENT_SECRET,
  EFI_CERTIFICATE,
} from "./env.server";

export const efibank = new EfiPay({
  sandbox: false,
  client_id: EFI_CLIENT_ID,
  client_secret: EFI_CLIENT_SECRET,
  certificate: EFI_CERTIFICATE,
  cert_base64: true,
});
