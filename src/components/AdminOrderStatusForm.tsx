"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateOrderStatus } from "@/app/admin/actions";
import { ORDER_STATUS_VALUES, orderStatusSchema, type OrderStatusValues } from "@/lib/validators";
import { valuesToFormData } from "@/lib/form-data";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field, FieldError } from "@/components/ui/field";
import { useState } from "react";

export function AdminOrderStatusForm({ id, status }: { id: string; status: string }) {
  const [serverError, setServerError] = useState("");
  const form = useForm<OrderStatusValues>({
    resolver: zodResolver(orderStatusSchema),
    defaultValues: {
      id,
      status: ORDER_STATUS_VALUES.includes(status as OrderStatusValues["status"])
        ? (status as OrderStatusValues["status"])
        : "pending",
    },
  });

  async function onSubmit(values: OrderStatusValues) {
    setServerError("");
    try {
      await updateOrderStatus(valuesToFormData(values));
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Could not update status.");
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 flex flex-wrap items-end gap-3">
      <Controller
        control={form.control}
        name="status"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid || undefined} className="w-48">
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-full capitalize" aria-invalid={fieldState.invalid}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ORDER_STATUS_VALUES.map((value) => (
                  <SelectItem key={value} value={value} className="capitalize">
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />
      <Button
        type="submit"
        disabled={form.formState.isSubmitting}
        className="h-10 shrink-0 rounded-full px-5 text-[11px] font-semibold uppercase tracking-widest"
      >
        {form.formState.isSubmitting ? "Updating…" : "Update status"}
      </Button>
      {serverError && <p className="w-full text-sm text-destructive">{serverError}</p>}
    </form>
  );
}
