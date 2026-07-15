import { useEffect, useState, type ReactNode } from "react";
import { AlertTriangle, ArrowUpRight, CheckCircle2, ChevronRight, Clock3, Info, RotateCcw } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BottomAskBar, PageHeader, useCopilot } from "../../components";
import { provenanceLabels } from "./data";
import type { DataProvenance, DefaultStatus, RiskLevel, TrackingStatus, WarningStatus } from "./types";

type WarningScreenProps = {
  title: string;
  children: ReactNode;
  fallbackBackTo?: string;
  badge?: ReactNode;
  className?: string;
  showBack?: boolean;
  showAsk?: boolean;
  askPlaceholder?: string;
  copilotContext?: string;
  headerAction?: ReactNode;
};

export function WarningScreen({
  title,
  children,
  fallbackBackTo = "/credit/warning",
  badge,
  className = "",
  showBack = true,
  showAsk = true,
  askPlaceholder = "问预警、查出险、生成风险查询…",
  copilotContext,
  headerAction,
}: WarningScreenProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { openCopilot } = useCopilot();
  const returnTo = (location.state as { returnTo?: string } | null)?.returnTo;
  const [shareToast, setShareToast] = useState<{ message: string; tone: "success" | "error" } | null>(null);

  function returnToPreviousScreen() {
    const historyIndex = (window.history.state as { idx?: number } | null)?.idx;
    if (typeof historyIndex === "number" && historyIndex > 0) {
      navigate(-1);
      return;
    }
    navigate(returnTo ?? fallbackBackTo, { replace: true });
  }

  async function shareCurrentPage() {
    const shareData = { title, text: `${title} · AI 风控助手`, url: window.location.href };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        setShareToast({ message: "页面已分享", tone: "success" });
        return;
      }
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(window.location.href);
        setShareToast({ message: "页面链接已复制", tone: "success" });
        return;
      }
      setShareToast({ message: "当前浏览器暂不支持分享", tone: "error" });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setShareToast({ message: "分享未完成，请稍后重试", tone: "error" });
    }
  }

  const action =
    headerAction ??
    (showBack ? (
      <button className="warning-header-share" type="button" aria-label="分享当前页面" title="分享当前页面" onClick={shareCurrentPage}>
        <ArrowUpRight size={19} />
      </button>
    ) : null);

  return (
    <div className={`page warning-page${className ? ` ${className}` : ""}`}>
      <div className="page-scroll">
        <PageHeader
          title={title}
          badge={badge}
          onBack={showBack ? returnToPreviousScreen : undefined}
          action={action}
        />
        {children}
      </div>
      {showAsk ? (
        <BottomAskBar
          placeholder={askPlaceholder}
          onOpen={() =>
            openCopilot({
              intent: "warningFacts",
              context: copilotContext ?? "正在基于“预警与出险”结构化数据查询",
            })
          }
        />
      ) : null}
      <WarningToast message={shareToast?.message ?? null} tone={shareToast?.tone} onDismiss={() => setShareToast(null)} />
    </div>
  );
}

