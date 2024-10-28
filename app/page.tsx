import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <Button asChild>
        <Link href="/w/new">Create Wallet</Link>
      </Button>
    </div>
  );
}
