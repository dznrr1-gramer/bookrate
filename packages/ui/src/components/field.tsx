import type { InputHTMLAttributes, ReactNode } from "react";
import { Search } from "lucide-react";

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  description?: string;
  error?: string;
  icon?: ReactNode;
}

export function Field({
  id,
  label,
  description,
  error,
  icon,
  className = "",
  ...inputProps
}: FieldProps) {
  const fieldId = id ?? inputProps.name;
  if (!fieldId) {
    throw new Error("Field requires an id or name.");
  }

  const descriptionId = description ? `${fieldId}-description` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;
  const describedBy = [descriptionId, errorId].filter(Boolean).join(" ");

  return (
    <div className="w-full">
      <label className="sr-only" htmlFor={fieldId}>
        {label}
      </label>
      <div
        className={`flex min-h-12 items-center gap-3 rounded-full border border-border bg-page px-4 transition-colors focus-within:border-forest focus-within:ring-2 focus-within:ring-forest/15 ${error ? "border-danger" : ""}`}
      >
        {icon ?? (
          <Search aria-hidden="true" className="size-4 shrink-0 text-muted" />
        )}
        <input
          {...inputProps}
          aria-describedby={describedBy || undefined}
          aria-invalid={Boolean(error)}
          className={`ui-focus-ring min-w-0 flex-1 bg-transparent py-3 text-sm text-ink placeholder:text-muted ${className}`}
          id={fieldId}
        />
      </div>
      {description ? (
        <p className="mt-1.5 px-4 text-xs text-muted" id={descriptionId}>
          {description}
        </p>
      ) : null}
      {error ? (
        <p className="mt-1.5 px-4 text-xs font-medium text-danger" id={errorId}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
