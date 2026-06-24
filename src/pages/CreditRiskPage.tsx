import { useRef, useState, type MouseEvent, type MutableRefObject } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  Bot,
  Building2,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  FileText,
  Gavel,
  Landmark,
  Link2,
  MessageCircle,
  PieChart,
  Share2,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Umbrella,
  UserRoundSearch,
  UsersRound,
} from "lucide-react";
import { BottomAskBar, DonutChart, PageHeader, PillTag, TabBar, useCopilot } from "../components";
import {
  aiPredictedCustomers,
  concentrationRiskViews,
  getCustomerRiskProfile,
  getCustomerStatusVariant,
  migrationTrendData,
  riskFactorData,
  subsidiaryRiskData,
  type AIPredictedCustomer,
  type ConcentrationDimension,
  type ConcentrationRiskView,
  type ConcentrationSource,
  type ConcentrationTrendPoint,
  type CreditCustomer,
  type ExternalEventCounts,
  type MigrationTrendPoint,
  type RiskFactorItem,
  type SubsidiaryRiskItem,
} from "../data/creditCustomers";
import { LargeExposureHomeContent } from "./LargeExposurePage";

const tabs = [
  { key: "large", label: "大户风险" },
  { key: "concentration", label: "集中度风险" },
  { key: "warning", label: "预警与出险" },
];

const concentrationDims: ConcentrationDimension[] = ["客户", "行业", "区域"];
const migrationViewTabs = [
  { key: "overall", label: "总体趋势" },
  { key: "subsidiary", label: "子公司视图" },
  { key: "driver", label: "风险驱动" },
] as const;

type CreditRiskTab = (typeof tabs)[number]["key"];
type MigrationViewTab = (typeof migrationViewTabs)[number]["key"];

function getCreditRiskTab(tab: string | null): CreditRiskTab {
  return tabs.some((item) => item.key === tab) ? (tab as CreditRiskTab) : "large";
}

const subsidiaryMigrationCards = [
  {
    name: "平安银行",
    tag: "风险上升",
    status: "rise",
    change: "+3",
    warning: "215",
    defaulted: "48",
    desc: "对公地产链和城投客户风险迁移加快，需关注现金流和再融资压力。",
    icon: Landmark,
  },
  {
    name: "平安产险",
    tag: "风险上升",
    status: "rise",
    change: "+2",
    warning: "142",
    defaulted: "23",
    desc: "工程类客户赔付与回款压力上升，风险迁移加快。",
    icon: Umbrella,
  },
  {
    name: "平安资管",
    tag: "风险上升",
    status: "riseGreen",
    change: "+1",
    warning: "67",
    defaulted: "10",
    desc: "部分非标资产风险抬头，需加强底层资产穿透监控。",
    icon: PieChart,
  },
  {
    name: "平安寿险",
    tag: "保持稳定",
    status: "stable",
    change: "0",
    warning: "86",
    defaulted: "8",
    desc: "风险迁移保持平稳，整体风险可控。",
    icon: ShieldCheck,
  },
] as const;

const riskMigrationDrivers = [
  {
    name: "宏观周期",
    desc: "经济下行压力加大",
    score: "+2.1",
    level: 88,
    tone: "orange",
    icon: TrendingUp,
  },
  {
    name: "债市波动",
    desc: "利率上行，信用利差走阔",
    score: "+1.8",
    level: 78,
    tone: "orange",
    icon: Landmark,
  },
  {
    name: "信用事件",
    desc: "违约/展期事件增加",
    score: "+1.3",
    level: 60,
    tone: "orange",
    icon: ShieldCheck,
  },
  {
    name: "舆情研报",
    desc: "负面舆情及不利研报增多",
    score: "+0.8",
    level: 34,
    tone: "orange",
    icon: FileText,
  },
  {
    name: "政策监管",
    desc: "监管趋严，政策收紧",
    score: "+0.3",
    level: 12,
    tone: "green",
    icon: ClipboardList,
  },
] as const;

export function CreditRiskPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { openCopilot } = useCopilot();
  const activeTab = getCreditRiskTab(searchParams.get("tab"));
  const predictedSectionRef = useRef<HTMLElement | null>(null);
  const backPath = getReturnTo(location.state, "/");

  const scrollToPredictedCustomers = () => {
    predictedSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="page credit-page">
      <div className="page-scroll credit-detail">
        <PageHeader
          title="信用风险"
          onBack={() => navigate(backPath)}
          action={
            <button className="icon-button" type="button" aria-label="分享">
              <Share2 size={18} />
            </button>
          }
        />

        <TabBar
          items={tabs}
          activeKey={activeTab}
          onChange={(key) => setSearchParams({ tab: key })}
        />

        {activeTab === "large" ? <LargeExposureHomeContent /> : null}
        {activeTab === "concentration" ? <ConcentrationTab /> : null}
        {activeTab === "warning" ? <WarningDefaultTab predictedSectionRef={predictedSectionRef} onViewHighRisk={scrollToPredictedCustomers} /> : null}
      </div>

      <BottomAskBar
        placeholder={activeTab === "large" ? "问大户风险、筛选客户、生成名单..." : activeTab === "warning" ? "问预警、查出险、生成迁徙报告…" : undefined}
        onOpen={() =>
          openCopilot({
            context:
              activeTab === "large"
                ? "正在分析“大户风险首页与 AI 推荐名单”"
                : activeTab === "warning"
                  ? "正在分析“信用风险迁徙与预警出险”"
                  : "正在分析“信用风险集中趋势”",
          })
        }
      />
    </div>
  );
}

