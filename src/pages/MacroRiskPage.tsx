import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  Building2,
  ChevronRight,
  CircleDollarSign,
  CircleGauge,
  Clock3,
  Flame,
  Globe2,
  Landmark,
  LineChart,
  MessageCircle,
  Share2,
  ShieldAlert,
  Sparkles,
  TrendingDown,
  UsersRound,
} from "lucide-react";
import { BottomAskBar, MiniLineChart, PageHeader, PillTag, TabBar, useCopilot } from "../components";

const tabs = [
  { key: "cycle", label: "周期性风险" },
  { key: "systemic", label: "系统性风险" },
  { key: "market", label: "金融市场分析" },
];

const cycleIndicators = [
  { label: "GDP 增速", value: "4.5%", change: "较上月 -0.2pp", tone: "down", data: [22, 22, 21, 24, 23, 27, 24, 25, 23, 24] },
  { label: "社会融资规模", value: "3.1万亿", change: "较上月 +8%", tone: "up", data: [18, 17, 18, 21, 19, 23, 22, 26, 21, 20] },
  { label: "CPI", value: "0.3%", change: "较上月 +0.1pp", tone: "steady", data: [16, 16, 15, 18, 17, 22, 24, 23, 19, 18] },
  { label: "PMI", value: "49.2", change: "较上月 -0.3", tone: "down", data: [25, 24, 22, 27, 26, 31, 30, 28, 25, 26] },
  { label: "10Y 国债收益率", value: "2.28%", change: "较上月 -6bp", tone: "down", data: [18, 18, 19, 23, 21, 26, 24, 21, 24, 22] },
  { label: "美元兑人民币", value: "7.18", change: "较上月 +1.2%", tone: "up", data: [20, 20, 24, 21, 22, 23, 28, 23, 22, 21] },
];

const chainItems = ["地产销售下行", "房企现金流承压", "上下游回款放缓", "相关客户信用压力上升"];

const systemicReasons = [
  "债券市场波动加大，利率快速上行引发估值回调。",
  "地产链条信用压力上升，行业出清与流动性压力并存。",
  "外部市场扰动增强，地缘政治与贸易摩擦扰动风险偏好。",
];

const systemicEvents = [
  { tag: "债市波动", text: "10年期国债收益率单周上行12bp", time: "2小时前" },
  { tag: "地产风险", text: "多地房企债务展期压力集中释放", time: "5小时前" },
  { tag: "外部扰动", text: "海外主要经济体通胀超预期", time: "1天前" },
];

const impactObjects = [
  { title: "重点行业", desc: "地产、建筑、银行、非银", icon: Building2 },
  { title: "重点客户", desc: "中小房企、高杠杆集团", icon: UsersRound },
  { title: "重点资产", desc: "信用债、长久期利率债、权益", icon: BarChart3 },
  { title: "重点区域", desc: "华东、华南、环渤海地区", icon: Globe2 },
];

const marketSignals = [
  { label: "10Y国债收益率", value: "2.28%", change: "较上日 +6bp", tone: "up", icon: Landmark, data: [12, 16, 18, 23, 21, 26, 28] },
  { label: "信用利差", value: "132bp", change: "较上日 +9bp", tone: "up", icon: ShieldAlert, data: [10, 14, 17, 20, 22, 26, 31] },
  { label: "沪深300", value: "-0.8%", change: "较上日 -0.6%", tone: "down", icon: TrendingDown, data: [31, 28, 26, 21, 19, 16, 14] },
  { label: "美元兑人民币", value: "7.18", change: "较上日 +0.03", tone: "up", icon: CircleDollarSign, data: [18, 20, 19, 23, 24, 28, 27] },
  { label: "原油", value: "78.4", change: "较上日 +2.1%", tone: "up", icon: Flame, data: [18, 21, 19, 24, 22, 28, 30] },
  { label: "DR007", value: "1.92%", change: "较上日 +3bp", tone: "up", icon: Clock3, data: [12, 13, 16, 18, 17, 20, 22] },
];

