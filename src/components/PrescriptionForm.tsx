"use client";

import { useState } from "react";

const fields = [
  { name: "odSph", label: "OD SPH" },
  { name: "odCyl", label: "OD CYL" },
  { name: "odAxis", label: "OD Axis" },
  { name: "osSph", label: "OS SPH" },
  { name: "osCyl", label: "OS CYL" },
  { name: "osAxis", label: "OS Axis" },
  { name: "pd", label: "PD" },
];

export function PrescriptionForm() {
  const [status, setStatus] = useState<"idle" | "saving" | "ok" | "error">("idle");
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP ?? "233504388814";

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    setStatus("saving");
    const res = await fetch("/api/prescription", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      setStatus("error");
      return;
    }
    setStatus("ok");
    const message = encodeURIComponent(
      `Hi Beauty Shades, I just submitted my prescription.${data.name ? ` Name: ${data.name}.` : ""}`,
    );

    window.open(`https://wa.me/${whatsapp}?text=${message}`, "_blank");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <input name="name" placeholder="Your name" className="underline-input" />
        <input name="phone" placeholder="Phone" className="underline-input" />
        <input name="email" type="email" placeholder="Email" className="underline-input sm:col-span-2" />
      </div>
      <div>
        <h3 className="text-sm font-medium">Manual Entry (Optional)</h3>
        <p className="mt-1 text-sm text-muted">OD (Right Eye) · OS (Left Eye)</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {fields.map((field) => (
            <input key={field.name} name={field.name} placeholder={field.label} className="underline-input" />
          ))}
        </div>
      </div>
      <textarea name="notes" placeholder="Anything else we should know?" rows={3} className="underline-input resize-none" />
      {status === "error" && <p className="text-sm text-red-600">Could not save those details.</p>}
      {status === "ok" && <p className="text-sm text-emerald-700">Saved. WhatsApp should open so you can attach a photo.</p>}
      <div className="rounded-2xl bg-blush p-4 text-sm text-muted">
        📸 After clicking submit, WhatsApp will open. You can attach your prescription image directly in the chat.
      </div>
      <button
        type="submit"
        disabled={status === "saving"}
        className="rounded-full bg-pink px-8 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white"
      >
        {status === "saving" ? "Submitting…" : "Submit Details"}
      </button>
    </form>
  );
}