export function RiskMigrationTrendPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { openCopilot } = useCopilot();
  const [activeView, setActiveView] = useState<MigrationViewTab>("driver");
  const backPath = getReturnTo(location.state, "/brief");

  return (
    <div className="page risk-migration-page">
      <div className="page-scroll risk-migration-screen">
        <PageHeader
          title="风险迁移趋势"
          onBack={() => navigate(backPath)}
          action={
            <button className="icon-button" type="button" aria-label="分享">
              <Share2 size={18} />
            </button>
          }
        />

        <div className="migration-view-tabs" role="tablist" aria-label="风险迁移趋势视图">
          {migrationViewTabs.map((item) => (
            <button
              className={activeView === item.key ? "is-active" : ""}
              type="button"
              role="tab"
              aria-selected={activeView === item.key}
              key={item.key}
              onClick={() => setActiveView(item.key)}
            >
              {item.label}
            </button>
          ))}
        </div>

        {activeView === "overall" ? <MigrationOverallView /> : null}
        {activeView === "subsidiary" ? <MigrationSubsidiaryView /> : null}
        {activeView === "driver" ? <MigrationDriverView /> : null}
      </div>

      <BottomAskBar
        onOpen={() =>
          openCopilot({
            context:
              activeView === "driver"
                ? "正在分析“风险迁移趋势风险驱动”"
                : activeView === "subsidiary"
                  ? "正在分析“风险迁移趋势子公司视图”"
                  : "正在分析“风险迁移趋势总体变化”",
          })
        }
      />
    </div>
  );
}

function MigrationOverallView() {
  return (
    <>
        <section className="migration-overview-card migration-brief-card glass-card">
          <div className="migration-card-title">
            <span>
              <Sparkles size={19} />
            </span>
            <h2>AI 风险迁移简报</h2>
          </div>
          <div className="migration-brief-card__body">
            <p>
              本月集团信用风险迁移加快，正常转预警客户 <strong>18</strong> 家，预警转出险客户 <strong>5</strong> 家。主要集中在地产链、城投平台和建筑工程客户。
            </p>
            <div className="migration-brief-illus" aria-hidden="true">
              <span />
              <span />
              <span />
              <TrendingUp size={54} />
            </div>
          </div>
        </section>

        <section className="migration-overview-card migration-funnel-card glass-card">
          <h2>风险迁移漏斗（本月）</h2>
          <div className="migration-funnel-layout">
            <div className="migration-funnel" aria-label="本月风险迁移漏斗">
              <div className="migration-funnel__level migration-funnel__level--normal">
                <span>正常</span>
                <strong>3,652<em>家</em></strong>
              </div>
              <div className="migration-funnel__level migration-funnel__level--warning">
                <span>预警</span>
                <strong>632<em>家</em></strong>
              </div>
              <div className="migration-funnel__level migration-funnel__level--default">
                <span>出险</span>
                <strong>152<em>家</em></strong>
              </div>
            </div>
            <div className="migration-change-panel" aria-label="迁移变化">
              <h3>迁移变化（较上月）</h3>
              <p>
                正常 → 预警
                <strong>18<em>家</em></strong>
                <span>↑</span>
              </p>
              <p>
                预警 → 出险
                <strong>5<em>家</em></strong>
                <span>↑</span>
              </p>
            </div>
          </div>
        </section>

        <section className="migration-overview-card migration-insight-card glass-card">
          <div className="migration-card-title">
            <span>
              <Sparkles size={19} />
            </span>
            <h2>AI 关键洞察</h2>
          </div>
          <ul>
            <li>
              <CheckCircle2 size={18} />
              <p>
                正常转预警客户 <strong>18</strong> 家，预警转出险客户 <strong>5</strong> 家，风险迁移速度加快。
              </p>
            </li>
            <li>
              <CheckCircle2 size={18} />
              <p>风险主要集中在地产链、城投平台和建筑工程客户。</p>
            </li>
            <li>
              <CheckCircle2 size={18} />
              <p>建议加强重点客户现金流监控，防范预警客户向出险迁移。</p>
            </li>
          </ul>
        </section>
    </>
  );
}

