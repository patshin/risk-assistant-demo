import { useRef, useState, type MutableRefObject } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bot,
  Building2,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  FileText,
  Landmark,
  Share2,
  Sparkles,
  UserRoundSearch,
  UsersRound,
} from "lucide-react";
import { BottomAskBar, DonutChart, PageHeader, PillTag, TabBar, useCopilot } from "../components";
import {
  aiPredictedCustomers,
  concentrationRiskViews,
  creditCustomerStats,
  customerFilters,
  filterCreditCustomers,
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
  type CustomerFilter,
  type MigrationTrendPoint,
  type RiskFactorItem,
  type SubsidiaryRiskItem,
} from "../data/creditCustomers";

const tabs = [
  { key: "large", label: "大户风险" },
  { key: "concentration", label: "集中度风险" },
  { key: "warningDefault", label: "预警与出险" },
];

const concentrationDims: ConcentrationDimension[] = ["客户", "行业", "区域"];

export function CreditRiskPage() {
  const navigate = useNavigate();
  const { openCopilot } = useCopilot();
  const [activeTab, setActiveTab] = useState("large");
  const predictedSectionRef = useRef<HTMLElement | null>(null);

  const scrollToPredictedCustomers = () => {
    predictedSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="page credit-page">
      <div className="page-scroll credit-detail">
        <StatusBar />
        <PageHeader
          title="信用风险"
          onBack={() => navigate("/")}
          action={
            <button className="icon-button" type="button" aria-label="分享">
              <Share2 size={18} />
            </button>
          }
        />

        <TabBar items={tabs} activeKey={activeTab} onChange={setActiveTab} />

        {activeTab === "large" ? <LargeCustomerTab /> : null}
        {activeTab === "concentration" ? <ConcentrationTab /> : null}
        {activeTab === "warningDefault" ? <WarningDefaultTab predictedSectionRef={predictedSectionRef} onViewHighRisk={scrollToPredictedCustomers} /> : null}
      </div>

      <BottomAskBar
        placeholder={activeTab === "warningDefault" ? "问预警、查出险、生成迁徙报告…" : undefined}
        onOpen={() => openCopilot({ context: activeTab === "warningDefault" ? "正在分析“信用风险迁徙与预警出险”" : activeTab === "concentration" ? "正在分析“信用风险集中趋势”" : "正在分析“信用风险重点客户”" })}
      />
    </div>
  );
}

function LargeCustomerTab() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<CustomerFilter>("全部");
  const stats = creditCustomerStats();
  const visibleCustomers = filterCreditCustomers(filter).slice(0, 3);

  return (
    <>
      <section className="customer-list-summary glass-card">
        <span>AI 统计摘要</span>
        <h2>当前共 {stats.total} 家集团/公司存在风险信号</h2>
        <p>一级预警 {stats.firstLevel} 家 · 二级预警 {stats.secondLevel} 家 · 已出险 {stats.defaulted} 家 · 关注中 {stats.watching} 家</p>
      </section>

      <div className="credit-chip-row">
        {customerFilters.map((item) => (
          <button className={item === filter ? "is-active" : ""} type="button" key={item} onClick={() => setFilter(item)}>
            {item}
          </button>
        ))}
      </div>

      <div className="customer-card-list">
        {visibleCustomers.map((customer) => (
          <CustomerRiskCard customer={customer} key={customer.id} />
        ))}
      </div>

      <button className="view-all-customers" type="button" onClick={() => navigate("/credit/customers")}>
        查看全部客户
        <ChevronRight size={16} />
      </button>

      <AIInsight>本周重点客户风险整体上升，建议关注地产、建筑、城投相关客户的现金流与债务压力。</AIInsight>
    </>
  );
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

export function CustomerRiskCard({ customer }: { customer: CreditCustomer }) {
  return (
    <article className="customer-risk-card glass-card">
      <header>
        <h2>{customer.name}</h2>
        <PillTag variant={getCustomerStatusVariant(customer.riskLevel)}>{customer.riskLevel}</PillTag>
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
      <p>
        <b>最新动态：</b>
        {customer.latestUpdate}
      </p>
      <small>{customer.updatedAt}</small>
    </article>
  );
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
