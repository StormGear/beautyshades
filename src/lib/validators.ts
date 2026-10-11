import { z } from "zod";

export const ORDER_STATUS_VALUES = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
] as const;

const phonePattern = /^[+\d][\d\s()-]{6,}$/;

export const phoneSchema = z
  .string()
  .trim()
  .min(8, "Enter a valid phone number")
  .regex(phonePattern, "Enter a valid phone number");

export const optionalPhoneSchema = z
  .string()
  .trim()
  .refine((value) => value === "" || phonePattern.test(value), "Enter a valid phone number")
  .optional();

export const optionalEmailSchema = z
  .string()
  .trim()
  .refine((value) => value === "" || z.email().safeParse(value).success, "Enter a valid email")
  .optional();

export const optionalHrefSchema = z
  .string()
  .trim()
  .refine(
    (value) => value === "" || value.startsWith("/") || value.startsWith("http://") || value.startsWith("https://"),
    "Use a path like /gallery or a full URL",
  )
  .optional();

export const checkoutSchema = z
  .object({
    name: z.string().trim().min(2, "Enter your full name"),
    email: z.email("Enter a valid email"),
    phone: phoneSchema,
    fulfillment: z.enum(["delivery", "pickup"]),
    address: z.string().optional(),
    city: z.string().optional(),
    notes: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.fulfillment === "delivery" && (!data.address || data.address.trim().length < 5)) {
      ctx.addIssue({
        code: "custom",
        message: "Please add a delivery address.",
        path: ["address"],
      });
    }
  });

export type CheckoutValues = z.infer<typeof checkoutSchema>;

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Enter your name"),
  email: z.email("Enter a valid email"),
  message: z.string().trim().min(10, "Tell us a little more (at least 10 characters)"),
});

export type ContactValues = z.infer<typeof contactSchema>;

export const prescriptionSchema = z
  .object({
    name: z.string().trim().min(2, "Enter your name"),
    phone: optionalPhoneSchema,
    email: optionalEmailSchema,
    odSph: z.string().optional(),
    odCyl: z.string().optional(),
    odAxis: z.string().optional(),
    osSph: z.string().optional(),
    osCyl: z.string().optional(),
    osAxis: z.string().optional(),
    pd: z.string().optional(),
    notes: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.phone && !data.email) {
      ctx.addIssue({
        code: "custom",
        message: "Add a phone number or email so we can reach you.",
        path: ["phone"],
      });
    }
  });

export type PrescriptionValues = z.infer<typeof prescriptionSchema>;

export const adminLoginSchema = z.object({
  password: z.string().min(1, "Enter the admin password"),
});

export type AdminLoginValues = z.infer<typeof adminLoginSchema>;

export const productSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(2, "Enter a product name"),
  slug: z.string().optional(),
  description: z.string().trim().min(8, "Add a short description"),
  image: z.string().trim().min(1, "Add a product image"),
  price: z.coerce.number().positive("Enter a price greater than 0"),
  compareAt: z
    .union([z.literal(""), z.coerce.number().positive("Compare-at must be greater than 0")])
    .optional(),
  stock: z.coerce.number().int("Stock must be a whole number").min(0, "Stock cannot be negative"),
  categoryId: z.string().min(1, "Choose a category"),
  featured: z.boolean(),
});

export type ProductValues = z.infer<typeof productSchema>;

export const categorySchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(2, "Enter a category name"),
  slug: z.string().optional(),
  image: z.string().trim().min(1, "Add an image URL"),
  description: z.string().optional(),
});

export type CategoryValues = z.infer<typeof categorySchema>;

export const announcementSchema = z.object({
  id: z.string().optional(),
  label: z.string().trim().min(2, "Enter a badge label"),
  text: z.string().trim().min(8, "Enter the ticker message"),
  href: optionalHrefSchema,
  cta: z.string().optional(),
  order: z.coerce.number().int().min(0, "Order cannot be negative"),
  active: z.boolean(),
});

export type AnnouncementValues = z.infer<typeof announcementSchema>;

export const orderStatusSchema = z.object({
  id: z.string().min(1),
  status: z.enum(ORDER_STATUS_VALUES),
});

export type OrderStatusValues = z.infer<typeof orderStatusSchema>;

export const productSearchSchema = z.object({
  q: z.string().trim().max(80, "Keep the search under 80 characters").optional(),
});
