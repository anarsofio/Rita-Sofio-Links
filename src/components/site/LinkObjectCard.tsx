import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion, useSpring } from "motion/react";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useState, type PointerEvent as ReactPointerEvent } from "react";
import { cn } from "@/lib/utils";

const MotionLink = motion.create(Link);
const MotionAnchor = motion.a;
const MotionButton = motion.button;

export type LinkObjectSize = "featured" | "wide" | "square";

const SPAN_CLASSES: Record<LinkObjectSize, string> = {
  featured: "col-span-2 row-span-2",
  wide: "col-span-2 row-span-1",
  square: "col-span-1 row-span-1",
};

const MIN_HEIGHT_CLASSES: Record<LinkObjectSize, string> = {
  featured: "min-h-[260px] md:min-h-[340px]",
  wide: "min-h-[136px]",
  square: "min-h-[136px] md:min-h-[160px]",
};

/** Touch devices skip drag/tilt entirely — tapping stays effortless, per the brief's mobile priority. */
function useCoarsePointer() {
  const [coarse, setCoarse] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    setCoarse(mq.matches);
    const handler = (e: MediaQueryListEvent) => setCoarse(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return coarse;
}

export function LinkObjectCard({
  title,
  description,
  to,
  hash,
  href,
  external,
  onClick,
  Icon,
  featured = false,
  size,
  index,
}: {
  title: string;
  description?: string;
  to?: string;
  hash?: string;
  href?: string;
  external?: boolean;
  /** When set, the card is a button that runs this instead of navigating (e.g. opens a drawer). */
  onClick?: (() => void) | undefined;
  Icon: LucideIcon;
  featured?: boolean;
  size: LinkObjectSize;
  index: number;
}) {
  const prefersReducedMotion = useReducedMotion();
  const isCoarsePointer = useCoarsePointer();
  const rotateX = useSpring(0, { stiffness: 320, damping: 22, mass: 0.5 });
  const rotateY = useSpring(0, { stiffness: 320, damping: 22, mass: 0.5 });

  const allowTilt = !prefersReducedMotion && !isCoarsePointer;
  const allowDrag = !prefersReducedMotion && !isCoarsePointer;

  function handlePointerMove(e: ReactPointerEvent<HTMLElement>) {
    if (!allowTilt || e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(px * 6);
    rotateX.set(py * -6);
  }

  function handlePointerLeave() {
    rotateX.set(0);
    rotateY.set(0);
  }

  // `animate` always resolves to the same resting state so a card can never get
  // stuck mid-entrance — reduced motion only removes the "from" state and the
  // hover/tap/tilt/drag flourishes, never the guarantee that it ends up visible.
  const motionProps = {
    initial: prefersReducedMotion ? false : { opacity: 0, y: 16, scale: 0.96 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: prefersReducedMotion
      ? { duration: 0 }
      : { delay: index * 0.06, type: "spring" as const, stiffness: 260, damping: 26 },
    ...(prefersReducedMotion
      ? {}
      : {
          whileHover: { scale: 1.02, y: -4 },
          whileTap: { scale: 0.97 },
        }),
    ...(allowTilt
      ? {
          style: { rotateX, rotateY },
          onPointerMove: handlePointerMove,
          onPointerLeave: handlePointerLeave,
        }
      : {}),
    ...(allowDrag
      ? {
          drag: true as const,
          dragElastic: 0.12,
          dragConstraints: { top: 0, left: 0, right: 0, bottom: 0 },
          dragMomentum: false,
          dragTransition: { bounceStiffness: 500, bounceDamping: 34 },
        }
      : {}),
  };

  const classes = cn(
    "group relative flex flex-col justify-between rounded-2xl p-5 shadow-soft outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-wine focus-visible:ring-offset-2 md:p-6",
    SPAN_CLASSES[size],
    MIN_HEIGHT_CLASSES[size],
    featured
      ? "bg-wine text-primary-foreground hover:bg-wine-deep hover:shadow-lift"
      : "border border-ink/12 bg-background text-ink hover:border-wine hover:bg-champagne-soft",
  );

  const content = (
    <>
      <span
        className={cn(
          "flex size-10 items-center justify-center rounded-full",
          featured ? "bg-background/15" : "bg-champagne-soft text-wine",
        )}
      >
        <Icon size={18} aria-hidden="true" />
      </span>
      <span className="mt-4 min-w-0 pr-7">
        <span className="block font-display text-lg font-medium tracking-tight md:text-xl">
          {title}
        </span>
        {description ? (
          <span
            className={cn(
              "mt-1 block text-sm",
              featured ? "text-primary-foreground/80" : "text-muted-foreground",
            )}
          >
            {description}
          </span>
        ) : null}
      </span>
      <ArrowUpRight
        size={18}
        aria-hidden="true"
        className="absolute right-5 top-5 shrink-0 opacity-60 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
      />
    </>
  );

  if (onClick) {
    return (
      <MotionButton
        type="button"
        aria-haspopup="dialog"
        onClick={onClick}
        className={cn(classes, "text-left")}
        {...motionProps}
      >
        {content}
      </MotionButton>
    );
  }

  if (href) {
    return (
      <MotionAnchor
        href={href}
        {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
        className={classes}
        {...motionProps}
      >
        {content}
      </MotionAnchor>
    );
  }

  return (
    <MotionLink to={(to ?? "/") as never} hash={hash as never} className={classes} {...motionProps}>
      {content}
    </MotionLink>
  );
}