export function WarningTopTabs() {
  const location = useLocation();
  const tabs = [
    { label: "大户风险", to: "/credit?tab=large" },
    { label: "集中度风险", to: "/credit?tab=concentration" },
    { label: "预警与出险", to: "/credit/warning" },
  ];

  return (
    <nav className="warning-top-tabs" aria-label="信用风险模块">
      {tabs.map((tab) => {
        const active = tab.to === "/credit/warning" && location.pathname.startsWith("/credit/warning");
        return (
          <Link key={tab.label} to={tab.to} className={active ? "is-active" : undefined} aria-current={active ? "page" : undefined}>
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function WarningSection({ title, meta, action, children, className = "" }: { title: string; meta?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`warning-section${className ? ` ${className}` : ""}`}>
      <header className="warning-section__header">
        <div>
          <h2>{title}</h2>
          {meta ? <p>{meta}</p> : null}
        </div>
        {action}
      </header>
      {children}
    </section>
  );
}

export function DataMeta({ date, provenance = "confirmed", note }: { date: string; provenance?: DataProvenance; note?: string }) {
  return (
    <div className="warning-data-meta">
      <span>数据截至 {date}</span>
      <span className={`provenance-tag provenance-tag--${provenance}`}>{provenanceLabels[provenance].label}</span>
      {note ? <span className="warning-data-meta__note">{note}</span> : null}
    </div>
  );
}

export function RiskStatusTag({
  level,
  warningStatus,
  defaultStatus,
  trackingStatus,
}: {
  level?: RiskLevel;
  warningStatus?: WarningStatus;
  defaultStatus?: DefaultStatus;
  trackingStatus?: TrackingStatus;
}) {
  if (defaultStatus === "defaulted") return <span className="warning-tag warning-tag--danger">已出险</span>;
  if (defaultStatus === "historical") return <span className="warning-tag warning-tag--neutral">历史出险</span>;
  if (trackingStatus === "tracking") return <span className="warning-tag warning-tag--tracked">跟踪中</span>;
  if (trackingStatus === "creationPending") return <span className="warning-tag warning-tag--neutral">待创建</span>;
  if (trackingStatus === "notTracking") return <span className="warning-tag warning-tag--neutral">未跟踪</span>;
  if (warningStatus === "released") return <span className="warning-tag warning-tag--neutral">已解除预警</span>;
  if (warningStatus === "historical") return <span className="warning-tag warning-tag--neutral">历史预警</span>;
  if (level === "major") return <span className="warning-tag warning-tag--major">重大预警</span>;
  if (level === "level2") return <span className="warning-tag warning-tag--level2">二级预警</span>;
  if (level === "level1") return <span className="warning-tag warning-tag--level1">一级预警</span>;
  if (warningStatus === "active") return <span className="warning-tag warning-tag--level1">预警中</span>;
  if (level === "normal") return <span className="warning-tag warning-tag--neutral">正常</span>;
  return null;
}

export function AmountValue({ value, unit = "亿元", compact = false }: { value: string | number; unit?: string; compact?: boolean }) {
  const unavailable = value === "—";
  return (
    <span className={`warning-amount${compact ? " is-compact" : ""}${unavailable ? " is-unavailable" : ""}`}>
      <strong>{value}</strong>
      {unavailable ? null : <em>{unit}</em>}
    </span>
  );
}

export function ExpandableText({ text, threshold = 72 }: { text: string; threshold?: number }) {
  const [expanded, setExpanded] = useState(false);
  const expandable = text.length > threshold;
  return (
    <span className={`warning-expandable-text${expanded ? " is-expanded" : ""}`}>
      <span className={expandable && !expanded ? "is-collapsed" : undefined}>{text}</span>
      {expandable ? (
        <button type="button" aria-expanded={expanded} onClick={() => setExpanded((current) => !current)}>
          {expanded ? "收起" : "展开完整原因"}
        </button>
      ) : null}
    </span>
  );
}

export function RouteLink({ to, children, className = "", ariaLabel }: { to: string; children: ReactNode; className?: string; ariaLabel?: string }) {
  const location = useLocation();
  return (
    <Link
      to={to}
      state={{ returnTo: `${location.pathname}${location.search}` }}
      className={className}
      aria-label={ariaLabel}
    >
      {children}
    </Link>
  );
}

export function ActionLink({ to, children, state }: { to: string; children: ReactNode; state?: Record<string, unknown> }) {
  const location = useLocation();
  return (
    <Link className="warning-action-link" to={to} state={{ returnTo: `${location.pathname}${location.search}`, ...state }}>
      <span>{children}</span>
      <ChevronRight size={17} />
    </Link>
  );
}

export function DetailRows({ rows }: { rows: Array<{ label: string; value: ReactNode; wide?: boolean }> }) {
  return (
    <dl className="warning-detail-rows">
      {rows.map((row) => (
        <div key={row.label} className={row.wide ? "is-wide" : undefined}>
          <dt>{row.label}</dt>
          <dd>{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Timeline({ items }: { items: Array<{ date: string; title: string; detail: string; tone?: "danger" | "warning" | "neutral" }> }) {
  return (
    <ol className="warning-timeline">
      {items.map((item, index) => (
        <li key={`${item.date}-${item.title}`} className={`warning-timeline__item is-${item.tone ?? "neutral"}`}>
          <span className="warning-timeline__rail" aria-hidden="true">
            <i />
            {index < items.length - 1 ? <b /> : null}
          </span>
          <div>
            <time>{item.date}</time>
            <strong>{item.title}</strong>
            <p>{item.detail}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function StatusPanel({
  state,
  title,
  description,
  onRetry,
  onReset,
  resetLabel = "清除筛选",
}: {
  state: "loading" | "error" | "empty" | "no-results";
  title?: string;
  description?: string;
  onRetry?: () => void;
  onReset?: () => void;
  resetLabel?: string;
}) {
  const defaults = {
    loading: { title: "正在加载风险数据", description: "正在核对客户、资产和状态口径。", icon: Clock3 },
    error: { title: "风险数据暂时不可用", description: "请稍后重试，已有筛选条件不会丢失。", icon: AlertTriangle },
    empty: { title: "当前没有风险事项", description: "该范围内暂无需要处理的预警或出险。", icon: CheckCircle2 },
    "no-results": { title: "没有匹配结果", description: "可调整关键词或清除筛选条件。", icon: AlertTriangle },
  } as const;
  const current = defaults[state];
  const Icon = current.icon;
  return (
    <section className={`warning-status-panel is-${state}`} aria-live="polite" aria-busy={state === "loading"}>
      <span className="warning-status-panel__icon">{state === "loading" ? <i /> : <Icon size={24} />}</span>
      <h2>{title ?? current.title}</h2>
      <p>{description ?? current.description}</p>
      {onRetry ? (
        <button className={state === "error" ? "primary-button" : "ghost-button"} type="button" onClick={onRetry}>
          <RotateCcw size={16} /> 重新加载
        </button>
      ) : null}
      {onReset ? (
        <button className="ghost-button" type="button" onClick={onReset}>
          <RotateCcw size={16} /> {resetLabel}
        </button>
      ) : null}
    </section>
  );
}

export function WarningToast({
  message,
  tone = "success",
  onDismiss,
}: {
  message: string | null;
  tone?: "success" | "error";
  onDismiss?: () => void;
}) {
  useEffect(() => {
    if (!message || !onDismiss) return;
    const timer = window.setTimeout(onDismiss, tone === "error" ? 5000 : 2800);
    return () => window.clearTimeout(timer);
  }, [message, onDismiss, tone]);

  if (!message) return null;
  return (
    <div className={`warning-toast${tone === "error" ? " is-error" : ""}`} role={tone === "error" ? "alert" : "status"}>
      {tone === "error" ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}
      <span>{message}</span>
      {onDismiss ? (
        <button type="button" aria-label="关闭提示" onClick={onDismiss}>
          ×
        </button>
      ) : null}
    </div>
  );
}

export function AiFactNote({ children }: { children: ReactNode }) {
  return (
    <div className="warning-ai-fact-note">
      <Info size={17} aria-hidden="true" />
      <p>{children}</p>
    </div>
  );
}
