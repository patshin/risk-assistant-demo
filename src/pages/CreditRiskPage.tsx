import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  Building2,
  ChevronRight,
  Factory,
  Globe2,
  Landmark,
  Share2,
  ShoppingBag,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { BottomAskBar, MiniLineChart, PageHeader, PillTag, TabBar } from "../components";

const tabs = [
  { key: "large", label: "大户风险" },
  { key: "concentration", label: "集中度风险" },
  { key: "industry", label: "行业信用风险" },
];

const customerFilters = ["全部", "预警中", "关注中", "正常"];

const customers = [
  {
    name: "华东建设集团",
    score: 78,
    change: "↑ 12",
    status: "预警中",
    statusVariant: "warming" as const,
    mainRisk: "现金流承压、商票逾期、舆情风险",
    latest: "新增 2 条负面舆情",
    updated: "更新 2 小时前",
  },
  {
    name: "中南实业有限公司",
    score: 65,
    change: "↑ 8",
    status: "预警中",
    statusVariant: "warming" as const,
    mainRisk: "债务承压、担保风险、司法风险",
    latest: "新增被执行信息",
    updated: "更新 4 小时前",
  },
  {
    name: "天合能源股份",
    score: 48,
    change: "↑ 5",
    status: "关注中",
    statusVariant: "watch" as const,
    mainRisk: "盈利下滑、行业景气度下降",
    latest: "一季度净利下滑 35%",
    updated: "更新 1 天前",
  },
];

const concentrationDims = ["行业", "区域", "客户群", "关联集团"];

const concentrationExposure = [
  { title: "地产链客户群", desc: "区域集中、现金流压力上升", ratio: "28%", change: "+6 ↑", icon: Building2 },
  { title: "城投相关客户", desc: "区域财政承压、再融资风险需关注", ratio: "21%", change: "+4 ↑", icon: Landmark },
  { title: "关联集团授信", desc: "担保与关联关系交叉，需排查风险传导", ratio: "18%", change: "+5 ↑", icon: UsersRound },
];

const distributionItems = [
  { label: "地产", value: "28%" },
  { label: "城投", value: "21%" },
  { label: "建筑", value: "17%" },
  { label: "制造", value: "14%" },
  { label: "其他", value: "20%" },
];

const regionItems = [
  { label: "华东", value: "36%", width: "92%" },
  { label: "华南", value: "23%", width: "64%" },
  { label: "华中", value: "21%", width: "58%" },
  { label: "华北", value: "20%", width: "52%" },
];

const heatCards = [
  { title: "房地产", level: "高风险", desc: "房企资金面趋紧，回款压力上升", icon: Building2, chart: "line" },
  { title: "城投平台", level: "中高风险", desc: "区域融资收缩，债务滚续承压", icon: Landmark, chart: "line" },
  { title: "建筑建材", level: "中高风险", desc: "需求偏弱，毛利承压加剧", icon: Factory, chart: "bar" },
  { title: "商贸零售", level: "中等风险", desc: "消费复苏分化，库存压力延续", icon: ShoppingBag, chart: "bar" },
];

const industryRanks = [
  { rank: 1, name: "房地产", score: 78, change: "↑ 9", signal: "房企债务压力上升，回款放缓" },
  { rank: 2, name: "城投平台", score: 71, change: "↑ 6", signal: "再融资收缩，隐债化解压力" },
  { rank: 3, name: "建筑建材", score: 65, change: "↑ 4", signal: "项目开工不足，现金流承压" },
  { rank: 4, name: "商贸零售", score: 54, change: "↓ 2", signal: "消费分化，库存去化缓慢" },
  { rank: 5, name: "制造业", score: 48, change: "↓ 1", signal: "需求恢复偏慢，利润承压" },
];

const sectorChips = ["地产链", "城投", "建材", "零售", "制造", "更多"];

export function CreditRiskPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("large");

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
        {activeTab === "industry" ? <IndustryCreditTab /> : null}
      </div>

      <BottomAskBar onOpen={() => undefined} />
    </div>
  );
}

function LargeCustomerTab() {
  const [filter, setFilter] = useState("预警中");

  return (
    <>
      <SectionHeader title="重点客户风险预警" action="全部客户" />
      <div className="credit-chip-row">
        {customerFilters.map((item) => (
          <button className={item === filter ? "is-active" : ""} type="button" key={item} onClick={() => setFilter(item)}>
            {item}
          </button>
        ))}
      </div>

      <div className="customer-card-list">
        {customers.map((customer) => (
          <article className="customer-risk-card glass-card" key={customer.name}>
            <header>
              <h2>{customer.name}</h2>
              <PillTag variant={customer.statusVariant}>{customer.status}</PillTag>
            </header>
            <div className="customer-score-row">
              <span>风险评分</span>
              <strong>{customer.score}</strong>
              <em>{customer.change}</em>
            </div>
            <p>
              <b>主要风险：</b>
              {customer.mainRisk}
            </p>
            <p>
              <b>最新动态：</b>
              {customer.latest}
            </p>
            <small>{customer.updated}</small>
          </article>
        ))}
      </div>

      <AIInsight>本周重点客户风险整体上升，建议关注地产、建筑、城投相关客户的现金流与债务压力。</AIInsight>
    </>
  );
}

