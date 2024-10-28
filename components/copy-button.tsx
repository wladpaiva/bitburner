"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CopyButtonProps {
  value: string;
}

export function CopyButton({ value }: CopyButtonProps) {
  const [isCopied, setIsCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <Button variant="ghost" size="icon" onClick={copy} className="h-8 w-8">
      {isCopied ? (
        <Check className="ml-4 h-4 w-4" />
      ) : (
        <Copy className="h-4 w-4 ml-4" />
      )}
    </Button>
  );
}
