import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  BarChart3,
  Bell,
  Bot,
  BriefcaseBusiness,
  Building2,
  CalendarClock,
  ChartNoAxesCombined,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  ClipboardList,
  FileText,
  Filter,
  Gavel,
  Info,
  LineChart,
  Megaphone,
  MoreHorizontal,
  PieChart,
  RadioTower,
  RotateCcw,
  Share2,
  Shield,
  ShieldAlert,
  Sparkles,
  TrendingDown,
  TrendingUp,
  UserRoundSearch,
  X,
} from "lucide-react";
import { BottomAskBar, BottomSheet, useCopilot } from "../components";
import {
  bondIssuanceTrend,
  exposureBreakdown,
  filterGroups,
  getLargeExposureCustomer,
  holdingTrendData,
  largeExposureCustomers,
  type LargeExposureFilterKey,
  type LargeExposureCustomer,
} from "../data/largeExposure";

const homeTabs = ["AI 推荐关注 8", "持仓较高 12", "风险上行 6", "已出险 3"];
const defaultFilters: LargeExposureFilters = {
  industries: [],
  natures: [],
  managementClasses: [],
  riskFeatures: [],
};
const rangeLabels = {
  "3m": "近 3 个月",
  "6m": "近 6 个月",
  "12m": "近 12 个月",
} as const;

const detailTabs = [
  { key: "overview", label: "风险概览" },
  { key: "internal", label: "内部风险" },
  { key: "external", label: "外部风险" },
  { key: "forecast", label: "未来预测" },
] as const;

type DetailTab = (typeof detailTabs)[number]["key"];
type HoldingRange = keyof typeof holdingTrendData;
type LargeExposureFilters = Record<LargeExposureFilterKey, string[]>;
type SheetKind =
  | "filter"
  | "rating"
  | "exposure"
  | "greylist"
  | "finance"
  | "sentiment"
  | "funding"
  | "bondTrend"
  | "industry"
  | "scenario-base"
  | "scenario-stress"
  | "scenario-improve"
  | "alert"
  | "summary"
  | null;

export function LargeExposureHomePage() {
  const navigate = useNavigate();
  const { openCopilot } = useCopilot();

  return (
    <LargePage className="large-home" askPlaceholder="问大户风险、筛选客户、生成名单..." onAsk={() => openCopilot({ context: "正在分析“大户风险首页与 AI 推荐名单”" })}>
      <LargeTopNav title="大户风险" onBack={() => navigate("/credit?tab=large")} right={<RoundIconButton label="分享"><Share2 size={20} /></RoundIconButton>} />
      <LargeExposureHomeContent />
    </LargePage>
  );
}

export function LargeExposureHomeContent() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(homeTabs[0]);
  const [sheet, setSheet] = useState<SheetKind>(null);
  const [filters, setFilters] = useState<LargeExposureFilters>(defaultFilters);
  const [draftFilters, setDraftFilters] = useState<LargeExposureFilters>(defaultFilters);
  const [toast, showToast] = useToast();
  const selectedFilters = getSelectedFilterItems(filters);
  const filteredCustomers = useMemo(() => filterLargeExposureCustomers(getHomeTabCustomers(activeTab), filters), [activeTab, filters]);
  const visibleCustomers = filteredCustomers.slice(0, 5);

  const openFilter = () => {
    setDraftFilters(cloneFilters(filters));
    setSheet("filter");
  };

  return (
    <div className="large-home large-home-content">
      <AiBlock
        label="AI 今日洞察"
        title={
          <>
            大户风险整体可控，但 <em>6</em> 家客户风险边际上升
          </>
        }
        description="其中 3 家来自房地产链条，2 家持仓较年初未明显压降，1 家出现负面舆情与财务恶化共振。"
        icon={<Bot size={20} />}
        art={<ShieldChartArt />}
        variant="hero"
      />

      <section className="large-stat-grid" aria-label="关键统计">
        <MetricTile icon={<BriefcaseBusiness size={18} />} label="重点管理" value="6 家" subValue="较上月 +1" tone="orange" />
        <MetricTile icon={<ShieldAlert size={18} />} label="出险客户" value="3 家" subValue="较上月 -" tone="orange" />
        <MetricTile icon={<TrendingUp size={18} />} label="风险上行" value="8 家" subValue="较上月 +2" tone="orange" />
        <MetricTile icon={<PieChart size={18} />} label="持仓较年初" value="-12.4%" subValue="已压降" tone="green" />
      </section>

      <PillTabs items={homeTabs} active={activeTab} onChange={setActiveTab} />

      <FilterStrip hasActiveFilters={selectedFilters.length > 0} onOpen={openFilter} />

      <SelectedFilterRow
        filters={filters}
        onRemove={(key, value) => setFilters((current) => removeFilterValue(current, key, value))}
        onClear={() => setFilters(defaultFilters)}
      />

      <section className="large-list-heading">
        <div>
          <h2>AI 推荐关注客户</h2>
          <p>{selectedFilters.length > 0 ? `已筛出 ${filteredCustomers.length} 家客户` : "默认展示前 5 家重点客户"}</p>
        </div>
        <span>{visibleCustomers.length}/{filteredCustomers.length}</span>
      </section>

      <CustomerResultList
        customers={visibleCustomers}
        emptyText="暂无符合条件的大户客户，请调整筛选条件。"
        onOpenCustomer={(customer) => navigate(`/credit/large-exposure/${customer.id}`)}
      />

      {filteredCustomers.length > 5 ? (
        <button className="large-more-button" type="button" onClick={() => navigate("/credit/large-exposure/list")}>
          查看更多
          <ChevronRight size={15} />
        </button>
      ) : null}

      <BottomSheet open={sheet === "filter"} title="筛选大户客户" onClose={() => setSheet(null)}>
        <FilterSheet
          value={draftFilters}
          onChange={setDraftFilters}
          onReset={() => setDraftFilters(defaultFilters)}
          onSubmit={() => {
            setFilters(cloneFilters(draftFilters));
            showToast("已按筛选条件更新名单");
            setSheet(null);
          }}
        />
      </BottomSheet>
      <MockToast message={toast} />
    </div>
  );
}

