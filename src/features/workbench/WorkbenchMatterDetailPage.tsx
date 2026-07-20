import { Navigate, useParams } from "react-router-dom";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowRight,
  Bot,
  Building2,
  CalendarClock,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  Clock3,
  FileCheck2,
  FileClock,
  Landmark,
  Link2,
  ListChecks,
  MessageSquareText,
  RefreshCw,
  Scale,
  Send,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  UserRoundCheck,
  WalletCards,
} from "lucide-react";
import { matters, type MatterId } from "./data/workbenchDemoData";
import { useWorkbench } from "./state/workbenchStore";
import { AiBoundary, AiInsightCard, EvidenceStatus, SectionHeading, WorkbenchTag } from "./components/WorkbenchUI";
import { useWorkbenchActions } from "./WorkbenchLayout";

export function WorkbenchMatterDetailPage() {
  const { matterId } = useParams<{ matterId: MatterId }>();
  if (!matterId || !matters[matterId]) return <Navigate to="/watch" replace />;
  if (matterId === "huadong") return <HuadongDetail />;
  if (matterId === "baise") return <BaiseDetail />;
  if (matterId === "cii") return <CiiDetail />;
  return <ChangningDetail />;
}

function DetailHero({ matterId, children }: { matterId: MatterId; children?: React.ReactNode }) {
  const matter = matters[matterId];
  const title = matterId === "huadong" ? "华东建设集团集中度与信用风险事项" : matter.title;
  const responsibility = matterId === "huadong" ? "今日 17:00 前确认是否升级专项核查，并指定牵头责任人。" : matter.responsibility;
  return (
    <section className={`wb-detail-hero is-${matterId}`}>
      <div className="wb-detail-hero__tags"><WorkbenchTag tone={matter.priority === "P0" ? "critical" : matterId === "cii" ? "purple" : "warning"}>{matter.priority}</WorkbenchTag><WorkbenchTag tone={matterId === "huadong" || matterId === "baise" ? "critical" : "info"}>{matter.risk}</WorkbenchTag><WorkbenchTag>{matter.status}</WorkbenchTag><span>{matter.category}</span></div>
      <h1>{title}</h1>
      <div className="wb-detail-hero__meta">{matterId === "huadong" ? <span>事项 RM-2026-0716-001 · 首次发现 08:42 · 更新于 09:25</span> : <><span><Clock3 size={14} />{matter.updatedAt} 更新</span><span><CalendarClock size={14} />{matter.due}</span></>}</div>
      <div className="wb-detail-responsibility"><span>你的责任</span><p>{responsibility}</p></div>
      {children}
    </section>
  );
}

function DetailSection({ title, meta, children, className = "" }: { title: string; meta?: string; children: React.ReactNode; className?: string }) {
  return <section className={`wb-card wb-detail-section${className ? ` ${className}` : ""}`}><SectionHeading title={title} meta={meta} />{children}</section>;
}

function EvidenceRow({ icon, title, source, time, status, action }: { icon: React.ReactNode; title: string; source: string; time: string; status: "confirmed" | "pending" | "missing"; action?: string }) {
  return (
    <div className="wb-evidence-row"><span className="wb-evidence-row__icon">{icon}</span><div><strong>{title}</strong><small>{source} · {time}</small></div><EvidenceStatus label={status === "confirmed" ? "已确认" : status === "pending" ? "待核验" : "缺失"} status={status} />{action ? <button type="button" aria-label={action}><ChevronRight size={16} /></button> : null}</div>
  );
}

