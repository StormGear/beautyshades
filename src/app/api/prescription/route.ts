import { prisma } from "@/lib/prisma";
import { prescriptionSchema } from "@/lib/validators";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const parsed = prescriptionSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Unable to save those details." }, { status: 400 });
  }
  const record = await prisma.prescription.create({ data: parsed.data });
  return NextResponse.json({ id: record.id });
}
