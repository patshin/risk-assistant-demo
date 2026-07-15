import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Bot,
  ChevronRight,
  CircleAlert,
  FileText,
  LoaderCircle,
  Maximize2,
  Minimize2,
  RefreshCw,
  Send,
  Target,
  UserRoundSearch,
  X,
} from "lucide-react";
import {
  formatMetric,
  formatNumber,
  getChange,
  getCiiViewData,
  investmentRiskSnapshot,
  type CiiViewId,
  type CompareBasis,
  type DataStatus,
} from "../data/investmentRisk";
import { warningCopilotFacts } from "../features/warning-default/data";
import { createReportDraft, createTrackingTask } from "../lib/investmentRiskStore";

export type CopilotIntent = "general" | "impact" | "action" | "tracking" | "report" | "pressure" | "warningFacts";

export type InvestmentSourceContext = {
  module: "investment" | "investment-risk";
  snapshotId: string;
  route: string;
  period: string;
  dataStatus: DataStatus;
  compareBasis: CompareBasis;
  page?: "performance";
  view?: CiiViewId;
  changeId?: string;
  memberId?: string;
  assetClassId?: string;
  metricIds?: string[];
};

export type OpenCopilotOptions = {
  intent?: CopilotIntent;
  context?: string;
  sourceContext?: InvestmentSourceContext;
};

type CopilotContextValue = {
  openCopilot: (options?: OpenCopilotOptions) => void;
  closeCopilot: () => void;
};

type CopilotState = {
  open: boolean;
  intent: CopilotIntent;
  context?: string;
  sourceContext?: InvestmentSourceContext;
  fullScreen: boolean;
  responseState: "loading" | "completed" | "error";
  followUpCount: number;
  notice?: string;
};

const CopilotContext = createContext<CopilotContextValue | null>(null);

const routeContext: Record<string, string> = {
  "/": "正在分析“今日风险总览与主动提醒”",
  "/brief": "正在分析“今日风险简报对集团的影响”",
  "/macro": "正在分析“宏观风险传导与市场扰动”",
  "/credit": "正在分析“信用集中度与重点客户风险”",
  "/investment": "正在分析“本期投资风险、证据与管理动作”",
  "/watch": "正在分析“个人工作台与待跟踪事项”",
  "/watch/today": "正在分析“今日重点风险事项”",
  "/watch/tracking": "正在分析“重点跟踪风险变化”",
  "/report": "正在分析“领导汇报内容与证据支撑”",
};

const intentContext: Record<CopilotIntent, string> = {
  general: "正在基于当前页面上下文继续分析",
  impact: "正在分析“地产链条风险对集团的影响”",
  action: "正在生成“风险处置建议与行动优先级”",
  tracking: "正在配置“重点风险跟踪任务”",
  report: "正在生成“领导汇报摘要预览”",
  pressure: "正在分析“压力情景下的资产影响”",
  warningFacts: "正在核对“预警事实与证据”",
};

