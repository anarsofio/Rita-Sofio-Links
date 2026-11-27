export function FormField({
  id,
  label,
  type = "text",
  required,
}: {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div className="grid gap-2">
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
        {required ? (
          <span aria-hidden="true" className="ml-1 text-destructive">
            *
          </span>
        ) : null}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        className="h-12 rounded-xl border border-input bg-background px-4 text-sm text-ink placeholder:text-muted-foreground"
      />
    </div>
  );
}
