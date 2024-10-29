"use client";

import { forwardRef } from "react";
import { useFormStatus } from "react-dom";

import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "@/components/ui/button";
import { Spinner } from "@/components/icons";

export type SubmitButtonProps = Omit<ButtonProps, "type" | "aria-disabled"> & {
  pending?: boolean;
};

const SubmitButton = forwardRef<HTMLButtonElement, SubmitButtonProps>(
  ({ children, className, pending, ...rest }, ref) => {
    const { pending: formPending } = useFormStatus();
    const isPending = pending || formPending;
    return (
      <Button
        {...rest}
        disabled={isPending}
        type="submit"
        aria-disabled={isPending}
        ref={ref}
        className={cn("relative", className)}
      >
        {isPending && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Spinner className="h-4 w-4 animate-spin" />
          </div>
        )}
        <div className={cn(isPending ? "opacity-0" : "contents")}>
          {children}
        </div>
      </Button>
    );
  }
);
SubmitButton.displayName = "SubmitButton";

export { SubmitButton };
