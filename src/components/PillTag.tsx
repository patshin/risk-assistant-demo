import type { ReactNode } from "react";

type PillTagVariant = "high" | "mediumHigh" | "watch" | "warming" | "tracked" | "neutral";

type PillTagProps = {
  variant?: PillTagVariant;
  children: ReactNode;
};

export function PillTag({ variant = "neutral", children }: PillTagProps) {
  return <span className={`pill-tag status-badge risk-badge pill-tag--${variant}`}>{children}</span>;
}
