import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  name: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  odSph: z.string().optional(),
  odCyl: z.string().optional(),
  odAxis: z.string().optional(),
  osSph: z.string().optional(),
  osCyl: z.string().optional(),
  osAxis: z.string().optional(),
  pd: z.string().optional(),
  notes: z.string().optional(),
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Unable to save those details." }, { status: 400 });
  }
  const record = await prisma.prescription.create({ data: parsed.data });
  return NextResponse.json({ id: record.id });
}
