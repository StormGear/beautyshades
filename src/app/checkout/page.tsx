import { CheckoutForm } from "@/components/CheckoutForm";

export const metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="font-serif text-5xl">Checkout</h1>
      <p className="mt-3 text-sm text-muted">Nationwide delivery from Cape Coast. Complimentary across Cape Coast above GHS 500.</p>
      <div className="mt-12">
        <CheckoutForm />
      </div>
    </section>
  );
}
