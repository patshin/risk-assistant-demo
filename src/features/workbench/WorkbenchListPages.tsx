import { useMemo, type CSSProperties } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Bot,
  CalendarClock,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  Clock3,
  FileCheck2,
  FileClock,
  Filter,
  ListFilter,
  Search,
  ShieldCheck,
  TrendingUp,
  UserRound,
} from "lucide-react";
import { matterOrder, matters, reportItems, trackingItems, type Matter } from "./data/workbenchDemoData";
import { useWorkbench } from "./state/workbenchStore";
import { EmptyState, MatterCard, SectionHeading, WorkbenchTag } from "./components/WorkbenchUI";
import { useWorkbenchActions } from "./WorkbenchLayout";

const priorityWeight: Record<Matter["priority"], number> = { P0: 0, P1: 1, P2: 2 };

function scopedMatters(scope: string) {
  const items = matterOrder.map((id) => matters[id]);
  if (scope === "credit") return items.filter((matter) => matter.category === "信用" || matter.category === "跨模块");
  if (scope === "investment") return items.filter((matter) => matter.category === "投资" || matter.category === "跨模块");
  if (scope === "watching") return items.filter((matter) => matter.id === "huadong" || matter.id === "baise");
  return items;
}

export function WorkbenchQueuePage() {
  const { state, dispatch } = useWorkbench();
  const { openSheet } = useWorkbenchActions();
  const filters = ["全部", "待决策", "超期", "待确认", "待核验", "待分派"];
  const items = useMemo(() => {
    let next = scopedMatters(state.scope).filter((matter) => state.queueFilter === "全部" || matter.queueFilter === state.queueFilter || (state.queueFilter === "待分派" && matter.id === "huadong" && !state.huadongTask));
    const query = state.queueQuery.trim().toLowerCase();
    if (query) next = next.filter((matter) => `${matter.title}${matter.risk}${matter.status}${matter.category}${matter.responsibility}`.toLowerCase().includes(query));
    return [...next].sort((a, b) => {
      if (state.queueSort === "updated") return b.updatedAt.localeCompare(a.updatedAt);
      if (state.queueSort === "deadline") return (a.status === "已超期" ? -1 : 1) - (b.status === "已超期" ? -1 : 1);
      return priorityWeight[a.priority] - priorityWeight[b.priority];
    });
  }, [state.huadongTask, state.queueFilter, state.queueQuery, state.queueSort, state.scope]);

  return (
    <div className="wb-list-page">
      <section className="wb-queue-summary">
        <div><small>今日待处理</small><strong>{items.length || 0}</strong><span>集团口径共 4 项</span></div>
        <div><span className="is-critical"><CircleAlert size={17} /></span><strong>{state.huadongDecision === "pending" ? 1 : 0}</strong><small>待你决策</small></div>
        <div><span className="is-warning"><Clock3 size={17} /></span><strong>{state.baiseProgress ? 0 : 1}</strong><small>已超期</small></div>
        <div><span className="is-info"><UserRound size={17} /></span><strong>{state.huadongTask ? 0 : 1}</strong><small>待分派</small></div>
      </section>

      <div className="wb-queue-tools">
        <label><Search size={17} /><input aria-label="搜索待处理事项" placeholder="搜索事项、风险或责任" value={state.queueQuery} onChange={(event) => dispatch({ type: "set-queue-query", value: event.target.value })} /></label>
        <button type="button" aria-label="打开筛选" onClick={() => document.querySelector<HTMLElement>(".wb-filter-chips")?.scrollIntoView({ behavior: "smooth", block: "nearest" })}><Filter size={18} /></button>
      </div>
      <div className="wb-filter-chips" role="group" aria-label="队列筛选">{filters.map((filter) => <button key={filter} type="button" className={state.queueFilter === filter ? "is-active" : ""} onClick={() => dispatch({ type: "set-queue-filter", value: filter })}>{filter}</button>)}</div>
      <div className="wb-sort-row"><span><ListFilter size={15} />当前视角：集团风险负责人</span><label>排序<select aria-label="队列排序" value={state.queueSort} onChange={(event) => dispatch({ type: "set-queue-sort", value: event.target.value as typeof state.queueSort })}><option value="priority">优先级</option><option value="deadline">截止时间</option><option value="updated">最近更新</option></select></label></div>

      <div className="wb-list-stack">
        {items.map((matter) => <MatterCard key={matter.id} matter={matter} actionLabel={matter.id === "huadong" && !state.huadongTask ? "分派" : matter.id === "baise" && !state.baiseProgress ? "更新" : undefined} onAction={matter.id === "huadong" && !state.huadongTask ? () => openSheet("assign") : matter.id === "baise" && !state.baiseProgress ? () => openSheet("progress") : undefined} />)}
        {!items.length ? <EmptyState query={state.queueQuery} /> : null}
      </div>
      <div className="wb-list-footnote"><Bot size={16} /><span>AI 只解释当前事项；优先级来自严重度、时限和人工责任规则。</span></div>
    </div>
  );
}

