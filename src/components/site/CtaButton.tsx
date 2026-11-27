import { Link } from "@tanstack/react-router";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const ctaVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-wide transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-3 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-wine text-primary-foreground shadow-soft hover:-translate-y-0.5 hover:bg-wine-deep hover:shadow-lift active:translate-y-0 active:scale-[0.97] active:duration-100",
        outline:
          "border border-ink/20 bg-background text-ink hover:-translate-y-0.5 hover:border-ink hover:bg-champagne-soft active:translate-y-0 active:scale-[0.97] active:duration-100",
        champagne:
          "bg-champagne text-ink hover:-translate-y-0.5 hover:bg-champagne/80 active:translate-y-0 active:scale-[0.97] active:duration-100",
        ghost: "text-ink underline-offset-4 hover:text-wine hover:underline active:opacity-70",
      },
      size: {
        sm: "min-h-11 px-4 py-2 text-sm",
        md: "px-6 py-3 text-sm sm:text-base",
        lg: "px-7 py-4 text-base",
      },
      full: { true: "w-full", false: "" },
    },
    defaultVariants: { variant: "primary", size: "md", full: false },
  },
);

type Props = VariantProps<typeof ctaVariants> & {
  children: ReactNode;
  className?: string;
  to?: string;
  /** Scrolls to this element id after navigating to `to`. */
  hash?: string;
  href?: string;
  /** Opens `href` in a new tab — for destinations outside this site. */
  external?: boolean;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  /** Shows a spinner and disables the button — for async actions like form submission. */
  loading?: boolean;
};

export function CtaButton({
  children,
  className,
  to,
  hash,
  href,
  external,
  variant,
  size,
  full,
  type,
  onClick,
  disabled,
  loading,
}: Props) {
  const classes = cn(ctaVariants({ variant, size, full }), className);

  if (to) {
    return (
      <Link to={to as never} hash={hash as never} className={classes} onClick={onClick}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a
        href={href}
        className={classes}
        onClick={onClick}
        {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
      >
        {children}
      </a>
    );
  }
  return (
    <button
      type={type ?? "button"}
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
    >
      {loading ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : null}
      {children}
    </button>
  );
}
