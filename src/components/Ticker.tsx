import Link from "next/link";

const items = [
  {
    label: "Special Offer",
    text: "Flash Offer: Enjoy up to 25% off selected luxury frames & sunglasses this week!",
    href: "/gallery",
    cta: "Shop Collection",
  },
  {
    label: "Free Delivery",
    text: "Complimentary door-to-door delivery across Accra on all orders above GHS 500.",
    href: "/contact",
    cta: "Order Now",
  },
  {
    label: "Prescription",
    text: "Upload your prescription online for precision custom-crafted optical lenses.",
    href: "/prescription",
    cta: "Upload Prescription",
  },
];

export function Ticker() {
  const loop = [...items, ...items, ...items, ...items];
  return (
    <div className="relative overflow-hidden border-b border-black/5 bg-white" role="region" aria-label="Announcement ticker">
      <div className="pointer-events-none absolute left-0 top-0 z-10 flex h-full items-center bg-white pr-3 pl-4 text-[10px] font-semibold tracking-[0.18em] text-ink/70">
        ANNOUNCEMENT
      </div>
      <div className="animate-ticker flex w-max items-center gap-10 py-2.5 pl-48">
        {loop.map((item, index) => (
          <div key={`${item.label}-${index}`} className="flex items-center gap-3 whitespace-nowrap text-[13px]">
            <span className="rounded-full bg-pink-soft px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-pink">
              {item.label}
            </span>
            <span className="text-ink/80">{item.text}</span>
            <Link href={item.href} className="text-[11px] font-semibold uppercase tracking-wider underline decoration-ink/30 underline-offset-4">
              {item.cta}
            </Link>
            <span className="text-ink/20">|</span>
          </div>
        ))}
      </div>
    </div>
  );
}