function HuadongDetail() {
  const { state } = useWorkbench();
  const { openSheet, askCopilot } = useWorkbenchActions();
  const decisionLabel = state.huadongDecision === "special-review" ? "启动专项核查" : state.huadongDecision === "observe" ? "维持观察" : state.huadongDecision === "request-materials" ? "先补材料" : "尚未确认";
  return (
    <div className="wb-detail-page">
      <DetailHero matterId="huadong">
        {state.huadongDecision !== "pending" ? <div className="wb-decision-confirmed"><CheckCircle2 size={16} />管理策略已确认：{decisionLabel}</div> : null}
      </DetailHero>

      <DetailSection title="为什么现在重要" meta="事实变化与触发规则">
        <p className="wb-detail-lead">占用率连续上升并突破管理阈值，司法执行信号同步增加；融资与投资主体可能存在关联，需要跨模块确认。</p>
        <div className="wb-metric-trend"><div><span>集中度限额占用率</span><strong>128%</strong><small>较上期 +7pct</small></div><div className="wb-mini-bars" aria-label="集中度从 106% 上升至 128%"><i style={{ height: "36%" }} /><i style={{ height: "54%" }} /><i style={{ height: "72%" }} /><i style={{ height: "92%" }} /><span>106</span><span>113</span><span>121</span><span>128</span></div></div>
        <div className="wb-trigger-list"><div><CircleAlert size={16} /><span><strong>确定性规则</strong>占用率超过 120% 且连续两期上升</span></div><div><Scale size={16} /><span><strong>已确认事实</strong>新增 2 条司法执行记录</span></div></div>
      </DetailSection>

      <DetailSection title="集团敞口" meta="同一主体 · 分模块呈现">
        <div className="wb-exposure-grid"><div><span><Landmark size={17} />融资敞口</span><strong>25.6 亿元</strong><small>已确认 · 银行与租赁</small></div><div><span><WalletCards size={17} />投资持仓</span><strong>3.8 亿元</strong><small>待核验 · 2 个组合</small></div><div><span><Building2 size={17} />关联成员公司</span><strong>3 家</strong><small>已识别关联主体</small></div><div><span><ShieldAlert size={17} />集中度占用率</span><strong>128%</strong><small>超过管理阈值</small></div></div>
        <div className="wb-association-path"><span>华东建设集团</span><ArrowRight size={15} /><span>融资主体</span><ArrowRight size={15} /><span className="is-pending">疑似投资关联主体</span></div>
      </DetailSection>

      <AiInsightCard title="风险升级信号可信，但影响边界仍需核验" onAsk={() => askCopilot("华东建设集团 · 解释升级原因、证据和行动边界", "huadong")}>
        <p>规则触发与司法执行属于已确认事实；“可能形成跨模块集中风险”是 AI 推断，不能替代主体关系核验。</p>
        <div className="wb-evidence-sufficiency"><EvidenceStatus label="4 项事实已确认" status="confirmed" /><EvidenceStatus label="1 项关系待核验" status="pending" /></div>
      </AiInsightCard>

      <DetailSection title="证据链" meta="来源、时间与确认状态">
        <div className="wb-evidence-list-detail"><EvidenceRow icon={<Landmark size={17} />} title="集中度限额占用率 128%" source="集中度监测系统" time="09:20" status="confirmed" action="查看原始记录" /><EvidenceRow icon={<Scale size={17} />} title="新增 2 条司法执行记录" source="司法公开信息" time="09:18" status="confirmed" action="查看原始记录" /><EvidenceRow icon={<WalletCards size={17} />} title="疑似投资持仓 3.8 亿元" source="投资风险快照" time="09:22" status="pending" action="核验主体关系" /><EvidenceRow icon={<Building2 size={17} />} title="最新现金流与偿债安排" source="责任单位补充" time="尚未提交" status="missing" /></div>
      </DetailSection>

      <DetailSection title="信息缺口" meta="补齐前不扩大结论">
        <div className="wb-gap-card"><AlertTriangle size={18} /><div><strong>投资持仓与主体关系待核验</strong><p>需确认疑似关联主体是否纳入华东建设集团同一风险口径。</p></div></div>
        <div className="wb-section-actions"><button type="button" onClick={() => openSheet("assign")}><UserRoundCheck size={17} />{state.huadongTask ? "查看已分派任务" : "分派核验任务"}</button><button type="button" onClick={() => openSheet("materials")}><Send size={17} />补充材料</button></div>
      </DetailSection>

      <DetailSection title="管理决策" meta="需由你确认并留痕" className="wb-decision-section">
        <div className="wb-decision-callout"><MessageSquareText size={18} /><div><strong>{state.huadongDecision === "pending" ? "等待管理策略" : `已确认：${decisionLabel}`}</strong><p>{state.huadongDecision === "pending" ? "建议启动专项核查，同时保留对主体关系与敞口范围的不确定性说明。" : "确认结果已回写待处理、跟踪与汇报准备度。"}</p></div></div>
        <button className="wb-primary-button" type="button" onClick={() => openSheet("decision")}><Check size={17} />{state.huadongDecision === "pending" ? "确认管理策略" : "调整管理策略"}</button>
      </DetailSection>

      <DetailSection title="任务与记录" meta="责任闭环">
        <div className="wb-task-record"><span className={state.huadongTask ? "is-done" : ""}>{state.huadongTask ? <CheckCircle2 size={18} /> : <FileClock size={18} />}</span><div><strong>{state.huadongTask?.name ?? "主体关系核验任务尚未分派"}</strong><p>{state.huadongTask ? `${state.huadongTask.owner} · ${state.huadongTask.due.replace("T", " ")} 前完成` : "指定责任人和完成时间后进入重点跟踪。"}</p></div><button type="button" onClick={() => openSheet("assign")}><ChevronRight size={17} /></button></div>
        <div className="wb-activity-log"><div><i /><span><strong>09:25</strong>事项升级为 P0，进入集团风险负责人队列</span></div><div><i /><span><strong>09:22</strong>AI 发现融资与投资主体可能关联，标记为待核验</span></div><div><i /><span><strong>09:18</strong>司法公开信息新增 2 条执行记录</span></div></div>
      </DetailSection>
    </div>
  );
}

