"use client";

import {
  NEXT_PUBLIC_PUSHER_CLUSTER,
  NEXT_PUBLIC_PUSHER_KEY,
} from "@/lib/env.client";
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Pusher from "pusher-js";
import { useEffect } from "react";

export default function PendingPage() {
  const params = useParams<{ id: string; invoiceId: string }>();
  const router = useRouter();

  useEffect(() => {
    const pusher = new Pusher(NEXT_PUBLIC_PUSHER_KEY, {
      cluster: NEXT_PUBLIC_PUSHER_CLUSTER,
    });

    const channel = pusher.subscribe(`pix-${params.invoiceId}`);

    channel.bind("payment-confirmed", () => {
      // Unsubscribe and disconnect before navigation
      channel.unbind_all();
      pusher.unsubscribe(`pix-${params.invoiceId}`);
      pusher.disconnect();

      // Redirect to the success page
      router.push(`/w/${params.id}/pix/${params.invoiceId}/success`);
    });

    // Cleanup on component unmount
    return () => {
      channel.unbind_all();
      pusher.unsubscribe(`pix-${params.invoiceId}`);
      pusher.disconnect();
    };
  }, [params.id, params.invoiceId, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
        <h1 className="mt-4 text-xl font-semibold">
          Waiting for payment confirmation
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Please wait while we confirm your payment...
        </p>
      </div>
    </div>
  );
}
