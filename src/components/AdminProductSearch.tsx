"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { productSearchSchema } from "@/lib/validators";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";

export function AdminProductSearch({ query = "" }: { query?: string }) {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(productSearchSchema),
    defaultValues: { q: query },
  });

  function onSubmit(values: { q?: string }) {
    const params = new URLSearchParams();
    if (values.q?.trim()) params.set("q", values.q.trim());
    router.push(params.size ? `/admin/products?${params}` : "/admin/products");
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 flex max-w-md items-start gap-3">
      <Field className="flex-1" data-invalid={!!form.formState.errors.q || undefined}>
        <Input placeholder="Search by name" aria-label="Search products" {...form.register("q")} />
        <FieldError errors={[form.formState.errors.q]} />
      </Field>
      <Button type="submit" variant="outline" className="h-10 rounded-full px-5 text-[11px] font-semibold uppercase tracking-widest">
        Search
      </Button>
    </form>
  );
}
