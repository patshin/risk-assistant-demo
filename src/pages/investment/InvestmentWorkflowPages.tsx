import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Bot, Check, ChevronRight, FileCheck2, FileText, ShieldCheck } from "lucide-react";
import { SectionTitle, useCopilot } from "../../components";
import { InvestmentPage, StatusBadge } from "../../components/investment";
import { formatMetric, getChange, investmentRiskSnapshot, resolveEvidence } from "../../data/investmentRisk";
import {
  confirmReportDraft,
  confirmTrackingTask,
  createReportDraft,
  createTrackingTask,
  getReportDraft,
  getTrackingTask,
  type InvestmentReportDraft,
  type InvestmentTrackingTask,
} from "../../lib/investmentRiskStore";

function ensureTrackingTask(taskId: string): InvestmentTrackingTask {
  const existing = getTrackingTask(taskId);
  if (existing) return existing;
  const change = getChange(taskId.replace(/^tracking-/, ""), investmentRiskSnapshot);
  return createTrackingTask({
    sourceSnapshotId: investmentRiskSnapshot.id,
    sourceChangeId: change.id,
    title: change.title,
    baselineMetricIds: change.metricIds,
    memberIds: change.memberIds,
    nextUpdateAt: "2026-08-08",
  }).task;
}

function ensureReportDraft(draftId: string): InvestmentReportDraft {
  const existing = getReportDraft(draftId);
  if (existing) return existing;
  const changeId = draftId.replace(/^investment-2026-06-/, "").replace(/-draft$/, "");
  const change = investmentRiskSnapshot.changes.find((item) => item.id === changeId) ?? investmentRiskSnapshot.changes[0];
  return createReportDraft({ sourceSnapshotId: investmentRiskSnapshot.id, sourceChangeIds: [change.id], factEvidenceIds: change.evidenceIds }).draft;
}

export function InvestmentTrackingDetailPage() {
  const { trackingId = "tracking-group-var-improving" } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [task, setTask] = useState(() => ensureTrackingTask(trackingId));
  const change = getChange(task.sourceChangeId, investmentRiskSnapshot);

  useEffect(() => {
    const confirmed = confirmTrackingTask(task.id);
    if (confirmed) setTask(confirmed);
  }, [task.id]);

  const sourceContext = { changeId: change.id, metricIds: task.baselineMetricIds };
  const baselineEvidence = change.evidenceIds
    .map((id) => investmentRiskSnapshot.evidence[id])
    .filter(Boolean)
    .map((item) => ({ item, metric: resolveEvidence(item, investmentRiskSnapshot) }))
    .filter((entry) => entry.metric && !task.baselineMetricIds.includes(entry.metric.id));

  const openReport = () => {
    const draft = task.reportDraftId
      ? getReportDraft(task.reportDraftId)
      : createReportDraft({ sourceSnapshotId: investmentRiskSnapshot.id, sourceChangeIds: [change.id], factEvidenceIds: change.evidenceIds }).draft;
    if (draft) navigate(`/report/investment/${draft.id}`, { state: { returnTo: `${location.pathname}${location.search}` } });
  };

  return (
    <InvestmentPage title="重点跟踪" subtitle={`来源：投资风险 · ${investmentRiskSnapshot.periodLabel}`} snapshot={investmentRiskSnapshot} backTo={`/investment/changes/${change.id}`} sourceContext={sourceContext} askPlaceholder="追问这项投资风险跟踪…">
      <section className="investment-tracking-hero">
        <div><StatusBadge kind="tracking" value={task.status} /><span>重点跟踪</span></div>
        <h2>{task.title}</h2>
        <p>已基于 {investmentRiskSnapshot.periodLabel} 复核数据建立跟踪，下一次更新为 {task.nextUpdateAt}。</p>
      </section>

      <section className="investment-section">
        <SectionTitle title="当前基线" />
        <div className="investment-baseline-grid">
          {task.baselineMetricIds.map((metricId) => {
            const metric = investmentRiskSnapshot.metrics[metricId];
            if (!metric) return null;
            return <article key={metricId}><span>{metric.label}</span><strong>{formatMetric(metric)}</strong><small>{metric.scope}</small></article>;
          })}
          {baselineEvidence.map(({ item, metric }) => metric ? <article key={item.id}><span>{item.label}</span><strong>{formatMetric(metric)}</strong><small>{item.scope}</small></article> : null)}
        </div>
      </section>

      <section className="investment-section">
        <SectionTitle title="下一观察指标" />
        <div className="investment-observation-list investment-surface-card">
          {task.observations.map((observation) => <div key={observation.id}><i aria-hidden="true" /><span><strong>{observation.title}</strong><small>{observation.description}</small></span></div>)}
        </div>
      </section>

      <section className="investment-section">
        <SectionTitle title="跟踪记录" />
        <ol className="investment-timeline investment-surface-card">
          {task.timeline.map((item) => <li className={item.state === "done" ? "is-done" : undefined} key={item.id}><i>{item.state === "done" ? <Check size={14} /> : null}</i><div><strong>{item.title}</strong><span>{item.detail}</span></div></li>)}
        </ol>
      </section>

      <button className="investment-report-material" type="button" onClick={openReport}><FileText size={20} /><span><strong>{task.reportDraftId ? "已同步到本期投资风险汇报素材" : "生成本期投资风险汇报素材"}</strong><small>{task.reportDraftId ? "查看已生成的汇报内容" : "基于当前跟踪事实生成草稿"}</small></span><ChevronRight size={17} /></button>
    </InvestmentPage>
  );
}