export function LargeExposureListPage() {
  const navigate = useNavigate();
  const { openCopilot } = useCopilot();
  const [sheet, setSheet] = useState<SheetKind>(null);
  const [filters, setFilters] = useState<LargeExposureFilters>(defaultFilters);
  const [draftFilters, setDraftFilters] = useState<LargeExposureFilters>(defaultFilters);
  const [visibleCount, setVisibleCount] = useState(10);
  const [toast, showToast] = useToast();
  const selectedFilters = getSelectedFilterItems(filters);
  const filteredCustomers = useMemo(() => filterLargeExposureCustomers(largeExposureCustomers, filters), [filters]);
  const visibleCustomers = filteredCustomers.slice(0, visibleCount);

  useEffect(() => {
    setVisibleCount(10);
  }, [filters]);

  const openFilter = () => {
    setDraftFilters(cloneFilters(filters));
    setSheet("filter");
  };

  return (
    <LargePage className="large-list-page" askPlaceholder="问大户列表、筛选客户、生成名单..." onAsk={() => openCopilot({ context: "正在分析“大户客户全量列表”" })}>
      <LargeTopNav title="大户客户列表" onBack={() => navigate("/credit?tab=large")} right={<RoundIconButton label="分享"><Share2 size={20} /></RoundIconButton>} />

      <FilterStrip hasActiveFilters={selectedFilters.length > 0} onOpen={openFilter} />
      <SelectedFilterRow
        filters={filters}
        onRemove={(key, value) => setFilters((current) => removeFilterValue(current, key, value))}
        onClear={() => setFilters(defaultFilters)}
      />

      <section className="large-list-heading">
        <div>
          <h2>全部大户客户</h2>
          <p>{selectedFilters.length > 0 ? "已按筛选条件更新列表" : "每次加载 10 条，卡片样式与首页一致"}</p>
        </div>
        <span>{filteredCustomers.length} 家</span>
      </section>

      <CustomerResultList
        customers={visibleCustomers}
        emptyText="暂无符合条件的大户客户，请调整筛选条件。"
        onOpenCustomer={(customer) => navigate(`/credit/large-exposure/${customer.id}`)}
      />

      {visibleCount < filteredCustomers.length ? (
        <button className="large-more-button" type="button" onClick={() => setVisibleCount((current) => current + 10)}>
          加载更多
          <ChevronDown size={15} />
        </button>
      ) : filteredCustomers.length > 0 ? (
        <p className="large-list-end">已展示全部客户</p>
      ) : null}

      <BottomSheet open={sheet === "filter"} title="筛选大户客户" onClose={() => setSheet(null)}>
        <FilterSheet
          value={draftFilters}
          onChange={setDraftFilters}
          onReset={() => setDraftFilters(defaultFilters)}
          onSubmit={() => {
            setFilters(cloneFilters(draftFilters));
            showToast("已按筛选条件更新名单");
            setSheet(null);
          }}
        />
      </BottomSheet>
      <MockToast message={toast} />
    </LargePage>
  );
}

export function LargeExposureDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { openCopilot } = useCopilot();
  const customer = getLargeExposureCustomer(id);
  const activeTab = getDetailTab(searchParams.get("tab"));
  const [sheet, setSheet] = useState<SheetKind>(null);
  const [range, setRange] = useState<HoldingRange>("6m");
  const [toast, showToast] = useToast();

  const placeholder = {
    overview: "问该客户风险、生成报告、预测未来...",
    internal: "问关于内部风险的问题...",
    external: "问关于外部风险的问题...",
    forecast: "问关于未来风险的问题...",
  }[activeTab];

  const setTab = (tab: DetailTab) => {
    setSearchParams(tab === "overview" ? {} : { tab });
  };

  return (
    <LargePage className={`large-detail large-detail--${activeTab}`} askPlaceholder={placeholder} onAsk={() => openCopilot({ context: `正在分析“${customer.name}大户风险”` })}>
      <LargeDetailHeroNav onBack={() => navigate("/credit?tab=large")} />
      <CustomerHeader customer={customer} />
      <CoreStatusCard customer={customer} onOpenRating={() => setSheet("rating")} />
      <StrategyCard customer={customer} onMock={() => showToast("已打开策略记录草稿")} />
      <AiBlock
        label="AI 风险判断"
        title="该客户风险较上月上升"
        description="主要受盈利下滑、行业景气度下降及融资成本上升影响。集团持仓虽较年初已有压降，但存量规模仍需重点跟踪。"
        icon={<Sparkles size={18} />}
        chips={["风险趋势：上行", "关键驱动：盈利下滑、融资成本上升", "关注等级：高"]}
      />
      <DetailTabs active={activeTab} onChange={setTab} />

      {activeTab === "overview" ? <OverviewTab customer={customer} /> : null}
      {activeTab === "internal" ? (
        <InternalRiskTab
          customer={customer}
          range={range}
          onRangeChange={(nextRange) => setRange(nextRange)}
          onOpenSheet={setSheet}
        />
      ) : null}
      {activeTab === "external" ? <ExternalRiskTab customer={customer} onOpenSheet={setSheet} /> : null}
      {activeTab === "forecast" ? <ForecastTab onOpenSheet={setSheet} onToast={showToast} /> : null}

      <DetailSheets customer={customer} sheet={sheet} onClose={() => setSheet(null)} onToast={showToast} />
      <MockToast message={toast} />
    </LargePage>
  );
}

function LargePage({ children, className, askPlaceholder, onAsk }: { children: ReactNode; className: string; askPlaceholder: string; onAsk: () => void }) {
  return (
    <div className={`page large-page ${className}`}>
      <div className="large-page-scroll">{children}</div>
      <BottomAskBar placeholder={askPlaceholder} onOpen={onAsk} />
    </div>
  );
}

function LargeTopNav({ title, onBack, right }: { title: string; onBack: () => void; right?: ReactNode }) {
  return (
    <header className="large-top-nav">
      <RoundIconButton label="返回" onClick={onBack}>
        <ArrowLeft size={24} />
      </RoundIconButton>
      <h1>{title}</h1>
      <div className="large-nav-actions">{right}</div>
    </header>
  );
}

function LargeDetailHeroNav({ onBack }: { onBack: () => void }) {
  return (
    <header className="large-detail-hero-nav">
      <RoundIconButton label="返回" onClick={onBack}>
        <ArrowLeft size={24} />
      </RoundIconButton>
      <div className="large-nav-actions">
        <RoundIconButton label="分享">
          <Share2 size={20} />
        </RoundIconButton>
        <RoundIconButton label="更多">
          <MoreHorizontal size={22} />
        </RoundIconButton>
      </div>
    </header>
  );
}

function LargeCompactDetailNav({ customer, onBack }: { customer: LargeExposureCustomer; onBack: () => void }) {
  return (
    <header className="large-compact-nav">
      <RoundIconButton label="返回" onClick={onBack}>
        <ArrowLeft size={23} />
      </RoundIconButton>
      <div>
        <h1>{customer.name}</h1>
        <p>{customer.customerCode}</p>
      </div>
      <div className="large-nav-actions">
        <RoundIconButton label="分享">
          <Share2 size={19} />
        </RoundIconButton>
        <RoundIconButton label="更多">
          <MoreHorizontal size={21} />
        </RoundIconButton>
      </div>
    </header>
  );
}

function RoundIconButton({ children, label, onClick }: { children: ReactNode; label: string; onClick?: () => void }) {
  return (
    <button className="large-round-button" type="button" aria-label={label} onClick={onClick}>
      {children}
    </button>
  );
}

function AiBlock({
  label,
  title,
  description,
  icon,
  art,
  chips,
  variant,
}: {
  label: string;
  title: ReactNode;
  description: string;
  icon: ReactNode;
  art?: ReactNode;
  chips?: string[];
  variant?: "hero";
}) {
  return (
    <section className={`large-ai-card${variant === "hero" ? " large-ai-card--hero" : ""}`}>
      <div className="large-ai-card__body">
        <div className="large-ai-card__label">
          <span>{icon}</span>
          {label}
        </div>
        <h2>{title}</h2>
        <p>{description}</p>
        {chips ? (
          <div className="large-ai-chips">
            {chips.map((chip) => (
              <span key={chip}>{chip}</span>
            ))}
          </div>
        ) : null}
      </div>
      {art ? <div className="large-ai-art">{art}</div> : null}
    </section>
  );
}

function ShieldChartArt() {
  return (
    <div className="shield-art" aria-hidden="true">
      <Shield size={82} />
      <LineChart size={38} />
    </div>
  );
}

