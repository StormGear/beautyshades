"use client";

import { useState } from "react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "saving" | "ok" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus("saving");
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const body = await res.json();
      setError(body.error ?? "Something went wrong.");
      setStatus("error");
      return;
    }
    setStatus("ok");
    form.reset();
  }

  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP ?? "233504388814";

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <input name="name" required placeholder="Your Name *" className="underline-input" />
      <input name="email" type="email" required placeholder="Email Address *" className="underline-input" />
      <textarea name="message" required placeholder="How can we help you? *" rows={4} className="underline-input resize-none" />
      {status === "error" && <p className="text-sm text-red-600">{error}</p>}
      {status === "ok" && <p className="text-sm text-emerald-700">Saved. We’ll reply shortly — or continue on WhatsApp.</p>}
      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={status === "saving"}
          className="rounded-full bg-ink px-8 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white"
        >
          {status === "saving" ? "Sending…" : "Send via WhatsApp"}
        </button>
        <a
          href={`https://wa.me/${whatsapp}`}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-black/15 px-8 py-3 text-[11px] font-semibold uppercase tracking-[0.18em]"
        >
          Open chat
        </a>
      </div>
    </form>
  );
}
