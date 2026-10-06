import Link from "next/link";
import Image from "next/image";

type LogoProps = {
  className?: string;
  variant?: "horizontal" | "badge" | "icon";
};

export function Logo({ className = "", variant = "horizontal" }: LogoProps) {
  if (variant === "badge") {
    return (
      <Link
        href="/"
        className={`group inline-flex items-center transition hover:opacity-90 ${className}`}
        aria-label="Beauty Shades home"
      >
        <Image
          src="/logo1.jpeg"
          alt="Beauty Shades"
          width={72}
          height={72}
          className="h-16 w-16 rounded-full object-cover shadow-md ring-2 ring-[#dfa85b]/30"
          priority
        />
      </Link>
    );
  }

  if (variant === "icon") {
    return (
      <Link
        href="/"
        className={`group inline-flex items-center transition hover:opacity-90 ${className}`}
        aria-label="Beauty Shades home"
      >
        <Image
          src="/logo2.jpeg"
          alt="Beauty Shades"
          width={40}
          height={40}
          className="h-10 w-10 rounded-full object-cover shadow-sm ring-1 ring-black/10"
          priority
        />
      </Link>
    );
  }

  return (
    <Link
      href="/"
      className={`group inline-flex items-center transition hover:opacity-95 ${className}`}
      aria-label="Beauty Shades home"
    >
      <div className="relative overflow-hidden rounded-xl bg-[#160c07] p-1 shadow-sm ring-1 ring-black/10">
        <Image
          src="/logo3.jpeg"
          alt="Beauty Shades"
          width={160}
          height={48}
          className="h-9 w-auto object-contain sm:h-10"
          priority
        />
      </div>
    </Link>
  );
}
