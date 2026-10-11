"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { saveCategory } from "@/app/admin/actions";
import { categorySchema, type CategoryValues } from "@/lib/validators";
import { isNextRedirect, valuesToFormData } from "@/lib/form-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { useState } from "react";

export function AdminCategoryForm({
  category,
  productCount,
}: {
  category?: { id: string; name: string; slug: string; image: string; description?: string | null };
  productCount?: number;
}) {
  const [serverError, setServerError] = useState("");
  const form = useForm<CategoryValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      id: category?.id ?? "",
      name: category?.name ?? "",
      slug: category?.slug ?? "",
      image: category?.image ?? "",
      description: category?.description ?? "",
    },
    mode: "onBlur",
  });

  async function onSubmit(values: CategoryValues) {
    setServerError("");
    try {
      await saveCategory(valuesToFormData(values));
    } catch (err) {
      if (isNextRedirect(err)) throw err;
      setServerError(err instanceof Error ? err.message : "Could not save this category.");
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="rounded-2xl bg-white p-6 ring-1 ring-black/5">
      {category ? (
        <p className="text-xs text-muted">{productCount ?? 0} products</p>
      ) : (
        <p className="font-serif text-2xl">New category</p>
      )}
      <FieldGroup className="mt-3">
        <Field data-invalid={!!form.formState.errors.name || undefined}>
          <FieldLabel htmlFor={`${category?.id ?? "new"}-name`}>Name</FieldLabel>
          <Input id={`${category?.id ?? "new"}-name`} aria-invalid={!!form.formState.errors.name} {...form.register("name")} />
          <FieldError errors={[form.formState.errors.name]} />
        </Field>
        <Field>
          <FieldLabel htmlFor={`${category?.id ?? "new"}-slug`}>Slug</FieldLabel>
          <Input id={`${category?.id ?? "new"}-slug`} placeholder="Optional" {...form.register("slug")} />
        </Field>
        <Field data-invalid={!!form.formState.errors.image || undefined}>
          <FieldLabel htmlFor={`${category?.id ?? "new"}-image`}>Image URL</FieldLabel>
          <Input id={`${category?.id ?? "new"}-image`} aria-invalid={!!form.formState.errors.image} {...form.register("image")} />
          <FieldError errors={[form.formState.errors.image]} />
        </Field>
        <Field>
          <FieldLabel htmlFor={`${category?.id ?? "new"}-description`}>Description</FieldLabel>
          <Textarea id={`${category?.id ?? "new"}-description`} rows={3} {...form.register("description")} />
        </Field>
        {serverError && <p className="text-sm text-destructive">{serverError}</p>}
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className={`h-10 rounded-full px-5 text-[11px] font-semibold uppercase tracking-widest ${category ? "" : "bg-pink text-white hover:bg-pink/90"}`}
        >
          {form.formState.isSubmitting ? (category ? "Saving…" : "Creating…") : category ? "Save" : "Create"}
        </Button>
      </FieldGroup>
    </form>
  );
}
