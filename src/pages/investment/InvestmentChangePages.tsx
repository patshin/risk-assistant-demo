import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Bot, CalendarClock, Check, ChevronRight, FilePlus2, Filter, ListFilter, PlusCircle, RotateCcw, ShieldCheck } from "lucide-react";
import { BottomSheet, SectionTitle, useCopilot } from "../../components";
import {
  ChangeCard,
  EvidenceStatus,
  InvestmentPage,
  LineChart,
  StatusBadge,
} from "../../components/investment";
import {
  categoryLabels,
  formatMetric,
  formatNumber,
  getChange,
  getEvidenceForChange,
  getSnapshotForSearch,
  investmentRiskSnapshot,
  resolveEvidence,
  trackingStatusLabels,
  type ChangeCategory,
} from "../../data/investmentRisk";
import { createReportDraft, createTrackingTask, findTrackingTask, getInvestmentDemoState } from "../../lib/investmentRiskStore";

type FilterState = {
  category: "all" | ChangeCategory;
  status: "all" | "attention" | "pending" | "improving" | "observe" | "decision" | "mitigated";
  members: string[];
  tracking: "all" | "untracked" | "tracking";
};

const defaultFilters: FilterState = { category: "all", status: "all", members: [], tracking: "all" };

const filterStatusLabels: Record<FilterState["status"], string> = {
  all: "全部",
  attention: "需关注",
  pending: "待核验",
  improving: "趋稳",
  observe: "观察",
  decision: "需决策",
  mitigated: "已缓解",
};

function matchesStatus(change: (typeof investmentRiskSnapshot.changes)[number], status: FilterState["status"]) {
  if (status === "all") return true;
  if (status === "attention" || status === "decision") return change.riskLevel === status;
  if (status === "pending") return change.verification === "pending";
  return change.eventState === status;
}

function matchesTracking(change: (typeof investmentRiskSnapshot.changes)[number], tracking: FilterState["tracking"]) {
  if (tracking === "all") return true;
  return tracking === "untracked" ? change.trackingStatus === "untracked" : change.trackingStatus !== "untracked";
}

function readFilters(search: string): FilterState {
  const params = new URLSearchParams(search);
  const category = params.get("category");
  const requestedStatus = params.get("status") ?? params.get("level") ?? params.get("verification") ?? params.get("event");
  const tracking = params.get("tracking");
  return {
    category: category === "return" || category === "var" || category === "scale" ? category : "all",
    status: requestedStatus === "attention" || requestedStatus === "pending" || requestedStatus === "improving" || requestedStatus === "observe" || requestedStatus === "decision" || requestedStatus === "mitigated" ? requestedStatus : "all",
    members: (params.get("members") ?? "").split(",").filter(Boolean),
    tracking: tracking === "untracked" || tracking === "tracking" ? tracking : "all",
  };
}

function serializeFilters(filters: FilterState, search: string) {
  const params = new URLSearchParams(search);
  ["category", "status", "level", "verification", "event", "members", "tracking"].forEach((key) => params.delete(key));
  if (filters.category !== "all") params.set("category", filters.category);
  if (filters.status !== "all") params.set("status", filters.status);
  if (filters.members.length) params.set("members", filters.members.join(","));
  if (filters.tracking !== "all") params.set("tracking", filters.tracking);
  const result = params.toString();
  return result ? `?${result}` : "";
}

