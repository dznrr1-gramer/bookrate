import { Star } from "lucide-react";

interface RatingProps {
  value: number;
  reviewCount?: number;
}

export function Rating({ value, reviewCount }: RatingProps) {
  const formattedValue = value.toFixed(1);
  const reviewLabel =
    reviewCount === undefined ? "" : ` dari ${reviewCount} ulasan`;

  return (
    <span
      aria-label={`Rating ${formattedValue} dari 5${reviewLabel}`}
      className="inline-flex items-center gap-1 text-sm font-semibold text-star"
      role="img"
    >
      <Star aria-hidden="true" className="size-4 fill-current" />
      <span aria-hidden="true">{formattedValue}</span>
    </span>
  );
}
