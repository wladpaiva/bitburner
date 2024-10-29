"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeftIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams } from "next/navigation";
import { payPixAction } from "./actions";
import { toast } from "sonner";
import { SubmitButton } from "@/components/submit-button";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { payPixActionSchema } from "@/schemas/pix";

export default function PixPage() {
  const { id } = useParams();
  const { form, handleSubmitWithAction } = useHookFormAction(
    payPixAction,
    zodResolver(payPixActionSchema),
    {
      actionProps: {
        onError: ({ error }) => {
          toast.error(
            error.serverError ??
              "There was a problem paying the Pix. Please try again."
          );
        },
      },
      formProps: {
        defaultValues: {
          pixKey: "",
          walletId: id as string,
        },
      },
      errorMapProps: {},
    }
  );

  return (
    <div className="container max-w-md mx-auto p-4">
      <Button variant="ghost" className="mb-4" asChild>
        <Link href={`/w/${id}`}>
          <ArrowLeftIcon className="h-6 w-6" />
        </Link>
      </Button>
      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={handleSubmitWithAction} className="space-y-6">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount (BRL)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        onChange={(e) => {
                          // Convert to cents
                          const value = Math.round(
                            parseFloat(e.target.value) * 100
                          );
                          field.onChange(value);
                        }}
                        defaultValue={(field.value / 100).toFixed(2)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pixKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Insert the key to make the Pix</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Pix key" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="pixType"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pix Type</FormLabel>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-wrap gap-2"
                    >
                      {["cpf", "cnpj", "phone"].map((type) => (
                        <div key={type}>
                          <RadioGroupItem
                            value={type}
                            id={type}
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor={type}
                            className={cn(
                              "flex items-center justify-center px-3 py-2 text-sm font-medium border rounded-full cursor-pointer hover:bg-accent hover:text-accent-foreground",
                              field.value === type &&
                                "border-foreground text-accent-foreground"
                            )}
                          >
                            {type.toUpperCase()}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <SubmitButton
                pending={form.formState.isSubmitting}
                className="w-full"
              >
                Pay Pix
              </SubmitButton>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
