import { useMemo, useState, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowDownRight,
  ArrowUpRight,
  Bot,
  Check,
  ChevronRight,
  CircleAlert,
  CircleCheck,
  Info,
  Minus,
} from "lucide-react";
import { BottomAskBar } from "../BottomAskBar";
import { BottomSheet } from "../BottomSheet";
import { PageHeader } from "../PageHeader";
import { useCopilot, type InvestmentSourceContext } from "../GlobalCopilot";
import {
  categoryLabels,
  eventStateLabels,
  formatMetricParts,
  formatNumber,
  investmentRiskSnapshot,
  riskLevelLabels,
  trackingStatusLabels,
  verificationLabels,
  type AssetClass,
  type EventState,
  type InvestmentChange,
  type InvestmentRiskSnapshot,
  type Metric,
  type RiskLevel,
  type TrackingStatus,
  type VerificationStatus,
} from "../../data/investmentRisk";

export type InvestmentRouteState = { returnTo?: string };

export function InvestmentPage({
  title,
  subtitle,
  children,
  snapshot = investmentRiskSnapshot,
  backTo = "/investment",
  sourceContext,
  askPlaceholder = "问投资风险、证据和后续动作…",
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  snapshot?: InvestmentRiskSnapshot;
  backTo?: string;
  sourceContext?: Partial<InvestmentSourceContext>;
  askPlaceholder?: string;
  footer?: ReactNode;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { openCopilot } = useCopilot();
  const [scopeOpen, setScopeOpen] = useState(false);
  const routeState = location.state as InvestmentRouteState | null;
  const resolvedContext: InvestmentSourceContext = {
    module: "investment",
    snapshotId: snapshot.id,
    route: `${location.pathname}${location.search}`,
    period: snapshot.period,
    dataStatus: snapshot.dataStatus,
    compareBasis: snapshot.defaultCompareBasis,
    ...sourceContext,
  };

  const goBack = () => {
    const target = routeState?.returnTo ?? backTo;
    navigate(target);
  };

  return (
    <div className="page investment-page">
      <div className={`investment-page__scroll${footer ? " has-sticky-actions" : ""}`}>
        <PageHeader
          title={title}
          onBack={goBack}
          action={
            <button className="icon-button" type="button" aria-label="查看数据口径" onClick={() => setScopeOpen(true)}>
              <Info size={20} />
            </button>
          }
        />
        <p className="investment-page__subtitle">{subtitle}</p>
        {children}
      </div>
      {footer ?? (
        <BottomAskBar
          placeholder={askPlaceholder}
          onOpen={() => openCopilot({ intent: "general", sourceContext: resolvedContext })}
        />
      )}
      <ScopeSheet open={scopeOpen} snapshot={snapshot} onClose={() => setScopeOpen(false)} />
    </div>
  );
}

export function ScopeSheet({ open, snapshot, onClose }: { open: boolean; snapshot: InvestmentRiskSnapshot; onClose: () => void }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <BottomSheet open={open} title="数据口径与范围" className="investment-sheet" onClose={onClose}>
      <div className="investment-scope-list">
        <ScopeRow label="投资规模" value="集团投资资产" />
        <ScopeRow label="CII 收益" value="四家险资 CII 口径" />
        <ScopeRow label="VaR" value="VaR 计量资产" />
        <ScopeRow label="期间" value={snapshot.periodLabel} />
        <ScopeRow label="状态" value={`${snapshot.dataStatus === "reviewed" ? "已复核" : "待复核"} · ${snapshot.reviewedAt}`} tone={snapshot.dataStatus === "reviewed" ? "success" : undefined} />
      </div>
      <div className="investment-scope-warning">
        <CircleAlert size={18} />
        <p>{snapshot.scopeNote}</p>
      </div>
      <button className="investment-definition-toggle" type="button" aria-expanded={expanded} onClick={() => setExpanded((value) => !value)}>
        <span>什么是 VaR？</span>
        <ChevronRight className={expanded ? "is-expanded" : ""} size={18} />
      </button>
      {expanded ? (
        <p className="investment-definition-copy">
          VaR 是给定置信水平和持有期下的潜在损失估计，用于比较市场风险暴露；它不是实际亏损，也不能与成员因子 VaR 直接相加。
        </p>
      ) : null}
    </BottomSheet>
  );
}