function MetricTile({ icon, label, value, subValue, tone = "neutral" }: { icon?: ReactNode; label: string; value: string; subValue: string; tone?: "orange" | "green" | "neutral" }) {
  return (
    <article className={`large-metric-tile is-${tone}`}>
      <div>
        {icon ? <span className="large-metric-icon">{icon}</span> : null}
        <span>{label}</span>
      </div>
      <strong>{value}</strong>
      <p>{subValue}</p>
    </article>
  );
}

function PillTabs({ items, active, onChange }: { items: string[]; active: string; onChange: (item: string) => void }) {
  return (
    <nav className="large-pill-tabs" aria-label="主筛选">
      {items.map((item) => (
        <button className={active === item ? "is-active" : ""} type="button" key={item} onClick={() => onChange(item)}>
          {item}
        </button>
      ))}
    </nav>
  );
}

function FilterStrip({ hasActiveFilters, onOpen }: { hasActiveFilters: boolean; onOpen: () => void }) {
  return (
    <section className="large-filter-strip" aria-label="筛选入口">
      <button className="large-filter-icon" type="button" aria-label="筛选" onClick={onOpen}>
        <Filter size={19} />
      </button>
      {["行业", "企业性质", "管理分类"].map((item) => (
        <button type="button" key={item} onClick={onOpen}>
          {item}
          <ChevronDown size={15} />
        </button>
      ))}
      <button type="button" onClick={onOpen}>
        更多筛选
        {hasActiveFilters ? <span className="large-filter-dot" /> : null}
      </button>
    </section>
  );
}

function SelectedFilterRow({
  filters,
  onRemove,
  onClear,
}: {
  filters: LargeExposureFilters;
  onRemove: (key: LargeExposureFilterKey, value: string) => void;
  onClear: () => void;
}) {
  const selectedFilters = getSelectedFilterItems(filters);

  if (selectedFilters.length === 0) {
    return null;
  }

  return (
    <section className="large-selected-row" aria-label="已选条件">
      <span>已选条件：</span>
      <div>
        {selectedFilters.map((item) => (
          <button type="button" key={`${item.key}-${item.value}`} onClick={() => onRemove(item.key, item.value)}>
            {item.value}
            <X size={13} />
          </button>
        ))}
      </div>
      <button type="button" onClick={onClear}>
        清空
      </button>
    </section>
  );
}

function CustomerResultList({
  customers,
  emptyText,
  onOpenCustomer,
}: {
  customers: LargeExposureCustomer[];
  emptyText: string;
  onOpenCustomer: (customer: LargeExposureCustomer) => void;
}) {
  if (customers.length === 0) {
    return (
      <section className="large-empty-card">
        <UserRoundSearch size={26} />
        <h2>没有匹配客户</h2>
        <p>{emptyText}</p>
      </section>
    );
  }

  return (
    <section className="large-customer-stack" aria-label="客户列表">
      {customers.map((customer) => (
        <CustomerCard key={customer.id} customer={customer} onClick={() => onOpenCustomer(customer)} />
      ))}
    </section>
  );
}