function MigrationSubsidiaryView() {
  return (
    <>
      <section className="migration-overview-card migration-brief-card migration-subsidiary-brief glass-card">
        <div className="migration-card-title">
          <span>
            <Building2 size={19} />
          </span>
          <h2>AI 子公司风险摘要</h2>
        </div>
        <div className="migration-brief-card__body">
          <p>
            本月共有 <strong>3</strong> 家子公司风险上升，主要集中在平安银行、平安产险和平安资管，需重点关注相关客户风险迁移情况。
          </p>
          <div className="migration-brief-illus migration-subsidiary-illus" aria-hidden="true">
            <Building2 size={46} />
            <TrendingUp size={50} />
          </div>
        </div>
      </section>

      <section className="migration-overview-card migration-subsidiary-section glass-card">
        <header>
          <h2>子公司风险变化（本月）</h2>
          <span>按风险上升排序 <ChevronDown size={15} /></span>
        </header>
        <div className="migration-subsidiary-list">
          {subsidiaryMigrationCards.map((item) => (
            <button className={`migration-subsidiary-card is-${item.status}`} type="button" key={item.name}>
              <span className="migration-subsidiary-card__icon">
                <item.icon size={25} />
              </span>
              <span className="migration-subsidiary-card__body">
                <span className="migration-subsidiary-card__head">
                  <strong>{item.name}</strong>
                  <em>{item.tag}</em>
                </span>
                <span className="migration-subsidiary-card__stats">
                  <span>
                    <small>预警客户</small>
                    <b>{item.warning}<em>家</em></b>
                  </span>
                  <i />
                  <span>
                    <small>出险客户</small>
                    <b>{item.defaulted}<em>家</em></b>
                  </span>
                </span>
              </span>
              <span className="migration-subsidiary-card__desc">{item.desc}</span>
              <span className="migration-subsidiary-card__change">
                <b>{item.change}</b>
                {item.status === "stable" ? null : <i>↑</i>}
                <ChevronRight size={20} />
              </span>
              <span className="migration-subsidiary-card__watermark" aria-hidden="true">
                <item.icon size={42} />
              </span>
            </button>
          ))}
        </div>
      </section>
    </>
  );
}

function MigrationDriverView() {
  return (
    <>
      <section className="migration-overview-card migration-brief-card migration-driver-brief glass-card">
        <div className="migration-card-title">
          <span>
            <Sparkles size={19} />
          </span>
          <h2>AI 风险驱动解读</h2>
        </div>
        <div className="migration-brief-card__body">
          <p>本月风险迁移主要受宏观周期和债市波动驱动，两者合计影响占比超过 70%，外部环境压力是风险加速迁移的核心原因。</p>
          <div className="migration-brief-illus migration-driver-illus" aria-hidden="true">
            <FileText size={48} />
            <UserRoundSearch size={56} />
            <TrendingUp size={42} />
          </div>
        </div>
      </section>

      <section className="migration-overview-card migration-driver-section glass-card">
        <header>
          <h2>风险迁移驱动因素（本月）</h2>
          <span>影响度 <ChevronDown size={15} /></span>
        </header>
        <div className="migration-driver-list">
          {riskMigrationDrivers.map((item) => (
            <button className={`migration-driver-card is-${item.tone}`} type="button" key={item.name}>
              <span className="migration-driver-card__icon">
                <item.icon size={23} />
              </span>
              <span className="migration-driver-card__content">
                <span className="migration-driver-card__head">
                  <strong>{item.name}</strong>
                  <b>{item.score}</b>
                  <ChevronRight size={18} />
                </span>
                <span className="migration-driver-card__desc">{item.desc}</span>
                <span className="migration-driver-card__track">
                  <i style={{ width: `${item.level}%` }} />
                </span>
              </span>
            </button>
          ))}
        </div>
        <p className="migration-driver-note">注：数值越大，对风险迁移的推动作用越强</p>
      </section>

      <section className="migration-overview-card migration-insight-card migration-driver-advice glass-card">
        <div className="migration-card-title">
          <span>
            <Sparkles size={19} />
          </span>
          <h2>AI 建议重点关注</h2>
        </div>
        <ul>
          <li>
            <CheckCircle2 size={18} />
            <p>宏观周期和债市波动短期内仍将持续影响风险迁移。</p>
          </li>
          <li>
            <CheckCircle2 size={18} />
            <p>建议加强高敏感行业和高杠杆客户的风险监测与预警。</p>
          </li>
        </ul>
      </section>
    </>
  );
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

function ConcentrationTab() {
  const [dim, setDim] = useState<ConcentrationDimension>("客户");
  const sourceSectionRef = useRef<HTMLElement | null>(null);
  const view = concentrationRiskViews[dim];

  return (
    <>
      <SectionHeader title="风险集中趋势" action="查看明细" />
      <div className="credit-chip-row credit-chip-row--wide concentration-dimension-tabs">
        {concentrationDims.map((item) => (
          <button className={item === dim ? "is-active" : ""} type="button" key={item} onClick={() => setDim(item)}>
            {item}
          </button>
        ))}
      </div>

      <AIConcentrationBriefCard view={view} onViewSources={() => sourceSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })} />
      <ConcentrationMetricGrid view={view} />
      <ConcentrationTrendChart view={view} />
      <ConcentrationSourceList view={view} sectionRef={sourceSectionRef} />
      <section className="credit-section">
        <SectionHeader title="集中分布" />
        <ConcentrationDistributionCard view={view} />
      </section>
      <AIInsight>{view.insight}</AIInsight>
      <ConcentrationActionRecommendationCard view={view} dimension={dim} />
    </>
  );
}