export function InvestmentChangesPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { snapshot, error } = getSnapshotForSearch(location.search);
  const filters = useMemo(() => readFilters(location.search), [location.search]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [draft, setDraft] = useState(filters);
  const [trackingTasks, setTrackingTasks] = useState(() => getInvestmentDemoState().trackingTasks);

  const changes = useMemo(() => snapshot.changes.map((change) => {
    const task = trackingTasks.find((item) => item.sourceSnapshotId === snapshot.id && item.sourceChangeId === change.id);
    return { ...change, trackingStatus: task?.status ?? change.trackingStatus };
  }), [snapshot, trackingTasks]);

  useEffect(() => setDraft(filters), [filters]);
  useEffect(() => {
    const refresh = () => setTrackingTasks(getInvestmentDemoState().trackingTasks);
    window.addEventListener("investment-store-change", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("investment-store-change", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);
  useEffect(() => {
    const value = window.sessionStorage.getItem("investment-changes-scroll");
    if (!value) return;
    window.sessionStorage.removeItem("investment-changes-scroll");
    window.requestAnimationFrame(() => window.requestAnimationFrame(() => document.querySelector(".phone-shell")?.scrollTo(0, Number(value))));
  }, []);

  const filtered = changes.filter((change) => {
    if (filters.category !== "all" && change.category !== filters.category) return false;
    if (!matchesStatus(change, filters.status)) return false;
    if (filters.members.length && !filters.members.some((memberId) => change.memberIds.includes(memberId))) return false;
    if (!matchesTracking(change, filters.tracking)) return false;
    return true;
  });

  const openDetail = (changeId: string) => {
    const scrollTop = document.querySelector(".phone-shell")?.scrollTop ?? 0;
    window.sessionStorage.setItem("investment-changes-scroll", String(scrollTop));
    navigate(`/investment/changes/${changeId}${location.search}`, { state: { returnTo: `${location.pathname}${location.search}` } });
  };

  const applyFilters = () => {
    navigate({ pathname: location.pathname, search: serializeFilters(draft, location.search) }, { replace: true });
    setFilterOpen(false);
  };

  const setQuickCategory = (category: FilterState["category"]) => {
    navigate({ pathname: location.pathname, search: serializeFilters({ ...filters, category }, location.search) }, { replace: true });
  };

  const clearFilters = () => navigate({ pathname: location.pathname, search: serializeFilters(defaultFilters, location.search) }, { replace: true });

  if (error) {
    return <InvestmentPage title="重点变化" subtitle="按管理影响识别本期变化" snapshot={snapshot}><div className="investment-state-card is-error"><h2>暂时无法获取投资风险数据</h2><p>当前不展示可能失真的变化事项。</p><button type="button" onClick={() => navigate(location.pathname, { replace: true })}>重新加载</button></div></InvestmentPage>;
  }

  return (
    <InvestmentPage title="重点变化" subtitle={`${changes.length} 项 · 截至 ${snapshot.period}`} snapshot={snapshot}>
      <div className="investment-chip-row" aria-label="事项类别">
        {(["all", "var", "return", "scale"] as const).map((category) => (
          <button key={category} className={filters.category === category ? "is-active" : ""} type="button" onClick={() => setQuickCategory(category)}>
            {category === "all" ? "全部" : categoryLabels[category]}
          </button>
        ))}
        <button className={`investment-filter-trigger${Object.values(filters).some((value) => Array.isArray(value) ? value.length > 0 : value !== "all") ? " has-filter" : ""}`} type="button" onClick={() => { setDraft(filters); setFilterOpen(true); }}>
          <Filter size={15} />筛选
        </button>
      </div>

      <section className="investment-change-summary">
        <div><span>本期变化</span><strong>{changes.length}</strong></div>
        <div><span>需关注</span><strong>{changes.filter((change) => change.riskLevel === "attention").length}</strong></div>
        <div><span>观察与趋稳</span><strong>{changes.filter((change) => change.eventState === "observe" || change.eventState === "improving").length}</strong></div>
      </section>

      <div className="investment-list-result">
        <span><ListFilter size={15} />当前显示 {filtered.length} 项</span>
        {filtered.length !== changes.length ? <button type="button" onClick={clearFilters}>清除筛选</button> : null}
      </div>

      {filtered.length ? (
        <div className="investment-card-stack">
          {filtered.map((change) => <ChangeCard key={change.id} change={change} onClick={() => openDetail(change.id)} />)}
        </div>
      ) : changes.length === 0 ? (
        <section className="investment-state-card">
          <h2>本期未发现需要管理层处理的重大变化</h2>
          <p>可继续查看 VaR、收益和规模详情。</p>
        </section>
      ) : (
        <section className="investment-state-card">
          <h2>没有符合当前筛选条件的变化</h2>
          <p>调整筛选条件后再查看，不会修改原始业务状态。</p>
          <button type="button" onClick={clearFilters}>重置筛选</button>
        </section>
      )}

      <ChangesFilterSheet
        open={filterOpen}
        draft={draft}
        members={snapshot.members}
        resultCount={changes.filter((change) => {
          if (draft.category !== "all" && change.category !== draft.category) return false;
          if (!matchesStatus(change, draft.status)) return false;
          if (draft.members.length && !draft.members.some((memberId) => change.memberIds.includes(memberId))) return false;
          if (!matchesTracking(change, draft.tracking)) return false;
          return true;
        }).length}
        onDraft={setDraft}
        onApply={applyFilters}
        onClose={() => setFilterOpen(false)}
      />
    </InvestmentPage>
  );
}

function ChangesFilterSheet({
  open,
  draft,
  members,
  resultCount,
  onDraft,
  onApply,
  onClose,
}: {
  open: boolean;
  draft: FilterState;
  members: typeof investmentRiskSnapshot.members;
  resultCount: number;
  onDraft: (value: FilterState) => void;
  onApply: () => void;
  onClose: () => void;
}) {
  const toggleMember = (id: string) => onDraft({ ...draft, members: draft.members.includes(id) ? draft.members.filter((item) => item !== id) : [...draft.members, id] });
  return (
    <BottomSheet
      open={open}
      title="筛选重点变化"
      className="investment-sheet investment-filter-sheet"
      onClose={onClose}
      footer={
        <div className="investment-sheet-actions">
          <button type="button" onClick={() => onDraft(defaultFilters)}><RotateCcw size={17} />重置</button>
          <button className="is-primary" type="button" onClick={onApply}>查看 {resultCount} 项结果</button>
        </div>
      }
    >
      <FilterGroup label="状态" values={["all", "attention", "pending", "improving", "observe"]} current={draft.status} labels={filterStatusLabels} onSelect={(value) => onDraft({ ...draft, status: value as FilterState["status"] })} />
      <div className="investment-filter-group">
        <h3>成员机构 <small>可多选</small></h3>
        <div className="investment-filter-options is-members">
          {members.map((member) => <button key={member.id} className={draft.members.includes(member.id) ? "is-active" : ""} type="button" onClick={() => toggleMember(member.id)}>{member.shortName}</button>)}
        </div>
      </div>
      <FilterGroup label="事项类型" values={["all", "return", "var", "scale"]} current={draft.category} labels={{ all: "全部", ...categoryLabels }} onSelect={(value) => onDraft({ ...draft, category: value as FilterState["category"] })} />
      <FilterGroup label="跟踪状态" values={["all", "untracked", "tracking"]} current={draft.tracking} labels={{ all: "全部", ...trackingStatusLabels }} onSelect={(value) => onDraft({ ...draft, tracking: value as FilterState["tracking"] })} />
    </BottomSheet>
  );
}

function FilterGroup({ label, values, current, labels, onSelect }: { label: string; values: readonly string[]; current: string; labels: Record<string, string>; onSelect: (value: string) => void }) {
  return <div className="investment-filter-group"><h3>{label}</h3><div className="investment-filter-options">{values.map((value) => <button key={value} className={current === value ? "is-active" : ""} type="button" onClick={() => onSelect(value)}>{labels[value]}</button>)}</div></div>;
}

export function InvestmentChangeDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { changeId } = useParams();
  const { snapshot } = getSnapshotForSearch(location.search);
  const hasChange = snapshot.changes.some((item) => item.id === changeId);
  const change = getChange(changeId, snapshot);
  const { openCopilot } = useCopilot();
  const [successTaskId, setSuccessTaskId] = useState<string | null>(null);
  const [alreadyTracked, setAlreadyTracked] = useState(false);
  if (!hasChange) {
    return <InvestmentPage title="变化详情" subtitle={`${snapshot.periodLabel} · 暂无事项`} snapshot={snapshot} backTo="/investment/changes"><section className="investment-state-card"><h2>本期未发现需要管理层处理的重大变化</h2><p>可返回变化列表查看其他期间或筛选条件。</p><button type="button" onClick={() => navigate(`/investment/changes${location.search}`)}>返回变化列表</button></section></InvestmentPage>;
  }
  const evidence = getEvidenceForChange(change, snapshot);
  const sourceContext = { changeId: change.id, metricIds: change.metricIds };

  const addTracking = () => {
    const result = createTrackingTask({
      sourceSnapshotId: snapshot.id,
      sourceChangeId: change.id,
      title: change.title,
      baselineMetricIds: change.metricIds,
      memberIds: change.memberIds,
      nextUpdateAt: "2026-08-08",
    });
    setAlreadyTracked(!result.created);
    setSuccessTaskId(result.task.id);
  };

  const makeReport = () => {
    const result = createReportDraft({ sourceSnapshotId: snapshot.id, sourceChangeIds: [change.id], factEvidenceIds: change.evidenceIds });
    navigate(`/report/investment/${result.draft.id}`, { state: { returnTo: `${location.pathname}${location.search}` } });
  };

  const footer = (
    <div className="investment-sticky-actions">
      <button type="button" onClick={addTracking}><PlusCircle size={17} />加入跟踪</button>
      <button type="button" onClick={makeReport}><FilePlus2 size={17} />生成汇报</button>
      <button className="is-primary" type="button" onClick={() => openCopilot({ intent: "general", sourceContext: { module: "investment", snapshotId: snapshot.id, route: `${location.pathname}${location.search}`, period: snapshot.period, dataStatus: snapshot.dataStatus, compareBasis: snapshot.defaultCompareBasis, ...sourceContext } })}><Bot size={17} />问 AI</button>
    </div>
  );

  return (
    <InvestmentPage title="变化详情" subtitle={`${categoryLabels[change.category]} · ${snapshot.periodLabel}`} snapshot={snapshot} backTo="/investment/changes" sourceContext={sourceContext} footer={footer}>
      <section className="investment-detail-hero">
        <div><span className={`investment-category is-${change.category}`}>{categoryLabels[change.category]}</span><StatusBadge kind="risk" value={change.riskLevel} /></div>
        <h2>{change.title}</h2>
        <p>{change.conclusion}</p>
        <div className="investment-detail-status"><StatusBadge kind="verification" value={change.verification} /><StatusBadge kind="event" value={change.eventState} /><span>{change.updatedAt}</span></div>
      </section>

      <section className="investment-section">
        <SectionTitle title="关键证据" />
        <div className="investment-evidence-grid">
          {evidence.map((item) => {
            const metric = resolveEvidence(item, snapshot);
            if (!metric) return null;
            return <article key={item.id}><div><span>{item.label}</span><EvidenceStatus confirmed={snapshot.dataStatus === "reviewed"} /></div><strong>{formatMetric(metric)}</strong><p>{item.scope}</p><small>{item.source}</small></article>;
          })}
        </div>
        {change.id === "cii-monthly-negative" ? <div className="investment-surface-card"><h3>近 6 个月月度收益率</h3><LineChart data={snapshot.ciiMonthlyTrend} unit="%" /></div> : null}
      </section>

      <section className="investment-section">
        <SectionTitle title="成员影响" />
        <div className="investment-impact-list">
          {change.memberIds.map((memberId) => {
            const member = snapshot.members.find((item) => item.id === memberId)!;
            const field = change.category === "return" ? "annualReturn" : change.category === "var" ? "varValue" : "scale";
            const value = member[field];
            const unit = field === "annualReturn" ? "%" : "亿元";
            return <button key={member.id} type="button" onClick={() => navigate(`/investment/member/${member.id}${location.search}`, { state: { returnTo: `${location.pathname}${location.search}` } })}><span>{member.shortName}</span><strong>{value === null ? `无${change.category === "return" ? "收益" : "VaR"}口径` : `${formatNumber(value, field === "annualReturn" ? 2 : 0)}${unit}`}</strong><ChevronRight size={17} /></button>;
          })}
        </div>
      </section>

      <section className="investment-boundary-card">
        <ShieldCheck size={20} />
        <div><h2>判断边界</h2><p>本结论基于单月已复核数据，仅支持管理关注与后续核验，不构成投资、买卖或调仓建议。</p></div>
      </section>

      <TrackingSuccessSheet
        open={Boolean(successTaskId)}
        taskId={successTaskId}
        alreadyTracked={alreadyTracked || Boolean(findTrackingTask(snapshot.id, change.id) && !successTaskId)}
        changeTitle={change.title}
        baseline={(change.metricIds.length ? change.metricIds.map((id) => formatMetric(snapshot.metrics[id])) : evidence.map((item) => { const metric = resolveEvidence(item, snapshot); return metric ? formatMetric(metric) : ""; })).filter(Boolean).join(" · ")}
        onClose={() => setSuccessTaskId(null)}
        onView={() => { if (successTaskId) navigate(`/watch/tracking/${successTaskId}`, { state: { returnTo: `${location.pathname}${location.search}` } }); }}
      />
    </InvestmentPage>
  );
}

function TrackingSuccessSheet({ open, taskId, alreadyTracked, changeTitle, baseline, onClose, onView }: { open: boolean; taskId: string | null; alreadyTracked: boolean; changeTitle: string; baseline: string; onClose: () => void; onView: () => void }) {
  return (
    <BottomSheet
      open={open}
      title={alreadyTracked ? "已在跟踪中" : "已加入重点跟踪"}
      className="investment-sheet investment-tracking-success"
      onClose={onClose}
      footer={<div className="investment-sheet-actions"><button type="button" onClick={onClose}>完成</button><button className="is-primary" type="button" onClick={onView}>查看跟踪事项</button></div>}
    >
      <div className="investment-success-mark"><Check size={28} /></div>
      <dl>
        <div><dt>来源快照</dt><dd>{investmentRiskSnapshot.periodLabel} · 已复核</dd></div>
        <div><dt>跟踪主题</dt><dd>{changeTitle}</dd></div>
        <div><dt>基线指标</dt><dd>{baseline}</dd></div>
        <div><dt>下次更新</dt><dd><CalendarClock size={16} />2026-08-08</dd></div>
        <div><dt>任务编号</dt><dd>{taskId}</dd></div>
      </dl>
      <p className="investment-success-note">任务先标记为“待确认”；进入详情后由负责人确认并转为“跟踪中”。</p>
    </BottomSheet>
  );
}
