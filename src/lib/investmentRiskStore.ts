import { getChange, investmentRiskSnapshot, type ReportStatus, type TrackingStatus } from "../data/investmentRisk";

export const INVESTMENT_STORE_KEY = "risk-assistant-demo:investment-risk:v1";

export type InvestmentObservation = {
  id: string;
  title: string;
  description: string;
};

export type InvestmentTimelineItem = {
  id: string;
  title: string;
  detail: string;
  state: "done" | "pending";
};

export type InvestmentTrackingTask = {
  id: string;
  sourceSnapshotId: string;
  sourceChangeId: string;
  title: string;
  status: TrackingStatus;
  baselineMetricIds: string[];
  memberIds: string[];
  createdAt: string;
  nextUpdateAt: string;
  observations: InvestmentObservation[];
  timeline: InvestmentTimelineItem[];
  managementSummary: string;
  reportDraftId?: string;
};

export type InvestmentManagementAction = {
  id: string;
  title: string;
  description: string;
};

export type InvestmentReportDraft = {
  id: string;
  sourceSnapshotId: string;
  sourceChangeIds: string[];
  factEvidenceIds: string[];
  status: ReportStatus;
  title: string;
  summary: string;
  managementActions: InvestmentManagementAction[];
  boundary: string;
  createdAt: string;
  confirmedAt?: string;
};

type InvestmentDemoState = {
  trackingTasks: InvestmentTrackingTask[];
  reportDrafts: InvestmentReportDraft[];
};

const historicalReport: InvestmentReportDraft = {
  id: "investment-2026-06-var-review",
  sourceSnapshotId: investmentRiskSnapshot.id,
  sourceChangeIds: ["group-var-improving"],
  factEvidenceIds: ["e-totalVar", "e-varDelta", "e-varUsage"],
  status: "included",
  title: "集团 VaR 回落跟踪汇报",
  summary: "集团 VaR 降至 426 亿元，较上月减少 72 亿元，限额使用率为 53.3%，仍在 800 亿元管理限额内。主要风险因子同步回落，本期状态为趋稳。",
  managementActions: [
    { id: "var-review-1", title: "按月复核集团 VaR", description: "下一期复核集团 VaR、限额使用率及三类风险因子，确认回落是否延续。" },
    { id: "var-review-2", title: "保留成员口径边界", description: "成员 VaR 无独立限额，因子 VaR 彼此相关，不与集团 VaR 直接相加。" },
    { id: "var-review-3", title: "维持例行汇报", description: "若 VaR 再度上升或限额使用率显著变化，由负责人确认是否升级。" },
  ],
  boundary: "本汇报仅描述已复核 VaR 变化及跟踪动作，不构成投资、交易或调仓建议。",
  createdAt: "2026-07-09T02:00:00.000Z",
  confirmedAt: "2026-07-09T03:30:00.000Z",
};

const historicalTask: InvestmentTrackingTask = {
  id: "tracking-group-var-improving",
  sourceSnapshotId: investmentRiskSnapshot.id,
  sourceChangeId: "group-var-improving",
  title: "集团 VaR 较上月下降",
  status: "improving",
  baselineMetricIds: ["totalVar", "varDelta", "varUsage"],
  memberIds: ["pension", "health", "property", "life"],
  createdAt: "2026-07-08T10:20:00.000Z",
  nextUpdateAt: "2026-08-08",
  observations: [
    { id: "var-next-data", title: "复核下一期集团 VaR", description: "比较集团 VaR、限额使用率和剩余额度。" },
    { id: "var-factor-check", title: "观察主要风险因子", description: "同步复核利率、权益和汇率因子是否延续回落。" },
    { id: "var-upgrade", title: "升级触发", description: "VaR 再度上升或计量口径异常时，由负责人确认是否升级。" },
  ],
  timeline: [
    { id: "var-found", title: "识别集团 VaR 回落", detail: "2026-07-08 · 已复核快照", state: "done" },
    { id: "var-confirmed", title: "负责人确认持续观察", detail: "2026-07-09 · 状态趋稳", state: "done" },
    { id: "var-next", title: "复核下一期 VaR 数据", detail: "2026-08-08 · 待更新", state: "pending" },
  ],
  managementSummary: "集团 VaR 本期回落且仍在限额内，当前保持“改善中”；下一步只复核既定 VaR 指标和计量口径，不自动调整风险等级。",
  reportDraftId: historicalReport.id,
};

