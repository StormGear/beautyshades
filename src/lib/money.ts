import { Decimal } from "@prisma/client/runtime/library";

export function formatGhs(value: Decimal | number | string) {
  return `GHS ${Number(value).toFixed(2)}`;
}

export function percentOff(price: Decimal | number, compareAt?: Decimal | number | null) {
  if (!compareAt) return null;
  const p = Number(price);
  const c = Number(compareAt);
  if (c <= p) return null;
  return Math.round(((c - p) / c) * 100);
}
