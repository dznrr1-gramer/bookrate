import {
  AlertCircle,
  CheckCircle2,
  LoaderCircle,
  type LucideIcon,
} from "lucide-react";

type FeedbackStatus = "loading" | "error" | "success" | "empty";

interface FeedbackProps {
  status: FeedbackStatus;
  title: string;
  description?: string;
}

const feedbackIcons: Partial<Record<FeedbackStatus, LucideIcon>> = {
  loading: LoaderCircle,
  error: AlertCircle,
  success: CheckCircle2,
};

export function Feedback({ status, title, description }: FeedbackProps) {
  const Icon = feedbackIcons[status];

  return (
    <div
      aria-live={status === "error" ? "assertive" : "polite"}
      className="rounded-2xl border border-border bg-surface-muted p-8 text-center"
      role={status === "error" ? "alert" : "status"}
    >
      {Icon ? (
        <Icon
          aria-hidden="true"
          className={`mx-auto mb-3 size-5 text-forest ${status === "loading" ? "animate-spin" : ""}`}
        />
      ) : null}
      <p className="font-semibold text-ink">{title}</p>
      {description ? (
        <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
      ) : null}
    </div>
  );
}
