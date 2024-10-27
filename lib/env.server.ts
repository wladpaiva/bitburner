import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const {
  EFI_CLIENT_ID,
  EFI_CLIENT_SECRET,
  EFI_PIX_CHAVE,
  EFI_WEBHOOK_SECRET,
} = createEnv({
  // Skip server env validation during build
  skipValidation: process.env.SKIP_ENV_VALIDATION === "true",
  server: {
    EFI_CLIENT_ID: z.string().min(1),
    EFI_CLIENT_SECRET: z.string().min(1),
    EFI_PIX_CHAVE: z.string().min(1),
    EFI_WEBHOOK_SECRET: z.string().min(1),
  },
  experimental__runtimeEnv: process.env,
});