function ConcentrationTab() {
  const [dim, setDim] = useState("行业");

  return (
    <>
      <SectionHeader title="集中度风险总览" action="查看明细" />
      <div className="credit-chip-row credit-chip-row--wide">
        {concentrationDims.map((item) => (
          <button className={item === dim ? "is-active" : ""} type="button" key={item} onClick={() => setDim(item)}>
            {item}
          </button>
        ))}
      </div>

      <section className="concentration-summary glass-card">
        <header>
          <h2>{dim}集中度偏高</h2>
          <PillTag variant="warming">预警中</PillTag>
        </header>
        <div>
          <span>集中度评分</span>
          <strong>74</strong>
          <em>↑ 9</em>
        </div>
        <p>主要集中于地产、城投与建筑相关客户，部分区域与集团关联敞口同步升高。</p>
        <small>更新 2 小时前</small>
      </section>

      <section className="credit-section">
        <h2>重点集中暴露</h2>
        <div className="exposure-list">
          {concentrationExposure.map((item) => (
            <article className="exposure-card glass-card" key={item.title}>
              <div className="exposure-card__icon">
                <item.icon size={24} />
              </div>
              <div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
              <div className="exposure-card__meta">
                <span>敞口占比 <strong>{item.ratio}</strong></span>
                <span>风险变化 <strong>{item.change}</strong></span>
              </div>
              <ChevronRight size={18} />
            </article>
          ))}
        </div>
      </section>

      <section className="credit-section">
        <h2>集中分布</h2>
        <div className="distribution-stack">
          <DistributionCard title="行业分布" items={distributionItems} mode="dot" />
          <DistributionCard title="区域分布" items={regionItems} mode="bar" />
        </div>
      </section>

      <AIInsight>当前信用风险并非单点暴露，而是集中于地产链、城投平台和部分关联集团客户，建议优先关注高敞口与弱资质主体。</AIInsight>
    </>
  );
}

function IndustryCreditTab() {
  const [sector, setSector] = useState("地产链");

  return (
    <>
      <section className="industry-overview-card glass-card">
        <header>
          <h2>行业信用风险概览</h2>
          <span>近8周趋势</span>
        </header>
        <div className="industry-overview-card__body">
          <div>
            <strong>62</strong>
            <span>/ 100</span>
            <PillTag variant="mediumHigh">中等偏高</PillTag>
            <em>+6 较上周</em>
          </div>
          <MiniLineChart data={[42, 40, 45, 54, 46, 50, 58, 62]} />
        </div>
        <p><b>AI</b> 本周地产链条、建筑建材与城投相关行业信用风险有所抬升，建议关注弱资质主体与产业链传导风险。</p>
      </section>

      <section className="credit-section">
        <h2>行业风险热度</h2>
        <div className="heat-card-grid">
          {heatCards.map((item) => (
            <article className="heat-card glass-card" key={item.title}>
              <header>
                <item.icon size={24} />
                <h3>{item.title}</h3>
                <PillTag variant={item.level === "高风险" ? "high" : item.level === "中高风险" ? "mediumHigh" : "watch"}>{item.level}</PillTag>
              </header>
              <MiniLineChart data={item.chart === "line" ? [22, 25, 24, 28, 27, 31, 35] : [14, 18, 16, 21, 19, 25, 23]} />
              <p>{item.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="credit-section">
        <h2>重点行业排行</h2>
        <div className="industry-rank-list glass-card">
          {industryRanks.map((item) => (
            <article key={item.name}>
              <span>{item.rank}</span>
              <div>
                <strong>{item.name}</strong>
                <p>{item.signal}</p>
              </div>
              <em>{item.score}</em>
              <small>{item.change}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="credit-section">
        <h2>行业风险分布</h2>
        <DistributionCard title="风险等级分布" items={[
          { label: "高风险", value: "18%" },
          { label: "中高风险", value: "32%" },
          { label: "中等风险", value: "30%" },
          { label: "低风险", value: "16%" },
          { label: "较低风险", value: "4%" },
        ]} mode="dot" />
      </section>

      <section className="credit-section">
        <h2>风险变化趋势</h2>
        <div className="industry-trend-card glass-card">
          <MiniLineChart data={[42, 45, 44, 48, 51, 55, 58, 62]} />
          <p>房地产、城投平台与建筑建材风险热度近 8 周持续上行，弱资质主体压力更集中。</p>
        </div>
      </section>

      <AIInsight>当前行业信用风险并非普遍恶化，而是集中在地产链、城投平台与部分高杠杆行业。建议优先关注融资收缩与回款压力同步上升的行业。</AIInsight>

      <div className="sector-chip-row">
        {sectorChips.map((item) => (
          <button className={item === sector ? "is-active" : ""} type="button" key={item} onClick={() => setSector(item)}>
            {item}
          </button>
        ))}
      </div>
    </>
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

function DistributionCard({ title, items, mode }: { title: string; items: Array<{ label: string; value: string; width?: string }>; mode: "dot" | "bar" }) {
  return (
    <article className="distribution-card glass-card">
      <h3>{title}</h3>
      <div className={`distribution-list distribution-list--${mode}`}>
        {items.map((item) => (
          <div key={item.label}>
            <span>{item.label}</span>
            {mode === "bar" ? (
              <i>
                <b style={{ width: item.width }} />
              </i>
            ) : null}
            <em>{item.value}</em>
          </div>
        ))}
      </div>
    </article>
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
