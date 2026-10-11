"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Logo } from "@/components/Logo";
import { adminLoginSchema, type AdminLoginValues } from "@/lib/validators";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";

export function AdminLoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const [serverError, setServerError] = useState("");
  const form = useForm<AdminLoginValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: { password: "" },
  });

  async function onSubmit(values: AdminLoginValues) {
    setServerError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setServerError(body.error ?? "Could not sign in.");
      return;
    }
    router.push(search.get("next") || "/admin");
    router.refresh();
  }

  return (
    <div className="grid min-h-screen place-items-center bg-[#faf6ef] px-6">
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-sm ring-1 ring-black/5">
        <Logo />
        <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.22em] text-pink">Studio access</p>
        <h1 className="mt-2 font-serif text-4xl">Admin</h1>
        <FieldGroup className="mt-8">
          <Field data-invalid={!!form.formState.errors.password || undefined}>
            <FieldLabel htmlFor="admin-password">Password</FieldLabel>
            <Input
              id="admin-password"
              type="password"
              autoFocus
              autoComplete="current-password"
              aria-invalid={!!form.formState.errors.password}
              {...form.register("password")}
            />
            <FieldError errors={[form.formState.errors.password]} />
          </Field>
          {serverError && <p className="text-sm text-destructive">{serverError}</p>}
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="h-11 w-full rounded-full text-[11px] font-semibold uppercase tracking-[0.18em]"
          >
            {form.formState.isSubmitting ? "Signing in…" : "Enter"}
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
}
