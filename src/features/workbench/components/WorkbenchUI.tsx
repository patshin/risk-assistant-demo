import type { KeyboardEvent, ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  Check,
  ChevronDown,
  ChevronRight,
  Clock3,
  FileCheck2,
  MoreHorizontal,
  Search,
  ShieldAlert,
  Sparkles,
  UserRound,
} from "lucide-react";
import { matters, roleOptions, scopeOptions, type Matter } from "../data/workbenchDemoData";
import { useWorkbench } from "../state/workbenchStore";

export type WorkbenchSheetName = "scope" | "assign" | "progress" | "materials" | "directive" | "decision" | "search" | null;

export function WorkbenchHeader({ detail = false, onMore, onSearch }: { detail?: boolean; onMore?: () => void; onSearch?: () => void }) {
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = (location.state as { returnTo?: string } | null)?.returnTo;
  return (
    <header className="wb-topbar">
      <button type="button" className="wb-icon-button" aria-label="返回" onClick={() => detail ? navigate(returnTo ?? "/watch") : navigate("/")}>
        <ArrowLeft size={21} />
      </button>
      <h1>{detail ? "事项详情" : "个人工作台"}</h1>
      <button type="button" className="wb-icon-button" aria-label={detail ? "更多操作" : "搜索工作台"} onClick={detail ? onMore : onSearch}>
        {detail ? <MoreHorizontal size={21} /> : <Search size={20} />}
      </button>
    </header>
  );
}

export function WorkbenchIdentity({ onScope }: { onScope: () => void }) {
  const { state } = useWorkbench();
  const role = roleOptions.find((item) => item.value === state.role) ?? roleOptions[1];
  const scope = scopeOptions.find((item) => item.value === state.scope) ?? scopeOptions[0];
  return (
    <button className="wb-identity" type="button" onClick={onScope} aria-label="切换角色和数据范围">
      <span className="wb-identity__avatar"><UserRound size={17} /></span>
      <span className="wb-identity__copy">
        <strong>{role.label}</strong>
        <small>{scope.label} · 数据截至 2026-07-16 09:30</small>
      </span>
      <span className="wb-demo-tag">演示数据</span>
      <ChevronDown size={15} />
    </button>
  );
}

const tabs = [
  { to: "/watch", label: "总览" },
  { to: "/watch/queue", label: "待处理", count: 4 },
  { to: "/watch/tracking", label: "跟踪", count: 4 },
  { to: "/watch/reports", label: "汇报", count: 3 },
];

export function WorkbenchTabs() {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <nav className="wb-tabs" aria-label="工作台分区">
      {tabs.map((tab) => {
        const active = location.pathname === tab.to;
        return (
          <button key={tab.to} type="button" className={active ? "is-active" : ""} aria-current={active ? "page" : undefined} onClick={() => navigate(tab.to)}>
            {tab.label}{tab.count ? <span>{tab.count}</span> : null}
          </button>
        );
      })}
    </nav>
  );
}

export function SectionHeading({ title, meta, action, onAction }: { title: string; meta?: string; action?: string; onAction?: () => void }) {
  return (
    <div className="wb-section-heading">
      <div><h2>{title}</h2>{meta ? <span>{meta}</span> : null}</div>
      {action ? <button type="button" onClick={onAction}>{action}<ChevronRight size={15} /></button> : null}
    </div>
  );
}

export function WorkbenchTag({ children, tone = "neutral" }: { children: ReactNode; tone?: "critical" | "warning" | "info" | "success" | "neutral" | "purple" }) {
  return <span className={`wb-tag is-${tone}`}>{children}</span>;
}

function toneForMatter(matter: Matter) {
  if (matter.priority === "P0") return "critical" as const;
  if (matter.status === "已超期") return "warning" as const;
  if (matter.category === "投资") return "purple" as const;
  return "info" as const;
}

function activateCard(event: KeyboardEvent<HTMLElement>, action: () => void) {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    action();
  }
}

export function MatterCard({ matter, compact = false, actionLabel, onAction }: { matter: Matter; compact?: boolean; actionLabel?: string; onAction?: () => void }) {
  const navigate = useNavigate();
  const location = useLocation();
  const open = () => navigate(`/watch/matter/${matter.id}`, { state: { returnTo: location.pathname } });
  return (
    <article className={`wb-card wb-matter-card${compact ? " is-compact" : ""}`} role="button" tabIndex={0} onClick={open} onKeyDown={(event) => activateCard(event, open)}>
      <div className="wb-matter-card__tags">
        <WorkbenchTag tone={toneForMatter(matter)}>{matter.priority}</WorkbenchTag>
        <WorkbenchTag tone={toneForMatter(matter)}>{matter.risk}</WorkbenchTag>
        <WorkbenchTag>{matter.status}</WorkbenchTag>
        <span className="wb-matter-card__category">{matter.category}</span>
      </div>
      <h3>{matter.title}</h3>
      {!compact ? <p className="wb-matter-card__why">{matter.why}</p> : null}
      {!compact ? <div className="wb-responsibility"><span>你的责任</span><p>{matter.responsibility}</p></div> : null}
      <div className="wb-matter-card__meta">
        <span><FileCheck2 size={14} />{matter.evidence}</span>
        <span><Clock3 size={14} />{matter.updatedAt} · {matter.due}</span>
      </div>
      <div className="wb-matter-card__footer">
        <span>{compact ? "查看事项与证据" : "查看完整研判"}</span>
        {actionLabel && onAction ? (
          <button type="button" onClick={(event) => { event.stopPropagation(); onAction(); }}>{actionLabel}<ArrowRight size={15} /></button>
        ) : <ChevronRight size={18} />}
      </div>
    </article>
  );
}

export function EmptyState({ query }: { query?: string }) {
  return (
    <div className="wb-empty">
      <Search size={28} />
      <strong>没有匹配的事项</strong>
      <p>{query ? `未找到与“${query}”匹配的工作项。` : "当前筛选条件下暂无工作项。"}</p>
    </div>
  );
}

export function AiBoundary({ children }: { children: ReactNode }) {
  return (
    <div className="wb-ai-boundary">
      <span><Bot size={17} /></span>
      <div><strong>AI 边界</strong><p>{children}</p></div>
    </div>
  );
}

export function EvidenceStatus({ label, status }: { label: string; status: "confirmed" | "pending" | "missing" }) {
  return (
    <div className={`wb-evidence-status is-${status}`}>
      <span>{status === "confirmed" ? <Check size={13} /> : status === "missing" ? <ShieldAlert size={13} /> : <Clock3 size={13} />}</span>
      <strong>{label}</strong>
    </div>
  );
}

export function AiInsightCard({ title, children, onAsk }: { title: string; children: ReactNode; onAsk: () => void }) {
  return (
    <section className="wb-card wb-ai-card">
      <div className="wb-ai-card__header"><span><Sparkles size={16} /></span><div><small>AI 初步研判</small><h3>{title}</h3></div></div>
      <div className="wb-ai-card__body">{children}</div>
      <button type="button" onClick={onAsk}>继续追问依据与边界<ChevronRight size={16} /></button>
    </section>
  );
}

export const huadong = matters.huadong;
