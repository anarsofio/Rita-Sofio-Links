import { X } from "lucide-react";
import { AnimatePresence, motion, useDragControls, useReducedMotion } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CtaButton } from "@/components/site/CtaButton";
import { FormField } from "@/components/site/FormField";
import { FormSuccessNotice } from "@/components/site/FormSuccessNotice";
import { useWeb3FormsForm } from "@/hooks/use-web3forms-form";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Bottom-sheet drawer holding the same "Send a message" form as the main
 * site's Contact section (Name, Email, How can I help you?), sent through
 * Web3Forms to the same inbox. Swipe down, tap outside, press Esc or use
 * the close button to dismiss.
 */
export function ContactDrawer({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const dragControls = useDragControls();
  const [mounted, setMounted] = useState(false);
  const { status, errorMessage, submit, reset } = useWeb3FormsForm();

  useEffect(() => setMounted(true), []);

  function close() {
    onOpenChange(false);
  }

  // Lock page scroll, move focus into the drawer, trap Tab, close on Esc,
  // and give focus back to whatever opened it.
  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>("input, textarea")?.focus();
    }, 50);

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onOpenChange(false);
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const items = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      const first = items[0];
      const last = items[items.length - 1];
      if (!first || !last) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
      previouslyFocused?.focus?.();
    };
  }, [open, onOpenChange]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence onExitComplete={reset}>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 bg-ink/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
            onClick={close}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-background px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-3 shadow-lift"
            initial={prefersReducedMotion ? { opacity: 0 } : { y: "100%" }}
            animate={prefersReducedMotion ? { opacity: 1 } : { y: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { y: "100%" }}
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : { type: "spring", stiffness: 380, damping: 38, mass: 0.8 }
            }
            {...(prefersReducedMotion
              ? {}
              : {
                  drag: "y" as const,
                  dragConstraints: { top: 0, bottom: 0 },
                  dragElastic: { top: 0, bottom: 0.6 },
                  dragListener: false,
                  dragControls,
                })}
            onDragEnd={(_, info) => {
              if (info.offset.y > 120 || info.velocity.y > 600) close();
            }}
          >
            {/* Grab bar: dragging starts only here, so scrolling the form never drags the drawer. */}
            <div
              aria-hidden="true"
              className="mx-auto mb-4 flex h-6 w-full cursor-grab touch-none items-center justify-center active:cursor-grabbing"
              onPointerDown={(e) => {
                if (!prefersReducedMotion) dragControls.start(e);
              }}
            >
              <span className="h-1.5 w-12 rounded-full bg-ink/20" />
            </div>

            <div className="mb-5 flex items-start justify-between gap-4">
              <h2 id={titleId} className="font-display text-xl tracking-tight text-ink">
                Send a message
              </h2>
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="-mr-2 -mt-1 flex size-9 items-center justify-center rounded-full text-ink/70 transition-colors hover:bg-champagne-soft hover:text-ink"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            {status === "success" ? (
              <FormSuccessNotice
                description="Thanks for reaching out — I'll get back to you as soon as possible."
                onReset={close}
              />
            ) : (
              <form
                className="grid gap-4"
                onSubmit={async (e) => {
                  e.preventDefault();
                  const data = new FormData(e.currentTarget);
                  await submit(e.currentTarget, "General Contact Form", {
                    Name: String(data.get("name") ?? ""),
                    Email: String(data.get("email") ?? ""),
                    Message: String(data.get("message") ?? ""),
                  });
                }}
              >
                <FormField id="name" label="Name" required />
                <FormField id="email" label="Email" type="email" required />
                <div className="grid gap-2">
                  <label htmlFor="message" className="text-sm font-medium text-ink">
                    How can I help you?
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    className="rounded-xl border border-input bg-background p-4 text-sm text-ink"
                  />
                </div>
                {errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}
                <CtaButton type="submit" full size="lg" loading={status === "loading"}>
                  Send
                </CtaButton>
              </form>
            )}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
