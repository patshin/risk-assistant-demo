import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import {
  ArrowRight,
  Bot,
  ChevronRight,
  FileText,
  Maximize2,
  Minimize2,
  Send,
  Target,
  UserRoundSearch,
  X,
} from "lucide-react";

type CopilotIntent = "general" | "impact" | "action" | "tracking" | "report" | "pressure";

type OpenCopilotOptions = {
  intent?: CopilotIntent;
  context?: string;
};

type CopilotContextValue = {
  openCopilot: (options?: OpenCopilotOptions) => void;
  closeCopilot: () => void;
};

const CopilotContext = createContext<CopilotContextValue | null>(null);

const routeContext: Record<string, string> = {
  "/": "正在分析“今日风险总览与主动提醒”",
  "/brief": "正在分析“今日风险简报对集团的影响”",
  "/macro": "正在分析“宏观风险传导与市场扰动”",
  "/credit": "正在分析“信用集中度与重点客户风险”",
  "/investment": "正在分析“投资组合风险与压力情景”",
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
};

export function GlobalCopilotProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [state, setState] = useState<{ open: boolean; intent: CopilotIntent; context?: string; fullScreen: boolean }>({
    open: false,
    intent: "general",
    fullScreen: false,
  });

  const value = useMemo<CopilotContextValue>(
    () => ({
      openCopilot: (options) =>
        setState({
          open: true,
          intent: options?.intent ?? "general",
          context: options?.context,
          fullScreen: false,
        }),
      closeCopilot: () => setState((current) => ({ ...current, open: false, fullScreen: false })),
    }),
    [],
  );

  const resolvedContext = state.context ?? (state.intent === "general" ? routeContext[location.pathname] : intentContext[state.intent]) ?? intentContext.general;

  return (
    <CopilotContext.Provider value={value}>
      {children}
      <CopilotSheet
        open={state.open}
        intent={state.intent}
        context={resolvedContext}
        fullScreen={state.fullScreen}
        onClose={value.closeCopilot}
        onToggleFullScreen={() => setState((current) => ({ ...current, fullScreen: !current.fullScreen }))}
      />
    </CopilotContext.Provider>
  );
}

export function useCopilot() {
  const value = useContext(CopilotContext);

  if (!value) {
    throw new Error("useCopilot must be used inside GlobalCopilotProvider");
  }

  return value;
}

function CopilotSheet({
  open,
  intent,
  context,
  fullScreen,
  onClose,
  onToggleFullScreen,
}: {
  open: boolean;
  intent: CopilotIntent;
  context: string;
  fullScreen: boolean;
  onClose: () => void;
  onToggleFullScreen: () => void;
}) {
  if (!open) {
    return null;
  }

  const answer = getCopilotAnswer(intent);

  return (
    <div className={`copilot-layer${fullScreen ? " is-fullscreen" : ""}`} role="presentation">
      <button className="copilot-layer__backdrop" type="button" aria-label="关闭 AI 风控助手" onClick={onClose} />
      <section className="copilot-panel" role="dialog" aria-modal="true" aria-label="AI 风控助手">
        <header className="copilot-header">
          <div className="copilot-header__mark">
            <Bot size={20} />
          </div>
          <div>
            <h2>AI 风控助手</h2>
            <p>{context}</p>
          </div>
          <div className="copilot-header__actions">
            <button type="button" aria-label={fullScreen ? "收起半屏" : "展开全屏"} onClick={onToggleFullScreen}>
              {fullScreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
            <button type="button" aria-label="关闭" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </header>

        <div className="copilot-body">
          <section className="copilot-user-bubble">{answer.prompt}</section>

          <section className="copilot-answer">
            <div className="copilot-answer__lead">
              <span>AI</span>
              <p>好的，以下是基于当前页面上下文生成的分析：</p>
            </div>

            <CopilotBlock title="结论摘要">
              <p>{answer.summary}</p>
            </CopilotBlock>

            <CopilotBlock title="风险传导链路">
              <div className="copilot-chain">
                {answer.chain.map((item, index) => (
                  <div key={item} className="copilot-chain__item">
                    <span>{item}</span>
                    {index < answer.chain.length - 1 ? <ArrowRight size={16} /> : null}
                  </div>
                ))}
              </div>
            </CopilotBlock>

            <CopilotBlock title="主要影响对象">
              <div className="copilot-impact-grid">
                {answer.impacts.map((item) => (
                  <article key={item.title}>
                    <item.icon size={18} />
                    <strong>{item.title}</strong>
                    <p>{item.desc}</p>
                  </article>
                ))}
              </div>
            </CopilotBlock>

            <CopilotBlock title="关键证据">
              <div className="copilot-evidence-list">
                {answer.evidence.map((item) => (
                  <div key={item.text}>
                    <span>{item.text}</span>
                    <em>{item.source}</em>
                  </div>
                ))}
              </div>
            </CopilotBlock>

            <CopilotBlock title="推荐动作">
              <div className="copilot-recommendations">
                {answer.actions.map((item) => (
                  <button key={item} type="button">
                    <Target size={16} />
                    <span>{item}</span>
                    <ChevronRight size={15} />
                  </button>
                ))}
              </div>
            </CopilotBlock>
          </section>

        </div>

        <footer className="copilot-input">
          <button type="button">继续追问…</button>
          <Send size={18} />
        </footer>
      </section>
    </div>
  );
}

function CopilotBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="copilot-block">
      <h3>{title}</h3>
      {children}
    </section>
  );
}

