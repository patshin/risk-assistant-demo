import { ArrowDownRight, ArrowUpRight, Minus, PieChart, ShieldCheck } from "lucide-react";
import { formatAmount, formatPercent, formatSignedAmount } from "../../data/investmentRisk";

type GroupVarOverviewCardProps = {
  value: number | null;
  previousMonthDelta: number | null;
  limit: number | null;
  limitUsage: number | null;
  remainingLimit: number | null;
};

function GroupVarPrimaryMetric({ value, previousMonthDelta }: Pick<GroupVarOverviewCardProps, "value" | "previousMonthDelta">) {
  const DeltaIcon = previousMonthDelta === null || previousMonthDelta === 0
    ? Minus
    : previousMonthDelta < 0
      ? ArrowDownRight
      : ArrowUpRight;

  return (
    <div className="group-var-overview__primary">
      <div className="group-var-overview__title">
        <span className="group-var-overview__title-icon" aria-hidden="true"><ShieldCheck size={18} strokeWidth={2.1} /></span>
        <h2>集团 VaR</h2>
      </div>

      <div className="group-var-overview__metric">
        <strong>{formatAmount(value)}</strong>
        {value === null ? null : <span>亿元</span>}
      </div>

      <div className="group-var-overview__delta">
        <DeltaIcon size={12} strokeWidth={2.1} aria-hidden="true" />
        <span>{previousMonthDelta === null ? "暂无环比数据" : `较上月 ${formatSignedAmount(previousMonthDelta)} 亿元`}</span>
      </div>
    </div>
  );
}

function VarLimitGauge({ value, limit, limitUsage }: Pick<GroupVarOverviewCardProps, "value" | "limit" | "limitUsage">) {
  const progress = Math.max(0, Math.min(limitUsage ?? 0, 1));
  const isOverLimit = limitUsage !== null && limitUsage > 1;
  const valueCopy = value === null ? "集团 VaR 暂无数据" : `集团 VaR ${formatAmount(value)} 亿元`;
  const limitCopy = limit === null || limit <= 0 ? "集团限额未配置" : `集团限额 ${formatAmount(limit)} 亿元`;
  const usageCopy = limitUsage === null ? "集团 VaR 限额使用率不可计算" : `集团 VaR 限额使用率 ${formatPercent(limitUsage)}`;

  return (
    <div className="group-var-overview__gauge-panel">
      <h3>限额使用率</h3>
      <div className={`group-var-gauge${isOverLimit ? " is-over-limit" : ""}`} role="img" aria-label={`${usageCopy}，${valueCopy}，${limitCopy}`}>
        <svg viewBox="0 0 176 108" aria-hidden="true" focusable="false">
          <path className="group-var-gauge__track" d="M 13 92 A 75 75 0 0 1 163 92" pathLength="100" />
          {limitUsage === null ? null : (
            <path
              className="group-var-gauge__progress"
              d="M 13 92 A 75 75 0 0 1 163 92"
              pathLength="100"
              strokeDasharray={`${progress * 100} 100`}
            />
          )}
        </svg>
        <div className="group-var-gauge__value">
          <strong>{formatPercent(limitUsage)}</strong>
          {limitUsage === null ? <small>{limit === null || limit <= 0 ? "限额未配置" : "数据不可用"}</small> : isOverLimit ? <small>已超限</small> : null}
        </div>
      </div>
    </div>
  );
}

function VarLimitSummary({ limit, remainingLimit }: Pick<GroupVarOverviewCardProps, "limit" | "remainingLimit">) {
  const hasLimit = limit !== null && limit > 0;

  return (
    <div className="group-var-overview__summary">
      <div className="group-var-overview__summary-item is-limit">
        <span className="group-var-overview__summary-icon" aria-hidden="true">
          <PieChart size={12} strokeWidth={2.1} />
        </span>
        <span className="group-var-overview__summary-copy">
          <span className="group-var-overview__summary-label group-var-overview__summary-label--long">集团 VaR 限额</span>
          <span className="group-var-overview__summary-label group-var-overview__summary-label--short">集团限额</span>
          <strong>{hasLimit ? formatAmount(limit) : "—"}</strong>
          {hasLimit ? <span>亿元</span> : null}
        </span>
      </div>
      <i className="group-var-overview__summary-divider" aria-hidden="true" />
      <div className="group-var-overview__summary-item is-remaining">
        <span className="group-var-overview__summary-copy">
          <span className="group-var-overview__summary-label">剩余额度</span>
          <strong>{formatAmount(remainingLimit)}</strong>
          {remainingLimit === null ? null : <span>亿元</span>}
        </span>
      </div>
    </div>
  );
}

export function GroupVarOverviewCard(props: GroupVarOverviewCardProps) {
  return (
    <section className="group-var-overview" aria-label="集团 VaR 总览">
      <div className="group-var-overview__main">
        <GroupVarPrimaryMetric value={props.value} previousMonthDelta={props.previousMonthDelta} />
        <div className="group-var-overview__main-divider" aria-hidden="true" />
        <VarLimitGauge value={props.value} limit={props.limit} limitUsage={props.limitUsage} />
      </div>
      <VarLimitSummary limit={props.limit} remainingLimit={props.remainingLimit} />
    </section>
  );
}
