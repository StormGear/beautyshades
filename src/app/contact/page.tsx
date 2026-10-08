import { ContactForm } from "@/components/ContactForm";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <div className="text-center">
        <h1 className="font-serif text-5xl">Reach Out</h1>
        <p className="mt-3 italic text-muted">We are here to assist you.</p>
      </div>
      <div className="mt-16 grid gap-16 md:grid-cols-2">
        <div className="space-y-10">
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em]">Address</h4>
            <p className="mt-2 text-sm leading-7 text-muted">
              Cape Coast, Ghana
              <br />
              Available for Nationwide Delivery
            </p>
          </div>
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em]">Direct Line</h4>
            <p className="mt-2 text-sm text-muted">
              <a href="tel:0552383203" className="hover:text-ink">0552383203</a>
            </p>
          </div>
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em]">Email Inquiries</h4>
            <p className="mt-2 text-sm text-muted">
              <a href="mailto:lilianababaise@gmail.com" className="hover:text-ink">lilianababaise@gmail.com</a>
            </p>
          </div>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}