const seededState: InvestmentDemoState = {
  trackingTasks: [historicalTask],
  reportDrafts: [historicalReport],
};

function defaultTaskFields(sourceChangeId: string): Pick<InvestmentTrackingTask, "observations" | "timeline" | "managementSummary"> {
  const change = getChange(sourceChangeId, investmentRiskSnapshot);
  if (change.category === "return") {
    return {
      observations: [
        { id: `${change.id}-next-data`, title: "核验收益连续性", description: "比较下一期月度 CII 收益率和收益额。" },
        { id: `${change.id}-scope`, title: "复核四家险资口径", description: "确认成员变化与集团 CII 口径一致。" },
        { id: `${change.id}-upgrade`, title: "升级触发", description: "连续两期转负或出现口径异常时，由负责人确认升级。" },
      ],
      timeline: [
        { id: `${change.id}-found`, title: "识别收益变化事项", detail: "2026-07-08 · 已复核快照", state: "done" },
        { id: `${change.id}-confirmed`, title: "负责人确认进入跟踪", detail: "当前会话 · 跟踪中", state: "done" },
        { id: `${change.id}-next`, title: "复核下一期收益数据", detail: "2026-08-08 · 待更新", state: "pending" },
      ],
      managementSummary: "该事项当前为“跟踪中”。系统只监测已定义的 CII 收益指标和升级触发条件，不自动改变风险等级。",
    };
  }
  if (change.category === "var") {
    return {
      observations: [
        { id: `${change.id}-next-data`, title: "复核下一期 VaR", description: "比较成员整体 VaR 及较上月变化。" },
        { id: `${change.id}-scope`, title: "核验计量范围", description: "确认整体 VaR、因子 VaR 与集团口径的比较边界。" },
        { id: `${change.id}-upgrade`, title: "升级触发", description: "计量值继续上升或口径异常时，由负责人确认升级。" },
      ],
      timeline: [
        { id: `${change.id}-found`, title: "识别 VaR 变化事项", detail: "2026-07-08 · 当前快照", state: "done" },
        { id: `${change.id}-confirmed`, title: "负责人确认进入跟踪", detail: "当前会话 · 跟踪中", state: "done" },
        { id: `${change.id}-next`, title: "复核下一期 VaR 数据", detail: "2026-08-08 · 待更新", state: "pending" },
      ],
      managementSummary: "该事项按既定 VaR 口径持续核验；成员数值无独立限额，不据此自动判断风险等级。",
    };
  }
  return {
    observations: [
      { id: `${change.id}-next-data`, title: "复核下一期规模", description: "比较集团规模、成员变化与资产结构勾稽关系。" },
      { id: `${change.id}-upgrade`, title: "升级触发", description: "规模或结构出现异常变化时，由负责人确认升级。" },
    ],
    timeline: [
      { id: `${change.id}-found`, title: "识别规模变化事项", detail: "2026-07-08 · 已复核快照", state: "done" },
      { id: `${change.id}-confirmed`, title: "负责人确认进入跟踪", detail: "当前会话 · 跟踪中", state: "done" },
      { id: `${change.id}-next`, title: "复核下一期规模数据", detail: "2026-08-08 · 待更新", state: "pending" },
    ],
    managementSummary: "该事项只跟踪已确认的规模和结构变化，不据此生成调仓、交易或投资建议。",
  };
}

