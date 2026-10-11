"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactValues } from "@/lib/validators";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";

export function ContactForm() {
  const [serverError, setServerError] = useState("");
  const [ok, setOk] = useState(false);
  const form = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", message: "" },
    mode: "onBlur",
  });
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP ?? "233504388814";

  async function onSubmit(values: ContactValues) {
    setOk(false);
    setServerError("");
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (!res.ok) {
      const body = await res.json();
      setServerError(body.error ?? "Something went wrong.");
      return;
    }
    setOk(true);
    form.reset();
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Field data-invalid={!!form.formState.errors.name || undefined}>
          <FieldLabel htmlFor="contact-name">Your name</FieldLabel>
          <Input id="contact-name" autoComplete="name" aria-invalid={!!form.formState.errors.name} {...form.register("name")} />
          <FieldError errors={[form.formState.errors.name]} />
        </Field>
        <Field data-invalid={!!form.formState.errors.email || undefined}>
          <FieldLabel htmlFor="contact-email">Email address</FieldLabel>
          <Input id="contact-email" type="email" autoComplete="email" aria-invalid={!!form.formState.errors.email} {...form.register("email")} />
          <FieldError errors={[form.formState.errors.email]} />
        </Field>
        <Field data-invalid={!!form.formState.errors.message || undefined}>
          <FieldLabel htmlFor="contact-message">How can we help you?</FieldLabel>
          <Textarea id="contact-message" rows={4} aria-invalid={!!form.formState.errors.message} {...form.register("message")} />
          <FieldError errors={[form.formState.errors.message]} />
        </Field>
        {serverError && <p className="text-sm text-destructive">{serverError}</p>}
        {ok && <p className="text-sm text-emerald-700">Saved. We’ll reply shortly — or continue on WhatsApp.</p>}
        <div className="flex flex-wrap gap-3">
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="h-11 rounded-full px-8 text-[11px] font-semibold uppercase tracking-[0.18em]"
          >
            {form.formState.isSubmitting ? "Sending…" : "Send via WhatsApp"}
          </Button>
          <a
            href={`https://wa.me/${whatsapp}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 items-center rounded-full border border-input px-8 text-[11px] font-semibold uppercase tracking-[0.18em] transition hover:bg-muted/40"
          >
            Open chat
          </a>
        </div>
      </FieldGroup>
    </form>
  );
}
