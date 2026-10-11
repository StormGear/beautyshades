-- AlterTable
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "fulfillment" TEXT NOT NULL DEFAULT 'delivery';