function AIConcentrationBriefCard({ view, onViewSources }: { view: ConcentrationRiskView; onViewSources: () => void }) {
  const [message, setMessage] = useState<"explain" | "suggestion" | null>(null);

  return (
    <section className="credit-migration-brief concentration-ai-brief glass-card">
      <header>
        <h2>
          <Bot size={18} />
          AI 集中度趋势简报
        </h2>
        <span>本月更新 2 小时前</span>
      </header>
      <p>{view.brief}</p>
      <div className="credit-migration-brief__actions concentration-ai-brief__actions">
        <button type="button" onClick={() => setMessage("explain")}>
          <ClipboardList size={17} />
          解释变化原因
        </button>
        <button type="button" onClick={onViewSources}>
          <UserRoundSearch size={17} />
          查看集中来源
        </button>
        <button type="button" onClick={() => setMessage("suggestion")}>
          <FileText size={17} />
          生成分散建议
        </button>
      </div>
      {message ? (
        <div className="credit-migration-brief__result">
          <Sparkles size={15} />
          <p>{message === "explain" ? `AI 解释：${view.explain}` : `AI 建议：${view.suggestion}`}</p>
        </div>
      ) : null}
    </section>
  );
}

function ConcentrationMetricGrid({ view }: { view: ConcentrationRiskView }) {
  return (
    <section className="concentration-metric-grid">
      {view.metrics.map((item) => (
        <article className="concentration-metric-card glass-card" key={item.label}>
          <span>{item.label}</span>
          <strong>{item.value}</strong>
          <em>{item.detail}</em>
          {item.sparkline === "bars" ? (
            <div className="concentration-mini-bars" aria-hidden="true">
              {[18, 24, 31, 38, 48, 62, 74].map((height) => (
                <i style={{ height: `${height}%` }} key={height} />
              ))}
            </div>
          ) : (
            <svg className="concentration-mini-line" viewBox="0 0 88 24" aria-hidden="true">
              <polyline points="2,18 18,13 34,15 50,10 66,12 86,4" />
            </svg>
          )}
        </article>
      ))}
    </section>
  );
}

function ConcentrationTrendChart({ view }: { view: ConcentrationRiskView }) {
  const points = getConcentrationTrendPoints(view.trendData);
  const minTick = Math.max(0, Math.floor(Math.min(...view.trendData.map((item) => item.ratio)) / 10) * 10 - 10);
  const maxTick = Math.ceil(Math.max(...view.trendData.map((item) => item.ratio)) / 10) * 10;
  const ticks = [minTick, Math.round((minTick + maxTick) / 2), maxTick];

  return (
    <section className="concentration-trend-card glass-card">
      <header>
        <h2>{view.trendTitle}</h2>
        <span>
          近 6 个月
          <ChevronDown size={14} />
        </span>
      </header>
      <small>单位：%</small>
      <div className="concentration-line-chart" aria-label={view.trendTitle}>
        <svg viewBox="0 0 320 168" role="img">
          <line x1="28" y1="18" x2="28" y2="136" />
          <line x1="28" y1="136" x2="300" y2="136" />
          {ticks.map((tick) => (
            <g key={tick}>
              <text x="4" y={getConcentrationY(tick) + 4}>{tick}</text>
              <path d={`M28 ${getConcentrationY(tick)}H300`} className="migration-grid-line" />
            </g>
          ))}
          <polyline className="concentration-line" points={points} />
          {view.trendData.map((item, index) => {
            const x = 42 + index * 48;
            const y = getConcentrationY(item.ratio);
            return (
              <g key={item.month}>
                <circle className="concentration-dot" cx={x} cy={y} r="4" />
                <text className="concentration-value" x={x} y={y - 10}>{item.ratio}%</text>
                <text className="migration-month" x={x} y="158">{item.month}</text>
              </g>
            );
          })}
        </svg>
      </div>
      <AIReadout>{view.trendReadout}</AIReadout>
    </section>
  );
}

function ConcentrationSourceList({
  view,
  sectionRef,
}: {
  view: ConcentrationRiskView;
  sectionRef: MutableRefObject<HTMLElement | null>;
}) {
  return (
    <section className="concentration-source-section glass-card" ref={sectionRef}>
      <header>
        <h2>重点集中来源</h2>
        <span>
          {view.sourceSortLabel}
          <ChevronDown size={14} />
        </span>
      </header>
      <div className="concentration-source-list">
        {view.sources.map((item) => (
          <ConcentrationSourceCard source={item} key={item.name} />
        ))}
      </div>
      <button className="concentration-source-more" type="button">
        {view.sourceActionLabel}
        <ChevronRight size={14} />
      </button>
    </section>
  );
}

