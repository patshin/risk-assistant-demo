import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  BriefcaseBusiness,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Coins,
  Gauge,
  LineChart,
  MessageCircle,
  PieChart,
  Share2,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  WalletCards,
} from "lucide-react";
import { BottomAskBar, DonutChart, MiniLineChart, PageHeader, PillTag, TabBar } from "../components";

const tabs = [
  { key: "overview", label: "组合概览" },
  { key: "stress", label: "压力测试" },
  { key: "factor", label: "风险因子" },
  { key: "allocation", label: "资产配置" },
];

const contributionItems = [
  { label: "权益类", value: "45%", color: "#ff6a00" },
  { label: "信用债", value: "25%", color: "#5d9aaa" },
  { label: "利率债", value: "15%", color: "#9bc39a" },
  { label: "现金及其他", value: "15%", color: "#f5c75f" },
];

const stressScenarios = [
  { title: "利率上行 50bp", desc: "利率上升冲击组合估值", icon: BarChart3 },
  { title: "权益市场下跌 10%", desc: "权益价格回调冲击收益", icon: TrendingDown, active: true },
  { title: "信用利差走阔 100bp", desc: "信用风险上升冲击债券", icon: ShieldCheck },
  { title: "汇率波动 3%", desc: "汇率波动影响资产表现", icon: CircleDollarSign },
];

const stressBreakdown = [
  { label: "权益类", value: "-6.8%", width: "86%", tone: "orange", data: [32, 26, 31, 24, 30, 22] },
  { label: "信用债", value: "-3.1%", width: "48%", tone: "blue", data: [22, 18, 23, 17, 21, 16] },
  { label: "利率债", value: "-1.7%", width: "30%", tone: "green", data: [16, 19, 15, 20, 17, 21] },
  { label: "现金及其他", value: "-0.8%", width: "18%", tone: "yellow", data: [8, 10, 9, 12, 8, 11] },
];

const affectedAssets = [
  { title: "长久期利率债", tag: "高影响", desc: "久期较长，利率上行导致估值回撤明显。", icon: PieChart },
  { title: "低评级信用债", tag: "高影响", desc: "利差敏感性高，信用利差走阔带来额外损失。", icon: ShieldCheck },
  { title: "权益成长类", tag: "中高影响", desc: "对盈利预期敏感，市场下跌时波动放大。", icon: BarChart3 },
];

const factorItems = [
  { title: "利率风险", desc: "久期偏长，收益率上行将压缩债券估值", value: "32%", tone: "orange", icon: Gauge, data: [18, 19, 26, 22, 28, 24, 30] },
  { title: "权益风险", desc: "权益仓位对市场回调较敏感", value: "28%", tone: "red", icon: TrendingDown, data: [20, 23, 18, 24, 22, 26, 25] },
  { title: "信用利差", desc: "低评级信用债受利差走阔影响明显", value: "21%", tone: "blue", icon: ShieldCheck, data: [13, 18, 16, 23, 21, 25, 22] },
  { title: "汇率风险", desc: "外币资产与跨境敞口受汇率波动影响", value: "11%", tone: "brown", icon: CircleDollarSign, data: [10, 12, 9, 14, 12, 15, 13] },
  { title: "流动性风险", desc: "低流动性资产在压力情景下处置成本上升", value: "8%", tone: "yellow", icon: WalletCards, data: [8, 9, 7, 10, 9, 11, 10] },
];

const allocationItems = [
  { label: "利率债", value: "35%", color: "#ff6a00" },
  { label: "信用债", value: "26%", color: "#5d9aaa" },
  { label: "权益类", value: "18%", color: "#9bc39a" },
  { label: "现金及其他", value: "12%", color: "#f5c75f" },
  { label: "另类投资", value: "9%", color: "#aaa1d8" },
];

const allocationVsRisk = [
  { label: "利率债", allocation: "35%", risk: "22%", allocationWidth: "72%", riskWidth: "48%" },
  { label: "信用债", allocation: "26%", risk: "25%", allocationWidth: "56%", riskWidth: "54%" },
  { label: "权益类", allocation: "18%", risk: "38%", allocationWidth: "42%", riskWidth: "82%" },
  { label: "现金及其他", allocation: "12%", risk: "5%", allocationWidth: "28%", riskWidth: "14%" },
  { label: "另类投资", allocation: "9%", risk: "10%", allocationWidth: "22%", riskWidth: "24%" },
];

const observations = [
  { title: "权益成长板块", desc: "波动敏感，风险贡献偏高", icon: LineChart },
  { title: "长期利率债", desc: "对利率上行较敏感", icon: Clock3 },
  { title: "现金缓冲", desc: "具备一定防御能力", icon: ShieldCheck },
];

