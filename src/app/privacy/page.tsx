export const metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-20">
      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-pink">Compliance</p>
      <h1 className="mt-3 font-serif text-5xl">Privacy Policy.</h1>
      <div className="mt-10 space-y-6 text-sm leading-7 text-muted">
        <h2 className="font-serif text-2xl text-ink">Introduction</h2>
        <p>
          Welcome to Beauty Shades. We respect your privacy and are committed to protecting your personal data. This
          policy outlines how we handle information when you visit our site or use our services.
        </p>

        <h2 className="font-serif text-2xl text-ink">Data Collection</h2>
        <p>
          We collect information you provide directly to us, such as your name, email address, and prescription
          details when you fill out our forms or place an order.
        </p>
        <h2 className="font-serif text-2xl text-ink">How We Use Your Data</h2>
        <ul className="list-disc pl-5">
          <li>To process and deliver your eyewear orders.</li>
          <li>To provide customer support via WhatsApp or email.</li>
          <li>To send updates about collections with your consent.</li>
          <li>To improve website functionality and security.</li>
        </ul>
        <p>Last updated: October 2026. Questions: <a href="mailto:lilianababaise@gmail.com" className="underline hover:text-ink">lilianababaise@gmail.com</a>.</p>
      </div>
    </article>
  );
}