function reportContent(sourceChangeIds: string[]) {
  const changes = sourceChangeIds.map((id) => getChange(id, investmentRiskSnapshot));
  const first = changes[0];
  if (first.id === "group-var-improving") return historicalReport;
  if (first.category === "return") {
    return {
      title: "CII 月度收益变化汇报",
      summary: "CII 月度综合投资收益率为 -2.47%，较上月下降 70bp；四家险资年化收益仍为正。单月数据不足以判断趋势反转，需复核下一期数据。",
      managementActions: [
        { id: "return-review-1", title: "连续跟踪月度 CII 收益", description: "下一期复核收益率与收益额，判断是否连续转负。" },
        { id: "return-review-2", title: "核验成员变化", description: "仅在四家险资 CII 口径内比较成员收益变化。" },
        { id: "return-review-3", title: "保留人工确认", description: "满足升级触发后，由负责人确认是否调整跟踪状态。" },
      ],
      boundary: "本汇报基于单月已复核 CII 数据，不构成投资、交易或调仓建议。",
    };
  }
  if (first.id === "pension-var-leading") {
    return {
      title: "养老险成员 VaR 口径核验汇报",
      summary: "养老险成员 VaR 为 608 亿元，较上月增加 46 亿元并位列成员首位；该成员值无独立限额，需先核验计量范围和因子暴露。",
      managementActions: [
        { id: "pension-review-1", title: "核验成员 VaR 口径", description: "确认成员整体 VaR 的计量范围和比较期。" },
        { id: "pension-review-2", title: "复核因子暴露", description: "分别观察利率、权益和汇率因子，不进行加总。" },
        { id: "pension-review-3", title: "保留风险判断边界", description: "无独立限额，不因排名直接升级风险等级。" },
      ],
      boundary: "成员 VaR 与集团 VaR 口径不同，因子 VaR 彼此相关，不可直接相加。",
    };
  }
  return {
    title: "集团投资规模月度观察汇报",
    summary: "集团投资规模为 25,996 亿元，较上月增加 460 亿元；四类资产与七家成员规模保持一致勾稽，结构仍以固定收益为主。",
    managementActions: [
      { id: "scale-review-1", title: "按月复核规模", description: "继续核对集团、成员与资产类别三组金额。" },
      { id: "scale-review-2", title: "观察结构变化", description: "仅描述已确认的金额与占比，不推断未提供的收益或 VaR。" },
    ],
    boundary: "本汇报仅描述投资规模和结构，不构成投资、交易或调仓建议。",
  };
}

function normalizeTask(task: Partial<InvestmentTrackingTask> & Pick<InvestmentTrackingTask, "id" | "sourceChangeId">): InvestmentTrackingTask {
  const change = getChange(task.sourceChangeId, investmentRiskSnapshot);
  const defaults = defaultTaskFields(change.id);
  return {
    id: task.id,
    sourceSnapshotId: task.sourceSnapshotId ?? investmentRiskSnapshot.id,
    sourceChangeId: change.id,
    title: task.title ?? change.title,
    status: task.status ?? "pending",
    baselineMetricIds: task.baselineMetricIds ?? change.metricIds,
    memberIds: task.memberIds ?? change.memberIds,
    createdAt: task.createdAt ?? new Date().toISOString(),
    nextUpdateAt: task.nextUpdateAt ?? "2026-08-08",
    observations: task.observations ?? defaults.observations,
    timeline: task.timeline ?? defaults.timeline,
    managementSummary: task.managementSummary ?? defaults.managementSummary,
    reportDraftId: task.reportDraftId,
  };
}

function normalizeReport(draft: Partial<InvestmentReportDraft> & Pick<InvestmentReportDraft, "id">): InvestmentReportDraft {
  const sourceChangeIds = draft.sourceChangeIds?.length ? draft.sourceChangeIds : [investmentRiskSnapshot.changes[0].id];
  const content = reportContent(sourceChangeIds);
  const change = getChange(sourceChangeIds[0], investmentRiskSnapshot);
  return {
    id: draft.id,
    sourceSnapshotId: draft.sourceSnapshotId ?? investmentRiskSnapshot.id,
    sourceChangeIds,
    factEvidenceIds: draft.factEvidenceIds ?? change.evidenceIds,
    status: draft.status ?? "draft",
    title: draft.title ?? content.title,
    summary: draft.summary ?? content.summary,
    managementActions: draft.managementActions ?? content.managementActions,
    boundary: draft.boundary ?? content.boundary,
    createdAt: draft.createdAt ?? new Date().toISOString(),
    confirmedAt: draft.confirmedAt,
  };
}

function mergeById<T extends { id: string }>(saved: T[], seeded: T[]) {
  const savedIds = new Set(saved.map((item) => item.id));
  return [...saved, ...seeded.filter((item) => !savedIds.has(item.id))];
}

function readState(): InvestmentDemoState {
  if (typeof window === "undefined") return seededState;
  try {
    const value = window.localStorage.getItem(INVESTMENT_STORE_KEY);
    if (!value) return seededState;
    const parsed = JSON.parse(value) as Partial<InvestmentDemoState>;
    const trackingTasks = Array.isArray(parsed.trackingTasks)
      ? parsed.trackingTasks.filter((item): item is InvestmentTrackingTask => Boolean(item?.id && item?.sourceChangeId)).map(normalizeTask)
      : [];
    const reportDrafts = Array.isArray(parsed.reportDrafts)
      ? parsed.reportDrafts.filter((item): item is InvestmentReportDraft => Boolean(item?.id)).map(normalizeReport)
      : [];
    return {
      trackingTasks: mergeById(trackingTasks, seededState.trackingTasks),
      reportDrafts: mergeById(reportDrafts, seededState.reportDrafts),
    };
  } catch {
    return seededState;
  }
}

