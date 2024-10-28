import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const { NEXT_PUBLIC_URL } = createEnv({
  client: {
    /**
     * The public URL of the app.
     */
    NEXT_PUBLIC_URL: z.string(),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
  },
});