export function GlobalCopilotProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const copilotQuery = new URLSearchParams(location.search).get("copilot");
  const warningHistoryEntry = useRef(false);
  const simulatedFailureConsumed = useRef(false);
  const [state, setState] = useState<CopilotState>({
    open: false,
    intent: "general",
    fullScreen: false,
    responseState: "completed",
    followUpCount: 0,
  });

  const value = useMemo<CopilotContextValue>(
    () => ({
      openCopilot: (options) => {
        if (options?.intent === "warningFacts" && !warningHistoryEntry.current) {
          window.history.pushState({ ...(window.history.state ?? {}), warningCopilot: true }, "");
          warningHistoryEntry.current = true;
        }
        simulatedFailureConsumed.current = false;
        setState({
          open: true,
          intent: options?.intent ?? "general",
          context: options?.context,
          sourceContext: options?.sourceContext,
          fullScreen: false,
          responseState: "loading",
          followUpCount: 0,
        });
      },
      closeCopilot: () => {
        setState((current) => ({ ...current, open: false, fullScreen: false, notice: undefined }));
        const isWarningEntry = (window.history.state as { warningCopilot?: boolean } | null)?.warningCopilot;
        if (warningHistoryEntry.current && isWarningEntry) {
          warningHistoryEntry.current = false;
          window.history.back();
        }
      },
    }),
    [],
  );

  useEffect(() => {
    const handlePopState = () => {
      const isWarningEntry = (window.history.state as { warningCopilot?: boolean } | null)?.warningCopilot;
      if (warningHistoryEntry.current && !isWarningEntry) {
        warningHistoryEntry.current = false;
        setState((current) => ({ ...current, open: false, fullScreen: false, notice: undefined }));
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    if (!location.pathname.startsWith("/credit/warning") || (copilotQuery !== "1" && copilotQuery !== "error")) return;
    simulatedFailureConsumed.current = false;
    setState((current) => {
      if (current.open && current.intent === "warningFacts") return current;
      return {
        open: true,
        intent: "warningFacts",
        context: "正在基于“预警与出险”结构化数据查询",
        fullScreen: false,
        responseState: "loading",
        followUpCount: 0,
      };
    });
  }, [copilotQuery, location.pathname]);

  useEffect(() => {
    if (!state.open || state.responseState !== "loading") return;
    const shouldError = import.meta.env.DEV && new URLSearchParams(location.search).get("copilot") === "error" && !simulatedFailureConsumed.current;
    if (shouldError) simulatedFailureConsumed.current = true;
    const timer = window.setTimeout(() => setState((current) => ({ ...current, responseState: shouldError ? "error" : "completed" })), 420);
    return () => window.clearTimeout(timer);
  }, [location.search, state.open, state.responseState]);

  const matchedContext = Object.entries(routeContext).sort(([a], [b]) => b.length - a.length).find(([route]) => location.pathname === route || location.pathname.startsWith(`${route}/`))?.[1];
  const resolvedContext = state.context ?? (state.sourceContext?.page === "performance"
    ? `正在分析“${getCiiViewData(investmentRiskSnapshot, state.sourceContext.view ?? "group").label}收益表现与集团差异”`
    : state.sourceContext ? "正在分析“投资风险事实、边界与后续动作”" : state.intent === "general" ? matchedContext : intentContext[state.intent]) ?? intentContext.general;

  return (
    <CopilotContext.Provider value={value}>
      {children}
      <CopilotSheet
        state={state}
        context={resolvedContext}
        onClose={value.closeCopilot}
        onState={setState}
      />
    </CopilotContext.Provider>
  );
}

export function useCopilot() {
  const value = useContext(CopilotContext);
  if (!value) throw new Error("useCopilot must be used inside GlobalCopilotProvider");
  return value;
}

function CopilotSheet({
  state,
  context,
  onClose,
  onState,
}: {
  state: CopilotState;
  context: string;
  onClose: () => void;
  onState: React.Dispatch<React.SetStateAction<CopilotState>>;
}) {
  const navigate = useNavigate();
  const panelRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!state.open) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    const scrollContainer = document.querySelector<HTMLElement>(".phone-shell");
    const previousContainerOverflow = scrollContainer?.style.overflowY ?? "";
    document.body.style.overflow = "hidden";
    if (scrollContainer) scrollContainer.style.overflowY = "hidden";
    window.requestAnimationFrame(() => closeRef.current?.focus());
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key === "Tab" && panelRef.current) {
        const focusable = Array.from(
          panelRef.current.querySelectorAll<HTMLElement>(
            'button:not([disabled]), [href], input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
          ),
        );
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      if (scrollContainer) scrollContainer.style.overflowY = previousContainerOverflow;
      previousFocus?.focus();
    };
  }, [onClose, state.open]);

  if (!state.open) return null;

  const runInvestmentAction = (action: "tracking" | "report" | "detail") => {
    const source = state.sourceContext;
    if (!source) return;
    const change = getChange(source.changeId, investmentRiskSnapshot);
    if (action === "tracking") {
      const result = createTrackingTask({
        sourceSnapshotId: investmentRiskSnapshot.id,
        sourceChangeId: change.id,
        title: change.title,
        baselineMetricIds: change.metricIds,
        memberIds: change.memberIds,
        nextUpdateAt: "2026-08-08",
      });
      onState((current) => ({ ...current, notice: result.created ? "已创建重点跟踪，点击可查看详情" : "该事项已在跟踪中，未重复创建" }));
      return;
    }
    if (action === "report") {
      const result = createReportDraft({ sourceSnapshotId: investmentRiskSnapshot.id, sourceChangeIds: [change.id], factEvidenceIds: change.evidenceIds });
      onClose();
      navigate(`/report/investment/${result.draft.id}`);
      return;
    }
    onClose();
    navigate("/investment/member/pension", { state: { returnTo: source.route } });
  };

  const investmentAnswer = state.sourceContext ? getInvestmentAnswer(state.sourceContext, state.followUpCount) : null;
  const genericAnswer = !investmentAnswer ? getGenericAnswer(state.intent) : null;

  return (
    <div className={`copilot-layer${state.fullScreen ? " is-fullscreen" : ""}${state.sourceContext ? " is-investment" : ""}${state.intent === "warningFacts" ? " is-warning-facts" : ""}`} role="presentation">
      <button className="copilot-layer__backdrop" type="button" aria-label="关闭 AI 风控助手" onClick={onClose} />
      <section ref={panelRef} className="copilot-panel" role="dialog" aria-modal="true" aria-label="AI 风控助手" aria-busy={state.responseState === "loading"}>
        <header className="copilot-header">
          <div className="copilot-header__mark">{state.intent === "warningFacts" ? <span>AI</span> : <Bot size={20} />}</div>
          <div><h2>AI 风控助手</h2><p>{context}</p></div>
          <div className="copilot-header__actions">
            {state.intent !== "warningFacts" ? <button type="button" aria-label={state.fullScreen ? "收起半屏" : "展开全屏"} onClick={() => onState((current) => ({ ...current, fullScreen: !current.fullScreen }))}>{state.fullScreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}</button> : null}
            <button ref={closeRef} type="button" aria-label="关闭" onClick={onClose}><X size={18} /></button>
          </div>
        </header>

        <div className="copilot-body">
          {state.responseState === "loading" ? (
            <div className="copilot-loading" role="status"><LoaderCircle size={26} /><strong>{state.sourceContext ? "正在核对投资快照与证据…" : "正在分析当前页面信息…"}</strong><span>{state.sourceContext ? "数据范围、时间和口径将随结论一并给出" : "结论与支持证据将一并给出"}</span></div>
          ) : state.responseState === "error" ? (
            <div className="copilot-error" role="alert"><CircleAlert size={28} /><strong>本次分析未完成</strong><span>没有生成未经核验的结论，请重试。</span><button type="button" onClick={() => onState((current) => ({ ...current, responseState: "loading" }))}><RefreshCw size={16} />重新分析</button></div>
          ) : state.intent === "warningFacts" ? (
            <WarningFactsAnswer followUpCount={state.followUpCount} />
          ) : investmentAnswer ? (
            <>
              <section className="copilot-user-bubble">{investmentAnswer.prompt}</section>
              <section className="copilot-answer investment-copilot-answer">
                <div className="copilot-answer__lead"><span>AI</span><p>以下内容基于 {investmentRiskSnapshot.periodLabel} 已复核快照：</p></div>
                <CopilotBlock title="结论摘要"><p>{investmentAnswer.summary}</p></CopilotBlock>
                <CopilotBlock title="关键证据">
                  <div className="copilot-evidence-list">{investmentAnswer.evidence.map((item) => <div key={item.text}><span>{item.text}</span><em>{item.source}</em></div>)}</div>
                </CopilotBlock>
                <CopilotBlock title="不确定性与边界">
                  <div className="investment-copilot-boundary"><CircleAlert size={17} /><p>{investmentAnswer.boundary}</p></div>
                </CopilotBlock>
                <CopilotBlock title="建议的管理动作">
                  <div className="copilot-recommendations">
                    <button type="button" onClick={() => runInvestmentAction("tracking")}><Target size={16} /><span>加入重点跟踪</span><ChevronRight size={15} /></button>
                    <button type="button" onClick={() => runInvestmentAction("report")}><FileText size={16} /><span>生成汇报预览</span><ChevronRight size={15} /></button>
                    {state.sourceContext?.page === "performance" ? null : <button type="button" onClick={() => runInvestmentAction("detail")}><ChevronRight size={16} /><span>查看养老险</span><ChevronRight size={15} /></button>}
                  </div>
                </CopilotBlock>
                {state.notice ? <button className="investment-copilot-notice" type="button" aria-live="polite" onClick={() => { const change = getChange(state.sourceContext?.changeId, investmentRiskSnapshot); onClose(); navigate(`/watch/tracking/tracking-${change.id}`); }}>{state.notice}<ChevronRight size={16} /></button> : null}
              </section>
            </>
          ) : genericAnswer ? (
            <>
              <section className="copilot-user-bubble">{genericAnswer.prompt}</section>
              <section className="copilot-answer">
                <div className="copilot-answer__lead"><span>AI</span><p>好的，以下是基于当前页面上下文生成的分析：</p></div>
                <CopilotBlock title="结论摘要"><p>{genericAnswer.summary}</p></CopilotBlock>
                <CopilotBlock title="风险传导链路"><div className="copilot-chain">{genericAnswer.chain.map((item, index) => <div key={item} className="copilot-chain__item"><span>{item}</span>{index < genericAnswer.chain.length - 1 ? <ArrowRight size={16} /> : null}</div>)}</div></CopilotBlock>
                <CopilotBlock title="主要影响对象"><div className="copilot-impact-grid">{genericAnswer.impacts.map((item) => <article key={item.title}><item.icon size={18} /><strong>{item.title}</strong><p>{item.desc}</p></article>)}</div></CopilotBlock>
                <CopilotBlock title="关键证据"><div className="copilot-evidence-list">{genericAnswer.evidence.map((item) => <div key={item.text}><span>{item.text}</span><em>{item.source}</em></div>)}</div></CopilotBlock>
                <CopilotBlock title="推荐动作"><div className="copilot-recommendations">{genericAnswer.actions.map((item) => <button key={item} type="button"><Target size={16} /><span>{item}</span><ChevronRight size={15} /></button>)}</div></CopilotBlock>
              </section>
            </>
          ) : null}
        </div>

        <footer className="copilot-input">
          <button type="button" disabled={state.responseState !== "completed"} onClick={() => onState((current) => ({ ...current, responseState: "loading", followUpCount: current.followUpCount + 1, notice: undefined }))}>{state.followUpCount ? "继续核对影响范围…" : "继续追问…"}</button>
          <Send size={18} />
        </footer>
      </section>
    </div>
  );
}

