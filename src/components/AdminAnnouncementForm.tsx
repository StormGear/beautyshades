"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { saveAnnouncement } from "@/app/admin/actions";
import { announcementSchema, type AnnouncementValues } from "@/lib/validators";
import type { z } from "zod";
import { isNextRedirect, valuesToFormData } from "@/lib/form-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { useState } from "react";

export function AdminAnnouncementForm({
  announcement,
  nextOrder = 1,
  compact = false,
}: {
  announcement?: {
    id: string;
    label: string;
    text: string;
    href?: string | null;
    cta?: string | null;
    order: number;
    active: boolean;
  };
  nextOrder?: number;
  compact?: boolean;
}) {
  const [serverError, setServerError] = useState("");
  const form = useForm<z.input<typeof announcementSchema>, unknown, AnnouncementValues>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      id: announcement?.id ?? "",
      label: announcement?.label ?? "",
      text: announcement?.text ?? "",
      href: announcement?.href ?? "",
      cta: announcement?.cta ?? "",
      order: announcement?.order ?? nextOrder,
      active: announcement?.active ?? true,
    },
    mode: "onBlur",
  });

  async function onSubmit(values: AnnouncementValues) {
    setServerError("");
    try {
      await saveAnnouncement(valuesToFormData(values));
    } catch (err) {
      if (isNextRedirect(err)) throw err;
      setServerError(err instanceof Error ? err.message : "Could not save this announcement.");
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className={announcement ? "mt-5" : "mt-6"}>
      <FieldGroup>
        <div className={compact ? "space-y-4" : "grid gap-4 sm:grid-cols-3"}>
          <Field data-invalid={!!form.formState.errors.label || undefined} className={compact ? "" : "sm:col-span-1"}>
            <FieldLabel htmlFor={`${announcement?.id ?? "new"}-label`}>Badge label</FieldLabel>
            <Input id={`${announcement?.id ?? "new"}-label`} aria-invalid={!!form.formState.errors.label} {...form.register("label")} />
            <FieldError errors={[form.formState.errors.label]} />
          </Field>
          {!compact && (
            <Field>
              <FieldLabel htmlFor={`${announcement?.id}-order`}>Display order</FieldLabel>
              <Input id={`${announcement?.id}-order`} type="number" {...form.register("order")} />
            </Field>
          )}
          {!compact && (
            <Controller
              control={form.control}
              name="active"
              render={({ field }) => (
                <Field orientation="horizontal" className="items-end pb-2">
                  <Checkbox checked={field.value} onCheckedChange={(checked) => field.onChange(checked === true)} />
                  <FieldLabel className="font-normal">Active on ticker</FieldLabel>
                </Field>
              )}
            />
          )}
        </div>

        <Field data-invalid={!!form.formState.errors.text || undefined}>
          <FieldLabel htmlFor={`${announcement?.id ?? "new"}-text`}>Message text</FieldLabel>
          <Textarea id={`${announcement?.id ?? "new"}-text`} rows={compact ? 3 : 2} aria-invalid={!!form.formState.errors.text} {...form.register("text")} />
          <FieldError errors={[form.formState.errors.text]} />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field data-invalid={!!form.formState.errors.href || undefined}>
            <FieldLabel htmlFor={`${announcement?.id ?? "new"}-href`}>Link URL</FieldLabel>
            <Input id={`${announcement?.id ?? "new"}-href`} placeholder="/gallery" aria-invalid={!!form.formState.errors.href} {...form.register("href")} />
            <FieldError errors={[form.formState.errors.href]} />
          </Field>
          <Field>
            <FieldLabel htmlFor={`${announcement?.id ?? "new"}-cta`}>Button CTA</FieldLabel>
            <Input id={`${announcement?.id ?? "new"}-cta`} placeholder="Shop Collection" {...form.register("cta")} />
          </Field>
        </div>

        {compact && (
          <div className="grid grid-cols-2 items-end gap-3">
            <Field>
              <FieldLabel htmlFor="new-order">Sort order</FieldLabel>
              <Input id="new-order" type="number" {...form.register("order")} />
            </Field>
            <Controller
              control={form.control}
              name="active"
              render={({ field }) => (
                <Field orientation="horizontal" className="pb-2">
                  <Checkbox checked={field.value} onCheckedChange={(checked) => field.onChange(checked === true)} />
                  <FieldLabel className="font-normal">Active now</FieldLabel>
                </Field>
              )}
            />
          </div>
        )}

        {serverError && <p className="text-sm text-destructive">{serverError}</p>}
        <div className={announcement ? "flex justify-end pt-2" : ""}>
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className={`h-10 rounded-full px-5 text-[11px] font-semibold uppercase tracking-widest ${compact ? "w-full bg-pink text-white hover:bg-pink/90" : ""}`}
          >
            {form.formState.isSubmitting
              ? announcement
                ? "Updating…"
                : "Creating…"
              : announcement
                ? "Update Announcement"
                : "Create Announcement"}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