const marketReads = [
  { title: "债券市场", desc: "久期资产估值承压，关注利率拐点。", icon: ClipboardIcon },
  { title: "信用市场", desc: "低评级主体融资分化，流动性需跟踪。", icon: ShieldAlert },
  { title: "汇率/商品", desc: "外部波动扰动加大，关注跨境及原材料敞口。", icon: Globe2 },
];

export function MacroRiskPage() {
  const navigate = useNavigate();
  const { openCopilot } = useCopilot();
  const [activeTab, setActiveTab] = useState("cycle");

  const primaryAction = activeTab === "systemic" ? "生成系统风险点评" : activeTab === "market" ? "生成市场点评" : "";

  return (
    <div className="page macro-page">
      <div className="page-scroll macro-detail">
        <StatusBar />
        <PageHeader
          title="宏观风险"
          onBack={() => navigate("/")}
          action={
            <button className="icon-button" type="button" aria-label="分享">
              <Share2 size={18} />
            </button>
          }
        />

        <TabBar items={tabs} activeKey={activeTab} onChange={setActiveTab} />

        {activeTab === "cycle" ? <CycleRiskTab /> : null}
        {activeTab === "systemic" ? <SystemicRiskTab /> : null}
        {activeTab === "market" ? <MarketRiskTab /> : null}
      </div>

      {activeTab === "cycle" ? (
        <BottomAskBar onOpen={() => openCopilot({ context: "正在分析“宏观周期风险与传导影响”" })} />
      ) : (
        <div className="macro-bottom-actions">
          <button className="primary-button" type="button" onClick={() => openCopilot({ intent: "report", context: `正在生成“${primaryAction}”` })}>
            <BarChart3 size={18} />
            {primaryAction}
          </button>
          <button className="ghost-button" type="button" onClick={() => openCopilot({ context: "正在基于宏观风险继续追问" })}>
            <MessageCircle size={18} />
            继续追问
          </button>
        </div>
      )}
    </div>
  );
}

function CycleRiskTab() {
  return (
    <>
      <AISummaryCard
        label="AI 风险总结"
        title="宏观环境整体偏弱，地产周期仍在筑底，需关注传导影响。"
        action="查看完整分析"
      />

      <SectionHeader title="关键指标速览" action="全部指标" />
      <div className="macro-metric-grid">
        {cycleIndicators.map((item) => (
          <MetricTile key={item.label} {...item} />
        ))}
      </div>

      <SectionHeader title="风险传导链" action="查看图谱" />
      <div className="macro-chain-card glass-card">
        {chainItems.map((item, index) => (
          <div className="macro-chain-node" key={item}>
            <span>{item}</span>
            {index < chainItems.length - 1 ? <ChevronRight size={18} /> : null}
          </div>
        ))}
      </div>

      <section className="macro-ai-insight glass-card">
        <h2>
          <Sparkles size={18} />
          AI 洞察
        </h2>
        <p>地产销售下行仍是周期压力的核心变量，风险可能通过房企现金流、上下游回款和相关客户信用压力继续传导。</p>
      </section>
    </>
  );
}