export function InvestmentRiskPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="page investment-page">
      <div className="page-scroll investment-detail">
        <StatusBar />
        <PageHeader
          title="投资风险"
          onBack={() => navigate("/")}
          action={
            <button className="icon-button" type="button" aria-label="分享">
              <Share2 size={18} />
            </button>
          }
        />

        <TabBar items={tabs} activeKey={activeTab} onChange={setActiveTab} />

        {activeTab === "overview" ? <OverviewTab /> : null}
        {activeTab === "stress" ? <StressTab /> : null}
        {activeTab === "factor" ? <FactorTab /> : null}
        {activeTab === "allocation" ? <AllocationTab /> : null}
      </div>

      <BottomAskBar onOpen={() => undefined} />
    </div>
  );
}

function OverviewTab() {
  return (
    <>
      <section className="investment-overview-card glass-card">
        <header>
          <span>组合风险概览</span>
          <em>较上周 +6</em>
        </header>
        <div className="investment-score-row">
          <div>
            <p>风险水平 <strong>中等偏高</strong></p>
            <b>67</b>
            <small>/100</small>
          </div>
          <MiniLineChart data={[34, 34, 44, 38, 51, 47, 57, 42, 45, 39, 43, 47]} />
        </div>
        <div className="investment-kpi-row">
          <Metric label="最大回撤" value="-8.32%" />
          <Metric label="VaR(95%)" value="-2.45%" />
          <Metric label="预期收益" value="3.12%" />
        </div>
      </section>

      <section className="investment-card glass-card">
        <h2>风险贡献（按资产类别）</h2>
        <div className="contribution-layout">
          <DonutChart value={67} label="风险贡献分布" size={148} />
          <LegendList items={contributionItems} />
        </div>
      </section>

      <AIAdvice action="查看压力测试结果">组合对权益市场动荡较为敏感，若市场下行 10%，预计最大回撤可能扩大至 -12%。</AIAdvice>
    </>
  );
}

