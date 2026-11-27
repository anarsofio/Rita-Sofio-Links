import { CheckCircle2 } from "lucide-react";
import { CtaButton } from "@/components/site/CtaButton";

export function FormSuccessNotice({
  title = "Message sent",
  description,
  resetLabel = "Send another",
  onReset,
}: {
  title?: string;
  description: string;
  resetLabel?: string;
  onReset: () => void;
}) {
  return (
    <div
      role="status"
      className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-8 text-center"
    >
      <span className="flex size-14 items-center justify-center rounded-full bg-champagne-soft text-wine">
        <CheckCircle2 size={28} aria-hidden="true" />
      </span>
      <div>
        <p className="font-display text-lg text-ink">{title}</p>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      <CtaButton type="button" variant="outline" onClick={onReset}>
        {resetLabel}
      </CtaButton>
    </div>
  );
}