function SystemicRiskTab() {
  return (
    <>
      <AISummaryCard
        label="AI 风险总结"
        title="多因子风险共振，地产链条、债市波动与外部扰动共同推升系统性风险水平，需关注传导影响。"
        action="查看完整分析"
        visual="shield"
      />

      <section className="system-score-card glass-card">
        <header>
          <h2>系统性风险评分</h2>
          <span>较上周 <strong>+8</strong></span>
        </header>
        <div className="system-score-card__body">
          <div>
            <strong>72</strong>
            <span>/100</span>
            <PillTag variant="mediumHigh">中高风险</PillTag>
          </div>
          <MiniLineChart data={[30, 30, 42, 46, 36, 58, 46, 56, 53, 57, 70]} />
        </div>
      </section>

      <section className="macro-card glass-card">
        <h2>AI 解读：为什么上升？</h2>
        <ol className="number-list">
          {systemicReasons.map((reason, index) => (
            <li key={reason}>
              <span>{index + 1}</span>
              <p>{reason}</p>
            </li>
          ))}
        </ol>
        <button className="ghost-button" type="button">查看完整分析</button>
      </section>

      <section className="macro-card glass-card">
        <SectionHeader title="风险传导图谱" action="查看详情" />
        <div className="risk-map">
          <div className="risk-map__center">系统性<br />风险升温</div>
          {["债市波动", "地产信用压力", "融资成本上升", "重点客户承压", "投资组合波动", "舆情扩散"].map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </section>

      <section className="macro-card glass-card">
        <h2>重点事件</h2>
        <div className="event-list">
          {systemicEvents.map((event) => (
            <article key={event.text}>
              <PillTag variant="warming">{event.tag}</PillTag>
              <span>{event.text}</span>
              <em>{event.time}</em>
            </article>
          ))}
        </div>
      </section>

      <ImpactObjects />
    </>
  );
}

function MarketRiskTab() {
  return (
    <>
      <AISummaryCard
        label="AI 市场摘要"
        title="债市收益率上行，信用利差走阔，权益市场震荡，人民币汇率波动回升。短期需关注固收组合估值波动、低评级信用债流动性与外部扰动。"
        action="查看完整点评"
        visual="market"
      />

      <SectionHeader title="关键市场信号" action="更新于 23:06" />
      <div className="market-signal-grid">
        {marketSignals.map((item) => (
          <MarketSignalCard key={item.label} {...item} />
        ))}
      </div>

      <section className="macro-card glass-card">
        <h2>市场影响解读</h2>
        <div className="market-read-grid">
          {marketReads.map((item) => (
            <article key={item.title}>
              <item.icon size={24} />
              <strong>{item.title}</strong>
              <p>{item.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="macro-card macro-view-card glass-card">
        <h2>AI 观点</h2>
        <ul>
          <li>债市波动由利率与风险偏好双重驱动。</li>
          <li>信用利差走阔，反映市场对弱资质主体更谨慎。</li>
          <li>建议将债市与汇率变化纳入本周风险例会。</li>
        </ul>
      </section>

      <ImpactObjects />
    </>
  );
}

function AISummaryCard({ label, title, action, visual }: { label: string; title: string; action: string; visual?: "shield" | "market" }) {
  return (
    <section className="macro-ai-card glass-card">
      <div>
        <span>{label}</span>
        <h2>{title}</h2>
        <button className="ghost-button" type="button">
          {action}
          <ChevronRight size={17} />
        </button>
      </div>
      {visual ? (
        <div className="macro-ai-card__visual" aria-hidden="true">
          {visual === "shield" ? <ShieldAlert size={56} /> : <BarChart3 size={56} />}
        </div>
      ) : null}
    </section>
  );
}

function MetricTile({ label, value, change, tone, data }: { label: string; value: string; change: string; tone: string; data: number[] }) {
  return (
    <article className="macro-metric-tile glass-card">
      <span>{label}</span>
      <strong>{value}</strong>
      <em className={`tone-${tone}`}>{change}</em>
      <MiniLineChart data={data} tone={tone === "down" ? "down" : tone === "up" ? "up" : "steady"} />
    </article>
  );
}

function MarketSignalCard({ label, value, change, tone, icon: Icon, data }: (typeof marketSignals)[number]) {
  return (
    <article className="market-signal-card glass-card">
      <header>
        <Icon size={20} />
        <span>{label}</span>
      </header>
      <strong className={`tone-${tone}`}>{value}</strong>
      <em>{change}</em>
      <MiniLineChart data={data} tone={tone === "down" ? "down" : "up"} />
    </article>
  );
}

function ImpactObjects() {
  return (
    <section className="macro-card glass-card">
      <h2>可能影响对象</h2>
      <div className="macro-impact-grid">
        {impactObjects.map((item) => (
          <article key={item.title}>
            <item.icon size={21} />
            <strong>{item.title}</strong>
            <p>{item.desc}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function SectionHeader({ title, action }: { title: string; action?: string }) {
  return (
    <div className="macro-section-title">
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

function ClipboardIcon({ size = 24 }: { size?: number }) {
  return <CircleGauge size={size} />;
}
