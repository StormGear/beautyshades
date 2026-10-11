import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validators";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const parsed = contactSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Please fill in your name, email, and message." }, { status: 400 });
  }
  await prisma.contactMessage.create({ data: parsed.data });
  return NextResponse.json({ ok: true });
}