function StressTab() {
  return (
    <>
      <section className="stress-summary-card glass-card">
        <h2>压力测试总览</h2>
        <PillTag variant="warming">当前情景：权益市场下跌 10%</PillTag>
        <div className="stress-summary-grid">
          <Metric label="预计组合损失" value="-12.4%" />
          <Metric label="风险等级" value="高" />
          <Metric label="较基线" value="+8" />
        </div>
        <MiniLineChart data={[0, -3, -5, -11, -8, -10, -7, -6, -7, -5]} tone="down" />
      </section>

      <section className="investment-card glass-card">
        <h2>情景选择</h2>
        <div className="scenario-grid">
          {stressScenarios.map((scenario) => (
            <article className={scenario.active ? "is-active" : ""} key={scenario.title}>
              <scenario.icon size={24} />
              <strong>{scenario.title}</strong>
              <p>{scenario.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="investment-card glass-card">
        <h2>影响拆解</h2>
        <div className="impact-breakdown-list">
          {stressBreakdown.map((item) => (
            <BreakdownRow key={item.label} {...item} />
          ))}
        </div>
      </section>

      <section className="investment-card glass-card">
        <h2>重点受影响资产</h2>
        <div className="affected-list">
          {affectedAssets.map((asset) => (
            <article key={asset.title}>
              <asset.icon size={23} />
              <div>
                <strong>{asset.title}</strong>
                <PillTag variant={asset.tag === "高影响" ? "high" : "mediumHigh"}>{asset.tag}</PillTag>
                <p>{asset.desc}</p>
              </div>
              <ChevronRight size={18} />
            </article>
          ))}
        </div>
      </section>

      <AIAdvice action="查看完整压力结果">
        适度降低高波动权益敞口，关注防御性板块配置。评估组合久期，适当缩短长久期利率债敞口。提升现金及高流动性资产比例，增强组合抗风险能力。
      </AIAdvice>
    </>
  );
}

function FactorTab() {
  return (
    <>
      <section className="factor-overview-card glass-card">
        <header>
          <h2>风险因子概览</h2>
          <span>较上周 +4</span>
        </header>
        <div className="factor-score-row">
          <strong>69</strong>
          <span>/100</span>
          <PillTag variant="mediumHigh">中等偏高</PillTag>
        </div>
        <p>当前组合对利率、权益与信用利差最敏感。</p>
        <MiniLineChart data={[40, 41, 49, 57, 48, 58, 52, 60, 49, 54, 69]} />
      </section>

      <section className="investment-card glass-card">
        <h2>核心风险因子</h2>
        <div className="factor-list">
          {factorItems.map((factor) => (
            <article key={factor.title}>
              <factor.icon size={24} />
              <div>
                <strong>{factor.title}</strong>
                <p>{factor.desc}</p>
                <i><b style={{ width: factor.value }} /></i>
              </div>
              <em>{factor.value}</em>
            </article>
          ))}
        </div>
      </section>

      <section className="investment-card glass-card">
        <h2>因子暴露分布</h2>
        <div className="factor-exposure-bars">
          {factorItems.map((factor) => (
            <div key={factor.title}>
              <span>{factor.title}</span>
              <i><b style={{ width: factor.value }} /></i>
              <em>{factor.value}</em>
            </div>
          ))}
        </div>
      </section>

      <section className="investment-card glass-card">
        <h2>因子联动解读</h2>
        <div className="factor-linkage">
          <span>利率上行</span>
          <ChevronRight size={18} />
          <span>权益回调</span>
          <ChevronRight size={18} />
          <span>信用利差走阔</span>
          <ChevronRight size={18} />
          <span>组合波动上升</span>
        </div>
      </section>

      <AIAdvice action="查看因子点评">
        当前风险并非单一市场冲击，而是利率与权益双重敏感。若收益率继续上行，长期利率债与权益成长板块将承压。
      </AIAdvice>
    </>
  );
}

function AllocationTab() {
  return (
    <>
      <section className="allocation-overview-card glass-card">
        <header>
          <h2>资产配置概览</h2>
          <span>较上周 +3</span>
        </header>
        <div className="factor-score-row">
          <strong>74</strong>
          <span>/100</span>
          <PillTag variant="watch">配置较均衡</PillTag>
        </div>
        <p>当前组合以利率债与信用债为核心，权益敞口适中，流动性缓冲充足，但成长类权益风险贡献偏高。</p>
        <MiniLineChart data={[52, 55, 61, 58, 66, 62, 68, 60, 64, 70, 74]} />
      </section>

      <section className="investment-card glass-card">
        <h2>资产类别配置</h2>
        <div className="contribution-layout">
          <DonutChart value={74} label="资产分布" size={148} />
          <LegendList items={allocationItems} />
        </div>
      </section>

      <section className="investment-card glass-card">
        <h2>配置占比 vs 风险贡献</h2>
        <div className="allocation-compare-list">
          {allocationVsRisk.map((item) => (
            <div key={item.label}>
              <span>{item.label}</span>
              <div>
                <i><b style={{ width: item.allocationWidth }} /></i>
                <i className="risk"><b style={{ width: item.riskWidth }} /></i>
              </div>
              <em>{item.allocation} / {item.risk}</em>
            </div>
          ))}
        </div>
      </section>

      <section className="investment-card glass-card">
        <h2>结构分布</h2>
        <StructureBar title="久期结构" labels={["短久期 28%", "中久期 46%", "长久期 26%"]} />
        <StructureBar title="信用等级结构" labels={["AAA 42%", "AA 31%", "A及以下 11%", "未评级 16%"]} alt />
      </section>

      <section className="investment-card glass-card">
        <h2>重点配置观察</h2>
        <div className="observation-list">
          {observations.map((item) => (
            <article key={item.title}>
              <item.icon size={24} />
              <div>
                <strong>{item.title}</strong>
                <p>{item.desc}</p>
              </div>
              <ChevronRight size={18} />
            </article>
          ))}
        </div>
      </section>

      <AIAdvice action="查看配置优化建议">
        适度控制高波动权益仓位，优化成长板块集中暴露。在收益允许范围内，可适当缩短组合久期。保留流动性缓冲，以应对市场波动与赎回压力。
      </AIAdvice>
    </>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <article>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function LegendList({ items }: { items: Array<{ label: string; value: string; color: string }> }) {
  return (
    <div className="investment-legend">
      {items.map((item) => (
        <div key={item.label}>
          <i style={{ background: item.color }} />
          <span>{item.label}</span>
          <strong>{item.value}</strong>
        </div>
      ))}
    </div>
  );
}

function BreakdownRow({ label, value, width, data }: { label: string; value: string; width: string; tone: string; data: number[] }) {
  return (
    <article>
      <span>{label}</span>
      <strong>{value}</strong>
      <i><b style={{ width }} /></i>
      <MiniLineChart data={data} />
    </article>
  );
}

function StructureBar({ title, labels, alt }: { title: string; labels: string[]; alt?: boolean }) {
  return (
    <div className="structure-bar">
      <header>
        <strong>{title}</strong>
        <span>{labels.join("   ")}</span>
      </header>
      <div className={alt ? "is-alt" : ""}>
        {labels.map((label) => (
          <i key={label} />
        ))}
      </div>
    </div>
  );
}

function AIAdvice({ children, action }: { children: string; action: string }) {
  return (
    <section className="investment-ai-card glass-card">
      <h2>
        <Sparkles size={18} />
        AI 建议
      </h2>
      <p>{children}</p>
      <button className="ghost-button" type="button">
        {action}
        <ChevronRight size={17} />
      </button>
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