function ConcentrationSourceCard({ source }: { source: ConcentrationSource }) {
  const SourceIcon = getConcentrationSourceIcon(source.icon);

  return (
    <button className="concentration-source-card" type="button">
      <div className="concentration-source-card__icon">
        <SourceIcon size={20} />
      </div>
      <div className="concentration-source-card__body">
        <h3>
          {source.name}
          <span>{source.tag}</span>
        </h3>
        <p>{source.description}</p>
      </div>
      <div className="concentration-source-card__meta">
        <span>
          风险占比
          <strong>{source.riskRatio}</strong>
        </span>
        <span>
          较上月
          <strong>{source.monthChange}</strong>
        </span>
        <span>
          风险变化
          <strong>{source.riskChange}</strong>
        </span>
      </div>
      <ChevronRight size={17} />
    </button>
  );
}

function ConcentrationDistributionCard({ view }: { view: ConcentrationRiskView }) {
  return <DistributionCard title={view.distributionTitle} items={view.distributionItems} mode={view.distributionMode} />;
}

function ConcentrationActionRecommendationCard({
  view,
  dimension,
}: {
  view: ConcentrationRiskView;
  dimension: ConcentrationDimension;
}) {
  const { openCopilot } = useCopilot();
  const [summaryVisible, setSummaryVisible] = useState(false);

  const handleGenerate = () => {
    setSummaryVisible(true);
    openCopilot({ intent: "report", context: `正在生成“${dimension}维度集中度风险汇报”` });
  };

  return (
    <section className="ai-action-recommendation concentration-action-card glass-card">
      <div>
        <h2>
          <Sparkles size={18} />
          AI 建议动作
        </h2>
        <ol>
          {view.actions.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </div>
      <button className="primary-button" type="button" onClick={handleGenerate}>
        <FileText size={18} />
        生成集中度风险汇报
      </button>
      {summaryVisible ? (
        <p className="ai-action-recommendation__summary">
          本月信用风险集中度继续上升。客户维度看，前 20 大客户风险敞口占比升至 34%；行业维度看，前三行业风险占比升至 66%；区域维度看，华东区域风险占比最高。AI 判断当前风险存在客户、行业、区域三维共振，建议对高重合客户进行专项排查。
        </p>
      ) : null}
    </section>
  );
}

function getConcentrationSourceIcon(icon: ConcentrationSource["icon"]) {
  if (icon === "landmark") {
    return Landmark;
  }

  if (icon === "group") {
    return UsersRound;
  }

  if (icon === "customer") {
    return UserRoundSearch;
  }

  return Building2;
}

function WarningDefaultTab({
  predictedSectionRef,
  onViewHighRisk,
}: {
  predictedSectionRef: MutableRefObject<HTMLElement | null>;
  onViewHighRisk: () => void;
}) {
  return (
    <>
      <CreditMigrationBriefCard onViewHighRisk={onViewHighRisk} />
      <MigrationMetricOverview />
      <MigrationTrendChart data={migrationTrendData} />
      <RiskFactorDistribution items={riskFactorData} />
      <SubsidiaryRiskDistribution items={subsidiaryRiskData} />
      <AIPredictedCustomerSection items={aiPredictedCustomers} sectionRef={predictedSectionRef} />
      <AIActionRecommendationCard />
    </>
  );
}

function CreditMigrationBriefCard({ onViewHighRisk }: { onViewHighRisk: () => void }) {
  const [message, setMessage] = useState<"cause" | "summary" | null>(null);

  const handleExplain = () => {
    setMessage("cause");
  };

  const handleSummary = () => {
    setMessage("summary");
  };

  return (
    <section className="credit-migration-brief glass-card">
      <header>
        <h2>
          <Bot size={18} />
          AI 信用迁徙简报
        </h2>
        <span>本月更新 2 小时前</span>
      </header>
      <p>
        本月信用风险迁徙加快，正常转预警客户 <strong>18</strong> 家，预警转出险客户 <strong>5</strong> 家，较上月分别上升 <strong>28%</strong> 和 <strong>67%</strong>。风险主要集中在地产链、建筑工程和城投相关客户。AI 建议优先关注现金流承压、担保链复杂、舆情升温的客户。
      </p>
      <div className="credit-migration-brief__actions">
        <button type="button" onClick={handleExplain}>
          <ClipboardList size={17} />
          解释原因
        </button>
        <button type="button" onClick={onViewHighRisk}>
          <UserRoundSearch size={17} />
          查看高危客户
        </button>
        <button type="button" onClick={handleSummary}>
          <FileText size={17} />
          生成汇报摘要
        </button>
      </div>
      {message ? (
        <div className="credit-migration-brief__result">
          <Sparkles size={15} />
          <p>
            {message === "cause"
              ? "AI 解释：本月风险恶化主要由销售回款放缓、短债集中到期和关联担保扩散共同驱动，其中地产链客户的现金流压力已传导至建筑工程、供应链与城投相关主体。"
              : "汇报摘要：本月信用风险迁徙总体呈上升态势，正常转预警客户 18 家，预警转出险客户 5 家。建议将高危客户纳入一级跟踪，并对相关子公司启动专项排查。"}
          </p>
        </div>
      ) : null}
    </section>
  );
}

function MigrationMetricOverview() {
  const metrics = [
    { label: "正常 → 预警", value: "18", suffix: "家", detail: "↑ 28%" },
    { label: "预警 → 出险", value: "5", suffix: "家", detail: "↑ 67%" },
    { label: "出险客户总量", value: "23", suffix: "家", detail: "本月新增 5 家" },
    { label: "AI 预测高危", value: "7", suffix: "家", detail: "未来 30 天可能恶化" },
  ];

  return (
    <section className="credit-section migration-metric-section">
      <SectionHeader title="核心指标概览" action="本月 vs 上月" />
      <div className="migration-metric-grid">
        {metrics.map((item) => (
          <article className="migration-metric-card glass-card" key={item.label}>
            <span>{item.label}</span>
            <strong>
              {item.value}
              <small>{item.suffix}</small>
            </strong>
            <em>{item.detail}</em>
          </article>
        ))}
      </div>
    </section>
  );
}

function MigrationTrendChart({ data }: { data: MigrationTrendPoint[] }) {
  const normalPoints = getTrendPoints(data, "normalToWarning");
  const defaultPoints = getTrendPoints(data, "warningToDefault");

  return (
    <section className="migration-chart-card glass-card">
      <header>
        <h2>风险状态迁徙趋势</h2>
        <span>
          近 6 个月
          <ChevronDown size={14} />
        </span>
      </header>
      <div className="migration-chart-legend">
        <span><i />正常 → 预警</span>
        <span><i />预警 → 出险</span>
      </div>
      <div className="migration-line-chart" aria-label="近 6 个月风险状态迁徙趋势">
        <svg viewBox="0 0 320 168" role="img">
          <line x1="28" y1="18" x2="28" y2="136" />
          <line x1="28" y1="136" x2="300" y2="136" />
          {[0, 5, 10, 15].map((tick) => (
            <g key={tick}>
              <text x="6" y={136 - tick * 6.1 + 4}>{tick}</text>
              <path d={`M28 ${136 - tick * 6.1}H300`} className="migration-grid-line" />
            </g>
          ))}
          <polyline className="migration-line migration-line--normal" points={normalPoints} />
          <polyline className="migration-line migration-line--default" points={defaultPoints} />
          {data.map((item, index) => {
            const x = 42 + index * 48;
            const normalY = 136 - item.normalToWarning * 6.1;
            const defaultY = 136 - item.warningToDefault * 6.1;
            return (
              <g key={item.month}>
                <circle className="migration-dot migration-dot--normal" cx={x} cy={normalY} r="3.8" />
                <circle className="migration-dot migration-dot--default" cx={x} cy={defaultY} r="3.8" />
                <text className="migration-value" x={x} y={normalY - 8}>{item.normalToWarning}</text>
                <text className="migration-value" x={x} y={defaultY - 8}>{item.warningToDefault}</text>
                <text className="migration-month" x={x} y="158">{item.month}</text>
              </g>
            );
          })}
        </svg>
      </div>
      <AIReadout>6 月风险迁徙斜率明显抬升，说明前期预警客户中已有部分进入实质性风险阶段。</AIReadout>
    </section>
  );
}

function RiskFactorDistribution({ items }: { items: RiskFactorItem[] }) {
  const maxCount = Math.max(...items.map((item) => item.count));

  return (
    <section className="risk-factor-card glass-card">
      <header>
        <h2>风险恶化因素分布</h2>
        <span>
          按风险类型
          <ChevronDown size={14} />
        </span>
      </header>
      <div className="risk-factor-list">
        {items.map((item) => (
          <div className="risk-factor-row" key={item.type}>
            <span>{item.type}</span>
            <i>
              <b style={{ width: `${(item.count / maxCount) * 100}%` }} />
            </i>
            <em>{item.count} 家</em>
          </div>
        ))}
      </div>
      <AIReadout>现金流承压和债务逾期是本月风险恶化的主要触发因素，二者共同出现的客户建议提高至一级跟踪。</AIReadout>
    </section>
  );
}

function SubsidiaryRiskDistribution({ items }: { items: SubsidiaryRiskItem[] }) {
  const maxWarning = Math.max(...items.map((item) => item.warning));

  return (
    <section className="credit-section subsidiary-risk-section">
      <SectionHeader title="各子公司重点客户预警分布" action="预警客户数排序" />
      <div className="subsidiary-risk-track">
        {items.map((item) => (
          <article className="subsidiary-risk-card glass-card" key={item.company}>
            <header>
              <span className="subsidiary-risk-card__icon">
                <Building2 size={16} />
              </span>
              <h3>{item.company}</h3>
            </header>
            <div className="subsidiary-risk-card__numbers">
              <span><strong>{item.warning}</strong>预警</span>
              <span><strong>{item.defaulted}</strong>出险</span>
              <span>较上月 <strong>↑ {item.change}</strong></span>
            </div>
            <i>
              <b style={{ width: `${(item.warning / maxWarning) * 100}%` }} />
            </i>
            <p>{item.insight}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function AIPredictedCustomerSection({
  items,
  sectionRef,
}: {
  items: AIPredictedCustomer[];
  sectionRef: MutableRefObject<HTMLElement | null>;
}) {
  const { openCopilot } = useCopilot();
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <section className="ai-predicted-section" ref={sectionRef}>
      <header>
        <h2>
          <Sparkles size={17} />
          AI 预测：未来 30 天重点关注
        </h2>
        <button type="button" aria-label="查看全部预测客户" onClick={() => openCopilot({ context: "正在查看“全部预测高危客户”" })}>
          <ChevronRight size={18} />
        </button>
      </header>
      <div className="ai-predicted-list">
        {items.map((item) => (
          <AIPredictedCustomerCard
            customer={item}
            key={item.name}
            selected={selected === item.name}
            onClick={() => {
              setSelected(item.name);
              openCopilot({ context: `正在分析“${item.name}未来 30 天恶化风险”` });
            }}
          />
        ))}
      </div>
      {selected ? <p className="ai-predicted-section__hint">已进入 {selected} 的模拟分析态，可继续在底部 AI 输入框追问。</p> : null}
    </section>
  );
}

function AIPredictedCustomerCard({
  customer,
  selected,
  onClick,
}: {
  customer: AIPredictedCustomer;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button className={`ai-predicted-card${selected ? " is-selected" : ""}`} type="button" onClick={onClick}>
      <header>
        <h3>{customer.name}</h3>
        <span>恶化概率 {customer.probability}%</span>
      </header>
      <p>{customer.reason}</p>
      <em>{customer.suggestion}</em>
    </button>
  );
}

function AIActionRecommendationCard() {
  const { openCopilot } = useCopilot();
  const [summaryVisible, setSummaryVisible] = useState(false);
  const actions = [
    "将华东建设集团、中南实业有限公司纳入一级跟踪。",
    "对平安银行、平安寿险相关地产链客户进行专项排查。",
    "对现金流承压和债务逾期共振客户生成风险处置清单。",
    "本月信用风险迁徙情况建议纳入管理层周报。",
  ];

  const handleGenerate = () => {
    setSummaryVisible(true);
    openCopilot({ intent: "report", context: "正在生成“本月信用风险迁徙汇报”" });
  };

  return (
    <section className="ai-action-recommendation glass-card">
      <div>
        <h2>
          <Sparkles size={18} />
          AI 建议动作
        </h2>
        <ol>
          {actions.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </div>
      <button className="primary-button" type="button" onClick={handleGenerate}>
        <FileText size={18} />
        生成本月信用风险迁徙汇报
      </button>
      {summaryVisible ? (
        <p className="ai-action-recommendation__summary">
          本月信用风险迁徙总体呈上升态势。正常转预警客户 18 家，预警转出险客户 5 家，主要集中于地产链、建筑工程、城投相关客户。AI 识别 7 家客户存在进一步恶化风险，建议将其中 3 家纳入一级跟踪，并对相关子公司启动专项排查。
        </p>
      ) : null}
    </section>
  );
}

function AIReadout({ children }: { children: string }) {
  return (
    <div className="migration-ai-readout">
      <Sparkles size={15} />
      <p>
        <b>AI 解读：</b>
        {children}
      </p>
    </div>
  );
}

function getTrendPoints(data: MigrationTrendPoint[], key: "normalToWarning" | "warningToDefault") {
  return data.map((item, index) => `${42 + index * 48},${136 - item[key] * 6.1}`).join(" ");
}

function getConcentrationTrendPoints(data: ConcentrationTrendPoint[]) {
  return data.map((item, index) => `${42 + index * 48},${getConcentrationY(item.ratio)}`).join(" ");
}

function getConcentrationY(value: number) {
  return 136 - value * 1.55;
}

export function CustomerRiskCard({
  customer,
}: {
  customer: CreditCustomer;
}) {
  const navigate = useNavigate();
  const profile = getCustomerRiskProfile(customer.id);
  const eventChips = getExternalEventChips(profile.externalEvents).slice(0, 3);
  const openDetail = () => navigate(`/risk/customer/${customer.id}`);
  const openRating = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    navigate(`/risk/customer/${customer.id}?tab=rating`);
  };
  const openEvents = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    navigate(`/risk/customer/${customer.id}?tab=events`);
  };

  return (
    <article
      className="customer-risk-card customer-risk-card--entry glass-card"
      tabIndex={0}
      onClick={openDetail}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openDetail();
        }
      }}
    >
      <header>
        <span className="customer-card-leading-icon" aria-hidden="true">
          <Building2 size={18} />
        </span>
        <h2>{customer.name}</h2>
        <button className={`customer-rating-badge is-${getRatingTone(profile.rating)}`} type="button" onClick={openRating} aria-label={`查看${customer.name}信用评级`}>
          {profile.rating}
          {profile.ratingTrend === "down" ? <span>↓</span> : null}
        </button>
        <PillTag variant={getCustomerStatusVariant(customer.riskLevel)}>{customer.riskLevel}</PillTag>
        <ChevronRight className="customer-card-chevron" size={18} />
      </header>
      <div className="customer-score-row">
        <span>风险评分</span>
        <strong>{customer.riskScore}</strong>
        <em>↑ {customer.scoreDelta}</em>
      </div>
      <p>
        <b>主要风险：</b>
        {customer.mainRisks.join("、")}
      </p>
      {eventChips.length > 0 ? (
        <div className="external-event-chip-row" aria-label={`${customer.name}外部事件`}>
          {eventChips.map((chip) => (
            <button className="external-event-chip" type="button" key={chip.key} onClick={openEvents}>
              <chip.icon size={14} />
              {chip.label}
            </button>
          ))}
        </div>
      ) : null}
      <p>
        <b>最新动态：</b>
        {customer.latestUpdate}
      </p>
      <small>{customer.updatedAt}</small>
    </article>
  );
}

function getExternalEventChips(events: ExternalEventCounts) {
  const chips = [
    { key: "sentiment", label: `舆情 ${events.sentiment}`, count: events.sentiment, icon: MessageCircle },
    { key: "litigation", label: `诉讼 ${events.litigation}`, count: events.litigation, icon: Gavel },
    { key: "enforcement", label: `被执行 ${events.enforcement}`, count: events.enforcement, icon: ShieldAlert },
    { key: "regulatory", label: `监管 ${events.regulatory ?? 0}`, count: events.regulatory ?? 0, icon: ClipboardList },
    { key: "announcement", label: "公告风险", count: events.announcement ?? 0, icon: FileText },
    { key: "guaranteeChain", label: "担保链", count: events.guaranteeChain ? 1 : 0, icon: Link2 },
  ];

  return chips.filter((chip) => chip.count > 0);
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

function getExternalEventIcon(type: string) {
  if (type === "诉讼") {
    return <Gavel size={19} />;
  }

  if (type === "被执行") {
    return <ShieldAlert size={19} />;
  }

  if (type === "公告") {
    return <FileText size={19} />;
  }

  if (type === "监管") {
    return <ClipboardList size={19} />;
  }

  return <MessageCircle size={19} />;
}

function SectionHeader({ title, action }: { title: string; action?: string }) {
  return (
    <div className="credit-section-title">
      <h2>{title}</h2>
      {action ? (
        <button type="button">
          {action}
          <ChevronRight size={15} />
        </button>
      ) : null}
    </div>
  );
}

function DistributionCard({
  title,
  items,
  mode,
}: {
  title: string;
  items: Array<{ label: string; value: string; color?: string }>;
  mode: "dot" | "bar";
}) {
  const shouldShowDonut = mode === "dot" && title.includes("行业");
  const segments = items.map((item) => ({
    label: item.label,
    value: Number.parseFloat(item.value),
    color: item.color ?? "#ff6a00",
  }));

  return (
    <article className="distribution-card glass-card">
      <h3>{title}</h3>
      {shouldShowDonut ? (
        <div className="distribution-donut-layout">
          <DonutChart value={100} label={title} size={116} centerText="" segments={segments} />
          <DistributionLegend items={items} />
        </div>
      ) : null}
      <div className={`distribution-list distribution-list--${mode}${shouldShowDonut ? " distribution-list--hidden" : ""}`}>
        {items.map((item) => (
          <div key={item.label}>
            <span>{item.label}</span>
            {mode === "bar" ? (
              <i>
                <b style={{ width: item.value }} />
              </i>
            ) : null}
            <em>{item.value}</em>
          </div>
        ))}
      </div>
    </article>
  );
}

function DistributionLegend({ items }: { items: Array<{ label: string; value: string; color?: string }> }) {
  return (
    <div className="distribution-legend">
      {items.map((item) => (
        <div key={item.label}>
          <i style={{ background: item.color }} />
          <span>{item.label}</span>
          <em>{item.value}</em>
        </div>
      ))}
    </div>
  );
}

function AIInsight({ children }: { children: string }) {
  return (
    <section className="credit-ai-card glass-card">
      <h2>
        <Sparkles size={18} />
        AI 洞察
      </h2>
      <p>{children}</p>
    </section>
  );
}
