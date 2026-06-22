import type { ReactNode } from "react";

type MetricCardProps = {
  label: string;
  value: string;
  trend?: string;
  children?: ReactNode;
};

export function MetricCard({ label, value, trend, children }: MetricCardProps) {
  return (
    <article className="metric-card surface-card glass-card">
      <p>{label}</p>
      <strong>{value}</strong>
      {trend ? <span>{trend}</span> : null}
      {children ? <div className="metric-card__visual">{children}</div> : null}
    </article>
  );
}
