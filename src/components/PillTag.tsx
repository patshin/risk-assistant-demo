import type { ReactNode } from "react";

type PillTagVariant = "high" | "mediumHigh" | "watch" | "warming" | "tracked" | "neutral";

type PillTagProps = {
  variant?: PillTagVariant;
  children: ReactNode;
};

export function PillTag({ variant = "neutral", children }: PillTagProps) {
  return <span className={`pill-tag pill-tag--${variant}`}>{children}</span>;
}