function BaiseDetail() {
  const { state } = useWorkbench();
  const { openSheet, askCopilot } = useWorkbenchActions();
  return (
    <div className="wb-detail-page">
      <DetailHero matterId="baise">{state.baiseProgress ? <div className="wb-decision-confirmed"><CheckCircle2 size={16} />最新进展已于刚刚同步</div> : null}</DetailHero>
      <DetailSection title="已确认的出险事实" meta="资产状态与金额口径"><div className="wb-fact-amount"><span>出险金额</span><strong>0.47 亿元</strong><small>本息实质逾期 · 已确认</small></div><div className="wb-trigger-list"><div><CircleAlert size={16} /><span><strong>状态事实</strong>已进入出险资产清单</span></div><div><Clock3 size={16} /><span><strong>执行缺口</strong>处置进展更新已超期 30 分钟</span></div></div></DetailSection>
      <DetailSection title="处置进展" meta={state.baiseProgress ? "刚刚更新" : "等待责任人补充"}>{state.baiseProgress ? <><div className="wb-progress-update"><CheckCircle2 size={18} /><div><strong>{state.baiseProgress.judgment}</strong><p>{state.baiseProgress.detail}</p><small>下次更新：{state.baiseProgress.nextUpdate.replace("T", " ")}</small></div></div><button className="wb-secondary-button" type="button" onClick={() => openSheet("progress")}><RefreshCw size={16} />再次更新</button></> : <div className="wb-overdue-block"><Clock3 size={20} /><div><strong>约定进展尚未提交</strong><p>需要补充最新回收、担保处置与下一更新时间。</p></div><button type="button" onClick={() => openSheet("progress")}>立即更新<ArrowRight size={15} /></button></div>}</DetailSection>
      <AiInsightCard title="资产事实明确，风险是否缓释仍不能判断" onAsk={() => askCopilot("广西百色出险事项 · 核对事实、处置进展和判断边界", "baise")}><p>实质逾期属于源系统事实；处置效果取决于最新回收与担保材料，材料缺失时 AI 不应推断风险已缓释。</p><div className="wb-evidence-sufficiency"><EvidenceStatus label="资产事实已确认" status="confirmed" /><EvidenceStatus label={state.baiseProgress ? "进展已补充" : "进展仍缺失"} status={state.baiseProgress ? "confirmed" : "missing"} /></div></AiInsightCard>
      <DetailSection title="证据与材料" meta="责任边界清晰"><div className="wb-evidence-list-detail"><EvidenceRow icon={<FileCheck2 size={17} />} title="出险资产登记与金额" source="信用风险系统" time="08:45" status="confirmed" /><EvidenceRow icon={<Scale size={17} />} title="担保处置文件" source="责任单位" time="07-15 17:20" status="confirmed" /><EvidenceRow icon={<RefreshCw size={17} />} title="最新回收与处置进展" source="李敏" time={state.baiseProgress ? "刚刚" : "待提交"} status={state.baiseProgress ? "confirmed" : "missing"} /></div></DetailSection>
      <AiBoundary>AI 可以整理资产事实和进展差异，但“风险是否缓释”必须由责任人基于最新材料人工确认。</AiBoundary>
    </div>
  );
}