export function InvestmentReportPreviewPage() {
  const { draftId = "investment-2026-06-var-review" } = useParams();
  const location = useLocation();
  const { openCopilot } = useCopilot();
  const [draft, setDraft] = useState(() => ensureReportDraft(draftId));
  const changes = useMemo(() => draft.sourceChangeIds.map((id) => getChange(id, investmentRiskSnapshot)), [draft.sourceChangeIds]);
  const sourceContext = { changeId: changes[0]?.id, metricIds: changes.flatMap((change) => change.metricIds) };

  const confirm = () => {
    const updated = confirmReportDraft(draft.id);
    if (updated) setDraft(updated);
  };

  const footer = (
    <div className="investment-report-actions">
      <button className="is-primary" type="button" onClick={confirm}>{draft.status === "included" ? <FileCheck2 size={18} /> : <ShieldCheck size={18} />}{draft.status === "included" ? "已纳入本期汇报" : "确认纳入本期汇报"}</button>
      <button type="button" onClick={() => openCopilot({ intent: "report", sourceContext: { module: "investment", snapshotId: investmentRiskSnapshot.id, route: `${location.pathname}${location.search}`, period: investmentRiskSnapshot.period, dataStatus: investmentRiskSnapshot.dataStatus, compareBasis: investmentRiskSnapshot.defaultCompareBasis, ...sourceContext } })}><Bot size={18} />继续追问</button>
    </div>
  );

  return (
    <InvestmentPage title="投资风险汇报" subtitle={draft.status === "included" ? "已纳入本期汇报" : "AI 草稿 · 待人工确认"} snapshot={investmentRiskSnapshot} backTo={`/investment/changes/${changes[0]?.id ?? "cii-monthly-negative"}`} sourceContext={sourceContext} footer={footer}>
      <section className="investment-report-page-card">
        <header><span>一句话汇报口径</span><small>{investmentRiskSnapshot.periodLabel}</small></header>
        <p>{draft.summary}</p>
        <small>数据：{investmentRiskSnapshot.periodLabel} 已复核</small>
      </section>

      <section className="investment-section">
        <SectionTitle title="关键事实" />
        <div className="investment-report-facts">
          {draft.factEvidenceIds.map((evidenceId) => {
            const evidence = investmentRiskSnapshot.evidence[evidenceId];
            if (!evidence) return null;
            const metric = resolveEvidence(evidence, investmentRiskSnapshot);
            if (!metric) return null;
            return <article key={evidenceId}><span>{evidence.label}</span><strong>{formatMetric(metric)}</strong><small>{evidence.scope} · {evidence.source}</small></article>;
          })}
        </div>
      </section>

      <section className="investment-section">
        <SectionTitle title="管理建议" />
        <ol className="investment-management-actions">
          {draft.managementActions.map((action, index) => <li key={action.id}><i>{index + 1}</i><div><strong>{action.title}</strong><p>{action.description}</p></div></li>)}
        </ol>
      </section>

      <section className="investment-section">
        <SectionTitle title="证据来源" />
        <div className="investment-report-source"><p>{investmentRiskSnapshot.sourceSystems.join(" · ")}</p><small>{draft.boundary} · 复核时间 {investmentRiskSnapshot.reviewedAt}</small></div>
      </section>
    </InvestmentPage>
  );
}
