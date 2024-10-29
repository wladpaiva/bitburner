import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <div className="container max-w-md mx-auto p-4 space-y-12 flex flex-col items-center justify-center h-dvh">
      <div className="flex flex-col items-center justify-center space-y-4">
        <h1 className="text-5xl font-black">
          <span className="bg-gradient-to-r from-foreground via-foreground to-amber-400 bg-clip-text text-transparent">
            bit
          </span>
          <span className="bg-gradient-to-r from-amber-400 via-primary to-primary/50 bg-clip-text text-transparent">
            burner
          </span>
        </h1>
        <p className="text-foreground text-center text-balance">
          The simplest way to pay Pix with Bitcoin. No wallet setup, no custody
          worries - just quick transfers.
        </p>
      </div>

      <Button asChild size="lg" className="w-full">
        <Link href="/w/new">Create Wallet</Link>
      </Button>

      <p className="text-sm text-muted-foreground text-center">
        Perfect for beginners • No custody required • Instant Pix payments
      </p>
    </div>
  );
}