function ScopeRow({ label, value, tone }: { label: string; value: string; tone?: "success" }) {
  return (
    <div className="investment-scope-row">
      <span>{label}</span>
      <strong className={tone ? `is-${tone}` : ""}>{value}</strong>
    </div>
  );
}

export function StatusBadge({
  kind,
  value,
}: {
  kind: "risk" | "verification" | "event" | "tracking";
  value: RiskLevel | VerificationStatus | EventState | TrackingStatus;
}) {
  const label =
    kind === "risk"
      ? riskLevelLabels[value as RiskLevel]
      : kind === "verification"
        ? verificationLabels[value as VerificationStatus]
        : kind === "event"
          ? eventStateLabels[value as EventState]
          : trackingStatusLabels[value as TrackingStatus];
  return <span className={`investment-status investment-status--${kind} is-${value}`}>{label}</span>;
}

export function MetricValue({ metric, signed = false, compact = false }: { metric: Metric; signed?: boolean; compact?: boolean }) {
  const formatted = formatMetricParts(metric, signed);
  return (
    <strong className={compact ? "investment-number is-compact" : "investment-number"}>
      {formatted.value}{formatted.unit ? <em>{formatted.unit}</em> : null}
    </strong>
  );
}

export function MetricTile({
  metric,
  label,
  delta,
  hideSupportingText = false,
  tone = "neutral",
}: {
  metric: Metric;
  label?: string;
  delta?: string;
  hideSupportingText?: boolean;
  tone?: "neutral" | "good" | "attention";
}) {
  return (
    <article className={`investment-metric-tile is-${tone}`}>
      <span>{label ?? metric.label}</span>
      <MetricValue metric={metric} compact />
      {hideSupportingText ? null : <small>{delta || metric.scope}</small>}
    </article>
  );
}

export function Delta({ value, suffix = "", reverse = false }: { value: number; suffix?: string; reverse?: boolean }) {
  const improving = reverse ? value > 0 : value < 0;
  const Icon = value > 0 ? ArrowUpRight : value < 0 ? ArrowDownRight : Minus;
  return (
    <span className={`investment-delta ${improving ? "is-good" : value === 0 ? "is-neutral" : "is-attention"}`}>
      <Icon size={14} />
      {value > 0 ? "+" : ""}{formatNumber(value, Number.isInteger(value) ? 0 : 2)}{suffix}
    </span>
  );
}

export function ChangeCard({ change, onClick }: { change: InvestmentChange; onClick: () => void }) {
  return (
    <button className="investment-change-card" type="button" onClick={onClick}>
      <div className="investment-change-card__head">
        <span className={`investment-category is-${change.category}`}>{categoryLabels[change.category]}</span>
        <div>
          {change.verification === "pending" ? <StatusBadge kind="verification" value={change.verification} /> : null}
          <StatusBadge kind="risk" value={change.riskLevel} />
        </div>
      </div>
      <h3>{change.title}</h3>
      <p>{change.summary}</p>
      <div className="investment-change-card__foot">
        <StatusBadge kind="event" value={change.eventState} />
        {change.trackingStatus !== "untracked" ? <StatusBadge kind="tracking" value={change.trackingStatus} /> : null}
        <span>{change.updatedAt}</span>
        <ChevronRight size={17} />
      </div>
    </button>
  );
}

