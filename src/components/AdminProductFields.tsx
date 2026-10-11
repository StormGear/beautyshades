"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { saveProduct, deleteProduct } from "@/app/admin/actions";
import { productSchema, type ProductValues } from "@/lib/validators";
import type { z } from "zod";
import { isNextRedirect, valuesToFormData } from "@/lib/form-data";
import { ProductImageUpload } from "@/components/ProductImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { useState } from "react";

type CategoryOption = { id: string; name: string };

export function AdminProductFields({
  product,
  categories,
  canDelete = false,
}: {
  product?: Partial<ProductValues> & { id?: string };
  categories: CategoryOption[];
  canDelete?: boolean;
}) {
  const [serverError, setServerError] = useState("");
  const form = useForm<z.input<typeof productSchema>, unknown, ProductValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      id: product?.id ?? "",
      name: product?.name ?? "",
      slug: product?.slug ?? "",
      description: product?.description ?? "",
      image: product?.image ?? "",
      price: product?.price ?? ("" as unknown as number),
      compareAt: product?.compareAt ?? "",
      stock: product?.stock ?? 0,
      categoryId: product?.categoryId ?? "",
      featured: product?.featured ?? false,
    },
    mode: "onBlur",
  });

  async function onSubmit(values: ProductValues) {
    setServerError("");
    try {
      await saveProduct(valuesToFormData(values));
    } catch (err) {
      if (isNextRedirect(err)) throw err;
      setServerError(err instanceof Error ? err.message : "Could not save this product.");
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 max-w-2xl">
      <FieldGroup>
        <Field data-invalid={!!form.formState.errors.name || undefined}>
          <FieldLabel htmlFor="product-name">Name</FieldLabel>
          <Input id="product-name" aria-invalid={!!form.formState.errors.name} {...form.register("name")} />
          <FieldError errors={[form.formState.errors.name]} />
        </Field>
        <Field>
          <FieldLabel htmlFor="product-slug">Slug</FieldLabel>
          <Input id="product-slug" placeholder="Optional — generated from the name" {...form.register("slug")} />
        </Field>
        <Field data-invalid={!!form.formState.errors.description || undefined}>
          <FieldLabel htmlFor="product-description">Description</FieldLabel>
          <Textarea id="product-description" rows={4} aria-invalid={!!form.formState.errors.description} {...form.register("description")} />
          <FieldError errors={[form.formState.errors.description]} />
        </Field>

        <Field data-invalid={!!form.formState.errors.image || undefined}>
          <ProductImageUpload
            value={form.watch("image")}
            onChange={(url) => form.setValue("image", url, { shouldValidate: true, shouldDirty: true })}
            error={form.formState.errors.image?.message}
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-3">
          <Field data-invalid={!!form.formState.errors.price || undefined}>
            <FieldLabel htmlFor="product-price">Price (GHS)</FieldLabel>
            <Input id="product-price" type="number" step="0.01" aria-invalid={!!form.formState.errors.price} {...form.register("price")} />
            <FieldError errors={[form.formState.errors.price]} />
          </Field>
          <Field data-invalid={!!form.formState.errors.compareAt || undefined}>
            <FieldLabel htmlFor="product-compare">Compare at</FieldLabel>
            <Input id="product-compare" type="number" step="0.01" {...form.register("compareAt")} />
            <FieldError errors={[form.formState.errors.compareAt]} />
          </Field>
          <Field data-invalid={!!form.formState.errors.stock || undefined}>
            <FieldLabel htmlFor="product-stock">Stock</FieldLabel>
            <Input id="product-stock" type="number" aria-invalid={!!form.formState.errors.stock} {...form.register("stock")} />
            <FieldError errors={[form.formState.errors.stock]} />
          </Field>
        </div>

        <Controller
          control={form.control}
          name="categoryId"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid || undefined}>
              <FieldLabel>Category</FieldLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full" aria-invalid={fieldState.invalid}>
                  <SelectValue placeholder="Choose a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="featured"
          render={({ field }) => (
            <Field orientation="horizontal">
              <Checkbox checked={field.value} onCheckedChange={(checked) => field.onChange(checked === true)} />
              <FieldLabel className="font-normal">Feature on homepage</FieldLabel>
            </Field>
          )}
        />

        {serverError && <p className="text-sm text-destructive">{serverError}</p>}

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="h-11 rounded-full px-8 text-[11px] font-semibold uppercase tracking-[0.18em]"
          >
            {form.formState.isSubmitting ? "Saving product…" : "Save product"}
          </Button>
          {product?.id && canDelete && (
            <Button
              type="button"
              variant="destructive"
              className="text-[11px] uppercase tracking-widest"
              onClick={async () => {
                if (!window.confirm("Are you sure you want to delete this frame? This action cannot be undone.")) return;
                const fd = new FormData();
                fd.append("id", product.id!);
                await deleteProduct(fd);
              }}
            >
              Delete frame
            </Button>
          )}
        </div>
      </FieldGroup>
    </form>
  );
}
