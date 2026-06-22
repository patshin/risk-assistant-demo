import { useState, type ReactNode } from "react";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  BellRing,
  Building2,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  ClipboardList,
  FileText,
  Gavel,
  Link2,
  MessageCircle,
  PauseCircle,
  Send,
  Share2,
  ShieldAlert,
  Sparkles,
  Star,
  TrendingDown,
  WalletCards,
} from "lucide-react";
import { BottomAskBar, PageHeader, PillTag, useCopilot } from "../components";
import {
  getCustomerRiskProfile,
  getCustomerStatusVariant,
  type CustomerRiskProfile,
  type ExternalEventCounts,
  type ExternalRiskEvent,
} from "../data/creditCustomers";

const detailTabs = [
  { key: "overview", label: "风险概览" },
  { key: "rating", label: "信用评级" },
  { key: "events", label: "舆情司法" },
  { key: "advice", label: "处置建议" },
] as const;

type DetailTabKey = (typeof detailTabs)[number]["key"];

export function CustomerRiskDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id = "huadong-construction" } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { openCopilot } = useCopilot();
  const profile = getCustomerRiskProfile(id);
  const activeTab = getActiveTab(searchParams.get("tab"));
  const backPath = getReturnTo(location.state, "/credit");

  const switchTab = (key: DetailTabKey) => {
    setSearchParams(key === "overview" ? {} : { tab: key });
  };

  return (
    <div className="page customer-risk-detail-page">
      <div className="page-scroll customer-risk-detail-screen">
        <StatusBar />
        <PageHeader
          title="客户风险详情"
          onBack={() => navigate(backPath)}
          action={
            <button className="icon-button" type="button" aria-label="分享">
              <Share2 size={18} />
            </button>
          }
        />

        <CustomerIdentity profile={profile} onOpenRating={() => switchTab("rating")} />
        {activeTab === "overview" ? <RiskOverviewHero profile={profile} /> : null}
        <CustomerDetailTabs activeTab={activeTab} onChange={switchTab} />

        {activeTab === "overview" ? <OverviewTab profile={profile} /> : null}
        {activeTab === "rating" ? <RatingTab profile={profile} /> : null}
        {activeTab === "events" ? <EventsTab profile={profile} /> : null}
        {activeTab === "advice" ? <AdviceTab profile={profile} /> : null}
      </div>

      <BottomAskBar onOpen={() => openCopilot({ context: `正在分析“${profile.name}客户风险证据链”` })} />
    </div>
  );
}

function CustomerIdentity({ profile, onOpenRating }: { profile: CustomerRiskProfile; onOpenRating: () => void }) {
  return (
    <section className="customer-identity">
      <span className="customer-identity__icon" aria-hidden="true">
        <Building2 size={25} />
      </span>
      <div>
        <h2>{profile.name}</h2>
        <p>客户编号：{profile.customerCode}</p>
      </div>
      <button className={`customer-rating-badge customer-rating-badge--large is-${getRatingTone(profile.rating)}`} type="button" onClick={onOpenRating}>
        {profile.rating}
        {profile.ratingTrend === "down" ? <span>↓</span> : null}
      </button>
      <PillTag variant={getCustomerStatusVariant(profile.riskLevel)}>{profile.riskLevel}</PillTag>
    </section>
  );
}

function RiskOverviewHero({ profile }: { profile: CustomerRiskProfile }) {
  return (
    <section className="customer-overview-hero glass-card">
      <div className="customer-overview-hero__score">
        <span>风险评分</span>
        <strong>{profile.riskScore}</strong>
        <em>/100</em>
        <b>↑ {profile.scoreDelta}<small>较上月</small></b>
      </div>
      <div className="customer-overview-hero__visual" aria-hidden="true">
        <ShieldAlert size={62} />
      </div>
      <div className="customer-overview-hero__metrics">
        <span>
          当前评级
          <strong>{profile.rating} {profile.ratingTrend === "down" ? "↓" : ""}</strong>
        </span>
        <span>
          上月评级
          <strong>{profile.previousRating}</strong>
        </span>
        <span>
          风险状态
          <strong>{profile.riskLevel}</strong>
        </span>
      </div>
      <div className="customer-ai-note">
        <h3>
          <Sparkles size={16} />
          AI 判断
        </h3>
        <p>{profile.aiJudgment}</p>
      </div>
    </section>
  );
}

function CustomerDetailTabs({ activeTab, onChange }: { activeTab: DetailTabKey; onChange: (key: DetailTabKey) => void }) {
  return (
    <div className="customer-detail-tabs" role="tablist" aria-label="客户风险详情">
      {detailTabs.map((item) => (
        <button className={activeTab === item.key ? "is-active" : ""} type="button" role="tab" aria-selected={activeTab === item.key} key={item.key} onClick={() => onChange(item.key)}>
          {item.label}
        </button>
      ))}
    </div>
  );
}