function CopilotBlock({ title, children }: { title: string; children: ReactNode }) {
  return <section className="copilot-block"><h3>{title}</h3>{children}</section>;
}

function WarningFactsAnswer({ followUpCount }: { followUpCount: number }) {
  return (
    <>
      <section className="copilot-user-bubble">{warningCopilotFacts.prompt}</section>
      <section className="copilot-answer copilot-warning-facts">
        <div className="copilot-answer__lead"><span>AI</span><p>基于当前页面结构化数据查询</p></div>
        <CopilotBlock title="业务事实">
          <div className="copilot-warning-facts__metrics">
            <div><span>新增重大预警</span><strong>{warningCopilotFacts.majorWarning.amountBillion.toFixed(2)} 亿元</strong><small>涉及 {warningCopilotFacts.majorWarning.customerCount} 户</small></div>
            <div className="is-default"><span>新增出险</span><strong>{warningCopilotFacts.defaulted.amountBillion.toFixed(2)} 亿元</strong><small>涉及 {warningCopilotFacts.defaulted.customerCount} 户</small></div>
          </div>
          <p className="copilot-warning-facts__date">数据截至 {warningCopilotFacts.asOf}。</p>
        </CopilotBlock>
        <CopilotBlock title="已确认的重点新增事项">
          <p>出险：{warningCopilotFacts.defaultItem}。</p>
          <p>重大预警：{warningCopilotFacts.majorItem}。</p>
        </CopilotBlock>
        <CopilotBlock title="结论类型">
          <p><strong>AI 推断：无。</strong> 本回答仅汇总已确认结构化事实，不进行风险预测或处置建议。</p>
        </CopilotBlock>
        {followUpCount > 0 ? (
          <CopilotBlock title="补充核对口径">
            <p>客户数按法人客户去重，资产金额按当前资产状态归类；本日新增重大预警为 0.00 亿元、0 户。AI 推断：无。</p>
          </CopilotBlock>
        ) : null}
      </section>
    </>
  );
}

