import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { PillTag } from "./PillTag";

type RiskCardProps = {
  title: string;
  subtitle: string;
  temperatureLabel: string;
  metaLabel?: string | null;
  tagVariant?: "high" | "mediumHigh" | "watch" | "warming" | "tracked" | "neutral";
  icon?: ReactNode;
  visual?: ReactNode;
  onClick?: () => void;
};

export function RiskCard({ title, subtitle, temperatureLabel, metaLabel, tagVariant = "neutral", icon, visual, onClick }: RiskCardProps) {
  const resolvedMetaLabel = metaLabel === undefined ? "风险温度" : metaLabel;

  return (
    <button className="risk-card glass-card" type="button" onClick={onClick}>
      <span className="risk-card__arrow">
        <ChevronRight size={16} />
      </span>
      <div>
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>
      <div className="risk-card__meta">
        {resolvedMetaLabel ? <span>{resolvedMetaLabel}</span> : null}
        <PillTag variant={tagVariant}>{temperatureLabel}</PillTag>
      </div>
      <div className="risk-card__visual">{visual ?? icon}</div>
    </button>
  );
}
