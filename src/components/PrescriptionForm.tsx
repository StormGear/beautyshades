"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { prescriptionSchema, type PrescriptionValues } from "@/lib/validators";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";

const rxFields = [
  { name: "odSph", label: "OD SPH" },
  { name: "odCyl", label: "OD CYL" },
  { name: "odAxis", label: "OD Axis" },
  { name: "osSph", label: "OS SPH" },
  { name: "osCyl", label: "OS CYL" },
  { name: "osAxis", label: "OS Axis" },
  { name: "pd", label: "PD" },
] as const;

export function PrescriptionForm() {
  const [serverError, setServerError] = useState("");
  const [ok, setOk] = useState(false);
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP ?? "233504388814";
  const form = useForm<PrescriptionValues>({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      odSph: "",
      odCyl: "",
      odAxis: "",
      osSph: "",
      osCyl: "",
      osAxis: "",
      pd: "",
      notes: "",
    },
    mode: "onBlur",
  });

  async function onSubmit(values: PrescriptionValues) {
    setOk(false);
    setServerError("");
    const res = await fetch("/api/prescription", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (!res.ok) {
      setServerError("Could not save those details.");
      return;
    }
    setOk(true);
    const message = encodeURIComponent(
      `Hi Beauty Shades, I just submitted my prescription.${values.name ? ` Name: ${values.name}.` : ""}`,
    );
    window.open(`https://wa.me/${whatsapp}?text=${message}`, "_blank");
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field data-invalid={!!form.formState.errors.name || undefined}>
            <FieldLabel htmlFor="rx-name">Your name</FieldLabel>
            <Input id="rx-name" autoComplete="name" aria-invalid={!!form.formState.errors.name} {...form.register("name")} />
            <FieldError errors={[form.formState.errors.name]} />
          </Field>
          <Field data-invalid={!!form.formState.errors.phone || undefined}>
            <FieldLabel htmlFor="rx-phone">Phone</FieldLabel>
            <Input id="rx-phone" type="tel" autoComplete="tel" aria-invalid={!!form.formState.errors.phone} {...form.register("phone")} />
            <FieldError errors={[form.formState.errors.phone]} />
          </Field>
          <Field className="sm:col-span-2" data-invalid={!!form.formState.errors.email || undefined}>
            <FieldLabel htmlFor="rx-email">Email</FieldLabel>
            <Input id="rx-email" type="email" autoComplete="email" aria-invalid={!!form.formState.errors.email} {...form.register("email")} />
            <FieldError errors={[form.formState.errors.email]} />
          </Field>
        </div>

        <div>
          <h3 className="text-sm font-medium">Manual entry (optional)</h3>
          <p className="mt-1 text-sm text-muted">OD (Right Eye) · OS (Left Eye)</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {rxFields.map((field) => (
              <Field key={field.name}>
                <FieldLabel htmlFor={`rx-${field.name}`}>{field.label}</FieldLabel>
                <Input id={`rx-${field.name}`} {...form.register(field.name)} />
              </Field>
            ))}
          </div>
        </div>

        <Field>
          <FieldLabel htmlFor="rx-notes">Anything else we should know?</FieldLabel>
          <Textarea id="rx-notes" rows={3} {...form.register("notes")} />
        </Field>

        {serverError && <p className="text-sm text-destructive">{serverError}</p>}
        {ok && <p className="text-sm text-emerald-700">Saved. WhatsApp should open so you can attach a photo.</p>}
        <div className="rounded-2xl bg-blush p-4">
          <FieldDescription>
            After you submit, WhatsApp will open so you can attach a photo of your prescription.
          </FieldDescription>
        </div>
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="h-11 rounded-full bg-pink px-8 text-[11px] font-semibold uppercase tracking-[0.18em] text-white hover:bg-pink/90"
        >
          {form.formState.isSubmitting ? "Submitting…" : "Submit Details"}
        </Button>
      </FieldGroup>
    </form>
  );
}