function getInvestmentAnswer(source: InvestmentSourceContext, followUpCount: number) {
  if (source.page === "performance") {
    const viewData = getCiiViewData(investmentRiskSnapshot, source.view ?? "group");
    const metrics = [viewData.annualAmount, viewData.annualRate, viewData.monthlyAmount, viewData.monthlyRate];
    const evidence = metrics.map((metric) => ({
      text: `${metric.label} ${metric.value === null ? "—" : `${formatNumber(metric.value, metric.unit === "%" ? 2 : 0)}${metric.unit}`}`,
      source: `${metric.dataScope} · ${metric.source}`,
    }));
    return {
      prompt: followUpCount ? `请继续核对${viewData.label}收益表现的判断边界和后续动作` : `请解释${viewData.label}当前收益表现，并给出可确认的管理动作`,
      summary: followUpCount ? `${viewData.interpretation.conclusion} 后续应优先执行：${viewData.interpretation.action}` : viewData.interpretation.conclusion,
      evidence,
      boundary: `${viewData.interpretation.uncertainty} AI 输出需由人确认，且不构成投资、买卖、调仓或配置建议。`,
    };
  }
  const change = getChange(source.changeId, investmentRiskSnapshot);
  const metricIds = source.metricIds?.length ? source.metricIds : change.metricIds;
  const evidence = metricIds.slice(0, 4).map((metricId) => {
    const metric = investmentRiskSnapshot.metrics[metricId];
    return { text: `${metric.label} ${formatMetric(metric)}`, source: `${metric.scope} · ${metric.source}` };
  });
  if (!evidence.some((item) => item.text.includes("426"))) evidence.push({ text: "集团 VaR 426亿元，限额使用率 53.3%", source: "VaR 计量资产 · 市场风险计量系统" });
  if (!evidence.some((item) => item.text.includes("608"))) evidence.push({ text: "养老险成员 VaR 608亿元", source: "成员计量值 · 无独立限额" });
  return {
    prompt: followUpCount ? "请继续核对这项变化的影响范围和判断边界" : "请解释当前投资风险变化，并给出可确认的管理动作",
    summary: followUpCount
      ? "补充核对后，影响主要落在四家险资 CII 收益范围；集团 VaR 本月下降，养老险成员 VaR 仍需口径核验，结论不升级为投资建议。"
      : "CII 月度综合投资收益率为 -2.47%，是本期首要关注变化；集团 VaR 为 426 亿元、限额使用率 53.3%，整体仍在限额内。",
    evidence,
    boundary: "收益只覆盖四家险资 CII 口径，VaR 覆盖 VaR 计量资产；单月收益不足以判断趋势反转，成员 VaR 无独立限额。AI 输出需由人确认，且不构成投资、买卖或调仓建议。",
  };
}