function writeState(state: InvestmentDemoState) {
  window.localStorage.setItem(INVESTMENT_STORE_KEY, JSON.stringify(state));
  window.dispatchEvent(new CustomEvent("investment-store-change"));
}

export function getInvestmentDemoState() {
  return readState();
}

export function getTrackingTask(taskId: string) {
  return readState().trackingTasks.find((task) => task.id === taskId);
}

export function findTrackingTask(sourceSnapshotId: string, sourceChangeId: string) {
  return readState().trackingTasks.find((task) => task.sourceSnapshotId === sourceSnapshotId && task.sourceChangeId === sourceChangeId);
}

export function createTrackingTask(input: Omit<InvestmentTrackingTask, "id" | "createdAt" | "status" | "observations" | "timeline" | "managementSummary"> & Partial<Pick<InvestmentTrackingTask, "observations" | "timeline" | "managementSummary">>) {
  const state = readState();
  const existing = state.trackingTasks.find((task) => task.sourceSnapshotId === input.sourceSnapshotId && task.sourceChangeId === input.sourceChangeId);
  if (existing) return { task: existing, created: false };
  const defaults = defaultTaskFields(input.sourceChangeId);
  const linkedReport = state.reportDrafts.find((draft) => draft.sourceChangeIds.length === 1 && draft.sourceChangeIds[0] === input.sourceChangeId);
  const task: InvestmentTrackingTask = {
    ...input,
    ...defaults,
    observations: input.observations ?? defaults.observations,
    timeline: input.timeline ?? defaults.timeline,
    managementSummary: input.managementSummary ?? defaults.managementSummary,
    id: `tracking-${input.sourceChangeId}`,
    status: "pending",
    createdAt: new Date().toISOString(),
    reportDraftId: input.reportDraftId ?? linkedReport?.id,
  };
  writeState({ ...state, trackingTasks: [task, ...state.trackingTasks] });
  return { task, created: true };
}

export function confirmTrackingTask(taskId: string) {
  const state = readState();
  const task = state.trackingTasks.find((item) => item.id === taskId);
  if (!task) return undefined;
  const updated = { ...task, status: task.status === "pending" ? "tracking" as const : task.status };
  writeState({ ...state, trackingTasks: state.trackingTasks.map((item) => (item.id === taskId ? updated : item)) });
  return updated;
}

export function getReportDraft(draftId: string) {
  return readState().reportDrafts.find((draft) => draft.id === draftId);
}

export function createReportDraft(input: Pick<InvestmentReportDraft, "sourceSnapshotId" | "sourceChangeIds" | "factEvidenceIds">) {
  const state = readState();
  const normalizedSourceIds = [...input.sourceChangeIds].sort();
  const existing = state.reportDrafts.find((draft) => draft.sourceSnapshotId === input.sourceSnapshotId && [...draft.sourceChangeIds].sort().join(",") === normalizedSourceIds.join(","));
  if (existing) return { draft: existing, created: false };
  const content = reportContent(normalizedSourceIds);
  const sourceSlug = normalizedSourceIds.join("-");
  const draft: InvestmentReportDraft = {
    ...input,
    sourceChangeIds: normalizedSourceIds,
    ...content,
    id: `investment-2026-06-${sourceSlug}-draft`,
    status: "draft",
    createdAt: new Date().toISOString(),
  };
  const linkedTasks = state.trackingTasks.map((task) => normalizedSourceIds.includes(task.sourceChangeId) ? { ...task, reportDraftId: draft.id } : task);
  writeState({ trackingTasks: linkedTasks, reportDrafts: [draft, ...state.reportDrafts] });
  return { draft, created: true };
}

export function confirmReportDraft(draftId: string) {
  const state = readState();
  const draft = state.reportDrafts.find((item) => item.id === draftId);
  if (!draft) return undefined;
  if (draft.status === "included") return draft;
  const updated: InvestmentReportDraft = { ...draft, status: "included", confirmedAt: new Date().toISOString() };
  writeState({ ...state, reportDrafts: state.reportDrafts.map((item) => (item.id === draftId ? updated : item)) });
  return updated;
}