export function WorkbenchTrackingPage() {
  const { state, dispatch } = useWorkbench();
  const navigate = useNavigate();
  const location = useLocation();
  const { openSheet } = useWorkbenchActions();
  const filters = ["全部", "升温中", "核查中", "观察中", "待确认", "待分派", "趋稳"];
  const effectiveItems = trackingItems.map((item) => item.id === "baise" && state.baiseProgress ? { ...item, state: "核查中", latest: state.baiseProgress.detail, next: `${state.baiseProgress.judgment} · 下次 ${state.baiseProgress.nextUpdate}` } : item.id === "huadong" && state.huadongTask ? { ...item, state: "核查中", owner: state.huadongTask.owner, latest: `任务“${state.huadongTask.name}”已分派。`, next: `完成 ${state.huadongTask.checks.length} 项核验范围。` } : item);
  const items = effectiveItems.filter((item) => state.trackingFilter === "全部" || item.state === state.trackingFilter || (state.trackingFilter === "待分派" && item.owner === "未指定"));

  return (
    <div className="wb-list-page">
      <section className="wb-tracking-summary"><div><small>重点跟踪</small><strong>4</strong><span>1 项升温 · 1 项待确认</span></div><div><TrendingUp size={22} /><strong>{effectiveItems.filter((item) => item.state === "升温中").length}</strong><span>需要升级关注</span></div><div><CalendarClock size={22} /><strong>{state.baiseProgress ? 0 : 1}</strong><span>更新已超期</span></div></section>
      <div className="wb-filter-chips" role="group" aria-label="跟踪状态筛选">{filters.map((filter) => <button key={filter} type="button" className={state.trackingFilter === filter ? "is-active" : ""} onClick={() => dispatch({ type: "set-tracking-filter", value: filter })}>{filter}</button>)}</div>
      <div className="wb-list-stack wb-tracking-list">
        {items.map((item) => {
          const canOpen = Boolean(item.matterId);
          const open = () => { if (item.matterId) navigate(`/watch/matter/${item.matterId}`, { state: { returnTo: location.pathname } }); };
          return (
            <article key={item.id} className="wb-card wb-tracking-card" role={canOpen ? "button" : undefined} tabIndex={canOpen ? 0 : undefined} onClick={canOpen ? open : undefined} onKeyDown={(event) => { if (canOpen && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); open(); } }}>
              <div className="wb-tracking-card__top"><span className={`wb-tracking-icon is-${item.state === "升温中" ? "hot" : item.state === "趋稳" ? "stable" : "watch"}`}>{item.state === "升温中" ? <TrendingUp size={19} /> : item.state === "趋稳" ? <ShieldCheck size={19} /> : <FileClock size={19} />}</span><div><WorkbenchTag tone={item.state === "升温中" ? "critical" : item.state === "趋稳" ? "success" : "info"}>{item.state}</WorkbenchTag><h3>{item.title}</h3></div><ChevronRight size={18} /></div>
              <div className="wb-tracking-meta"><span><UserRound size={14} />{item.owner}</span><span><Clock3 size={14} />{item.due}</span></div>
              <div className="wb-latest"><small>最新进展</small><p>{item.latest}</p></div>
              <div className="wb-next-action"><span>下一步</span><p>{item.next}</p></div>
              {item.id === "baise" ? <button type="button" onClick={(event) => { event.stopPropagation(); openSheet("progress"); }}>{state.baiseProgress ? "再次更新" : "更新进展"}<ArrowRight size={15} /></button> : item.id === "huadong" && !state.huadongTask ? <button type="button" onClick={(event) => { event.stopPropagation(); openSheet("assign"); }}>分派责任人<ArrowRight size={15} /></button> : null}
            </article>
          );
        })}
        {!items.length ? <EmptyState /> : null}
      </div>
      <div className="wb-list-footnote"><ShieldCheck size={16} /><span>“趋稳”只表示当前指标缓和，不自动关闭事项；关闭仍需责任人确认。</span></div>
    </div>
  );
}