function CiiDetail() {
  const { state, dispatch } = useWorkbench();
  const { askCopilot, notify } = useWorkbenchActions();
  return (
    <div className="wb-detail-page">
      <DetailHero matterId="cii">{state.ciiReportIncluded ? <div className="wb-decision-confirmed"><CheckCircle2 size={16} />已确认纳入本周汇报</div> : null}</DetailHero>
      <DetailSection title="收益与风险指标" meta="2026 年 6 月快照"><div className="wb-investment-metrics"><div className="is-negative"><span>月度综合投资收益率</span><strong>-2.47%</strong><small><ArrowDownRight size={14} />较上期 -70bp</small></div><div><span>集团 VaR</span><strong>426 亿元</strong><small>限额使用率 53.3%</small></div></div><div className="wb-metric-strip"><span>收益口径：四家险资 CII</span><span>VaR 口径：VaR 计量资产</span></div></DetailSection>
      <AiInsightCard title="收益变化需要关注，但风险限额未被突破" onAsk={() => askCopilot("CII 月度收益变化 · 解释关键证据、边界与汇报口径", "cii")}><p>月度收益转负是已确认变化；集团 VaR 为 426 亿元、使用率 53.3%，仍在限额内。单月结果不足以判断趋势反转。</p><div className="wb-evidence-sufficiency"><EvidenceStatus label="4 项数据已确认" status="confirmed" /><EvidenceStatus label="趋势结论需观察" status="pending" /></div></AiInsightCard>
      <DetailSection title="纳入本周汇报" meta="需要人工确认"><div className="wb-decision-callout"><MessageSquareText size={18} /><div><strong>{state.ciiReportIncluded ? "已纳入正式汇报准备" : "等待确认"}</strong><p>建议呈现收益变化，同时明确 VaR 仍在限额内、收益与 VaR 数据范围不同。</p></div></div><button className="wb-primary-button" disabled={state.ciiReportIncluded} type="button" onClick={() => { dispatch({ type: "confirm-cii-report" }); notify("CII 已确认纳入本周汇报"); }}><Check size={17} />{state.ciiReportIncluded ? "已确认纳入" : "确认纳入汇报"}</button></DetailSection>
      <DetailSection title="关键证据" meta="来源可追溯"><div className="wb-evidence-list-detail"><EvidenceRow icon={<TrendingDown size={17} />} title="月度综合投资收益率 -2.47%" source="投资风险快照" time="09:32" status="confirmed" /><EvidenceRow icon={<ArrowDownRight size={17} />} title="较上期下降 70bp" source="同口径期间比较" time="09:32" status="confirmed" /><EvidenceRow icon={<ShieldCheck size={17} />} title="集团 VaR 426 亿元，使用率 53.3%" source="市场风险计量系统" time="09:30" status="confirmed" /></div></DetailSection>
      <AiBoundary>本页不构成投资、买卖、调仓或配置建议；AI 仅解释已复核快照，并保留数据口径和不确定性。</AiBoundary>
    </div>
  );
}

function ChangningDetail() {
  const { state } = useWorkbench();
  const { openSheet, askCopilot } = useWorkbenchActions();
  return (
    <div className="wb-detail-page">
      <DetailHero matterId="changning">{state.missingMaterialsRequested ? <div className="wb-decision-confirmed"><CheckCircle2 size={16} />缺失材料补充请求已发出</div> : null}</DetailHero>
      <DetailSection title="当前能确认什么" meta="重大预警事实"><div className="wb-warning-fact"><ShieldAlert size={22} /><div><strong>重大预警状态已确认</strong><p>客户已被源系统标记为重大预警，但触发原因明细与现金流证据未同步。</p></div></div><div className="wb-trigger-list"><div><FileCheck2 size={16} /><span><strong>已确认</strong>客户身份与重大预警状态</span></div><div><Clock3 size={16} /><span><strong>待补充</strong>原因明细与现金流变化</span></div></div></DetailSection>
      <AiInsightCard title="当前证据不足以解释预警原因" onAsk={() => askCopilot("常宁市尚宇高级中学 · 梳理已知事实和信息缺口", "changning")}><p>AI 不能根据“重大预警”标签自行补全原因。应先获取原因明细、现金流与偿债安排，再由专业人员判断。</p><div className="wb-evidence-sufficiency"><EvidenceStatus label="2 项事实已确认" status="confirmed" /><EvidenceStatus label="2 项材料缺失" status="missing" /></div></AiInsightCard>
      <DetailSection title="缺失材料" meta="补齐后再形成研判"><div className="wb-material-list"><div><span><ListChecks size={17} /></span><div><strong>触发原因明细</strong><p>规则、指标、阈值和首次触发时间</p></div><WorkbenchTag tone="critical">缺失</WorkbenchTag></div><div><span><WalletCards size={17} /></span><div><strong>现金流与偿债安排</strong><p>最近一期现金流变化和未来 3 个月安排</p></div><WorkbenchTag tone="critical">缺失</WorkbenchTag></div></div><button className="wb-primary-button" type="button" onClick={() => openSheet("materials")}><Send size={17} />{state.missingMaterialsRequested ? "再次提醒补充" : "发起材料补充"}</button></DetailSection>
      <DetailSection title="后续责任" meta="先补证据，再做判断"><div className="wb-task-record"><span><UserRoundCheck size={18} /></span><div><strong>分派信用风险专业人员</strong><p>材料到达后核验原因、现金流和预警等级。</p></div><button type="button" onClick={() => openSheet("assign")}><ChevronRight size={17} /></button></div></DetailSection>
      <AiBoundary>当前只可报告“已触发重大预警且原因材料缺失”；不得将未知原因表述为事实，也不得自动给出处置结论。</AiBoundary>
    </div>
  );
}
