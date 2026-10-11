"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCart } from "./CartProvider";
import { formatGhs } from "@/lib/money";
import { deliveryFee, PICKUP_ADDRESS, PICKUP_CITY } from "@/lib/fulfillment";
import { checkoutSchema, type CheckoutValues } from "@/lib/validators";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";

export function CheckoutForm() {
  const router = useRouter();
  const { items, subtotal, refresh } = useCart();
  const [serverError, setServerError] = useState("");
  const form = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fulfillment: "delivery",
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "Cape Coast",
      notes: "",
    },
    mode: "onBlur",
  });
  const fulfillment = form.watch("fulfillment");
  const delivery = deliveryFee(subtotal, fulfillment);
  const total = subtotal + delivery;

  async function onSubmit(values: CheckoutValues) {
    setServerError("");
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const body = await res.json();
    if (!res.ok) {
      setServerError(body.error ?? "Checkout failed.");
      return;
    }
    await refresh();
    router.push(`/order/${body.id}`);
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
      <FieldGroup>
        <Controller
          control={form.control}
          name="fulfillment"
          render={({ field, fieldState }) => (
            <FieldSet data-invalid={fieldState.invalid || undefined}>
              <FieldLegend className="text-[11px] font-semibold uppercase tracking-[0.18em]">
                How would you like to receive your order?
              </FieldLegend>
              <RadioGroup
                value={field.value}
                onValueChange={field.onChange}
                className="grid gap-3 sm:grid-cols-2"
              >
                <FieldLabel
                  className={`cursor-pointer rounded-2xl border p-4 transition has-data-checked:border-gold has-data-checked:bg-gold-soft/60 ${
                    field.value === "delivery" ? "border-gold bg-gold-soft/60" : "border-line-strong bg-surface"
                  }`}
                >
                  <Field orientation="horizontal">
                    <RadioGroupItem value="delivery" className="sr-only" />
                    <FieldContent>
                      <FieldTitle>Delivery</FieldTitle>
                      <FieldDescription>
                        Nationwide from Cape Coast. Complimentary in Cape Coast on orders above GHS 500.
                      </FieldDescription>
                    </FieldContent>
                  </Field>
                </FieldLabel>
                <FieldLabel
                  className={`cursor-pointer rounded-2xl border p-4 transition has-data-checked:border-gold has-data-checked:bg-gold-soft/60 ${
                    field.value === "pickup" ? "border-gold bg-gold-soft/60" : "border-line-strong bg-surface"
                  }`}
                >
                  <Field orientation="horizontal">
                    <RadioGroupItem value="pickup" className="sr-only" />
                    <FieldContent>
                      <FieldTitle>Store pickup</FieldTitle>
                      <FieldDescription>Collect at our Cape Coast store. No delivery fee.</FieldDescription>
                    </FieldContent>
                  </Field>
                </FieldLabel>
              </RadioGroup>
              <FieldError errors={[fieldState.error]} />
            </FieldSet>
          )}
        />

        <Field data-invalid={!!form.formState.errors.name || undefined}>
          <FieldLabel htmlFor="checkout-name">Full name</FieldLabel>
          <Input id="checkout-name" autoComplete="name" aria-invalid={!!form.formState.errors.name} {...form.register("name")} />
          <FieldError errors={[form.formState.errors.name]} />
        </Field>
        <Field data-invalid={!!form.formState.errors.email || undefined}>
          <FieldLabel htmlFor="checkout-email">Email</FieldLabel>
          <Input id="checkout-email" type="email" autoComplete="email" aria-invalid={!!form.formState.errors.email} {...form.register("email")} />
          <FieldError errors={[form.formState.errors.email]} />
        </Field>
        <Field data-invalid={!!form.formState.errors.phone || undefined}>
          <FieldLabel htmlFor="checkout-phone">Phone</FieldLabel>
          <Input id="checkout-phone" type="tel" autoComplete="tel" aria-invalid={!!form.formState.errors.phone} {...form.register("phone")} />
          <FieldError errors={[form.formState.errors.phone]} />
        </Field>

        {fulfillment === "delivery" ? (
          <>
            <Field data-invalid={!!form.formState.errors.address || undefined}>
              <FieldLabel htmlFor="checkout-address">Delivery address</FieldLabel>
              <Input id="checkout-address" autoComplete="street-address" aria-invalid={!!form.formState.errors.address} {...form.register("address")} />
              <FieldError errors={[form.formState.errors.address]} />
            </Field>
            <Field>
              <FieldLabel htmlFor="checkout-city">City</FieldLabel>
              <Input id="checkout-city" autoComplete="address-level2" {...form.register("city")} />
            </Field>
          </>
        ) : (
          <p className="rounded-2xl bg-blush px-4 py-3 text-sm leading-6 text-muted">
            Pickup from <span className="font-medium text-ink">{PICKUP_ADDRESS}</span>. We&apos;ll call you when your
            order is ready.
          </p>
        )}

        <Field>
          <FieldLabel htmlFor="checkout-notes">Order notes</FieldLabel>
          <Textarea id="checkout-notes" rows={3} placeholder="Optional" {...form.register("notes")} />
        </Field>

        {serverError && <p className="text-sm text-destructive">{serverError}</p>}
        <Button
          type="submit"
          disabled={form.formState.isSubmitting || items.length === 0}
          className="h-11 rounded-full px-8 text-[11px] font-semibold uppercase tracking-[0.18em]"
        >
          {form.formState.isSubmitting ? "Placing order…" : "Place Order"}
        </Button>
      </FieldGroup>

      <aside className="rounded-3xl bg-blush p-6">
        <h2 className="font-serif text-2xl">Summary</h2>
        <ul className="mt-5 space-y-3 text-sm">
          {items.map((item) => (
            <li key={item.productId} className="flex justify-between gap-4">
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>{formatGhs(item.lineTotal)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-6 space-y-2 border-t border-line-strong pt-4 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatGhs(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>{fulfillment === "pickup" ? "Pickup" : "Delivery"}</span>
            <span>
              {fulfillment === "pickup" ? `${PICKUP_CITY} store` : delivery === 0 ? "Complimentary" : formatGhs(delivery)}
            </span>
          </div>
          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span>{formatGhs(total)}</span>
          </div>
        </div>
      </aside>
    </form>
  );
}