export function AssetDonut({ assets, total, label = "投资规模" }: { assets: AssetClass[]; total: number; label?: string }) {
  const share = (amount: number) => total > 0 ? (amount / total) * 100 : 0;
  let cursor = 0;
  const stops = assets.map((asset) => {
    const start = cursor;
    cursor += share(asset.amount);
    return `${asset.color} ${start}% ${cursor}%`;
  });
  const background = total > 0 ? `conic-gradient(${stops.join(",")})` : "#f4e8d9";
  return (
    <div className="investment-donut" role="img" aria-label={total > 0 ? assets.map((asset) => `${asset.name} ${share(asset.amount).toFixed(1)}%`).join("，") : "暂无资产结构数据"}>
      <div className="investment-donut__chart" style={{ background }}>
        <div><strong>{formatNumber(total)}</strong><span>亿元</span></div>
      </div>
      <div className="investment-donut__legend">
        <small>{label}</small>
        {assets.map((asset) => (
          <div key={asset.id}>
            <i style={{ backgroundColor: asset.color }} />
            <span>{asset.name}</span>
            <strong>{formatNumber(asset.amount)} 亿</strong>
            <em>{total > 0 ? `${share(asset.amount).toFixed(1)}%` : "—"}</em>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LineChart({ data, unit = "" }: { data: Array<{ label: string; value: number }>; unit?: string }) {
  const { points, min, max } = useMemo(() => {
    if (data.length === 0) return { points: "", min: 0, max: 0 };
    const values = data.map((point) => point.value);
    const nextMin = Math.min(...values);
    const nextMax = Math.max(...values);
    const range = nextMax - nextMin || 1;
    const list = data.map((point, index) => {
      const x = data.length === 1 ? 50 : (index / (data.length - 1)) * 100;
      const y = 62 - ((point.value - nextMin) / range) * 48;
      return `${x},${y}`;
    });
    return { points: list.join(" "), min: nextMin, max: nextMax };
  }, [data]);

  if (data.length === 0) return <div className="investment-empty-chart"><strong>暂无趋势数据</strong><span>当前期间暂无可用数据</span></div>;

  return (
    <div className="investment-line-chart" role="img" aria-label={data.map((point) => `${point.label} ${point.value}${unit}`).join("，")}>
      <div className="investment-line-chart__range"><span>{max}{unit}</span><span>{min}{unit}</span></div>
      <svg viewBox="0 0 100 70" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="investment-line-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ff8a32" stopOpacity=".28" />
            <stop offset="1" stopColor="#ff8a32" stopOpacity="0" />
          </linearGradient>
        </defs>
        {data.length > 1 ? <polygon points={`0,68 ${points} 100,68`} fill="url(#investment-line-fill)" /> : null}
        <polyline points={points} fill="none" stroke="#ff6a00" strokeWidth="2.2" vectorEffect="non-scaling-stroke" />
        {data.map((point, index) => {
          const [x, y] = points.split(" ")[index].split(",");
          return <circle key={point.label} cx={x} cy={y} r="2" fill="#fff" stroke="#ff6a00" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />;
        })}
      </svg>
      <div className="investment-line-chart__labels">
        {data.map((point) => <span key={point.label}>{point.label}</span>)}
      </div>
      {data.length === 1 ? <p className="investment-line-chart__note">仅有一期数据，不绘制趋势面积</p> : null}
    </div>
  );
}

export function HorizontalBars({
  rows,
  unit = "亿元",
  onRow,
}: {
  rows: Array<{ id: string; label: string; value: number; note?: string }>;
  unit?: string;
  onRow?: (id: string) => void;
}) {
  const max = Math.max(...rows.map((row) => row.value), 1);
  if (rows.length === 0) return <div className="investment-empty-chart"><strong>暂无排行数据</strong><span>当前口径没有可比较值</span></div>;
  return (
    <div className="investment-bars">
      {rows.map((row, index) => {
        const content = (
          <>
            <div className="investment-bars__rank">{index + 1}</div>
            <div className="investment-bars__content">
              <div><span>{row.label}</span><strong>{formatNumber(row.value, unit === "%" ? 2 : 0)}{unit}</strong></div>
              <i><b style={{ width: `${Math.max(4, (row.value / max) * 100)}%` }} /></i>
              {row.note ? <small>{row.note}</small> : null}
            </div>
            {onRow ? <ChevronRight size={17} /> : null}
          </>
        );
        return onRow ? <button type="button" key={row.id} onClick={() => onRow(row.id)}>{content}</button> : <div key={row.id}>{content}</div>;
      })}
    </div>
  );
}

export function EvidenceStatus({ confirmed = true }: { confirmed?: boolean }) {
  return (
    <span className={`investment-evidence-status ${confirmed ? "is-confirmed" : "is-pending"}`}>
      {confirmed ? <CircleCheck size={15} /> : <CircleAlert size={15} />}
      {confirmed ? "已复核" : "待核验"}
    </span>
  );
}

export function AIConclusion({ children }: { children: ReactNode }) {
  return (
    <section className="investment-ai-conclusion">
      <div><Bot size={18} /><span>AI 管理解读</span></div>
      <p>{children}</p>
      <small><Check size={14} />基于已复核数据生成，需由人确认后进入跟踪或汇报</small>
    </section>
  );
}
