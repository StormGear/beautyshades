"use client";

import React, { useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

export type AdminButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  loadingText?: React.ReactNode;
  isFilled?: boolean;
  confirmMessage?: string;
  variant?: "filled" | "text" | "danger" | "ghost";
};

export function AdminButton({
  children,
  loading: explicitLoading,
  loadingText,
  isFilled,
  confirmMessage,
  variant,
  className = "",
  disabled,
  onClick,
  type = "submit",
  ...props
}: AdminButtonProps) {
  const formStatus = useFormStatus();
  const [internalPending, setInternalPending] = useState(false);
  const [, startTransition] = useTransition();

  // Determine whether this is a filled button:
  // Check explicit prop, variant, or presence of background color classes.
  const hasBgClass = /\bbg-(ink|pink|espresso|black|red|rose|cream|blush|[a-z0-9-]+)\b/.test(className);
  const filled = isFilled !== undefined ? isFilled : (variant === "filled" || hasBgClass);

  const isLoading = Boolean(explicitLoading || formStatus.pending || internalPending);
  const isDisabled = Boolean(disabled || isLoading);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (confirmMessage) {
      const ok = window.confirm(confirmMessage);
      if (!ok) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
    }

    if (onClick) {
      const result: unknown = onClick(e);
      if (result && typeof result === "object" && "then" in result && typeof (result as Promise<unknown>).then === "function") {
        setInternalPending(true);
        startTransition(async () => {
          try {
            await (result as Promise<unknown>);
          } finally {
            setInternalPending(false);
          }
        });
      }
    }
  };

  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-busy={isLoading}
      onClick={handleClick}
      className={`relative inline-flex items-center justify-center transition-all duration-200 ${
        filled && isLoading ? "cursor-not-allowed select-none" : ""
      } ${!filled && isLoading ? "cursor-not-allowed select-none opacity-60" : ""} ${className}`}
      {...props}
    >
      {/* Content wrapper */}
      <span
        className={`inline-flex items-center justify-center gap-2 transition-all duration-200 ${
          filled && isLoading
            ? "filter blur-[1.5px] opacity-40 select-none pointer-events-none scale-[0.98]"
            : ""
        }`}
      >
        {!filled && isLoading && (
          <Loader2 className="h-3.5 w-3.5 animate-spin text-current shrink-0" />
        )}
        {children}
      </span>

      {/* Crisp centered loader for filled buttons */}
      {filled && isLoading && (
        <span className="absolute inset-0 flex items-center justify-center gap-2 pointer-events-none z-10">
          <Loader2 className="h-4 w-4 animate-spin text-current drop-shadow-sm" />
          {loadingText && (
            <span className="text-[11px] font-semibold uppercase tracking-wider text-current">
              {loadingText}
            </span>
          )}
        </span>
      )}
    </button>
  );
}