function OverviewTab({ profile }: { profile: CustomerRiskProfile }) {
  const [summaryVisible, setSummaryVisible] = useState(false);
  const [tracked, setTracked] = useState(false);

  return (
    <>
      <section className="customer-detail-card glass-card">
        <header>
          <h2>主要风险因子</h2>
          <button type="button">查看全部<ChevronRight size={14} /></button>
        </header>
        <div className="risk-factor-chip-grid">
          {profile.overviewRiskFactors.map((item) => (
            <span key={item}>
              {getRiskFactorIcon(item)}
              {item}
            </span>
          ))}
        </div>
      </section>

      <section className="customer-detail-card glass-card">
        <h2>最新风险动态</h2>
        <div className="customer-update-timeline">
          {profile.overviewUpdates.map((item) => (
            <article key={`${item.title}-${item.time}`}>
              <span aria-hidden="true">{getRiskFactorIcon(item.title)}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.detail}</p>
              </div>
              <time>{item.time}</time>
            </article>
          ))}
        </div>
      </section>

      <section className="customer-detail-card ai-next-step-card glass-card">
        <h2>
          <Sparkles size={18} />
          AI 下一步建议
        </h2>
        <p>建议暂停新增授信，排查关联担保链，并将该客户纳入专项跟踪，持续关注现金流和商票逾期变化。</p>
        <div className="customer-action-row">
          <button className="ghost-button" type="button" onClick={() => setSummaryVisible(true)}>
            <FileText size={17} />
            生成客户风险摘要
          </button>
          <button className={tracked ? "ghost-button is-done" : "ghost-button"} type="button" onClick={() => setTracked(true)}>
            <CheckCircle2 size={17} />
            {tracked ? "已加入跟踪" : "加入跟踪"}
          </button>
        </div>
        {summaryVisible ? (
          <p className="customer-generated-result">
            {profile.name}当前评级为 {profile.rating}，风险评分 {profile.riskScore}，主要受{profile.mainRisks.join("、")}影响。建议暂停新增授信，排查关联担保链，并纳入一级跟踪。
          </p>
        ) : null}
      </section>
    </>
  );
}