function getCopilotAnswer(intent: CopilotIntent) {
  if (intent === "action") {
    return {
      prompt: "请生成当前风险的处置建议",
      summary: "建议以“先控敞口、再排查传导、同步汇报”为主线推进，优先处理已升温且影响授信或投资敞口的事项。",
      chain: ["风险信号升温", "敞口主体识别", "责任团队分派", "处置进度跟踪"],
      impacts: defaultImpacts,
      evidence: defaultEvidence,
      actions: ["建立日度监控清单", "生成客户排查任务", "同步本周风险例会"],
    };
  }

  if (intent === "tracking") {
    return {
      prompt: "请把这个风险加入重点跟踪",
      summary: "可创建重点跟踪任务，监控风险温度、关联主体、最新证据和处置进度，建议设置为本周高优先级。",
      chain: ["设置跟踪主题", "绑定证据来源", "配置预警阈值", "输出跟踪简报"],
      impacts: defaultImpacts,
      evidence: defaultEvidence,
      actions: ["跟踪地产链条风险", "设置升温提醒", "每日上午生成摘要"],
    };
  }

  if (intent === "pressure") {
    return {
      prompt: "请分析压力情景下的资产影响",
      summary: "在收益率上行和权益回调并存时，长久期债券与权益成长板块承压更明显，组合波动可能继续上升。",
      chain: ["利率上行", "估值回撤", "风险资产同步承压", "组合净值波动扩大"],
      impacts: defaultImpacts,
      evidence: defaultEvidence,
      actions: ["复核久期暴露", "测算情景损失", "优化流动性缓冲"],
    };
  }

  if (intent === "report") {
    return {
      prompt: "请生成领导汇报摘要",
      summary: "当前风险整体偏高，地产链条、债市波动和重点客户舆情是主要关注点，建议纳入本周汇报。",
      chain: ["风险识别", "影响对象归并", "关键证据整理", "形成汇报口径"],
      impacts: defaultImpacts,
      evidence: defaultEvidence,
      actions: ["生成一页式摘要", "补充支撑证据", "形成30秒口播稿"],
    };
  }

  return {
    prompt: intent === "impact" ? "请分析近期地产风险对集团的影响" : "请基于当前页面继续分析风险",
    summary: "地产销售下行、房企现金流承压和债市波动，可能通过上下游产业链、授信敞口和投资组合多条路径影响集团资产质量与投资收益。",
    chain: ["地产销售下行", "房企现金流承压", "上下游回款放缓", "相关客户信用压力上升", "集团资产质量承压"],
    impacts: defaultImpacts,
    evidence: defaultEvidence,
    actions: ["生成汇报摘要", "生成处置建议", "加入重点跟踪", "查看受影响客户"],
  };
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
