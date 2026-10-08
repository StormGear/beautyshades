"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin, slugify } from "@/lib/admin";
import { uploadToStorage } from "@/lib/storage";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function uploadImageAction(formData: FormData): Promise<{ url?: string; error?: string }> {
  await requireAdmin();
  const file = formData.get("file");
  if (!file || !(file instanceof File) || file.size === 0) {
    return { error: "Please select an image file to upload." };
  }
  if (!file.type.startsWith("image/")) {
    return { error: "Only image files (JPEG, PNG, WebP, etc.) are allowed." };
  }
  if (file.size > 10 * 1024 * 1024) {
    return { error: "Image file exceeds the 10MB size limit." };
  }

  try {
    const bytes = await file.arrayBuffer();
    const { url } = await uploadToStorage(Buffer.from(bytes), file.name, file.type, "products");
    return { url };
  } catch (err: unknown) {
    console.error("Upload error:", err);
    return { error: err instanceof Error ? err.message : "Failed to upload image." };
  }
}

async function uniqueSlug(base: string, excludeId?: string) {
  const original = slugify(base) || `frame-${Date.now()}`;
  let slug = original;
  let n = 1;
  while (
    await prisma.product.findFirst({
      where: { slug, ...(excludeId ? { id: { not: excludeId } } : {}) },
    })
  ) {
    n += 1;
    slug = `${original}-${n}`;
  }
  return slug;
}

function money(value: FormDataEntryValue | null) {
  const raw = String(value ?? "").trim();
  if (!raw) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

export async function saveProduct(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  let image = String(formData.get("image") ?? "").trim();
  const imageFile = formData.get("imageFile");

  if (imageFile instanceof File && imageFile.size > 0 && imageFile.type.startsWith("image/")) {
    const bytes = await imageFile.arrayBuffer();
    const uploadRes = await uploadToStorage(Buffer.from(bytes), imageFile.name, imageFile.type, "products");
    image = uploadRes.url;
  }

  const categoryId = String(formData.get("categoryId") ?? "");
  const price = money(formData.get("price"));
  const compareAt = money(formData.get("compareAt"));
  const stock = Math.max(0, Number(formData.get("stock") ?? 0));
  const featured = formData.get("featured") === "on";
  const requestedSlug = String(formData.get("slug") ?? "").trim();

  if (!name || !description || !image || !categoryId || price === null) {
    throw new Error("Name, description, image, category, and price are required.");
  }


  const slug = await uniqueSlug(requestedSlug || name, id || undefined);
  const data = {
    name,
    slug,
    description,
    image,
    categoryId,
    price,
    compareAt,
    stock,
    featured,
  };

  if (id) {
    await prisma.product.update({ where: { id }, data });
  } else {
    await prisma.product.create({ data });
  }

  revalidatePath("/admin/products");
  revalidatePath("/gallery");
  revalidatePath("/");
  redirect("/admin/products");
}

export async function deleteProduct(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const orders = await prisma.orderItem.count({ where: { productId: id } });
  if (orders > 0) {
    throw new Error("This frame is on existing orders, so it cannot be deleted. Set stock to 0 instead.");
  }
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/products");
  revalidatePath("/gallery");
  redirect("/admin/products");
}

export async function saveCategory(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const image = String(formData.get("image") ?? "").trim();
  const slug = slugify(String(formData.get("slug") ?? name));
  if (!name || !image || !slug) throw new Error("Name and image are required.");

  if (id) {
    await prisma.category.update({
      where: { id },
      data: { name, description, image, slug },
    });
  } else {
    await prisma.category.create({ data: { name, description, image, slug } });
  }
  revalidatePath("/admin/categories");
  revalidatePath("/gallery");
  redirect("/admin/categories");
}

export async function updateOrderStatus(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "pending");
  await prisma.order.update({ where: { id }, data: { status } });
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
}

export async function setHandled(formData: FormData) {
  await requireAdmin();
  const kind = String(formData.get("kind") ?? "");
  const id = String(formData.get("id") ?? "");
  const handled = String(formData.get("handled") ?? "true") === "true";
  if (kind === "message") {
    await prisma.contactMessage.update({ where: { id }, data: { handled } });
    revalidatePath("/admin/messages");
  } else {
    await prisma.prescription.update({ where: { id }, data: { handled } });
    revalidatePath("/admin/prescriptions");
  }
}

export async function deleteRecord(formData: FormData) {
  await requireAdmin();
  const kind = String(formData.get("kind") ?? "");
  const id = String(formData.get("id") ?? "");
  if (kind === "message") {
    await prisma.contactMessage.delete({ where: { id } });
    revalidatePath("/admin/messages");
  } else if (kind === "prescription") {
    await prisma.prescription.delete({ where: { id } });
    revalidatePath("/admin/prescriptions");
  }
}

export async function saveAnnouncement(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  const label = String(formData.get("label") ?? "").trim();
  const text = String(formData.get("text") ?? "").trim();
  const href = String(formData.get("href") ?? "").trim() || null;
  const cta = String(formData.get("cta") ?? "").trim() || null;
  const order = Number(formData.get("order") ?? 0);
  const active = formData.get("active") === "on" || formData.get("active") === "true";

  if (!label || !text) {
    throw new Error("Label and text are required for an announcement.");
  }

  if (id) {
    await prisma.announcement.update({
      where: { id },
      data: { label, text, href, cta, order, active },
    });
  } else {
    await prisma.announcement.create({
      data: { label, text, href, cta, order, active },
    });
  }

  revalidatePath("/admin/announcements");
  revalidatePath("/");
  redirect("/admin/announcements");
}

export async function toggleAnnouncementActive(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  const active = String(formData.get("active") ?? "true") === "true";
  await prisma.announcement.update({
    where: { id },
    data: { active },
  });
  revalidatePath("/admin/announcements");
  revalidatePath("/");
}

export async function deleteAnnouncement(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  await prisma.announcement.delete({ where: { id } });
  revalidatePath("/admin/announcements");
  revalidatePath("/");
}