export function WorkbenchReportsPage() {
  const { state, dispatch, readiness } = useWorkbench();
  const navigate = useNavigate();
  const location = useLocation();
  const { openSheet, notify } = useWorkbenchActions();
  const readyFacts = 4 + Number(state.huadongDecision !== "pending") + Number(Boolean(state.baiseProgress)) + Number(state.ciiReportIncluded);
  const pendingActions = Number(state.huadongDecision === "pending") + Number(!state.baiseProgress) + Number(!state.ciiReportIncluded);

  return (
    <div className="wb-list-page">
      <section className="wb-report-summary">
        <div className="wb-readiness-ring" style={{ "--readiness": `${readiness * 3.6}deg` } as CSSProperties}><span><strong>{readiness}%</strong><small>准备度</small></span></div>
        <div><small>本周风险例会</small><h2>关键事实已基本齐备</h2><p>仍需完成 {pendingActions} 项人工确认，方可形成正式汇报。</p></div>
      </section>
      <div className="wb-report-stats"><div><strong>3</strong><span>汇报事项</span></div><div><strong>{readyFacts}</strong><span>已确认事实</span></div><div><strong>{pendingActions}</strong><span>待确认动作</span></div></div>
      <SectionHeading title="汇报事项" meta="事实、边界与确认状态" />
      <div className="wb-list-stack wb-report-list">
        {reportItems.map((item) => {
          const confirmed = item.id === "cii" ? state.ciiReportIncluded : item.id === "baise" ? Boolean(state.baiseProgress) : state.huadongDecision !== "pending";
          const status = item.id === "cii" ? (confirmed ? "已确认纳入" : "待确认纳入") : item.id === "baise" ? (confirmed ? "材料已补齐" : "缺最新进展") : (confirmed ? "策略已确认" : "草稿待确认");
          return (
            <article key={item.id} className="wb-card wb-report-card">
              <div className="wb-report-card__top"><span className={`is-${item.id}`}><FileCheck2 size={19} /></span><div><WorkbenchTag tone={confirmed ? "success" : item.id === "baise" ? "critical" : "warning"}>{status}</WorkbenchTag><h3>{item.title}</h3><small>{item.module} · {item.updatedAt}</small></div></div>
              <div className="wb-report-boundary"><strong>口径边界</strong><p>{item.boundary}</p></div>
              <div className="wb-report-card__actions">
                <button type="button" onClick={() => navigate(`/watch/matter/${item.matterId}`, { state: { returnTo: location.pathname } })}>查看事项</button>
                {item.id === "cii" && !confirmed ? <button className="is-primary" type="button" onClick={() => { dispatch({ type: "confirm-cii-report" }); notify("CII 已确认纳入本周汇报"); }}>确认纳入<Check size={15} /></button> : item.id === "baise" && !confirmed ? <button className="is-primary" type="button" onClick={() => openSheet("progress")}>补进展<ChevronRight size={15} /></button> : item.id === "huadong" && !confirmed ? <button className="is-primary" type="button" onClick={() => openSheet("decision")}>确认策略<ChevronRight size={15} /></button> : <button className="is-confirmed" type="button" disabled><CheckCircle2 size={15} />已就绪</button>}
              </div>
            </article>
          );
        })}
      </div>
      <button className="wb-report-export" type="button" disabled={pendingActions > 0} onClick={() => navigate("/report")}><FileCheck2 size={18} />生成正式汇报预览<ArrowRight size={16} /></button>
      <div className="wb-list-footnote"><Bot size={16} /><span>AI 可整理事实与表述，但正式汇报必须由责任人确认口径、边界和行动状态。</span></div>
    </div>
  );
}