function getGenericAnswer(intent: CopilotIntent) {
  if (intent === "action") return { prompt: "请生成当前风险的处置建议", summary: "建议以风险信号、敞口主体、责任团队和处置进度为主线推进。", chain: ["风险信号升温", "敞口主体识别", "责任团队分派", "处置进度跟踪"], impacts: defaultImpacts, evidence: defaultEvidence, actions: ["建立日度监控清单", "生成客户排查任务", "同步本周风险例会"] };
  if (intent === "tracking") return { prompt: "请把这个风险加入重点跟踪", summary: "可创建重点跟踪任务，绑定证据来源和更新节奏。", chain: ["设置跟踪主题", "绑定证据来源", "配置预警阈值", "输出跟踪简报"], impacts: defaultImpacts, evidence: defaultEvidence, actions: ["设置跟踪主题", "设置升温提醒", "生成摘要"] };
  if (intent === "pressure") return { prompt: "请分析压力情景下的资产影响", summary: "压力情景需要结合当前资产数据和已确认的风险边界进一步测算。", chain: ["情景定义", "资产映射", "损失测算", "管理确认"], impacts: defaultImpacts, evidence: defaultEvidence, actions: ["复核情景参数", "测算情景损失", "确认管理边界"] };
  if (intent === "report") return { prompt: "请生成领导汇报摘要", summary: "当前主要风险可按变化、影响对象、关键证据和管理动作整理为领导汇报。", chain: ["风险识别", "影响对象归并", "关键证据整理", "形成汇报口径"], impacts: defaultImpacts, evidence: defaultEvidence, actions: ["生成一页式摘要", "补充支撑证据", "形成30秒口播稿"] };
  return { prompt: intent === "impact" ? "请分析近期地产风险对集团的影响" : "请基于当前页面继续分析风险", summary: "地产销售、企业现金流和市场波动可能通过产业链、授信敞口和投资组合影响集团。", chain: ["地产销售下行", "房企现金流承压", "上下游回款放缓", "相关客户信用压力上升", "集团资产质量承压"], impacts: defaultImpacts, evidence: defaultEvidence, actions: ["生成汇报摘要", "生成处置建议", "加入重点跟踪", "查看受影响客户"] };
}

const defaultImpacts = [
  { title: "地产上下游客户", desc: "建材、施工、承包等", icon: UserRoundSearch },
  { title: "相关授信客户", desc: "融资与担保压力", icon: Target },
  { title: "投资组合", desc: "信用债、权益资产", icon: FileText },
  { title: "集团报表", desc: "资产质量与收益", icon: Bot },
];

const defaultEvidence = [
  { text: "1-5月商品房销售面积同比 -17.3%", source: "国家统计局" },
  { text: "30家重点房企境内债展期规模上升", source: "Wind" },
  { text: "建筑行业应收账款周转天数上升至 96 天", source: "行业报告" },
];