function CustomerCard({ customer, onClick }: { customer: LargeExposureCustomer; onClick: () => void }) {
  const trendTone = customer.riskTrend === "风险下降" ? "green" : customer.riskTrend === "风险稳定" ? "stable" : "orange";

  return (
    <button className="large-customer-card" type="button" onClick={onClick}>
      <header>
        <span className="large-customer-avatar" aria-hidden="true">
          <Building2 size={24} />
        </span>
        <div>
          <h2>{customer.name}</h2>
          <p>客户编号：{customer.customerCode}</p>
        </div>
        <ChevronRight size={20} />
      </header>
      <div className="large-customer-pills">
        <span>{customer.managementClass}</span>
        <span>{customer.strategy}</span>
        <span className={`is-${trendTone}`}>{customer.riskTrend}{customer.riskTrend === "风险上行" ? " ↑" : customer.riskTrend === "风险下降" ? " ↓" : ""}</span>
      </div>
      <div className="large-customer-metrics">
        <span>
          评级
          <strong>{customer.rating}</strong>
        </span>
        <span>
          持仓规模
          <strong>{customer.holding.toFixed(1)} 亿</strong>
        </span>
        <span>
          较年初
          <strong className="is-green">{customer.holdingChangeYtd.toFixed(1)}%</strong>
        </span>
      </div>
      <p className="large-customer-ai">
        <Sparkles size={16} />
        <b>AI 判断：</b>
        {customer.aiSummary}
      </p>
      <div className="large-tag-cloud">
        {customer.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
      <footer>
        <span>
          <CalendarClock size={15} />
          最新信号：{customer.latestSignal}
        </span>
        <time>{customer.updatedAt}</time>
      </footer>
    </button>
  );
}

function CustomerHeader({ customer }: { customer: LargeExposureCustomer }) {
  const headerTags = Array.from(new Set([customer.industry, customer.nature, ...customer.tags])).slice(0, 3);

  return (
    <section className="large-customer-header">
      <div>
        <div className="large-title-row">
          <h1>{customer.name}</h1>
          <span>{customer.managementClass}</span>
        </div>
        <p>
          客户编号：{customer.customerCode}
          <ClipboardList size={15} />
        </p>
        <div className="large-tag-cloud">
          {[...headerTags, "+"].map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </div>
      <div className="large-building-art" aria-hidden="true">
        <Building2 size={54} />
      </div>
    </section>
  );
}

function CoreStatusCard({ customer, onOpenRating }: { customer: LargeExposureCustomer; onOpenRating: () => void }) {
  const riskScoreDirection = customer.riskScoreChange >= 0 ? "↑" : "↓";
  const riskScoreChange = Math.abs(customer.riskScoreChange);

  return (
    <section className="large-core-card">
      <StatusMetric label="当前评级" value={customer.rating} subtext={customer.ratingTone} tone="orange" onClick={onOpenRating} />
      <StatusMetric label="集团持仓规模" value={customer.holding.toFixed(1)} unit="亿" subtext="集团敞口" tone="orange" />
      <StatusMetric label="较年初变化" value={`${customer.holdingChangeYtd.toFixed(1)}%`} subtext="已压降" tone="green" />
      <StatusMetric label="综合风险分" value={`${customer.riskScore}`} unit="/100" subtext={`较上月 ${riskScoreDirection} ${riskScoreChange}`} tone="orange" />
    </section>
  );
}

function StatusMetric({
  label,
  value,
  unit,
  subtext,
  tone,
  onClick,
}: {
  label: string;
  value: string;
  unit?: string;
  subtext: string;
  tone: "orange" | "green";
  onClick?: () => void;
}) {
  const content = (
    <>
      <span className="large-core-label">
        <span>{label}</span>
        <Info size={14} />
      </span>
      <strong className={`large-core-value is-${tone}`}>
        <span>{value}</span>
        {unit ? <small>{unit}</small> : null}
      </strong>
      <span className="large-core-subtext">{subtext}</span>
    </>
  );

  if (onClick) {
    return (
      <button className="large-core-metric" type="button" onClick={onClick}>
        {content}
      </button>
    );
  }

  return <div className="large-core-metric">{content}</div>;
}

function StrategyCard({ customer, onMock }: { customer: LargeExposureCustomer; onMock: () => void }) {
  return (
    <section className="large-strategy-card">
      <div className="large-card-icon" aria-hidden="true">
        <ShieldAlert size={26} />
      </div>
      <div>
        <div className="large-strategy-lines">
          <p>
            客户策略：<strong>{customer.strategy}</strong>
          </p>
          <p>
            管理分类：<strong>{customer.managementClass}</strong>
          </p>
        </div>
        <p className="large-strategy-copy">建议暂停新增高风险敞口，保留存量必要业务，关注现金流、发债成本、负面舆情及关联担保变化。若连续两期财务指标恶化或出现新增重大负面事件，建议升级为压降策略。</p>
      </div>
      <button type="button" onClick={onMock}>
        策略记录
        <ChevronRight size={15} />
      </button>
    </section>
  );
}

function DetailTabs({ active, onChange }: { active: DetailTab; onChange: (tab: DetailTab) => void }) {
  return (
    <nav className="large-detail-tabs" aria-label="客户风险 Tabs">
      {detailTabs.map((tab) => (
        <button className={active === tab.key ? "is-active" : ""} type="button" key={tab.key} onClick={() => onChange(tab.key)}>
          {tab.label}
        </button>
      ))}
    </nav>
  );
}

function OverviewTab({ customer }: { customer: LargeExposureCustomer }) {
  return (
    <>
      <section className="large-section-card">
        <h2>风险概览</h2>
        <div className="large-overview-split">
          <article>
            <h3>
              主要风险因子
              <Info size={15} />
            </h3>
            {[
              ["盈利能力下滑", "影响较大", BarChart3],
              ["行业景气度下降", "影响较大", TrendingDown],
              ["融资成本上升", "影响中等", CircleDollarSign],
              ["负面舆情增加", "影响中等", Megaphone],
            ].map(([title, impact, Icon]) => (
              <div className="large-factor-row" key={title as string}>
                {typeof Icon !== "string" ? <Icon size={18} /> : null}
                <span>{title as string}</span>
                <em>{impact as string}</em>
              </div>
            ))}
          </article>
          <article>
            <KeyMetricTrendChart />
          </article>
        </div>
      </section>
      <section className="large-bottom-status">
        {[
          ["黑灰名单", customer.greylist ? "灰名单" : "否", ClipboardList],
          ["预警状态", customer.warningStatus, ShieldAlert],
          ["出险状态", customer.defaultStatus, CheckCircle2],
          ["集中度占比", `${customer.concentration}%`, ChartNoAxesCombined],
        ].map(([label, value, Icon]) => (
          <article key={label as string}>
            {typeof Icon !== "string" ? <Icon size={17} /> : null}
            <span>{label as string}</span>
            <strong>{value as string}</strong>
          </article>
        ))}
      </section>
    </>
  );
}

function KeyMetricTrendChart() {
  const quarters = ["23Q2", "23Q3", "23Q4", "24Q1"];
  const revenue = [22.1, 20.3, 18.7, 16.5];
  const profit = [4.1, 3.2, 0.8, -0.6];
  const chart = buildLineChartPoints({ series: [revenue, profit], width: 320, height: 184, minY: -10, maxY: 30 });

  return (
    <div className="large-key-trend">
      <h3>关键指标趋势（近 4 个季度）</h3>
      <div className="large-chart-legend">
        <span className="is-revenue">营业收入(亿)</span>
        <span className="is-profit">净利润(亿)</span>
      </div>
      <svg className="large-key-chart" viewBox="0 0 320 184" role="img" aria-label="营业收入和净利润近 4 个季度双折线趋势">
        {[30, 20, 10, 0, -10].map((tick) => (
          <g key={tick}>
            <line x1="36" x2="304" y1={chart.y(tick)} y2={chart.y(tick)} />
            <text x="10" y={chart.y(tick) + 4}>
              {tick}
            </text>
          </g>
        ))}
        <polyline points={chart.points(revenue)} className="is-revenue" />
        <polyline points={chart.points(profit)} className="is-profit" />
        {revenue.map((value, index) => (
          <g key={`revenue-${quarters[index]}`}>
            <circle cx={chart.x(index)} cy={chart.y(value)} r="5" className="is-revenue" />
            <text x={chart.x(index)} y={chart.y(value) - 12} className="is-revenue-value">
              {value}
            </text>
          </g>
        ))}
        {profit.map((value, index) => (
          <g key={`profit-${quarters[index]}`}>
            <circle cx={chart.x(index)} cy={chart.y(value)} r="5" className="is-profit" />
            <text x={chart.x(index)} y={chart.y(value) - 12} className="is-profit-value">
              {value}
            </text>
          </g>
        ))}
        {quarters.map((quarter, index) => (
          <text x={chart.x(index)} y="176" className="is-quarter" key={quarter}>
            {quarter}
          </text>
        ))}
      </svg>
      <div className="large-key-trend-foot">
        <span>
          净利润同比 <strong className="is-green">-35% ↓</strong>
        </span>
        <span>
          资产负债率 <strong>68%</strong>
        </span>
      </div>
    </div>
  );
}

function BondIssuanceChart() {
  const maxValue = 7;
  const baseY = 96;

  return (
    <div className="large-bond-chart">
      <h3>发债规模趋势（亿元）</h3>
      <div className="large-chart-legend">
        <span className="is-revenue">发行规模</span>
        <span className="is-maturity">到期规模</span>
      </div>
      <svg viewBox="0 0 320 132" aria-label="发债规模趋势双柱状图" role="img">
        {[6, 4, 2, 0].map((tick, index) => (
          <g key={tick}>
            <line x1="28" x2="304" y1={18 + index * 26} y2={18 + index * 26} />
            <text x="6" y={22 + index * 26}>{tick}</text>
          </g>
        ))}
        {bondIssuanceTrend.map((item, index) => {
          const groupX = 44 + index * 56;
          const issuanceHeight = (item.issuance / maxValue) * 76;
          const maturityHeight = (item.maturity / maxValue) * 76;
          return (
            <g key={item.month}>
              <text x={groupX + 6} y={baseY - issuanceHeight - 6} className="is-bar-value">{item.issuance.toFixed(1)}</text>
              <text x={groupX + 28} y={baseY - maturityHeight - 6} className="is-bar-value">{item.maturity.toFixed(1)}</text>
              <rect x={groupX} y={baseY - issuanceHeight} width="16" height={issuanceHeight} rx="4" className="is-issuance" />
              <rect x={groupX + 24} y={baseY - maturityHeight} width="16" height={maturityHeight} rx="4" className="is-maturity" />
              <text x={groupX + 20} y={124} className="is-month">{item.month}</text>
            </g>
          );
        })}
      </svg>
      <p>发债节奏偏快，未来 6 个月到期压力 5.2 亿元，需关注再融资能力。</p>
    </div>
  );
}

function InternalRiskTab({
  customer,
  range,
  onRangeChange,
  onOpenSheet,
}: {
  customer: LargeExposureCustomer;
  range: HoldingRange;
  onRangeChange: (range: HoldingRange) => void;
  onOpenSheet: (sheet: SheetKind) => void;
}) {
  return (
    <>
      <section className="large-section-card">
        <header className="large-section-head">
          <h2>
            内部敞口总览
            <Info size={15} />
          </h2>
          <span>金额单位：亿元</span>
        </header>
        <div className="large-exposure-grid">
          <MetricTile label="集团持仓规模" value={customer.holding.toFixed(1)} subValue="" tone="neutral" />
          <MetricTile label="较年初变化" value={`${customer.holdingChangeYtd.toFixed(1)}%`} subValue="已压降" tone="green" />
          <MetricTile label="集中度占比" value={`${customer.concentration}%`} subValue="较上月 -0.2pp" tone="green" />
          <MetricTile label="内部风险评分" value="68" subValue="较上月 ↑5" tone="orange" />
        </div>
      </section>

      <section className="large-section-card">
        <header className="large-section-head">
          <h2>敞口结构分布</h2>
          <button type="button" onClick={() => onOpenSheet("exposure")}>
            查看明细
            <ChevronRight size={15} />
          </button>
        </header>
        <div className="large-bar-list">
          {exposureBreakdown.map((item, index) => (
            <div className="large-bar-row" key={item.name}>
              <div>
                <span>{item.name}</span>
                <strong>{item.amount}</strong>
                <em>{item.ratio}%</em>
              </div>
              <i style={{ width: `${item.ratio}%`, opacity: 1 - index * 0.14 }} />
            </div>
          ))}
        </div>
      </section>

      <section className="large-section-card">
        <h2>预警与出险状态</h2>
        <div className="large-status-grid">
          <StatusCell label="预警状态" value={customer.warningStatus} sub="较上月 ↑1 级" tone="orange" />
          <StatusCell label="出险状态" value={customer.defaultStatus} sub="历史出险 0 次" tone="neutral" />
          <StatusCell label="黑名单" value={customer.blacklist ? "是" : "否"} sub="近期无新增" tone="green" />
          <button className="large-status-cell is-orange" type="button" onClick={() => onOpenSheet("greylist")}>
            <span>灰名单</span>
            <strong>{customer.greylist ? "是" : "否"}</strong>
            <p>04.12 纳入</p>
          </button>
        </div>
      </section>

      <section className="large-section-card large-trend-card">
        <header className="large-section-head">
          <h2>
            持仓变化趋势
            <small>（{rangeLabels[range]}）</small>
          </h2>
          <label className="large-range-select">
            <select value={range} onChange={(event) => onRangeChange(event.target.value as HoldingRange)} aria-label="选择持仓趋势时间范围">
              {(Object.keys(rangeLabels) as HoldingRange[]).map((item) => (
                <option value={item} key={item}>
                  {rangeLabels[item]}
                </option>
              ))}
            </select>
            <ChevronDown size={14} />
          </label>
        </header>
        <HoldingTrendChart data={holdingTrendData[range]} />
        <p>持仓缓慢压降，但压降进度偏慢。</p>
      </section>

      <section className="large-section-card">
        <h2>内部风险信号</h2>
        <div className="large-signal-list">
          <SignalRow title="持仓规模较大" detail="当前持仓规模高于同评级客户中位数" risk="中风险" icon={<Building2 size={18} />} />
          <SignalRow title="压降进度不确定" detail="较年初压降 8.4%，低于计划进度（计划压降 15%）" risk="中风险" icon={<TrendingDown size={18} />} />
          <SignalRow title="部分敞口久期偏长" detail="债券持仓中久期 > 3 年占比 42%" risk="低风险" icon={<Shield size={18} />} tone="green" />
        </div>
      </section>

      <AiBlock label="AI 内部风险解读" title="敞口规模较高，压降进度需跟踪" description="集团对该客户敞口规模较高，虽有压降但进度相对缓慢；债券久期偏长带来利率波动风险，建议重点跟踪压降进度与债券持仓风险。" icon={<Sparkles size={18} />} />
    </>
  );
}

function ExternalRiskTab({ customer, onOpenSheet }: { customer: LargeExposureCustomer; onOpenSheet: (sheet: SheetKind) => void }) {
  return (
    <>
      <section className="large-section-card">
        <header className="large-section-head">
          <h2>
            外部风险总览
            <Info size={15} />
          </h2>
        </header>
        <p className="large-section-subtitle">近 7 天外部风险信号 5 条，较上月增加 2 条</p>
        <div className="large-external-scroll">
          {[
            ["负面舆情", "1", "较上月 +1", Megaphone],
            ["重大公告", "1", "较上月 持平", FileText],
            ["司法风险", "0", "较上月 持平", Gavel],
            ["监管处罚", "0", "较上月 持平", Shield],
            ["评级变动", "-", "较上月 持平", Building2],
          ].map(([label, value, sub, Icon]) => (
            <article key={label as string}>
              {typeof Icon !== "string" ? <Icon size={17} /> : null}
              <span>{label as string}</span>
              <strong>{value as string}</strong>
              <p>{sub as string}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="large-section-card">
        <header className="large-section-head">
          <h2>
            财务风险
            <Info size={15} />
          </h2>
          <span className="large-segmented"><b>同比</b><i>环比</i></span>
        </header>
        <div className="large-finance-grid">
          <FinanceMetric label="营业收入" value={customer.financialMetrics.revenue} delta={customer.financialMetrics.revenueYoY} tone="green" />
          <FinanceMetric label="净利润" value={customer.financialMetrics.profit} delta={customer.financialMetrics.profitYoY} tone="green" />
          <FinanceMetric label="资产负债率" value={customer.financialMetrics.debtRatio} delta={customer.financialMetrics.debtRatioChange} tone="orange" />
          <FinanceMetric label="经营现金流" value={customer.financialMetrics.cashFlow} delta="下降" tone="orange" />
        </div>
        <button className="large-ai-inline" type="button" onClick={() => onOpenSheet("finance")}>
          <span><b>AI 解读：</b>客户盈利能力显著下滑，经营现金流转负，债务负担有所上升，短期财务压力加大。</span>
          <em>查看财务详情 <ChevronRight size={14} /></em>
        </button>
      </section>

      <section className="large-section-card large-funding-card">
        <header className="large-section-head">
          <h2>
            融资情况
            <Info size={15} />
          </h2>
        </header>
        <div className="large-funding-layout">
          <div className="large-funding-list">
            <p>今年以来累计发债<strong>{customer.financing.bondIssuedYtd}</strong></p>
            <button type="button" onClick={() => onOpenSheet("funding")}>债券利率区间<strong>{customer.financing.bondRateRange}</strong></button>
            <p>
              平均融资成本
              <span className="large-value-block">
                <strong>{customer.financing.averageCost}</strong>
                <em>较去年 {customer.financing.averageCostChange}</em>
              </span>
            </p>
            <p>未来 6 个月到期债务<strong>{customer.financing.dueDebtSixMonths}</strong></p>
          </div>
          <div className="large-funding-tags">
            <span>发债节奏：偏快</span>
            <span>到期压力：中等</span>
            <span>融资成本：{customer.financing.averageCostChange.startsWith("-") ? "下降" : "上行"}</span>
          </div>
          <button className="large-bond-chart-card" type="button" onClick={() => onOpenSheet("bondTrend")}>
            <BondIssuanceChart />
          </button>
        </div>
      </section>

      <section className="large-section-card">
        <header className="large-section-head">
          <h2>
            舆情风险
            <Info size={15} />
          </h2>
          <button type="button" onClick={() => onOpenSheet("sentiment")}>查看全部舆情 <ChevronRight size={15} /></button>
        </header>
        <p className="large-section-subtitle">近 7 日负面舆情 1 条，涉及：业绩下滑、债务压力</p>
        <button className="large-news-row" type="button" onClick={() => onOpenSheet("sentiment")}>
          <strong>天合能源一季度净利同比下滑 35%，债务压力引关注</strong>
          <p>
            <span>2024-05-14 10:32</span>
            <span>|</span>
            <span>财联社</span>
            <em>负面</em>
          </p>
        </button>
      </section>

      <section className="large-two-card-row">
        <article className="large-small-info-card">
          <h2>
            司法与担保风险
            <Info size={14} />
          </h2>
          <div className="large-mini-metric-row">
            <span>诉讼案件</span>
            <strong>0</strong>
          </div>
          <div className="large-mini-metric-row">
            <span>被执行信息</span>
            <strong>0</strong>
          </div>
          <div className="large-mini-metric-row">
            <span>对外担保余额</span>
            <strong>12.3 亿</strong>
          </div>
          <em className="large-mini-status-pill">无逾期担保</em>
        </article>
        <button className="large-small-info-card" type="button" onClick={() => onOpenSheet("industry")}>
          <h2>
            行业与宏观
            <Info size={14} />
          </h2>
          <div className="large-mini-field">
            <span>所属行业</span>
            <strong>{customer.industry}</strong>
          </div>
          <div className="large-mini-field">
            <span>行业景气度</span>
            <strong className="is-warning">偏弱</strong>
          </div>
          <p className="large-mini-summary">{getIndustrySummary(customer.industry)}</p>
        </button>
      </section>
    </>
  );
}

function ForecastTab({ onOpenSheet, onToast }: { onOpenSheet: (sheet: SheetKind) => void; onToast: (message: string) => void }) {
  return (
    <>
      <section className="large-section-card large-forecast-hero">
        <header className="large-section-head">
          <h2>
            <Sparkles size={20} />
            AI 未来风险趋势判断
          </h2>
          <span>更新时间：2024-05-15</span>
        </header>
        <div className="large-forecast-lead">
          <div className="large-rise-art" aria-hidden="true">
            <TrendingUp size={58} />
          </div>
          <div>
            <h3>未来 90 天风险趋势：<em>偏上行</em></h3>
            <p>受盈利下滑、行业景气度低位及融资成本上升影响，该客户未来风险可能边际走高，建议维持重点跟踪，关注关键指标变化。</p>
          </div>
        </div>
        <div className="large-prob-grid">
          <Probability label="评级下调概率" value="30% ~ 40%" level="中等" />
          <Probability label="舆情升温概率" value="50% ~ 60%" level="中高" tone="orange" />
          <Probability label="出险概率" value="10% ~ 20%" level="低-中" />
          <Probability label="融资成本上行概率" value="60% ~ 70%" level="中高" tone="orange" />
        </div>
      </section>

      <section className="large-section-card">
        <h2>情景推演（未来 90 天）</h2>
        <div className="large-scenario-scroll">
          <ScenarioCard title="基准情景" desc="维持当前经营与行业环境，风险整体可控。" level="中等" impacts={["持仓小幅压降", "融资成本维持高位", "盈利下滑放缓"]} strategy="审慎新增" tone="green" onClick={() => onOpenSheet("scenario-base")} />
          <ScenarioCard title="压力情景" desc="盈利继续下滑，融资成本进一步上行，舆情出现负面事件。" level="较高" impacts={["评级可能下调", "持仓减值压力上升", "流动性压力加大"]} strategy="压降" tone="orange" onClick={() => onOpenSheet("scenario-stress")} />
          <ScenarioCard title="改善情景" desc="经营改善，融资环境边际好转，舆情消退。" level="偏低" impacts={["盈利修复", "融资成本下降", "评级稳定"]} strategy="维持" tone="green" onClick={() => onOpenSheet("scenario-improve")} />
        </div>
      </section>

      <section className="large-section-card">
        <h2>风险升级触发条件</h2>
        <div className="large-trigger-list">
          <TriggerRow icon={<BarChart3 size={18} />} title="盈利持续恶化" detail="连续两期净利润同比下滑超过 30%。" impact="中高影响" />
          <TriggerRow icon={<CircleDollarSign size={18} />} title="融资成本显著上行" detail="平均债券利率上行超过 100BP。" impact="中高影响" />
          <TriggerRow icon={<Megaphone size={18} />} title="重大负面舆情或司法事件" detail="出现重大负面舆情、诉讼、被执行等事件。" impact="高影响" />
          <TriggerRow icon={<PieChart size={18} />} title="集团持仓压降不及预期" detail="未来两个季度持仓压降进度低于计划 15%。" impact="中影响" />
        </div>
      </section>

      <section className="large-section-card large-actions-card">
        <header className="large-section-head">
          <h2>
            <Sparkles size={20} />
            AI 建议与跟踪
          </h2>
          <span className="is-green">已加入跟踪（2 天前）</span>
        </header>
        <p>建议维持重点跟踪，设定关键指标预警，及时调整客户策略。</p>
        <div className="large-action-grid">
          <button type="button" onClick={() => onToast("已生成预测报告草稿")}><FileText size={17} />生成预测报告</button>
          <button type="button" onClick={() => onOpenSheet("alert")}><Bell size={17} />设置预警</button>
          <button type="button" onClick={() => onToast("已加入专项跟踪")}><RadioTower size={17} />加入专项跟踪</button>
          <button type="button" onClick={() => onOpenSheet("summary")}><ClipboardList size={17} />生成汇报摘要</button>
        </div>
      </section>
    </>
  );
}

function DetailSheets({ customer, sheet, onClose, onToast }: { customer: LargeExposureCustomer; sheet: SheetKind; onClose: () => void; onToast: (message: string) => void }) {
  const content = useMemo(() => getSheetContent(sheet, customer, onToast, onClose), [sheet, customer, onToast, onClose]);

  return (
    <BottomSheet open={Boolean(sheet)} title={content.title} onClose={onClose}>
      {content.body}
    </BottomSheet>
  );
}

function getSheetContent(sheet: SheetKind, customer: LargeExposureCustomer, onToast: (message: string) => void, onClose: () => void): { title: ReactNode; body: ReactNode } {
  if (sheet === "rating") {
    return {
      title: `为什么评级为 ${customer.rating}？`,
      body: (
        <div className="large-sheet-stack">
          <SheetBlock title="评级基础" items={[`内评：${customer.internalRating}`, "外部评级：AA-", `评级趋势：${customer.ratingTone}`]} />
          <SheetBlock title="主要支撑" items={["行业地位尚可", "存量现金流仍可覆盖短期债务", "集团持仓已较年初压降"]} />
          <SheetBlock title="主要拖累" items={["盈利下滑", "融资成本上升", "房地产链条景气度下降"]} tone="orange" />
          <div className="large-quick-ask">
            {["评级会下调吗？", "哪些指标拖累最大？", "生成评级说明"].map((item) => (
              <button type="button" key={item} onClick={() => onToast(item === "生成评级说明" ? "已生成评级说明草稿" : `已生成追问：${item}`)}>
                {item}
              </button>
            ))}
          </div>
        </div>
      ),
    };
  }

  if (sheet === "exposure") {
    return {
      title: "敞口明细",
      body: (
        <div className="large-sheet-list">
          {exposureBreakdown.map((item) => (
            <p key={item.name}>
              <span>{item.name}</span>
              <strong>{item.amount}</strong>
            </p>
          ))}
        </div>
      ),
    };
  }

  if (sheet === "greylist") {
    return {
      title: "灰名单纳入原因",
      body: <p className="large-sheet-copy">2024-04-12 因负面舆情与融资成本上行叠加，被纳入灰名单观察。当前建议维持重点跟踪，若新增重大负面事件或压降不及预期，需重新评估管理策略。</p>,
    };
  }

  if (sheet === "finance") {
    return {
      title: "财务详情",
      body: <SheetBlock title="更多财务指标" items={["毛利率：18.6%，同比 -3.1pp", "EBITDA：13.4 亿元，同比 -22.0%", "短债占比：38.5%", "货币资金：9.8 亿元", "现金短债比：0.74"]} />,
    };
  }

  if (sheet === "sentiment") {
    return {
      title: "舆情摘要",
      body: (
        <div className="large-sheet-stack">
          <p className="large-sheet-copy">负面｜天合能源一季度净利同比下滑 35%，债务压力引关注。</p>
          <SheetBlock title="来源与时间" items={["财联社", "2024-05-14 10:32"]} />
          <SheetBlock title="AI 影响判断" items={["对评级趋势形成负面压力", "与盈利下滑、融资成本上行形成共振", "建议纳入未来 30 天舆情跟踪"]} tone="orange" />
        </div>
      ),
    };
  }

  if (sheet === "funding") {
    return {
      title: "融资成本解释",
      body: <p className="large-sheet-copy">{customer.financing.bondRateRange} 为该客户近期债券利率区间，平均融资成本 {customer.financing.averageCost}，较去年 {customer.financing.averageCostChange}。AI 建议结合未来 6 个月到期债务 {customer.financing.dueDebtSixMonths} 持续跟踪再融资压力。</p>,
    };
  }

  if (sheet === "bondTrend") {
    return {
      title: "发债规模趋势说明",
      body: <p className="large-sheet-copy">今年以来累计发债 {customer.financing.bondIssuedYtd}。24-03 发行规模达到 6.0 亿元，未来 6 个月到期压力 {customer.financing.dueDebtSixMonths}，需关注再融资能力。</p>,
    };
  }

  if (sheet === "industry") {
    const isTransport = customer.industry.includes("交通");
    return {
      title: "行业景气度解释",
      body: (
        <SheetBlock
          title="行业与宏观判断"
          items={isTransport ? ["客运恢复偏慢", "融资环境仍偏紧", "行业信用风险需关注", "对客户再融资和现金流韧性形成压力"] : [`${customer.industry}景气度偏弱`, "融资环境偏紧", "行业信用风险上升", "需关注盈利和再融资变化"]}
          tone="orange"
        />
      ),
    };
  }

  if (sheet === "alert") {
    return {
      title: "设置预警",
      body: (
        <div className="large-alert-settings">
          {["净利润下滑阈值", "债券利率上行阈值", "舆情新增阈值", "持仓压降进度阈值"].map((item, index) => (
            <label key={item}>
              <span>{item}</span>
              <input readOnly value={["30%", "100BP", "1 条/7日", "15%"][index]} />
            </label>
          ))}
          <button
            className="primary-button"
            type="button"
            onClick={() => {
              onToast("预警阈值已保存");
              onClose();
            }}
          >
            保存预警
          </button>
        </div>
      ),
    };
  }

  if (sheet === "summary") {
    return {
      title: "30 秒领导汇报版",
      body: <p className="large-sheet-copy">{customer.name}当前为{customer.managementClass}，策略为{customer.strategy}。集团持仓 {customer.holding.toFixed(1)} 亿元，较年初变化 {customer.holdingChangeYtd.toFixed(1)}%，综合风险分 {customer.riskScore}。AI 建议围绕财务、舆情、融资和压降进度设置跟踪动作。</p>,
    };
  }

  if (sheet?.startsWith("scenario")) {
    const scenario = sheet === "scenario-stress" ? "压力情景" : sheet === "scenario-improve" ? "改善情景" : "基准情景";
    return {
      title: `${scenario}推演路径`,
      body: <SheetBlock title={scenario} items={scenario === "压力情景" ? ["盈利继续下滑", "融资成本进一步上行", "评级可能下调", "建议策略切换为压降"] : scenario === "改善情景" ? ["经营改善", "融资环境边际好转", "舆情消退", "建议策略维持"] : ["经营与行业环境维持现状", "持仓小幅压降", "融资成本维持高位", "建议策略审慎新增"]} />,
    };
  }

  return { title: "", body: null };
}

function FilterSheet({
  value,
  onChange,
  onReset,
  onSubmit,
}: {
  value: LargeExposureFilters;
  onChange: (filters: LargeExposureFilters) => void;
  onReset: () => void;
  onSubmit: () => void;
}) {
  return (
    <div className="large-filter-sheet">
      {filterGroups.map((group) => (
        <section key={group.title}>
          <h3>{group.title}</h3>
          <div>
            {group.options.map((option) => (
              <button
                className={value[group.key].includes(option) ? "is-active" : ""}
                type="button"
                key={option}
                onClick={() => onChange(toggleFilterValue(value, group.key, option))}
              >
                {option}
              </button>
            ))}
          </div>
        </section>
      ))}
      <footer>
        <button type="button" onClick={onReset}>
          <RotateCcw size={16} />
          重置
        </button>
        <button type="button" onClick={onSubmit}>查看结果</button>
      </footer>
    </div>
  );
}

function SheetBlock({ title, items, tone = "neutral" }: { title: string; items: string[]; tone?: "orange" | "neutral" }) {
  return (
    <section className={`large-sheet-block is-${tone}`}>
      <h3>{title}</h3>
      <div>
        {items.map((item) => (
          <p key={item}>{item}</p>
        ))}
      </div>
    </section>
  );
}

function StatusCell({ label, value, sub, tone }: { label: string; value: string; sub: string; tone: "orange" | "green" | "neutral" }) {
  return (
    <article className={`large-status-cell is-${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <p>{sub}</p>
    </article>
  );
}

function SignalRow({ icon, title, detail, risk, tone = "orange" }: { icon: ReactNode; title: string; detail: string; risk: string; tone?: "orange" | "green" }) {
  return (
    <article className="large-signal-row">
      <span>{icon}</span>
      <div>
        <h3>{title}</h3>
        <p>{detail}</p>
      </div>
      <em className={`is-${tone}`}>{risk}</em>
    </article>
  );
}

function FinanceMetric({ label, value, delta, tone }: { label: string; value: string; delta: string; tone: "orange" | "green" }) {
  return (
    <article className={`large-finance-metric is-${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <em>{delta}</em>
    </article>
  );
}

function Probability({ label, value, level, tone = "neutral" }: { label: string; value: string; level: string; tone?: "orange" | "neutral" }) {
  return (
    <article className={`large-probability is-${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <em>{level}</em>
    </article>
  );
}

function ScenarioCard({
  title,
  desc,
  level,
  impacts,
  strategy,
  tone,
  onClick,
}: {
  title: string;
  desc: string;
  level: string;
  impacts: string[];
  strategy: string;
  tone: "orange" | "green";
  onClick: () => void;
}) {
  return (
    <button className={`large-scenario-card is-${tone}`} type="button" onClick={onClick}>
      <h3>{title}</h3>
      <p>{desc}</p>
      <div>
        <span>风险水平</span>
        <strong>{level}</strong>
      </div>
      <span>核心影响</span>
      <ul>
        {impacts.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <div>
        <span>建议策略</span>
        <strong>{strategy}</strong>
      </div>
    </button>
  );
}

function TriggerRow({ icon, title, detail, impact }: { icon: ReactNode; title: string; detail: string; impact: string }) {
  return (
    <article className="large-trigger-row">
      <span>{icon}</span>
      <div>
        <h3>{title}</h3>
        <p>{detail}</p>
      </div>
      <em>{impact}</em>
    </article>
  );
}

function HoldingTrendChart({ data }: { data: readonly { label: string; value: number }[] }) {
  const values = data.map((item) => item.value);
  const minValue = Math.min(...values) - 0.6;
  const maxValue = Math.max(...values) + 0.6;
  const chartWidth = 334;
  const chartHeight = 118;
  const left = 12;
  const right = 12;
  const top = 18;
  const bottom = 22;
  const usableWidth = chartWidth - left - right;
  const usableHeight = chartHeight - top - bottom;
  const points = data.map((item, index) => {
    const x = data.length === 1 ? chartWidth / 2 : left + (usableWidth / (data.length - 1)) * index;
    const y = top + ((maxValue - item.value) / Math.max(maxValue - minValue, 1)) * usableHeight;
    return `${x},${y}`;
  });

  return (
    <div className="large-holding-chart">
      <svg viewBox="0 0 334 118" aria-hidden="true">
        <path d={`M ${points.join(" L ")}`} fill="none" stroke="#ff6a1a" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        {data.map((item, index) => {
          const x = data.length === 1 ? chartWidth / 2 : left + (usableWidth / (data.length - 1)) * index;
          const y = top + ((maxValue - item.value) / Math.max(maxValue - minValue, 1)) * usableHeight;
          return <circle key={item.label} cx={x} cy={y} r="5" fill="#fffaf4" stroke="#ff6a1a" strokeWidth="3" />;
        })}
      </svg>
      <div className="large-holding-labels" style={{ gridTemplateColumns: `repeat(${data.length}, minmax(0, 1fr))` }}>
        {data.map((item) => (
          <span key={item.label}>
            <strong>{item.value}</strong>
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function MockToast({ message }: { message: string | null }) {
  if (!message) {
    return null;
  }

  return (
    <div className="large-toast" role="status">
      <CheckCircle2 size={17} />
      {message}
    </div>
  );
}

function useToast(): [string | null, (message: string) => void] {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!message) {
      return;
    }
    const timer = window.setTimeout(() => setMessage(null), 1800);
    return () => window.clearTimeout(timer);
  }, [message]);

  return [message, setMessage];
}

function getDetailTab(tab: string | null): DetailTab {
  return detailTabs.some((item) => item.key === tab) ? (tab as DetailTab) : "overview";
}

function cloneFilters(filters: LargeExposureFilters): LargeExposureFilters {
  return {
    industries: [...filters.industries],
    natures: [...filters.natures],
    managementClasses: [...filters.managementClasses],
    riskFeatures: [...filters.riskFeatures],
  };
}

function toggleFilterValue(filters: LargeExposureFilters, key: LargeExposureFilterKey, value: string): LargeExposureFilters {
  const currentValues = filters[key];
  const nextValues = currentValues.includes(value) ? currentValues.filter((item) => item !== value) : [...currentValues, value];
  return { ...filters, [key]: nextValues };
}

function removeFilterValue(filters: LargeExposureFilters, key: LargeExposureFilterKey, value: string): LargeExposureFilters {
  return { ...filters, [key]: filters[key].filter((item) => item !== value) };
}

function getSelectedFilterItems(filters: LargeExposureFilters) {
  return (Object.keys(filters) as LargeExposureFilterKey[]).flatMap((key) => filters[key].map((value) => ({ key, value })));
}

function filterLargeExposureCustomers(customers: LargeExposureCustomer[], filters: LargeExposureFilters) {
  return customers.filter((customer) => {
    const industryOk = filters.industries.length === 0 || filters.industries.some((item) => matchesText(customer.industry, item) || customer.tags.some((tag) => matchesText(tag, item)));
    const natureOk = filters.natures.length === 0 || filters.natures.some((item) => matchesText(customer.nature, item) || customer.tags.some((tag) => matchesText(tag, item)));
    const managementOk = filters.managementClasses.length === 0 || filters.managementClasses.includes(customer.managementClass);
    const featureOk = filters.riskFeatures.length === 0 || filters.riskFeatures.every((feature) => matchRiskFeature(customer, feature));
    return industryOk && natureOk && managementOk && featureOk;
  });
}

function getHomeTabCustomers(activeTab: string) {
  if (activeTab.includes("持仓较高")) {
    return [...largeExposureCustomers].sort((a, b) => b.holding - a.holding);
  }
  if (activeTab.includes("风险上行")) {
    return largeExposureCustomers.filter((customer) => customer.riskTrend === "风险上行");
  }
  if (activeTab.includes("已出险")) {
    return largeExposureCustomers.filter((customer) => customer.defaultStatus === "已出险");
  }
  return largeExposureCustomers;
}

function matchRiskFeature(customer: LargeExposureCustomer, feature: string) {
  const searchableText = [customer.riskTrend, customer.publicOpinion, customer.warningStatus, customer.defaultStatus, customer.latestSignal, customer.financing.averageCostChange, ...customer.tags].join(" ");

  if (feature === "持仓较年初未压降") {
    return customer.holdingChangeYtd >= 0 || searchableText.includes("未压降");
  }
  if (feature === "持仓较年初上升") {
    return customer.holdingChangeYtd > 0 || searchableText.includes("持仓较年初上升");
  }
  if (feature === "黑灰名单") {
    return customer.blacklist || customer.greylist || searchableText.includes("黑名单") || searchableText.includes("灰名单");
  }
  if (feature === "有负面舆情") {
    return searchableText.includes("负面舆情") || customer.publicOpinion.includes("负面");
  }
  if (feature === "评级下调") {
    return searchableText.includes("评级下调") || customer.ratingTone.includes("下调");
  }
  if (feature === "融资成本上升") {
    return searchableText.includes("融资成本上升") || searchableText.includes("利率上行") || customer.financing.averageCostChange.startsWith("+");
  }
  if (feature === "近期发债异常") {
    return searchableText.includes("近期发债异常") || searchableText.includes("发债节奏") || searchableText.includes("新增发债");
  }
  if (feature === "风险上行") {
    return customer.riskTrend === "风险上行";
  }
  if (feature === "已出险") {
    return customer.defaultStatus === "已出险";
  }
  return searchableText.includes(feature);
}

function matchesText(source: string, query: string) {
  const normalizedSource = normalizeFilterText(source);
  const normalizedQuery = normalizeFilterText(query);
  return normalizedSource.includes(normalizedQuery) || normalizedQuery.includes(normalizedSource);
}

function normalizeFilterText(value: string) {
  return value.replace(/[、，,\s]/g, "").replace("链", "").replace("生产和供应业", "").replace("仓储和邮政业", "").replace("管理业", "").replace("所有制", "").replace("企业", "");
}

function getIndustrySummary(industry: string) {
  if (industry.includes("交通")) {
    return "客运恢复偏慢，融资环境仍偏紧，行业信用风险需关注。";
  }
  if (industry.includes("房地产")) {
    return "房地产销售持续低迷，融资环境偏紧，行业信用风险上升。";
  }
  if (industry.includes("建筑")) {
    return "工程回款周期拉长，现金流波动加大，需关注回款质量。";
  }
  return `${industry}景气度偏弱，融资环境仍偏紧，需关注现金流韧性。`;
}

function buildLineChartPoints({
  width,
  height,
  minY,
  maxY,
}: {
  series: number[][];
  width: number;
  height: number;
  minY: number;
  maxY: number;
}) {
  const left = 42;
  const right = 16;
  const top = 18;
  const bottom = 34;
  const usableWidth = width - left - right;
  const usableHeight = height - top - bottom;
  const x = (index: number) => left + (usableWidth / 3) * index;
  const y = (value: number) => top + ((maxY - value) / (maxY - minY)) * usableHeight;

  return {
    x,
    y,
    points: (values: number[]) => values.map((value, index) => `${x(index)},${y(value)}`).join(" "),
  };
}
