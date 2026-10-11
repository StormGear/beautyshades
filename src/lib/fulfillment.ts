export const PICKUP_ADDRESS = "Beauty Shades store, Cape Coast";
export const PICKUP_CITY = "Cape Coast";

export type Fulfillment = "delivery" | "pickup";

export function isFulfillment(value: unknown): value is Fulfillment {
  return value === "delivery" || value === "pickup";
}

export function deliveryFee(subtotal: number, fulfillment: Fulfillment) {
  if (fulfillment === "pickup") return 0;
  return subtotal >= 500 ? 0 : 30;
}
