import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  Clock3,
  FileCheck2,
  Gauge,
  ListChecks,
  MessageSquareText,
  Sparkles,
  TrendingDown,
  UserRoundCheck,
} from "lucide-react";
import { changes, matters } from "./data/workbenchDemoData";
import { useWorkbench } from "./state/workbenchStore";
import { MatterCard, SectionHeading, WorkbenchTag } from "./components/WorkbenchUI";
import { useWorkbenchActions, WorkbenchSection } from "./WorkbenchLayout";

export function WorkbenchOverviewPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state, dispatch, readiness, pendingCount } = useWorkbench();
  const { openSheet } = useWorkbenchActions();
  const completedActions = 4 - pendingCount;

  return (
    <div className="wb-overview">
      <section className="wb-today-card">
        <div className="wb-today-card__header">
          <span><ListChecks size={18} /></span>
          <div><h2>今天需要你处理</h2><p>集团风险负责人 · 集团口径</p></div>
          <small>截至 09:30</small>
        </div>
        <div className="wb-today-card__total"><strong>4</strong><span>项</span></div>
        <p className="wb-today-card__summary"><b>1</b> 项待决策、<b>1</b> 项已超期、<b>3</b> 项出现未读关键变化。</p>
        <p className="wb-today-card__insight"><Sparkles size={14} />较上次查看新增 3 条与你有关的已确认信息</p>
        <div className="wb-today-stats">
          <div><strong>{state.huadongDecision === "pending" ? 1 : 0}</strong><span>待决策</span></div>
          <div><strong>{state.baiseProgress ? 0 : 1}</strong><span>已超期</span></div>
          <div><strong>{state.unreadChanges}</strong><span>新变化</span></div>
        </div>
        <div className="wb-today-card__footer"><span>仅统计需要你判断、确认、执行或推动的事项</span><button type="button" onClick={() => navigate("/watch/queue")}><ListChecks size={17} />开始处理<ArrowRight size={16} /></button></div>
      </section>

      <WorkbenchSection>
        <SectionHeading title="最重要的事" meta="按严重度、时限与责任排序" action="全部" onAction={() => navigate("/watch/queue")} />
        <MatterCard matter={matters.huadong} actionLabel={state.huadongDecision === "pending" ? "确认策略" : "已确认"} onAction={() => state.huadongDecision === "pending" ? openSheet("decision") : navigate("/watch/matter/huadong", { state: { returnTo: location.pathname } })} />
        <MatterCard matter={matters.baise} compact actionLabel={state.baiseProgress ? "已更新" : "更新进展"} onAction={() => state.baiseProgress ? navigate("/watch/matter/baise", { state: { returnTo: location.pathname } }) : openSheet("progress")} />
      </WorkbenchSection>

      <WorkbenchSection>
        <SectionHeading title="今日变化" meta={state.unreadChanges ? `${state.unreadChanges} 条未读` : "已全部阅读"} action={state.unreadChanges ? "全部已读" : undefined} onAction={() => dispatch({ type: "mark-read" })} />
        <div className="wb-change-list">
          {changes.map((change, index) => (
            <button key={change.id} type="button" className="wb-change-item" onClick={() => navigate(`/watch/matter/${change.matterId}`, { state: { returnTo: location.pathname } })}>
              <span className={`wb-change-item__icon is-${change.matterId}`}>{change.matterId === "cii" ? <TrendingDown size={18} /> : change.matterId === "huadong" ? <CircleAlert size={18} /> : <Clock3 size={18} />}</span>
              <span className="wb-change-item__copy"><span><small>{change.time} · {change.type}</small>{index < state.unreadChanges ? <i /> : null}</span><strong>{change.title}</strong><p>{change.detail}</p><em>{change.source}</em></span>
              <b>{change.metric}</b>
              <ChevronRight size={16} />
            </button>
          ))}
        </div>
      </WorkbenchSection>

      <WorkbenchSection>
        <SectionHeading title="执行跟踪" meta="责任、时限与结果" action="查看跟踪" onAction={() => navigate("/watch/tracking")} />
        <div className="wb-execution-grid">
          <button type="button" onClick={() => openSheet("assign")}><span className="is-orange"><UserRoundCheck size={19} /></span><strong>{state.huadongTask ? "1 项已分派" : "1 项待分派"}</strong><small>{state.huadongTask ? `${state.huadongTask.owner} · ${state.huadongTask.name}` : "华东建设主体关系核验"}</small><ChevronRight size={16} /></button>
          <button type="button" onClick={() => openSheet("progress")}><span className="is-red"><CalendarClock size={19} /></span><strong>{state.baiseProgress ? "进展已更新" : "1 项已超期"}</strong><small>{state.baiseProgress ? `${state.baiseProgress.judgment} · 刚刚` : "广西百色 · 逾期 30 分钟"}</small><ChevronRight size={16} /></button>
        </div>
      </WorkbenchSection>

      <section className="wb-meeting-card">
        <div className="wb-meeting-card__top"><span><MessageSquareText size={19} /></span><div><small>本周风险例会</small><h2>汇报准备度 {readiness}%</h2></div><button type="button" onClick={() => navigate("/watch/reports")}>查看<ChevronRight size={15} /></button></div>
        <div className="wb-progress-track"><span style={{ width: `${readiness}%` }} /></div>
        <div className="wb-meeting-stats"><div><strong>4</strong><span>重点事项</span></div><div><strong>{completedActions + 2}</strong><span>已确认事实</span></div><div><strong>{pendingCount}</strong><span>待完成动作</span></div></div>
        <p><FileCheck2 size={15} />所有 AI 内容均需保留证据时间、口径边界与人工确认状态。</p>
      </section>

      <button className="wb-directive-card" type="button" onClick={() => openSheet("directive")}>
        <span><Sparkles size={19} /></span>
        <span><small>会议指令</small><strong>先讲重大升级，再讲出险进展，最后交代投资边界</strong></span>
        <ChevronRight size={18} />
      </button>

      {state.missingMaterialsRequested ? <div className="wb-inline-notice"><CheckCircle2 size={16} />常宁市尚宇高级中学材料补充请求已发出</div> : null}
      <div className="wb-overview-footnote"><Gauge size={15} /><span>排序由严重度、时限和责任规则确定；AI 仅解释证据与建议动作。</span><WorkbenchTag tone="neutral">可追溯</WorkbenchTag></div>
    </div>
  );
}
