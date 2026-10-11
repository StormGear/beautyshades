import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminCookie, isValidAdminToken } from "./admin-session";
import { ORDER_STATUS_VALUES } from "./validators";

export async function isAdmin() {
  const store = await cookies();
  return isValidAdminToken(store.get(adminCookie.name)?.value);
}

export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const ORDER_STATUSES = ORDER_STATUS_VALUES;

export type OrderStatus = (typeof ORDER_STATUSES)[number];
