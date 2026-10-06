import { NextResponse } from "next/server";
import { adminCookie, createAdminToken } from "@/lib/admin-session";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const password = String(body.password ?? "");
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return NextResponse.json({ error: "Admin password is not configured." }, { status: 500 });
  }

  const encoder = new TextEncoder();
  const a = encoder.encode(password);
  const b = encoder.encode(expected);
  const ok = a.length === b.length;
  const len = Math.max(a.length, b.length);
  let mismatch = ok ? 0 : 1;
  for (let i = 0; i < len; i += 1) {
    mismatch |= (a[i] ?? 0) ^ (b[i] ?? 0);
  }
  if (mismatch !== 0) {
    return NextResponse.json({ error: "That password is not correct." }, { status: 401 });
  }

  const token = await createAdminToken();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(adminCookie.name, token, adminCookie.options);
  return response;
}
