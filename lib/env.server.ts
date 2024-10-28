import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const {
  EFI_CLIENT_ID,
  EFI_CLIENT_SECRET,
  EFI_PIX_CHAVE,
  WEBHOOK_SECRET,
  LNBITS_ADMIN_KEY,
  LNBITS_INVOICE_READ_KEY,
  LNBITS_ENDPOINT,
  PUSHER_APP_ID,
  PUSHER_SECRET,
} = createEnv({
  // Skip server env validation during build
  skipValidation: process.env.SKIP_ENV_VALIDATION === "true",
  server: {
    EFI_CLIENT_ID: z.string().min(1),
    EFI_CLIENT_SECRET: z.string().min(1),
    EFI_PIX_CHAVE: z.string().min(1),
    WEBHOOK_SECRET: z.string().min(1),
    LNBITS_ADMIN_KEY: z.string().min(1),
    LNBITS_INVOICE_READ_KEY: z.string().min(1),
    LNBITS_ENDPOINT: z.string().min(1),
    PUSHER_APP_ID: z.string().min(1),
    PUSHER_SECRET: z.string().min(1),
  },
  experimental__runtimeEnv: process.env,
});
