"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/Logo";

export function AdminLoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "Could not sign in.");
      setPending(false);
      return;
    }
    router.push(search.get("next") || "/admin");
    router.refresh();
  }

  return (
    <div className="grid min-h-screen place-items-center bg-[#fff7fa] px-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-sm ring-1 ring-black/5">
        <Logo />
        <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.22em] text-pink">Studio access</p>
        <h1 className="mt-2 font-serif text-4xl">Admin</h1>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="underline-input mt-8"
          autoFocus
        />
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="mt-8 w-full rounded-full bg-ink py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white"
        >
          {pending ? "Signing in…" : "Enter"}
        </button>
      </form>
    </div>
  );
}
