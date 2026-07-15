import { useEffect, useRef, useState, type MouseEvent, type MutableRefObject } from "react";
import { Navigate, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  Bookmark,
  Bot,
  Building2,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  FileText,
  Filter,
  Gavel,
  Landmark,
  Link2,
  ListChecks,
  MessageCircle,
  PieChart,
  Share2,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Umbrella,
  UserRoundSearch,
} from "lucide-react";
import { BottomAskBar, PageHeader, PillTag, TabBar, useCopilot } from "../components";
import {
  aiPredictedCustomers,
  getCustomerRiskProfile,
  getCustomerStatusVariant,
  migrationTrendData,
  riskFactorData,
  subsidiaryRiskData,
  type AIPredictedCustomer,
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

const migrationViewTabs = [
  { key: "overall", label: "总体趋势" },
  { key: "subsidiary", label: "子公司视图" },
  { key: "driver", label: "风险驱动" },
] as const;

type CreditRiskTab = (typeof tabs)[number]["key"];
type MigrationViewTab = (typeof migrationViewTabs)[number]["key"];
type ConcentrationEntityType = "enterprise" | "financial";
type ConcentrationScreen = "overview" | "ranking" | "trend" | "detail";
type ConcentrationStatus = "超限" | "预警" | "正常";
type ConcentrationStatusFilter = "全部" | ConcentrationStatus;
type ConcentrationSortKey = "utilization" | "used" | "change";
type ConcentrationTrendWindow = "7天" | "30天";

type ConcentrationCustomer = {
  id: string;
  name: string;
  entityType: ConcentrationEntityType;
  status: ConcentrationStatus;
  utilization: number;
  used: number;
  limit: number;
  rating: string;
  change: number;
  chain: string;
};

type ConcentrationTrendPoint = {
  label: string;
  overLimit: number;
  warning: number;
  maxUtilization: number;
  keyCustomer: number;
};

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

const concentrationEntityTabs: Array<{ key: ConcentrationEntityType; label: string }> = [
  { key: "enterprise", label: "一般企业" },
  { key: "financial", label: "金融机构" },
];

const concentrationStatusFilters: ConcentrationStatusFilter[] = ["全部", "超限", "预警", "正常"];

const concentrationSortLabels: Record<ConcentrationSortKey, string> = {
  utilization: "按占用率",
  used: "按已占用额度",
  change: "按较昨日变化",
};

const concentrationQuickQuestions = [
  "为什么今日新增超限变多？",
  "哪些集团连续 7 天占用率上升？",
  "帮我生成集中度风险日报",
  "找出低评级但高占用客户",
  "对前 20 大客户生成排查清单",
  "一般企业和金融机构哪个风险更高？",
  "华东建设集团为什么超限？",
];

const concentrationCustomersByType: Record<ConcentrationEntityType, ConcentrationCustomer[]> = {
  enterprise: [
    { id: "huadong-construction-limit", name: "华东建设集团", entityType: "enterprise", status: "超限", utilization: 128, used: 256, limit: 200, rating: "AA-", change: 6.4, chain: "地产链 / 城投平台" },
    { id: "zhongnan-industrial-limit", name: "中南实业有限公司", entityType: "enterprise", status: "超限", utilization: 106, used: 212, limit: 200, rating: "A+", change: 4.1, chain: "建筑工程 / 担保链" },
    { id: "pingan-city-investment", name: "平安城市建设投资集团", entityType: "enterprise", status: "预警", utilization: 92, used: 184, limit: 200, rating: "AA", change: 2.9, chain: "城投平台 / 区域融资" },
    { id: "north-energy-group", name: "北方能源集团", entityType: "enterprise", status: "正常", utilization: 78, used: 156, limit: 200, rating: "AA+", change: -1.2, chain: "能源 / 大宗商品" },
    { id: "huaxia-traffic-group", name: "华夏交通集团", entityType: "enterprise", status: "正常", utilization: 65, used: 130, limit: 200, rating: "AA", change: 0.8, chain: "交通基建 / 华中区域" },
    { id: "jindi-property-group", name: "金地置业集团", entityType: "enterprise", status: "预警", utilization: 58, used: 116, limit: 200, rating: "A", change: 1.6, chain: "地产链 / 民营房企" },
  ],
  financial: [
    { id: "pingan-bank-group", name: "平安银行同业集团", entityType: "financial", status: "预警", utilization: 88, used: 176, limit: 200, rating: "AAA", change: 1.1, chain: "同业授信 / 流动性" },
    { id: "zhongxin-finance-holdings", name: "中信金融控股", entityType: "financial", status: "正常", utilization: 82, used: 164, limit: 200, rating: "AAA", change: 0.4, chain: "金融控股 / 同业往来" },
    { id: "huarong-asset-management", name: "华融资产管理", entityType: "financial", status: "正常", utilization: 74, used: 148, limit: 200, rating: "AA+", change: -0.7, chain: "资产管理 / 不良处置" },
    { id: "eastern-securities", name: "东方证券集团", entityType: "financial", status: "正常", utilization: 69, used: 138, limit: 200, rating: "AA", change: 0.6, chain: "券商 / 市场波动" },
    { id: "southwest-trust", name: "西南信托有限公司", entityType: "financial", status: "正常", utilization: 61, used: 122, limit: 200, rating: "AA-", change: 0.9, chain: "信托 / 非标资产" },
    { id: "haiyun-leasing", name: "海云金融租赁", entityType: "financial", status: "正常", utilization: 54, used: 108, limit: 200, rating: "A+", change: -0.3, chain: "融资租赁 / 设备资产" },
  ],
};

const concentrationTrendData: Record<ConcentrationEntityType, Record<ConcentrationTrendWindow, ConcentrationTrendPoint[]>> = {
  enterprise: {
    "7天": [
      { label: "06-09", overLimit: 9, warning: 31, maxUtilization: 114, keyCustomer: 104 },
      { label: "06-10", overLimit: 10, warning: 32, maxUtilization: 116, keyCustomer: 108 },
      { label: "06-11", overLimit: 10, warning: 33, maxUtilization: 119, keyCustomer: 112 },
      { label: "06-12", overLimit: 11, warning: 34, maxUtilization: 121, keyCustomer: 116 },
      { label: "06-13", overLimit: 11, warning: 35, maxUtilization: 123, keyCustomer: 120 },
      { label: "06-14", overLimit: 12, warning: 36, maxUtilization: 125, keyCustomer: 124 },
      { label: "06-15", overLimit: 12, warning: 36, maxUtilization: 128, keyCustomer: 128 },
    ],
    "30天": [
      { label: "05-17", overLimit: 8, warning: 27, maxUtilization: 110, keyCustomer: 74 },
      { label: "05-21", overLimit: 9, warning: 29, maxUtilization: 116, keyCustomer: 88 },
      { label: "05-25", overLimit: 9, warning: 30, maxUtilization: 113, keyCustomer: 86 },
      { label: "05-29", overLimit: 10, warning: 31, maxUtilization: 106, keyCustomer: 78 },
      { label: "06-02", overLimit: 10, warning: 32, maxUtilization: 113, keyCustomer: 76 },
      { label: "06-06", overLimit: 11, warning: 33, maxUtilization: 119, keyCustomer: 74 },
      { label: "06-09", overLimit: 11, warning: 34, maxUtilization: 123, keyCustomer: 70 },
      { label: "06-12", overLimit: 12, warning: 35, maxUtilization: 123, keyCustomer: 75 },
      { label: "06-15", overLimit: 12, warning: 36, maxUtilization: 128, keyCustomer: 88 },
    ],
  },
  financial: {
    "7天": [
      { label: "06-09", overLimit: 0, warning: 5, maxUtilization: 83, keyCustomer: 78 },
      { label: "06-10", overLimit: 0, warning: 5, maxUtilization: 84, keyCustomer: 79 },
      { label: "06-11", overLimit: 0, warning: 5, maxUtilization: 85, keyCustomer: 80 },
      { label: "06-12", overLimit: 0, warning: 6, maxUtilization: 86, keyCustomer: 82 },
      { label: "06-13", overLimit: 0, warning: 6, maxUtilization: 87, keyCustomer: 84 },
      { label: "06-14", overLimit: 0, warning: 6, maxUtilization: 88, keyCustomer: 86 },
      { label: "06-15", overLimit: 0, warning: 6, maxUtilization: 88, keyCustomer: 88 },
    ],
    "30天": [
      { label: "05-17", overLimit: 0, warning: 4, maxUtilization: 81, keyCustomer: 70 },
      { label: "05-21", overLimit: 0, warning: 4, maxUtilization: 82, keyCustomer: 72 },
      { label: "05-25", overLimit: 0, warning: 4, maxUtilization: 83, keyCustomer: 73 },
      { label: "05-29", overLimit: 0, warning: 5, maxUtilization: 83, keyCustomer: 75 },
      { label: "06-02", overLimit: 0, warning: 5, maxUtilization: 84, keyCustomer: 76 },
      { label: "06-06", overLimit: 0, warning: 5, maxUtilization: 86, keyCustomer: 79 },
      { label: "06-09", overLimit: 0, warning: 5, maxUtilization: 87, keyCustomer: 82 },
      { label: "06-12", overLimit: 0, warning: 6, maxUtilization: 88, keyCustomer: 85 },
      { label: "06-15", overLimit: 0, warning: 6, maxUtilization: 88, keyCustomer: 88 },
    ],
  },
};

export function CreditRiskPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { openCopilot } = useCopilot();
  const activeTab = getCreditRiskTab(searchParams.get("tab"));
  const [quickQuestionsOpen, setQuickQuestionsOpen] = useState(false);
  const predictedSectionRef = useRef<HTMLElement | null>(null);
  const backPath = getReturnTo(location.state, "/");

  const scrollToPredictedCustomers = () => {
    predictedSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (activeTab === "warning") {
    return <Navigate to="/credit/warning" replace />;
  }

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
          onChange={(key) => {
            setQuickQuestionsOpen(false);
            if (key === "warning") {
              navigate("/credit/warning");
              return;
            }
            setSearchParams({ tab: key });
          }}
        />

        {activeTab === "large" ? <LargeExposureHomeContent /> : null}
        {activeTab === "concentration" ? <ConcentrationTab /> : null}
      </div>

      <BottomAskBar
        placeholder={activeTab === "large" ? "问大户风险、筛选客户、生成名单..." : "问风险、生成报告、追踪预警…"}
        onOpen={() => {
          if (activeTab === "concentration") {
            setQuickQuestionsOpen(true);
            return;
          }

          openCopilot({
            context:
              activeTab === "large"
                ? "正在分析“大户风险首页与 AI 推荐名单”"
                : "正在分析“信用集中度风险”",
          });
        }}
      />
      {activeTab === "concentration" ? (
        <ConcentrationQuickQuestionSheet
          open={quickQuestionsOpen}
          onClose={() => setQuickQuestionsOpen(false)}
          onAsk={(question) => {
            setQuickQuestionsOpen(false);
            openCopilot({ context: `正在回答“${question}”` });
          }}
        />
      ) : null}
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
  const { openCopilot } = useCopilot();
  const [entityType, setEntityType] = useState<ConcentrationEntityType>("enterprise");
  const [screen, setScreen] = useState<ConcentrationScreen>("overview");
  const [statusFilter, setStatusFilter] = useState<ConcentrationStatusFilter>("全部");
  const [sortKey, setSortKey] = useState<ConcentrationSortKey>("utilization");
  const [trendWindow, setTrendWindow] = useState<ConcentrationTrendWindow>("30天");
  const [filterOpen, setFilterOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<ConcentrationCustomer>(concentrationCustomersByType.enterprise[0]);
  const customers = concentrationCustomersByType[entityType];
  const currentCustomer = selectedCustomer.entityType === entityType ? selectedCustomer : customers[0];

  useEffect(() => {
    if (selectedCustomer.entityType !== entityType) {
      setSelectedCustomer(concentrationCustomersByType[entityType][0]);
    }
  }, [entityType, selectedCustomer.entityType]);

  useEffect(() => {
    document.querySelector(".phone-shell")?.scrollTo({ top: 0, behavior: "auto" });
  }, [screen]);

  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    const timer = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const showToast = (message: string) => setToast(message);

  const openCustomerDetail = (customer: ConcentrationCustomer) => {
    setSelectedCustomer(customer);
    setScreen("detail");
  };

  return (
    <>
      <div className="concentration-redesign">
        {screen === "overview" ? (
          <ConcentrationOverview
            entityType={entityType}
            customers={customers}
            onEntityTypeChange={setEntityType}
            onGoRanking={() => setScreen("ranking")}
            onGoTrend={() => setScreen("trend")}
            onShowToast={showToast}
            onOpenCopilot={openCopilot}
          />
        ) : null}
        {screen === "ranking" ? (
          <ConcentrationRanking
            entityType={entityType}
            customers={customers}
            statusFilter={statusFilter}
            sortKey={sortKey}
            onEntityTypeChange={setEntityType}
            onStatusFilterChange={setStatusFilter}
            onCycleSort={() => setSortKey(getNextConcentrationSort(sortKey))}
            onOpenFilter={() => setFilterOpen(true)}
            onOpenCustomer={openCustomerDetail}
          />
        ) : null}
        {screen === "trend" ? (
          <ConcentrationTrendDistribution
            entityType={entityType}
            trendWindow={trendWindow}
            onEntityTypeChange={setEntityType}
            onTrendWindowChange={setTrendWindow}
          />
        ) : null}
        {screen === "detail" ? (
          <ConcentrationCustomerDetail
            customer={currentCustomer}
            onBackToRanking={() => setScreen("ranking")}
            onShowToast={showToast}
          />
        ) : null}
      </div>
      <ConcentrationFilterSheet open={filterOpen} onClose={() => setFilterOpen(false)} />
      <ConcentrationToast message={toast} />
    </>
  );
}

function ConcentrationOverview({
  entityType,
  customers,
  onEntityTypeChange,
  onGoRanking,
  onGoTrend,
  onShowToast,
  onOpenCopilot,
}: {
  entityType: ConcentrationEntityType;
  customers: ConcentrationCustomer[];
  onEntityTypeChange: (type: ConcentrationEntityType) => void;
  onGoRanking: () => void;
  onGoTrend: () => void;
  onShowToast: (message: string) => void;
  onOpenCopilot: (options?: { intent?: "general" | "impact" | "action" | "tracking" | "report" | "pressure"; context?: string }) => void;
}) {
  const summary = getConcentrationSummary(entityType);
  const previewCustomers = customers.slice(0, 5);

  return (
    <>
      <ConcentrationDataMeta />

      <section className="concentration-ai-brief glass-card">
        <header>
          <h2>
            <Bot size={18} />
            AI 今日风险简报
          </h2>
        </header>
        <p>{summary.brief}</p>
        <div className="concentration-ai-actions">
          <button type="button" onClick={() => onOpenCopilot({ context: "正在解释“今日集中度新增超限原因”" })}>
            <ClipboardList size={16} />
            解释原因
          </button>
          <button type="button" onClick={() => onShowToast("已生成《集中度风险日报》")}>
            <FileText size={16} />
            生成日报
          </button>
          <button type="button" onClick={onGoRanking}>
            <UserRoundSearch size={16} />
            查看重点对象
          </button>
        </div>
      </section>

      <section className="concentration-kpi-area">
        <article className="concentration-primary-kpi glass-card">
          <div>
            <span>最高限额占用率</span>
            <strong>{summary.highestUtilization}%</strong>
            <ConcentrationStatusBadge status={summary.highestStatus} />
          </div>
          <h3>{summary.highestGroup}</h3>
          <p>较昨日 {formatConcentrationChange(summary.highestChange)}</p>
          <svg viewBox="0 0 150 62" aria-hidden="true">
            <polyline points="5,48 28,38 52,42 75,31 100,35 125,24 145,12" />
          </svg>
        </article>

        <div className="concentration-kpi-grid">
          {summary.metricCards.map((item) => (
            <article className="concentration-small-kpi glass-card" key={item.label}>
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

      <section className="concentration-overall-usage glass-card">
        <div>
          <span>整体限额占用率</span>
          <strong>{summary.overallUsage}%</strong>
          <em>较昨日 {formatConcentrationChange(summary.overallChange)}</em>
        </div>
        <ConcentrationProgress value={summary.overallUsage} />
        <button type="button" onClick={onGoTrend}>
          趋势与分布
          <ChevronRight size={14} />
        </button>
      </section>

      <ConcentrationTypeSwitch entityType={entityType} onChange={onEntityTypeChange} />

      <section className="concentration-preview glass-card">
        <header>
          <div>
            <h2>前20大客户集中度</h2>
            <p>按限额占用率</p>
          </div>
          <button type="button" onClick={onGoRanking}>
            查看全部
            <ChevronRight size={14} />
          </button>
        </header>
        <div className="concentration-preview-list">
          {previewCustomers.map((customer, index) => (
            <article className="concentration-preview-row" key={customer.id}>
              <span className="concentration-rank-number">{index + 1}</span>
              <div>
                <strong>{customer.name}</strong>
                <ConcentrationStatusBadge status={customer.status} />
              </div>
              <ConcentrationProgress value={customer.utilization} compact />
              <em>{customer.utilization}%</em>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

function ConcentrationRanking({
  entityType,
  customers,
  statusFilter,
  sortKey,
  onEntityTypeChange,
  onStatusFilterChange,
  onCycleSort,
  onOpenFilter,
  onOpenCustomer,
}: {
  entityType: ConcentrationEntityType;
  customers: ConcentrationCustomer[];
  statusFilter: ConcentrationStatusFilter;
  sortKey: ConcentrationSortKey;
  onEntityTypeChange: (type: ConcentrationEntityType) => void;
  onStatusFilterChange: (status: ConcentrationStatusFilter) => void;
  onCycleSort: () => void;
  onOpenFilter: () => void;
  onOpenCustomer: (customer: ConcentrationCustomer) => void;
}) {
  const sortedCustomers = getSortedConcentrationCustomers(customers, statusFilter, sortKey);

  return (
    <>
      <ConcentrationTypeSwitch entityType={entityType} onChange={onEntityTypeChange} />
      <div className="concentration-filter-row">
        <div>
          {concentrationStatusFilters.map((status) => (
            <button
              className={statusFilter === status ? "is-active" : ""}
              type="button"
              key={status}
              onClick={() => onStatusFilterChange(status)}
            >
              {status}
            </button>
          ))}
        </div>
        <button type="button" onClick={onOpenFilter}>
          <Filter size={15} />
          筛选
        </button>
      </div>

      <section className="concentration-ranking-section glass-card">
        <header>
          <div>
            <h2>前20大客户集中度</h2>
            <p>按限额占用率</p>
          </div>
          <button type="button" onClick={onCycleSort}>
            {concentrationSortLabels[sortKey]}
            <ChevronDown size={14} />
          </button>
        </header>
        <div className="concentration-ranking-list">
          {sortedCustomers.map((customer, index) => (
            <button className="concentration-rank-card" type="button" key={customer.id} onClick={() => onOpenCustomer(customer)}>
              <span className="concentration-rank-number">{index + 1}</span>
              <div className="concentration-rank-card__body">
                <div>
                  <strong>{customer.name}</strong>
                  <ConcentrationStatusBadge status={customer.status} />
                </div>
                <p>已占用 {customer.used}亿 / 限额 {customer.limit}亿</p>
                <span>{customer.rating}</span>
              </div>
              <div className="concentration-rank-card__metric">
                <strong>{customer.utilization}%</strong>
                <em>较昨日 {formatConcentrationChange(customer.change)}</em>
              </div>
              <ChevronRight size={16} />
            </button>
          ))}
        </div>
      </section>
    </>
  );
}

function ConcentrationTrendDistribution({
  entityType,
  trendWindow,
  onEntityTypeChange,
  onTrendWindowChange,
}: {
  entityType: ConcentrationEntityType;
  trendWindow: ConcentrationTrendWindow;
  onEntityTypeChange: (type: ConcentrationEntityType) => void;
  onTrendWindowChange: (window: ConcentrationTrendWindow) => void;
}) {
  const summary = getConcentrationSummary(entityType);
  const trendData = concentrationTrendData[entityType][trendWindow];
  const statusDistribution = entityType === "enterprise"
    ? [
        { label: "正常", value: 86, color: "#2fb163" },
        { label: "预警", value: 10, color: "#f5a623" },
        { label: "超限", value: 4, color: "#ff5a1f" },
      ]
    : [
        { label: "正常", value: 91, color: "#2fb163" },
        { label: "预警", value: 9, color: "#f5a623" },
        { label: "超限", value: 0, color: "#ff5a1f" },
      ];
  const donutGradient = getConcentrationDonutGradient(statusDistribution);

  return (
    <>
      <ConcentrationTypeSwitch entityType={entityType} onChange={onEntityTypeChange} />

      <section className="concentration-trend-module glass-card">
        <header>
          <h2>趋势变化</h2>
          <div className="concentration-period-switch">
            {(["7天", "30天"] as ConcentrationTrendWindow[]).map((item) => (
              <button
                className={trendWindow === item ? "is-active" : ""}
                type="button"
                key={item}
                onClick={() => onTrendWindowChange(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </header>
        <div className="concentration-trend-metrics">
          <article>
            <span>超限集团数</span>
            <strong>{summary.overLimitCount}<small>家</small></strong>
            <em>较30日前 +{entityType === "enterprise" ? 4 : 0} ↑</em>
          </article>
          <article>
            <span>预警集团数</span>
            <strong>{summary.warningCount}<small>家</small></strong>
            <em>较30日前 +{entityType === "enterprise" ? 9 : 2} ↑</em>
          </article>
          <article>
            <span>最高占用率</span>
            <strong>{summary.highestUtilization}%</strong>
            <em>较30日前 +{entityType === "enterprise" ? 18 : 7}% ↑</em>
          </article>
        </div>
        <ConcentrationMultiLineChart data={trendData} />
      </section>

      <section className="concentration-ai-readout-card glass-card">
        <h2>
          <Sparkles size={17} />
          AI 趋势解读
        </h2>
        <p>{summary.trendInsight}</p>
      </section>

      <section className="concentration-distribution-section">
        <header>
          <h2>风险分布</h2>
          <button type="button">
            查看更多
            <ChevronRight size={14} />
          </button>
        </header>
        <div className="concentration-distribution-grid">
          <article className="concentration-distribution-card glass-card">
            <h3>状态分布</h3>
            <div className="concentration-donut-layout">
              <div className="concentration-status-donut" style={{ background: donutGradient }} aria-hidden="true" />
              <div className="concentration-donut-legend">
                {statusDistribution.map((item) => (
                  <p key={item.label}>
                    <i style={{ background: item.color }} />
                    <span>{item.label}</span>
                    <strong>{item.value}%</strong>
                  </p>
                ))}
              </div>
            </div>
          </article>
          <article className="concentration-distribution-card glass-card">
            <h3>集团类型分布</h3>
            <div className="concentration-type-distribution">
              <div>
                <span>一般企业</span>
                <ConcentrationProgress value={78} compact />
                <strong>78%</strong>
              </div>
              <div>
                <span>金融机构</span>
                <ConcentrationProgress value={22} compact />
                <strong>22%</strong>
              </div>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}

function ConcentrationCustomerDetail({
  customer,
  onBackToRanking,
  onShowToast,
}: {
  customer: ConcentrationCustomer;
  onBackToRanking: () => void;
  onShowToast: (message: string) => void;
}) {
  return (
    <>
      <button className="concentration-back-link" type="button" onClick={onBackToRanking}>
        <ChevronRight size={15} />
        返回前20排行
      </button>
      <section className="concentration-detail-hero glass-card">
        <header>
          <div>
            <h2>
              {customer.name}
              <ConcentrationStatusBadge status={customer.status} />
            </h2>
            <p>
              集团类型：{getConcentrationEntityLabel(customer.entityType)}
              <span>评级：{customer.rating}</span>
            </p>
          </div>
          <button type="button" aria-label="关注客户">
            <Bookmark size={18} />
            关注
          </button>
        </header>
        <div className="concentration-detail-metrics">
          <article>
            <span>限额占用率</span>
            <strong>{customer.utilization}%</strong>
            <em>较昨日 {formatConcentrationChange(customer.change)}</em>
          </article>
          <article>
            <span>已占用额度</span>
            <strong>{customer.used}<small>亿</small></strong>
            <em>连续上升 5 日</em>
          </article>
          <article>
            <span>限额</span>
            <strong>{customer.limit}<small>亿</small></strong>
          </article>
        </div>
      </section>

      <section className="concentration-detail-chart glass-card">
        <header>
          <h2>近30天占用率趋势</h2>
          <strong>{customer.utilization}%</strong>
        </header>
        <ConcentrationSingleLineChart utilization={customer.utilization} />
      </section>

      <section className="concentration-ai-reason glass-card">
        <h2>AI 风险归因</h2>
        <p>占用率上升主要由以下因素驱动：</p>
        <div>
          {[
            "表内授信增加：6月新增授信 38 亿",
            "关联敞口增加：关联集团新增占用 21 亿",
            "行业风险上升：地产链信用风险上升",
            "限额调整影响：限额下调 10 亿",
          ].map((item) => (
            <p key={item}>
              <ListChecks size={15} />
              {item}
            </p>
          ))}
        </div>
      </section>

      <section className="concentration-ai-actions-card glass-card">
        <h2>AI 建议动作</h2>
        <div>
          {["提高风险等级", "限额复核", "纳入重点跟踪", "生成客户报告"].map((item) => (
            <button
              type="button"
              key={item}
              onClick={() => {
                if (item === "生成客户报告") {
                  onShowToast(`已生成《${customer.name}集中度风险分析摘要》`);
                }
              }}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      <section className="concentration-related-risk glass-card">
        <h2>关联风险</h2>
        <div>
          <p><strong>6</strong><span>关联客户</span></p>
          <p><strong>2</strong><span>高风险关联方</span></p>
        </div>
        <small>共同风险因子：地产链、华东区域、集团互保</small>
      </section>
    </>
  );
}

function ConcentrationDataMeta() {
  return (
    <div className="concentration-data-meta">
      <span>数据日期：2026-06-15 09:30</span>
      <span>覆盖客户：<strong>32,184</strong> 个</span>
    </div>
  );
}

function ConcentrationTypeSwitch({
  entityType,
  onChange,
}: {
  entityType: ConcentrationEntityType;
  onChange: (type: ConcentrationEntityType) => void;
}) {
  return (
    <div className="concentration-type-switch" role="tablist" aria-label="客户类型">
      {concentrationEntityTabs.map((item) => (
        <button
          className={entityType === item.key ? "is-active" : ""}
          type="button"
          key={item.key}
          role="tab"
          aria-selected={entityType === item.key}
          onClick={() => onChange(item.key)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

function ConcentrationProgress({ value, compact = false }: { value: number; compact?: boolean }) {
  return (
    <span className={`concentration-progress${compact ? " concentration-progress--compact" : ""}`}>
      <i style={{ width: `${Math.max(4, Math.min(value, 100))}%` }} />
    </span>
  );
}

function ConcentrationStatusBadge({ status }: { status: ConcentrationStatus }) {
  return <span className={`concentration-status-badge is-${getConcentrationStatusClass(status)}`}>{status}</span>;
}

function ConcentrationMultiLineChart({ data }: { data: ConcentrationTrendPoint[] }) {
  return (
    <div className="concentration-multi-chart">
      <div className="concentration-chart-legend">
        <span><i className="is-over" />超限集团数</span>
        <span><i className="is-warning" />预警集团数</span>
        <span><i className="is-max" />最高占用率</span>
        <span><i className="is-key" />重点集团占用率</span>
      </div>
      <svg viewBox="0 0 330 188" role="img" aria-label="集中度风险趋势变化">
        {[0, 50, 100, 150].map((tick) => (
          <g key={tick}>
            <path d={`M30 ${150 - tick * 0.82}H312`} className="concentration-grid-line" />
            <text x="4" y={154 - tick * 0.82}>{tick}</text>
          </g>
        ))}
        <polyline className="concentration-line-over" points={getConcentrationChartPoints(data, "overLimit")} />
        <polyline className="concentration-line-warning" points={getConcentrationChartPoints(data, "warning")} />
        <polyline className="concentration-line-max" points={getConcentrationChartPoints(data, "maxUtilization")} />
        <polyline className="concentration-line-key" points={getConcentrationChartPoints(data, "keyCustomer")} />
        {data.map((item, index) => {
          const x = 42 + index * (252 / Math.max(1, data.length - 1));
          return (
            <text className="concentration-chart-label" x={x} y="178" key={item.label}>
              {item.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

function ConcentrationSingleLineChart({ utilization }: { utilization: number }) {
  const points = [65, 72, 73, 88, 91, 100, 114, 115, utilization];

  return (
    <div className="concentration-single-chart">
      <svg viewBox="0 0 330 150" role="img" aria-label="近30天占用率趋势">
        {[0, 50, 100, 150].map((tick) => (
          <g key={tick}>
            <path d={`M30 ${122 - tick * 0.68}H312`} className="concentration-grid-line" />
            <text x="4" y={126 - tick * 0.68}>{tick}%</text>
          </g>
        ))}
        <polyline points={points.map((value, index) => `${42 + index * 31},${122 - value * 0.68}`).join(" ")} />
        <text x="286" y={122 - utilization * 0.68 - 8}>{utilization}%</text>
        {["05-17", "05-25", "06-02", "06-09", "06-15"].map((item, index) => (
          <text className="concentration-chart-label" x={42 + index * 62} y="142" key={item}>
            {item}
          </text>
        ))}
      </svg>
    </div>
  );
}

function ConcentrationFilterSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) {
    return null;
  }

  return (
    <div className="sheet-layer" role="presentation">
      <button className="sheet-layer__backdrop" type="button" aria-label="关闭筛选" onClick={onClose} />
      <section className="bottom-sheet concentration-filter-sheet" role="dialog" aria-modal="true" aria-label="集中度筛选">
        <div className="bottom-sheet__handle" />
        <header>
          <h2>筛选</h2>
          <button type="button" onClick={onClose}>完成</button>
        </header>
        <div className="concentration-filter-groups">
          <section>
            <h3>集团类型</h3>
            <div><button type="button" className="is-active">一般企业</button><button type="button">金融机构</button></div>
          </section>
          <section>
            <h3>监控结果</h3>
            <div><button type="button" className="is-active">全部</button><button type="button">超限</button><button type="button">预警</button><button type="button">正常</button></div>
          </section>
          <section>
            <h3>限额门槛</h3>
            <div><button type="button">大于 50 亿</button><button type="button" className="is-active">100 亿</button><button type="button">200 亿</button></div>
          </section>
          <section>
            <h3>数据日期</h3>
            <input value="2026-06-15 09:30" readOnly />
          </section>
          <section>
            <h3>集团名称搜索</h3>
            <input placeholder="输入集团名称" />
          </section>
          <section>
            <h3>评级</h3>
            <div><button type="button">AAA</button><button type="button" className="is-active">AA-及以下</button><button type="button">A+</button></div>
          </section>
          <section>
            <h3>占用率区间</h3>
            <div><button type="button" className="is-active">大于 85%</button><button type="button">大于 100%</button><button type="button">50%-85%</button></div>
          </section>
        </div>
      </section>
    </div>
  );
}

function ConcentrationQuickQuestionSheet({
  open,
  onClose,
  onAsk,
}: {
  open: boolean;
  onClose: () => void;
  onAsk: (question: string) => void;
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="sheet-layer" role="presentation">
      <button className="sheet-layer__backdrop" type="button" aria-label="关闭 AI 快捷追问" onClick={onClose} />
      <section className="bottom-sheet concentration-question-sheet" role="dialog" aria-modal="true" aria-label="集中度风险快捷追问">
        <div className="bottom-sheet__handle" />
        <header>
          <div>
            <h2>AI 快捷追问</h2>
            <p>围绕当前集中度风险继续分析、生成报告或排查清单。</p>
          </div>
        </header>
        <div className="concentration-question-list">
          {concentrationQuickQuestions.map((question) => (
            <button type="button" key={question} onClick={() => onAsk(question)}>
              <Bot size={15} />
              {question}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

function ConcentrationToast({ message }: { message: string | null }) {
  if (!message) {
    return null;
  }

  return (
    <div className="large-toast concentration-toast" role="status">
      <CheckCircle2 size={16} />
      {message}
    </div>
  );
}

function getSortedConcentrationCustomers(customers: ConcentrationCustomer[], statusFilter: ConcentrationStatusFilter, sortKey: ConcentrationSortKey) {
  return [...customers]
    .filter((customer) => statusFilter === "全部" || customer.status === statusFilter)
    .sort((left, right) => right[sortKey] - left[sortKey]);
}

function getNextConcentrationSort(sortKey: ConcentrationSortKey): ConcentrationSortKey {
  if (sortKey === "utilization") {
    return "used";
  }

  if (sortKey === "used") {
    return "change";
  }

  return "utilization";
}

function getConcentrationSummary(entityType: ConcentrationEntityType) {
  if (entityType === "financial") {
    return {
      brief: "金融机构组整体平稳，暂无超限集团，预警集团 6 家。风险主要来自同业授信占用上升和非标资产波动，需关注低评级租赁与信托机构的额度变化。",
      highestUtilization: 88,
      highestStatus: "预警" as ConcentrationStatus,
      highestGroup: "平安银行同业集团",
      highestChange: 1.1,
      overLimitCount: 0,
      warningCount: 6,
      newOverLimit: 0,
      newWarning: 1,
      overallUsage: 61,
      overallChange: 0.8,
      trendInsight: "过去 30 天金融机构组整体平稳，预警数量小幅增加，主要受同业授信占用和非标资产估值波动影响，尚未形成超限压力。",
      metricCards: [
        { label: "超限集团数", value: "0", suffix: "家", detail: "较昨日 0 个" },
        { label: "预警集团数", value: "6", suffix: "家", detail: "较昨日 +1 ↑" },
        { label: "今日新增超限", value: "0", suffix: "家", detail: "无新增" },
        { label: "今日新增预警", value: "1", suffix: "家", detail: "同业占用上升" },
      ],
    };
  }

  return {
    brief: "今日集中度风险处于中高水平。超限集团 12 家，预警集团 36 家，新增超限 3 家。风险主要集中在一般企业中的地产链与城投平台客户，前 20 大客户限额占用率连续 4 周上升。",
    highestUtilization: 128,
    highestStatus: "超限" as ConcentrationStatus,
    highestGroup: "华东建设集团",
    highestChange: 6.4,
    overLimitCount: 12,
    warningCount: 36,
    newOverLimit: 3,
    newWarning: 8,
    overallUsage: 74,
    overallChange: 2.7,
    trendInsight: "过去 30 天集中度风险呈上升趋势，主要由一般企业组驱动，尤其是地产链与城投平台客户占用率提升最明显；金融机构组整体平稳。",
    metricCards: [
      { label: "超限集团数", value: "12", suffix: "家", detail: "较昨日 +3 ↑" },
      { label: "预警集团数", value: "36", suffix: "家", detail: "较昨日 +5 ↑" },
      { label: "今日新增超限", value: "3", suffix: "家", detail: "地产链集中" },
      { label: "今日新增预警", value: "8", suffix: "家", detail: "城投平台上升" },
    ],
  };
}

function getConcentrationChartPoints(data: ConcentrationTrendPoint[], key: keyof ConcentrationTrendPoint) {
  return data
    .map((item, index) => {
      const value = typeof item[key] === "number" ? item[key] : 0;
      const x = 42 + index * (252 / Math.max(1, data.length - 1));
      const y = 150 - value * 0.82;
      return `${x},${y}`;
    })
    .join(" ");
}

function getConcentrationDonutGradient(items: Array<{ value: number; color: string }>) {
  let cursor = 0;
  const segments = items.map((item) => {
    const start = cursor;
    const end = cursor + item.value;
    cursor = end;
    return `${item.color} ${start}% ${end}%`;
  });

  return `conic-gradient(${segments.join(", ")})`;
}

function getConcentrationStatusClass(status: ConcentrationStatus) {
  if (status === "超限") {
    return "over";
  }

  if (status === "预警") {
    return "warning";
  }

  return "normal";
}

function getConcentrationEntityLabel(entityType: ConcentrationEntityType) {
  return entityType === "enterprise" ? "一般企业" : "金融机构";
}

function formatConcentrationChange(value: number) {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}% ${value >= 0 ? "↑" : "↓"}`;
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