function RatingTab({ profile }: { profile: CustomerRiskProfile }) {
  const [generated, setGenerated] = useState(false);

  return (
    <>
      <section className="rating-current-card glass-card">
        <div>
          <span>当前信用评级</span>
          <strong>
            {profile.rating}
            {profile.ratingTrend === "down" ? <TrendingDown size={34} /> : null}
          </strong>
          <p>上月评级：<b>{profile.previousRating}</b></p>
          <p>评级状态：<em>{profile.ratingStatus}</em></p>
        </div>
        <small>{profile.ratingChange}</small>
        <div className="rating-card-visual" aria-hidden="true">
          <ShieldAlert size={64} />
        </div>
      </section>

      <section className="customer-detail-card rating-timeline-card glass-card">
        <h2>评级变化历史（近 4 个月）</h2>
        <div className="rating-timeline">
          {profile.ratingTimeline.map((item) => (
            <div className={item.changed ? "is-changed" : item.month === "6月" ? "is-current" : ""} key={item.month}>
              <strong>{item.rating}{item.changed ? " ↓" : ""}</strong>
              <span />
              <em>{item.month}</em>
            </div>
          ))}
        </div>
      </section>

      <section className="customer-detail-card rating-reason-card glass-card">
        <h2>评级下调原因</h2>
        <div className="rating-reason-list">
          {profile.ratingReasons.map((item) => (
            <article key={item.title}>
              <span aria-hidden="true">{getRiskFactorIcon(item.title)}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
              <strong>{item.impact}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="customer-detail-card rating-ai-card glass-card">
        <h2>
          <Sparkles size={18} />
          AI 评级解读
        </h2>
        <p>{profile.ratingInterpretation}</p>
        <button className="ghost-button" type="button" onClick={() => setGenerated(true)}>
          <FileText size={17} />
          生成评级说明
        </button>
        {generated ? <p className="customer-generated-result">{profile.ratingGeneratedText}</p> : null}
      </section>
    </>
  );
}

function EventsTab({ profile }: { profile: CustomerRiskProfile }) {
  const [tracked, setTracked] = useState(false);
  const [summaryVisible, setSummaryVisible] = useState(false);

  return (
    <>
      <section className="events-overview-card glass-card">
        <h2>舆情司法事件概览（近 7 日）</h2>
        <div className="event-count-grid">
          <EventCount icon={<MessageCircle size={18} />} value={profile.externalEvents.sentiment} label="负面舆情" />
          <EventCount icon={<Gavel size={18} />} value={profile.externalEvents.litigation} label="诉讼案件" />
          <EventCount icon={<ShieldAlert size={18} />} value={profile.externalEvents.enforcement} label="被执行信息" />
          <EventCount icon={<ClipboardList size={18} />} value={profile.externalEvents.regulatory ?? 0} label="监管处罚" />
          <EventCount icon={<FileText size={18} />} value={profile.externalEvents.announcement ?? 0} label="重大公告" />
        </div>
        <div className="customer-ai-note">
          <h3>
            <Sparkles size={16} />
            AI 概览
          </h3>
          <p>{profile.eventInsight}</p>
        </div>
      </section>

      <div className="external-sheet-filter-row customer-event-filter-row">
        {getEventFilterChips(profile.externalEvents).map((chip) => (
          <button className={chip.key === "all" ? "is-active" : ""} type="button" key={chip.key}>
            {chip.label}
          </button>
        ))}
      </div>

      <section className="customer-detail-card full-event-card glass-card">
        <header>
          <h2>事件时间轴（近 30 天）</h2>
          <span>最新在前</span>
        </header>
        <EventTimeline events={profile.eventTimeline} />
      </section>

      <section className="customer-detail-card event-ai-judge-card glass-card">
        <h2>
          <Sparkles size={18} />
          AI 判断
        </h2>
        <p>外部事件数量和强度在上升，且与内部经营压力指标共振，建议将该客户纳入一级跟踪并加强资金链监控。</p>
        <div className="customer-action-row">
          <button className={tracked ? "ghost-button is-done" : "ghost-button"} type="button" onClick={() => setTracked(true)}>
            <CheckCircle2 size={17} />
            {tracked ? "已加入跟踪" : "加入跟踪"}
          </button>
          <button className="primary-button" type="button" onClick={() => setSummaryVisible(true)}>
            <Sparkles size={17} />
            生成舆情摘要
          </button>
        </div>
        {summaryVisible ? <p className="customer-generated-result">{profile.name}近 7 日新增外部风险信号 {getExternalEventTotal(profile.externalEvents)} 条，建议纳入一级跟踪并持续观察舆情、诉讼和被执行变化。</p> : null}
      </section>
    </>
  );
}

function AdviceTab({ profile }: { profile: CustomerRiskProfile }) {
  const advice = profile.disposalAdvice;
  const [generated, setGenerated] = useState(false);
  const [tracked, setTracked] = useState(false);
  const [reportState, setReportState] = useState<"idle" | "done">("idle");
  const [noticeVisible, setNoticeVisible] = useState(false);

  return (
    <>
      <section className="advice-summary-card glass-card">
        <div>
          <h2>
            <Sparkles size={18} />
            AI 处置建议摘要
          </h2>
          <p>{advice.summary}</p>
          <div className="advice-summary-metrics">
            <span>
              建议处置等级
              <strong>{advice.disposalLevel}</strong>
            </span>
            <span>
              紧急程度
              <StarRating value={advice.urgency} />
            </span>
          </div>
        </div>
        <ClipboardCheck size={64} aria-hidden="true" />
      </section>

      <section className="customer-detail-card advice-action-card glass-card">
        <h2>建议处置行动清单</h2>
        <div className="advice-action-list">
          {advice.actions.map((item, index) => (
            <article key={item.title}>
              <span>{index + 1}</span>
              <i aria-hidden="true">{getAdviceIcon(item.title)}</i>
              <div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
              <strong className={item.priority === "高优先级" ? "is-high" : "is-medium"}>{item.priority}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="customer-detail-card advice-interpretation-card glass-card">
        <h2>
          <Sparkles size={18} />
          AI 处置建议解读
        </h2>
        <p>{advice.aiInterpretation}</p>
        <button className="ghost-button" type="button" onClick={() => setGenerated(true)}>
          <FileText size={17} />
          生成处置建议说明
        </button>
        {generated ? (
          <p className="customer-generated-result">
            华东建设集团当前评级由 1A 下调至 1B，风险评分升至 86，主要受现金流承压、商票逾期及负面舆情影响。建议暂停新增授信，排查关联担保链，并纳入一级跟踪。
          </p>
        ) : null}
      </section>

      <section className="customer-detail-card recommended-action-card glass-card">
        <h2>推荐后续动作</h2>
        <div className="recommended-action-list">
          <button type="button" onClick={() => setTracked(true)}>
            <Building2 size={18} />
            <span>
              <strong>{tracked ? "已加入跟踪" : "加入专项跟踪"}</strong>
              <em>将该客户加入专项跟踪清单，定期更新风险变化。</em>
            </span>
            <ChevronRight size={16} />
          </button>
          <button type="button" onClick={() => setReportState("done")}>
            <FileText size={18} />
            <span>
              <strong>{reportState === "done" ? "风险报告已生成" : "生成风险报告"}</strong>
              <em>生成该客户风险分析报告，用于内部汇报。</em>
            </span>
            <ChevronRight size={16} />
          </button>
          <button type="button" onClick={() => setNoticeVisible(true)}>
            <Send size={18} />
            <span>
              <strong>{noticeVisible ? "已准备通知" : "通知相关人员"}</strong>
              <em>将风险信号同步至相关人员，协同跟踪处置。</em>
            </span>
            <ChevronRight size={16} />
          </button>
        </div>
      </section>
    </>
  );
}

function EventCount({ icon, value, label }: { icon: ReactNode; value: number; label: string }) {
  return (
    <span>
      <i>{icon}</i>
      <strong>{value}</strong>
      <em>{label}</em>
    </span>
  );
}

function EventTimeline({ events }: { events: ExternalRiskEvent[] }) {
  return (
    <div className="full-event-timeline">
      {events.map((item) => (
        <article key={`${item.time}-${item.title}`}>
          <span className="full-event-timeline__icon">{getEventIcon(item.type)}</span>
          <div>
            <time>{item.time}</time>
            <h3>
              {item.title}
              <small>{item.type}</small>
            </h3>
            <p>{item.summary}</p>
            <em>影响因素：{item.factors.join("、")}</em>
          </div>
          <strong className={item.impact === "影响较大" ? "is-high" : "is-medium"}>{item.impact}</strong>
          <ChevronRight size={16} />
        </article>
      ))}
    </div>
  );
}

function StarRating({ value }: { value: number }) {
  return (
    <strong className="advice-stars" aria-label={`紧急程度 ${value} 星`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star className={index < value ? "is-active" : ""} size={18} fill="currentColor" key={index} />
      ))}
    </strong>
  );
}

function getActiveTab(tab: string | null): DetailTabKey {
  if (tab === "rating" || tab === "events" || tab === "advice") {
    return tab;
  }

  return "overview";
}

function getReturnTo(state: unknown, fallback: string) {
  if (state && typeof state === "object" && "returnTo" in state) {
    const returnTo = (state as { returnTo?: unknown }).returnTo;
    if (typeof returnTo === "string") {
      return returnTo;
    }
  }

  return fallback;
}

function getRatingTone(rating: string) {
  if (rating === "1D" || rating === "1C") {
    return "critical";
  }

  if (rating === "1B") {
    return "high";
  }

  if (rating.startsWith("2")) {
    return "medium";
  }

  return "low";
}

function getRiskFactorIcon(text: string) {
  if (text.includes("商票") || text.includes("逾期")) {
    return <WalletCards size={16} />;
  }

  if (text.includes("舆情")) {
    return <MessageCircle size={16} />;
  }

  if (text.includes("担保")) {
    return <Link2 size={16} />;
  }

  if (text.includes("被执行") || text.includes("司法") || text.includes("诉讼")) {
    return <Gavel size={16} />;
  }

  if (text.includes("行业")) {
    return <TrendingDown size={16} />;
  }

  return <Building2 size={16} />;
}

function getAdviceIcon(text: string) {
  if (text.includes("授信")) {
    return <PauseCircle size={17} />;
  }

  if (text.includes("担保")) {
    return <Link2 size={17} />;
  }

  if (text.includes("现金流")) {
    return <WalletCards size={17} />;
  }

  return <MessageCircle size={17} />;
}

function getEventIcon(type: string) {
  if (type === "诉讼") {
    return <Gavel size={18} />;
  }

  if (type === "被执行") {
    return <ShieldAlert size={18} />;
  }

  if (type === "监管") {
    return <BellRing size={18} />;
  }

  if (type === "公告") {
    return <FileText size={18} />;
  }

  return <MessageCircle size={18} />;
}

function getEventFilterChips(events: ExternalEventCounts) {
  return [
    { key: "all", label: `全部 ${getExternalEventTotal(events)}` },
    { key: "sentiment", label: `负面舆情 ${events.sentiment}` },
    { key: "litigation", label: `诉讼 ${events.litigation}` },
    { key: "enforcement", label: `被执行 ${events.enforcement}` },
    { key: "regulatory", label: `监管 ${events.regulatory ?? 0}` },
    { key: "announcement", label: `公告 ${events.announcement ?? 0}` },
  ];
}

function getExternalEventTotal(events: ExternalEventCounts) {
  return events.sentiment + events.litigation + events.enforcement + (events.regulatory ?? 0) + (events.announcement ?? 0);
}

function StatusBar() {
  return (
    <div className="status-bar" aria-hidden="true">
      <span>9:41</span>
      <div className="status-bar__icons">
        <span className="signal">
          <span />
          <span />
          <span />
        </span>
        <span>Wi-Fi</span>
        <span className="battery" />
      </div>
    </div>
  );
}
