import { PrescriptionForm } from "@/components/PrescriptionForm";

export const metadata = { title: "Prescription" };

export default function PrescriptionPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-20">
      <p className="text-xs text-muted">Home / Prescription</p>
      <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.28em] text-pink">Clear Vision Awaits</p>
      <h1 className="mt-3 font-serif text-5xl leading-tight">
        Submit Your
        <br />
        Prescription.
      </h1>
      <p className="mt-6 text-sm leading-7 text-muted">
        Fill out the form with your optical details, <strong>or simply skip the form</strong> and send us a
        photo of your doctor&apos;s prescription directly on WhatsApp.
      </p>
      <div className="mt-10">
        <PrescriptionForm />
      </div>
    </section>
  );
}
