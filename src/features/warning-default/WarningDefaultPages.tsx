import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  AlertTriangle,
  ArrowDownRight,
  Building2,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  FilePlus2,
  History,
  Landmark,
  ListFilter,
  PencilLine,
  Search,
  ShieldAlert,
  Target,
  UsersRound,
  X,
} from "lucide-react";
import { Link, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  customers,
  defaultAssets,
  filterDefaultCustomers,
  filterWarningCustomers,
  formatAmount,
  formatSignedAmount,
  getCustomer,
  getCustomerDefaultAssets,
  getCustomerWarningAssets,
  getDefaultAsset,
  getWarningAsset,
  memberFilterValues,
  memberFilterLabels,
  trackingRecord,
  trackingTimeline,
  WARNING_DATA_AS_OF,
  WARNING_THREE_MONTH_START,
  warningAssets,
  warningLevelStructure,
  warningOverview,
} from "./data";
import { DefaultTrendChart, WarningStructureChart } from "./WarningDefaultCharts";
import {
  ActionLink,
  AiFactNote,
  AmountValue,
  DetailRows,
  ExpandableText,
  RiskStatusTag,
  RouteLink,
  StatusPanel,
  Timeline,
  WarningScreen,
  WarningSection,
  WarningToast,
  WarningTopTabs,
} from "./WarningDefaultComponents";
import {
  CustomerFilterSheet,
  MetricDefinitionSheet,
  ProgressUpdateSheet,
  ReportAddSheet,
  TrackingSetupSheet,
} from "./WarningDefaultSheets";
import { readWarningDefaultSession, updateWarningDefaultSession } from "./sessionStore";
import type { CorporateCustomer, CustomerListFilter, DefaultAsset, MemberScope, TrackingFormValue, WarningAsset } from "./types";

export function WarningOverviewPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const period = searchParams.get("period") === "today" ? "today" : "month";
  const majorMetric = period === "month" ? warningOverview.monthlyMajorWarning : warningOverview.dailyMajorWarning;
  const defaultMetric = period === "month" ? warningOverview.monthlyDefault : warningOverview.dailyDefault;
  const definitionOpen = searchParams.get("sheet") === "metrics" || searchParams.get("sheet") === "definition";

  const closeDefinition = useCallback(() => {
    if ((location.state as { warningSheet?: boolean } | null)?.warningSheet) {
      navigate(-1);
      return;
    }
    const next = new URLSearchParams(searchParams);
    next.delete("sheet");
    setSearchParams(next, { replace: true, state: location.state });
  }, [location.state, navigate, searchParams, setSearchParams]);

  return (
    <WarningScreen title="信用风险" fallbackBackTo="/credit" className="warning-overview-page">
      <WarningTopTabs />

      <WarningSection
        title="新增风险规模"
        action={
          <div className="warning-period-switch" role="group" aria-label="统计周期">
            <button
              type="button"
              className={period === "today" ? "is-active" : undefined}
              aria-pressed={period === "today"}
              onClick={() => setSearchParams({ period: "today" }, { replace: true })}
            >
              本日
            </button>
            <button
              type="button"
              className={period === "month" ? "is-active" : undefined}
              aria-pressed={period === "month"}
              onClick={() => setSearchParams({}, { replace: true })}
            >
              本月
            </button>
          </div>
        }
      >
        <div className="warning-metric-grid">
          <RouteLink to="/credit/warning/prewarnings/customers" className="warning-primary-metric is-warning">
            <span className="warning-primary-metric__label">
              <AlertTriangle size={17} /> 新增重大预警
            </span>
            <AmountValue value={majorMetric.amountBillion.toFixed(2)} />
            <small>涉及 {majorMetric.customerCount} 户法人客户</small>
          </RouteLink>
          <RouteLink to={`/credit/warning/defaults/customers${period === "today" ? "?period=today" : ""}`} className="warning-primary-metric is-default">
            <span className="warning-primary-metric__label">
              <ShieldAlert size={17} /> 新增出险
            </span>
            <AmountValue value={defaultMetric.amountBillion.toFixed(2)} />
            <small>涉及 {defaultMetric.customerCount} 户法人客户</small>
          </RouteLink>
        </div>
        <div className="warning-data-scope">
          <span>数据截至 {WARNING_DATA_AS_OF}</span>
        </div>
      </WarningSection>

      <WarningSection title="存量风险">
        <div className="warning-stock-grid">
          <RouteLink to="/credit/warning/prewarnings" className="warning-stock-card">
            <span>预警资产</span>
            <AmountValue value={formatAmount(warningOverview.warningStock.amountBillion, 0)} />
            <small>{warningOverview.warningStock.customerCount} 户法人客户</small>
            <ChevronRight size={17} />
          </RouteLink>
          <RouteLink to="/credit/warning/defaults" className="warning-stock-card is-default">
            <span>出险资产</span>
            <AmountValue value={formatAmount(warningOverview.defaultStock.amountBillion, 0)} />
            <small>{warningOverview.defaultStock.customerCount} 户法人客户</small>
            <ChevronRight size={17} />
          </RouteLink>
        </div>
      </WarningSection>

      <WarningSection title="本月主要变化" meta="较上月末，单位：亿元">
        <div className="warning-level-grid">
          {warningLevelStructure.map((item) => (
            <article key={item.level} className={`warning-level-card is-${item.level}`}>
              <span>{item.label}</span>
              <strong>{formatAmount(item.amountBillion, 0)}</strong>
              <em>
                <ArrowDownRight size={14} /> {Math.abs(item.monthChangeBillion)} 亿元
              </em>
            </article>
          ))}
        </div>
      </WarningSection>

      <WarningSection
        title="预警资产结构"
        action={<ActionLink to="/credit/warning/prewarnings">进入预警资产</ActionLink>}
        className="warning-overview-structure"
      >
        <div className="warning-composition-card">
          <div className="warning-composition-bar" aria-label="重大预警占 34.77%，二级预警占 39.49%，一级预警占 25.74%">
            {warningLevelStructure.map((item) => (
              <i key={item.level} style={{ width: `${item.share}%`, background: item.color }} />
            ))}
          </div>
          <div className="warning-composition-legend">
            {warningLevelStructure.map((item) => (
              <div key={item.level}>
                <span>
                  <i style={{ background: item.color }} /> {item.label}
                </span>
                <strong>{item.share.toFixed(2)}%</strong>
              </div>
            ))}
          </div>
        </div>
      </WarningSection>

      <WarningSection
        title="本月新增重大预警"
        action={<ActionLink to="/credit/warning/prewarnings/customers">5 户 · 0.60 亿</ActionLink>}
      >
        <div className="warning-preview-list">
          {warningAssets.map((asset) => (
            <RiskPreviewCard key={asset.id} customer={customers[asset.customerId]} asset={asset} kind="warning" />
          ))}
        </div>
      </WarningSection>

      <WarningSection
        title="本月新增出险"
        action={<ActionLink to="/credit/warning/defaults/customers">7 户 · 0.83 亿</ActionLink>}
      >
        <div className="warning-preview-list">
          {defaultAssets.map((asset) => (
            <RiskPreviewCard key={asset.id} customer={customers[asset.customerId]} asset={asset} kind="default" />
          ))}
        </div>
      </WarningSection>

      <MetricDefinitionSheet open={definitionOpen} onClose={closeDefinition} />
    </WarningScreen>
  );
}

export function PrewarningAssetsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const member = readMemberScope(searchParams.get("member"));
  const memberOptions: MemberScope[] = ["集团汇总", "银行", "租赁", "寿险", "信托", "全部成员公司"];
  const setMember = (nextMember: MemberScope) => {
    const next = new URLSearchParams(searchParams);
    if (nextMember === "集团汇总") next.delete("member");
    else next.set("member", nextMember);
    setSearchParams(next, { replace: true });
  };

  return (
    <WarningScreen title="预警资产" fallbackBackTo="/credit/warning" className="warning-assets-page">
      <section className="warning-total-hero">
        <div className="warning-total-hero__heading">
          <span className={`warning-tag ${member === "集团汇总" ? "warning-tag--major" : "warning-tag--neutral"}`}>{member}</span>
          <small>数据截至 {WARNING_DATA_AS_OF}</small>
        </div>
        <div className="warning-total-hero__metrics">
          <div>
            <span>预警资产</span>
            {member === "集团汇总" ? <AmountValue value={formatAmount(warningOverview.warningStock.amountBillion, 0)} /> : <strong>—亿元</strong>}
          </div>
          <div>
            <span>预警客户</span>
            <strong>{member === "集团汇总" ? `${warningOverview.warningStock.customerCount} 户` : "—户"}</strong>
          </div>
        </div>
      </section>

      {member === "集团汇总" ? (
        <>
          <WarningSection title="预警等级结构" action={<ActionLink to="/credit/warning/prewarnings/migrations">较上月末</ActionLink>}>
            <div className="warning-level-grid">
              {warningLevelStructure.map((item) => (
                <RouteLink
                  key={item.level}
                  to={`/credit/warning/prewarnings/customers${item.level === "major" ? "" : `?level=${item.level}`}`}
                  className={`warning-level-card is-${item.level}`}
                  ariaLabel={`查看${item.label}客户`}
                >
                  <span>{item.label}</span>
                  <strong>{formatAmount(item.amountBillion, 0)}</strong>
                  <em>
                    <ArrowDownRight size={14} /> {Math.abs(item.monthChangeBillion)} 亿
                  </em>
                </RouteLink>
              ))}
            </div>
          </WarningSection>

          <WarningSection
            title="近期结构"
            action={<ActionLink to="/credit/warning/prewarnings/migrations">查看迁移明细</ActionLink>}
            className="warning-chart-card warning-compare-section"
          >
            <WarningStructureChart />
          </WarningSection>
        </>
      ) : null}

      {member !== "集团汇总" ? (
        <StatusPanel
          state="empty"
          title={`当前演示未提供${member}分项数据`}
          description="成员公司筛选状态已生效；切回集团汇总可查看已确认指标。"
          onReset={() => setMember("集团汇总")}
          resetLabel="切回集团汇总"
        />
      ) : null}

      <WarningSection title="成员公司" action={<span className="warning-section-label">全部成员公司 ›</span>}>
        <div className="warning-chip-scroller" role="group" aria-label="成员公司">
          {memberOptions.map((option) => (
            <button key={option} type="button" className={member === option ? "is-active" : undefined} aria-pressed={member === option} onClick={() => setMember(option)}>
              {option}
            </button>
          ))}
        </div>
      </WarningSection>
    </WarningScreen>
  );
}

function readMemberScope(value: string | null): MemberScope {
  const options: MemberScope[] = ["集团汇总", "银行", "租赁", "寿险", "不动产", "信托", "全部成员公司"];
  return options.includes(value as MemberScope) ? (value as MemberScope) : "集团汇总";
}

export function WarningMigrationsPage() {
  const [member, setMember] = useState<MemberScope>("集团汇总");
  const [period, setPeriod] = useState("2026年6月");
  const [searchParams, setSearchParams] = useSearchParams();
  const sort = searchParams.get("sort") === "recent" ? "recent" : "amount";
  const sortedWarningAssets = useMemo(
    () =>
      [...warningAssets].sort((left, right) =>
        sort === "recent"
          ? right.warningDate.localeCompare(left.warningDate)
          : right.amountBillion - left.amountBillion,
      ),
    [sort],
  );
  const hasConfirmedMigrationData = period === "2026年6月" && member === "集团汇总";
  return (
    <WarningScreen title="预警迁移" fallbackBackTo="/credit/warning/prewarnings" className="warning-migrations-page">
      <div className="warning-select-row">
        <label>
          <span>统计期间</span>
          <select aria-label="统计期间" value={period} onChange={(event) => setPeriod(event.target.value)}>
            <option>2026年6月</option>
            <option>2026年5月</option>
          </select>
          <ChevronDown size={15} />
        </label>
        <label>
          <span>成员范围</span>
          <select aria-label="成员范围" value={member} onChange={(event) => setMember(event.target.value as MemberScope)}>
            {(["集团汇总", "银行", "租赁", "寿险", "全部成员公司"] as MemberScope[]).map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
          <ChevronDown size={15} />
        </label>
      </div>
      {hasConfirmedMigrationData ? (
        <>
          <WarningSection title="状态变化概览" action={<span className="warning-section-label">按资产状态归类</span>}>
            <div className="warning-flow-grid">
              <FlowCard label="本月进入重大预警" value="0.60 亿" detail="涉及 5 户法人客户" tone="warning" />
              <FlowCard label="本月新增出险" value="0.83 亿" detail="涉及 7 户法人客户" tone="danger" />
              <FlowCard label="重大预警净变化" value="-9 亿" detail="较上月末" tone="good" />
              <FlowCard label="全部预警净变化" value="-16 亿" detail="重大、二级、一级合计" tone="good" />
            </div>
          </WarningSection>

          <AiFactNote>迁移、出险和跟踪是不同状态。本页按资产状态归类，法人客户按统一主体去重。</AiFactNote>

          <WarningSection
            title="本月进入重大预警"
            action={
              <button
                type="button"
                className="warning-inline-action"
                aria-pressed={sort === "recent"}
                onClick={() => {
                  const next = new URLSearchParams(searchParams);
                  if (sort === "recent") next.delete("sort");
                  else next.set("sort", "recent");
                  setSearchParams(next, { replace: true });
                }}
              >
                {sort === "recent" ? "最新优先" : "规模优先"}
              </button>
            }
          >
            <div className="warning-preview-list">
              {sortedWarningAssets.map((asset) => (
                <RiskPreviewCard key={asset.id} customer={customers[asset.customerId]} asset={asset} kind="migration" />
              ))}
            </div>
            <p className="warning-sort-note" aria-live="polite">
              当前按{sort === "recent" ? "最近进入重大" : "规模从高到低"}排序；两条已确认事项在两种口径下顺序一致。
            </p>
          </WarningSection>
        </>
      ) : (
        <StatusPanel
          state="empty"
          title={period !== "2026年6月" ? `${period}迁移数据暂未提供` : `${member}迁移汇总暂未提供`}
          description={
            period !== "2026年6月"
              ? "当前参考资料只确认了 2026年6月数据；月份选择保持可用，但不补造其他月份的迁移明细。"
              : "可返回集团汇总，或在客户列表中查看已确认明细。"
          }
        />
      )}
    </WarningScreen>
  );
}

export function DefaultAssetsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const member = readMemberScope(searchParams.get("member"));
  const period = searchParams.get("period") === "today" ? "today" : "month";
  const newDefaultMetric = period === "today" ? warningOverview.dailyDefault : warningOverview.monthlyDefault;
  const comparisonMetric = period === "today" ? warningOverview.monthlyDefault : warningOverview.dailyDefault;
  const setMember = (nextMember: MemberScope) => {
    const next = new URLSearchParams(searchParams);
    if (nextMember === "集团汇总") next.delete("member");
    else next.set("member", nextMember);
    setSearchParams(next, { replace: true });
  };
  return (
    <WarningScreen title="出险资产" fallbackBackTo="/credit/warning" className="default-assets-page">
      <section className="warning-total-hero is-default">
        <div className="warning-total-hero__heading">
          <span className={`warning-tag ${member === "集团汇总" ? "warning-tag--major" : "warning-tag--neutral"}`}>{member}</span>
          <small>数据截至 {WARNING_DATA_AS_OF}</small>
        </div>
        <div className="warning-total-hero__metrics">
          <div>
            <span>出险资产</span>
            {member === "集团汇总" ? <AmountValue value={formatAmount(warningOverview.defaultStock.amountBillion, 0)} /> : <strong>—亿元</strong>}
          </div>
          <div>
            <span>出险客户</span>
            <strong>{member === "集团汇总" ? `${warningOverview.defaultStock.customerCount} 户` : "—户"}</strong>
          </div>
        </div>
      </section>

      {member === "集团汇总" ? (
        <>
          <WarningSection
            title="新增出险"
            action={
              <div className="warning-period-switch" role="group" aria-label="新增出险统计周期">
                <button
                  type="button"
                  className={period === "today" ? "is-active" : undefined}
                  aria-pressed={period === "today"}
                  onClick={() => setSearchParams({ period: "today" }, { replace: true })}
                >
                  本日
                </button>
                <button
                  type="button"
                  className={period === "month" ? "is-active" : undefined}
                  aria-pressed={period === "month"}
                  onClick={() => setSearchParams({}, { replace: true })}
                >
                  本月
                </button>
              </div>
            }
          >
            <div className="warning-metric-grid">
              <RouteLink to={`/credit/warning/defaults/customers${period === "today" ? "?period=today" : ""}`} className="warning-primary-metric is-default">
                <span className="warning-primary-metric__label">{period === "today" ? "本日新增" : "本月新增"}</span>
                <AmountValue value={newDefaultMetric.amountBillion.toFixed(2)} />
                <small>{newDefaultMetric.customerCount} 户法人客户</small>
              </RouteLink>
              <article className="warning-primary-metric is-comparison">
                <span className="warning-primary-metric__label">{period === "today" ? "本月新增" : "本日新增"}</span>
                <AmountValue value={comparisonMetric.amountBillion.toFixed(2)} />
                <small>{comparisonMetric.customerCount} 户法人客户</small>
              </article>
            </div>
          </WarningSection>
        </>
      ) : null}

      {member !== "集团汇总" ? (
        <StatusPanel
          state="empty"
          title={`当前演示未提供${member}分项数据`}
          description="成员公司筛选状态已生效；切回集团汇总可查看已确认指标。"
          onReset={() => setMember("集团汇总")}
          resetLabel="切回集团汇总"
        />
      ) : null}

      <WarningSection title="成员公司" action={<span className="warning-section-label">全部成员公司 ›</span>}>
        <div className="warning-chip-scroller" role="group" aria-label="成员公司">
          {(["集团汇总", "银行", "不动产", "信托", "全部成员公司"] as MemberScope[]).map((option) => (
            <button key={option} type="button" className={member === option ? "is-active" : undefined} aria-pressed={member === option} onClick={() => setMember(option)}>
              {option}
            </button>
          ))}
        </div>
      </WarningSection>

      {member === "集团汇总" ? (
        <WarningSection
          title="出险资产变化趋势"
          action={<span className="warning-section-label">趋势演示 ›</span>}
          className="warning-chart-card is-default warning-trend-section"
        >
          <div className="warning-trend-scope">
            <span>当前规模 2,967亿元</span>
            <span>历史序列为演示数据</span>
          </div>
          <DefaultTrendChart />
        </WarningSection>
      ) : null}

    </WarningScreen>
  );
}

function RiskPreviewCard({ customer, asset, kind }: { customer: CorporateCustomer; asset: WarningAsset | DefaultAsset; kind: "warning" | "default" | "migration" }) {
  const isDefault = "defaultDate" in asset;
  const date = isDefault ? asset.defaultDate : asset.warningDate;
  const to = `/credit/warning/customers/${customer.id}`;
  return (
    <RouteLink to={to} className={`warning-list-card${isDefault ? " is-default" : ""}`} ariaLabel={`查看${customer.name}风险详情`}>
      <div className="warning-list-card__top">
        <div>
          <h3>{customer.name}</h3>
          <p>{kind === "migration" ? `${asset.memberCompany} · ${date}` : `所属集团：${customer.groupName}`}</p>
        </div>
        <AmountValue value={asset.amountBillion.toFixed(2)} compact />
      </div>
      <div className="warning-list-card__meta">
        {kind === "migration" ? <span className="warning-tag warning-tag--major">进入重大预警</span> : <RiskStatusTag level={!isDefault ? asset.warningLevel : undefined} defaultStatus={isDefault ? asset.defaultStatus : undefined} />}
        {kind !== "migration" ? <span className="warning-tag warning-tag--neutral">{asset.memberCompany}</span> : null}
        <span>
          <CalendarDays size={12} /> {date}
        </span>
      </div>
      {kind === "migration" ? <small className="warning-list-card__group">所属集团：{customer.groupName}</small> : null}
    </RouteLink>
  );
}

function FlowCard({ label, value, detail, tone }: { label: string; value: string; detail: string; tone: "warning" | "danger" | "good" }) {
  return (
    <article className={`warning-flow-card is-${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </article>
  );
}

type WarningTimelineItem = {
  date: string;
  title: string;
  detail: string;
  tone?: "danger" | "warning" | "neutral";
};

function CollapsibleTimelineSection({
  items,
  title = "状态记录",
  label = "全部",
  expandedNote,
}: {
  items: WarningTimelineItem[];
  title?: string;
  label?: string;
  expandedNote?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const collapsedCount = Math.min(2, items.length);
  const canExpand = items.length > collapsedCount || Boolean(expandedNote);
  const visibleItems = expanded ? items : items.slice(0, collapsedCount);

  return (
    <WarningSection
      title={title}
      action={
        canExpand ? (
          <button
            type="button"
            className="warning-inline-action"
            aria-expanded={expanded}
            onClick={() => setExpanded((current) => !current)}
          >
            {expanded ? "收起" : `${label} · ${items.length} 条`}
          </button>
        ) : (
          <span className="warning-section-label">{label} · {items.length} 条</span>
        )
      }
    >
      <div className="warning-timeline-card">
        <Timeline items={visibleItems} />
        {expanded && expandedNote ? <p className="warning-timeline-unavailable">{expandedNote}</p> : null}
      </div>
    </WarningSection>
  );
}

export function WarningCustomerListPage() {
  return <RiskCustomerListPage mode="warning" />;
}

export function DefaultCustomerListPage() {
  return <RiskCustomerListPage mode="default" />;
}

function RiskCustomerListPage({ mode }: { mode: "warning" | "default" }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const filters = readFilters(searchParams);
  const [searchDraft, setSearchDraft] = useState(filters.query);
  const warningLevel =
    mode === "warning" && (searchParams.get("level") === "level1" || searchParams.get("level") === "level2")
      ? (searchParams.get("level") as "level1" | "level2")
      : "major";
  const confirmedResults = mode === "warning" ? filterWarningCustomers(filters) : filterDefaultCustomers(filters);
  const results = mode === "warning" && warningLevel !== "major" ? [] : confirmedResults;
  const sheetOpen = searchParams.get("sheet") === "filter";
  const viewState = searchParams.get("state") ?? searchParams.get("view");
  const warningLevelLabel = warningLevel === "level2" ? "二级预警" : warningLevel === "level1" ? "一级预警" : "重大预警";
  const title = mode === "warning" ? `${warningLevelLabel}客户` : "出险客户";
  const fallback = mode === "warning" ? "/credit/warning/prewarnings" : "/credit/warning/defaults";
  const monthlyTotal = mode === "warning" ? warningOverview.monthlyMajorWarning : warningOverview.monthlyDefault;
  const hasAggregateNarrowing = Boolean(filters.query.trim()) || filters.member !== "all" || (mode === "default" && filters.category !== "all");
  const summaryMetric = hasAggregateNarrowing || warningLevel !== "major"
    ? null
    : filters.period === "today"
      ? mode === "warning"
        ? null
        : warningOverview.dailyDefault
      : filters.period === "custom"
        ? null
        : monthlyTotal;
  const periodLabel = filters.period === "today" ? "本日" : filters.period === "custom" ? "近3个月" : "本月";
  const activeFilterCount = Number(filters.member !== "all") + Number(filters.period !== "month") + Number(filters.sort !== "amount") + Number(mode === "default" && filters.category !== "all");
  const pendingFilterNavigation = useRef<{ params: URLSearchParams; state: { returnTo?: string } | null } | null>(null);

  const commitFilters = useCallback(
    (next: CustomerListFilter) => {
      const params = filtersToParams(next, mode === "warning" ? warningLevel : undefined);
      setSearchParams(params, { replace: true, state: location.state });
    },
    [location.state, mode, setSearchParams, warningLevel],
  );

  useEffect(() => {
    setSearchDraft(filters.query);
  }, [filters.query]);

  useEffect(() => {
    if (searchDraft === filters.query) return;
    const timer = window.setTimeout(() => {
      commitFilters({ ...filters, query: searchDraft });
    }, 250);
    return () => window.clearTimeout(timer);
  }, [
    commitFilters,
    filters.category,
    filters.dateFrom,
    filters.dateTo,
    filters.member,
    filters.period,
    filters.query,
    filters.sort,
    searchDraft,
  ]);

  const applyFilters = useCallback(
    (next: CustomerListFilter) => {
      const params = filtersToParams(next, mode === "warning" ? warningLevel : undefined);
      const marker = (location.state as { warningSheet?: boolean; returnTo?: string } | null)?.warningSheet;
      if (sheetOpen && marker) {
        const returnTo = (location.state as { returnTo?: string } | null)?.returnTo;
        pendingFilterNavigation.current = { params, state: returnTo ? { returnTo } : null };
        navigate(-1);
        return;
      }
      setSearchParams(params, { replace: true, state: location.state });
    },
    [location.state, mode, navigate, setSearchParams, sheetOpen, warningLevel],
  );

  useEffect(() => {
    const pending = pendingFilterNavigation.current;
    if (sheetOpen || !pending) return;
    pendingFilterNavigation.current = null;
    navigate(
      { pathname: location.pathname, search: pending.params.toString() ? `?${pending.params.toString()}` : "" },
      { replace: true, state: pending.state },
    );
  }, [location.pathname, navigate, sheetOpen]);

  const openFilter = () => {
    const next = filtersToParams({ ...filters, query: searchDraft }, mode === "warning" ? warningLevel : undefined);
    next.set("sheet", "filter");
    setSearchParams(next, { state: { ...(location.state ?? {}), warningSheet: true } });
  };
  const closeFilter = useCallback(() => {
    if ((location.state as { warningSheet?: boolean } | null)?.warningSheet) {
      navigate(-1);
      return;
    }
    const next = new URLSearchParams(searchParams);
    next.delete("sheet");
    setSearchParams(next, { replace: true, state: location.state });
  }, [location.state, navigate, searchParams, setSearchParams]);
  const resetFilters = useCallback(() => {
    const params = new URLSearchParams();
    if (mode === "warning" && warningLevel !== "major") params.set("level", warningLevel);
    setSearchParams(params, { replace: true, state: location.state });
  }, [location.state, mode, setSearchParams, warningLevel]);

  const currentFilters = searchDraft === filters.query ? filters : { ...filters, query: searchDraft };
  const searchInputId = `warning-${mode}-customer-search`;
  const appliedPeriodLabel = filters.period === "today"
    ? mode === "warning" ? "本日新增" : "本日"
    : filters.period === "custom"
      ? "近3个月"
      : mode === "warning" ? "本月新增" : "本月";
  const appliedCategoryLabel = filters.category === "all"
    ? "全部类别"
    : filters.category === "overdue"
      ? "逾期（本息实质逾期）"
      : "其他";

  return (
    <WarningScreen title={title} fallbackBackTo={fallback} className="warning-customer-list-page">
      <section className={`warning-list-summary${mode === "default" ? " is-default" : ""}`}>
        <div>
          <span>{periodLabel}{mode === "warning" ? "新增重大预警规模" : "新增出险规模"}</span>
          <AmountValue value={summaryMetric ? summaryMetric.amountBillion.toFixed(2) : "—"} />
        </div>
        <div>
          <span>法人客户</span>
          <strong>{summaryMetric ? `${summaryMetric.customerCount} 户` : "—"}</strong>
        </div>
      </section>
      <div className="warning-search-row">
        <div className="warning-search-box">
          <Search size={17} />
          <label className="sr-only" htmlFor={searchInputId}>搜索客户</label>
          <input
            id={searchInputId}
            type="search"
            value={searchDraft}
            placeholder="搜索客户或所属集团"
            onChange={(event) => setSearchDraft(event.target.value)}
          />
          {searchDraft ? (
            <button
              type="button"
              className="warning-search-clear"
              aria-label="清除搜索"
              onClick={() => {
                setSearchDraft("");
                commitFilters({ ...filters, query: "" });
              }}
            >
              <X size={16} />
            </button>
          ) : null}
        </div>
        <button
          type="button"
          className={activeFilterCount ? "is-active" : undefined}
          aria-label={`筛选${activeFilterCount ? `，已选 ${activeFilterCount} 项` : ""}`}
          aria-haspopup="dialog"
          aria-expanded={sheetOpen}
          onClick={openFilter}
        >
          <ListFilter size={18} />
          {activeFilterCount ? <em>{activeFilterCount}</em> : null}
        </button>
      </div>

      <div className="warning-active-chips" aria-label="快捷筛选">
        <button type="button" className="is-active" aria-haspopup="dialog" aria-expanded={sheetOpen} onClick={openFilter}>
          {appliedPeriodLabel}
        </button>
        <button
          type="button"
          className={filters.member !== "all" ? "is-active" : undefined}
          aria-haspopup="dialog"
          aria-expanded={sheetOpen}
          onClick={openFilter}
        >
          {memberFilterLabels[filters.member]}
        </button>
        {mode === "default" ? (
          <button
            type="button"
            className={filters.category !== "all" ? "is-active" : undefined}
            aria-haspopup="dialog"
            aria-expanded={sheetOpen}
            onClick={openFilter}
          >
            {appliedCategoryLabel}
          </button>
        ) : null}
        <button
          type="button"
          className={filters.sort !== "amount" ? "is-active" : undefined}
          aria-haspopup="dialog"
          aria-expanded={sheetOpen}
          onClick={openFilter}
        >
          {filters.sort === "amount" ? "规模从高到低" : "按最近时间"}
        </button>
      </div>

      {viewState === "loading" ? (
        <StatusPanel state="loading" />
      ) : viewState === "error" ? (
        <StatusPanel
          state="error"
          title="列表加载失败"
          description="请检查当前网络后重试。本状态用于验证错误处理。"
          onRetry={() => {
            const next = new URLSearchParams(searchParams);
            next.delete("view");
            next.delete("state");
            setSearchParams(next, { replace: true });
          }}
        />
      ) : viewState === "empty" ? (
        <StatusPanel state="empty" />
      ) : mode === "default" && filters.period === "today" && !hasAggregateNarrowing && results.length === 0 ? (
        <StatusPanel
          state="no-results"
          title="本日汇总有 1 户，明细暂未提供"
          description="已确认本日新增出险 0.05 亿元、1 户；参考资料未提供可核对的客户与资产字段，因此不补造明细。"
          onReset={() => commitFilters({ ...filters, period: "month" })}
          resetLabel="查看本月明细"
        />
      ) : mode === "warning" && warningLevel !== "major" ? (
        <StatusPanel
          state="empty"
          title={`${warningLevelLabel}客户明细暂未提供`}
          description={`已确认${warningLevelLabel}的存量规模与占比，但参考资料未提供可核对的法人客户和资产字段，因此不补造明细。`}
        />
      ) : results.length === 0 ? (
        <StatusPanel state="no-results" onReset={resetFilters} />
      ) : (
        <>
          <div className="warning-preview-list">
            {results.map(({ customer, asset }) => (
              <RiskPreviewCard key={asset.id} customer={customer} asset={asset} kind={mode} />
            ))}
          </div>
          <div className="warning-list-scope">
            <span>当前演示展示 {results.length} 户</span>
            <strong>汇总口径 {summaryMetric?.customerCount ?? "—"} 户</strong>
          </div>
        </>
      )}

      <CustomerFilterSheet
        open={sheetOpen}
        mode={mode}
        value={currentFilters}
        onClose={closeFilter}
        onApply={applyFilters}
      />
    </WarningScreen>
  );
}

function readFilters(params: URLSearchParams): CustomerListFilter {
  const memberValues = memberFilterValues.map((item) => item.value);
  const memberAliases: Record<string, CustomerListFilter["member"]> = {
    全部成员公司: "all",
    全部: "all",
    医保科技: "health-tech",
    租赁: "leasing",
    银行: "bank",
    不动产: "real-estate",
    信托: "trust",
  };
  const rawMember = params.get("member");
  const member = rawMember && memberAliases[rawMember]
    ? memberAliases[rawMember]
    : memberValues.includes(rawMember as CustomerListFilter["member"])
      ? (rawMember as CustomerListFilter["member"])
      : "all";
  const periodValue = params.get("period");
  const period: CustomerListFilter["period"] = periodValue === "today" || periodValue === "custom" ? periodValue : "month";
  const sort: CustomerListFilter["sort"] = params.get("sort") === "recent" ? "recent" : "amount";
  const categoryValue = params.get("category");
  const category: CustomerListFilter["category"] = categoryValue === "overdue" || categoryValue === "other" ? categoryValue : "all";
  const [dateFrom, dateTo] = normalizeFilterDates(params.get("from"), params.get("to"), period);
  return { query: params.get("q") ?? "", member, period, dateFrom, dateTo, sort, category };
}

function normalizeFilterDates(
  rawFrom: string | null,
  rawTo: string | null,
  period: CustomerListFilter["period"],
): [string, string] {
  const startOfMonth = "2026-06-01";
  const isDate = (value: string | null): value is string => Boolean(value && /^\d{4}-\d{2}-\d{2}$/.test(value));
  const clamp = (value: string, minimum: string, maximum: string) => (value < minimum ? minimum : value > maximum ? maximum : value);
  const fallbackFrom = period === "custom" ? WARNING_THREE_MONTH_START : startOfMonth;
  const from = clamp(isDate(rawFrom) ? rawFrom : fallbackFrom, WARNING_THREE_MONTH_START, WARNING_DATA_AS_OF);
  const to = clamp(isDate(rawTo) ? rawTo : WARNING_DATA_AS_OF, WARNING_THREE_MONTH_START, WARNING_DATA_AS_OF);
  return from <= to ? [from, to] : [to, from];
}

function filtersToParams(filters: CustomerListFilter, warningLevel?: "major" | "level1" | "level2") {
  const params = new URLSearchParams();
  if (warningLevel && warningLevel !== "major") params.set("level", warningLevel);
  if (filters.query.trim()) params.set("q", filters.query);
  if (filters.member !== "all") params.set("member", filters.member);
  if (filters.period !== "month") params.set("period", filters.period);
  if (filters.period === "custom") {
    params.set("from", filters.dateFrom);
    params.set("to", filters.dateTo);
  }
  if (filters.sort !== "amount") params.set("sort", filters.sort);
  if (filters.category !== "all") params.set("category", filters.category);
  return params;
}

export function WarningCustomerDetailPage() {
  const { customerId = "" } = useParams();
  const customer = getCustomer(customerId);
  const warningItems = getCustomerWarningAssets(customerId);
  const defaultItems = getCustomerDefaultAssets(customerId);

  if (!customer) {
    return (
      <WarningScreen title="客户风险概览" fallbackBackTo="/credit/warning">
        <StatusPanel state="error" title="未找到该客户" description="客户可能已被移除，或当前链接不再有效。" />
      </WarningScreen>
    );
  }

  const isDefault = customer.defaultStatus === "defaulted";
  const totalAmount = (isDefault ? defaultItems : warningItems).reduce((sum, item) => sum + item.amountBillion, 0);
  const primaryDate = isDefault ? defaultItems[0]?.defaultDate : warningItems[0]?.warningDate;
  const fallback = isDefault ? "/credit/warning/defaults/customers" : "/credit/warning/prewarnings/customers";

  return (
    <WarningScreen title="客户风险概览" fallbackBackTo={fallback} className={`warning-customer-detail-page${isDefault ? " is-default" : ""}`}>
      <section className="warning-customer-hero">
        <div className="warning-customer-hero__status">
          <RiskStatusTag level={customer.currentRiskLevel} defaultStatus={customer.defaultStatus} />
          {primaryDate ? <span>{primaryDate} {isDefault ? "出险" : "进入"}</span> : null}
        </div>
        <h2>{customer.name}</h2>
        <p>所属集团：{customer.groupName}</p>
        <div className="warning-customer-hero__stats">
          <div>
            <span>{isDefault ? "出险资产" : "重大预警资产"}</span>
            <AmountValue value={totalAmount.toFixed(2)} compact />
          </div>
          <div>
            <span>成员公司</span>
            <strong>{customer.memberCompany}</strong>
          </div>
        </div>
      </section>

      {isDefault ? <DefaultCustomerContent assets={defaultItems} /> : <WarningCustomerContent customer={customer} assets={warningItems} />}
    </WarningScreen>
  );
}

function WarningCustomerContent({ customer, assets }: { customer: CorporateCustomer; assets: WarningAsset[] }) {
  const session = readWarningDefaultSession();
  const trackedAssetIds = new Set([...(session.trackedAssetIds ?? []), ...Object.keys(session.trackedAssetValues ?? {})]);
  return (
    <>
      <WarningSection title="风险资产" meta={`${assets.length} 笔`}>
        <div className="warning-asset-list">
          {assets.map((asset) => (
            <article key={asset.id} className="warning-asset-card">
              <header>
                <div>
                  <h3>{asset.productName}</h3>
                  <p>项目 / 产品名称与法人客户同名</p>
                </div>
                <RiskStatusTag level={asset.warningLevel} />
              </header>
              <div className="warning-asset-card__metrics">
                <div>
                  <span>风险规模</span>
                  <strong>{asset.amountBillion.toFixed(2)} 亿</strong>
                </div>
                <div>
                  <span>成员公司</span>
                  <strong>{asset.memberCompany}</strong>
                </div>
                <div>
                  <span>预警日期</span>
                  <strong>{asset.warningDate}</strong>
                </div>
              </div>
              <div className="warning-button-row">
                <RouteLink to={`/credit/warning/assets/${asset.id}?sheet=tracking`} className="ghost-button">
                  {trackedAssetIds.has(asset.id) ? "更新跟踪" : "加入跟踪"}
                </RouteLink>
                <RouteLink to={`/credit/warning/assets/${asset.id}`} className="primary-button">
                  查看资产详情
                </RouteLink>
              </div>
            </article>
          ))}
        </div>
      </WarningSection>

      <CollapsibleTimelineSection
        items={assets.flatMap((asset) =>
          asset.transitions.map((item) => ({ date: item.date, title: item.title, detail: item.detail, tone: "warning" as const })),
        )}
        expandedNote="当前资料仅提供已确认的进入预警记录，此前迁移历史暂未提供。"
      />

    </>
  );
}

function DefaultCustomerContent({ assets }: { assets: DefaultAsset[] }) {
  const first = assets[0];
  if (!first) return <StatusPanel state="empty" title="暂无出险资产明细" />;
  const session = readWarningDefaultSession();
  const trackingCreated =
    first.id === "guangxi-baise-047"
      ? Boolean(session.trackingValue)
      : Boolean(session.trackedAssetValues?.[first.id] ?? session.trackedAssetIds?.includes(first.id));
  return (
    <>
      <WarningSection title="风险判断">
        <div className="warning-fact-card">
          <DetailRows
            rows={[
              { label: "风险结论", value: <strong className="is-danger">已出险</strong> },
              { label: "出险类别", value: first.defaultCategory ?? <span className="is-muted">未提供</span> },
              { label: "出险原因", value: first.defaultReason ?? <span className="is-muted">未提供</span>, wide: true },
              { label: "影响规模", value: `${first.amountBillion.toFixed(2)}亿元` },
              { label: "关键日期", value: <>到期 {first.maturityDate ?? "未提供"}<br />出险 {first.defaultDate}</> },
            ]}
          />
        </div>
      </WarningSection>

      <WarningSection title="出险资产" meta={`${assets.length} 笔`}>
        <div className="warning-asset-list">
          {assets.map((asset) => (
            <article key={asset.id} className="warning-asset-card is-default">
              <header>
                <div>
                  <h3>{asset.projectName}</h3>
                  <p>{asset.businessType ?? "业务类型未提供"} · {asset.fundingSource ?? "资金来源未提供"}</p>
                </div>
                <RiskStatusTag defaultStatus={asset.defaultStatus} />
              </header>
              <div className="warning-asset-card__metrics">
                <div>
                  <span>出险规模</span>
                  <strong>{asset.amountBillion.toFixed(2)} 亿</strong>
                </div>
                <div>
                  <span>到期日</span>
                  <strong>{asset.maturityDate ?? "未提供"}</strong>
                </div>
                <div>
                  <span>出险日期</span>
                  <strong>{asset.defaultDate}</strong>
                </div>
              </div>
              <div className="warning-button-row">
                {trackingCreated && asset.id === "guangxi-baise-047" ? (
                  <RouteLink to="/watch/tracking/guangxi-baise-default" className="ghost-button">
                    查看跟踪
                  </RouteLink>
                ) : (
                  <RouteLink to={`/credit/warning/assets/${asset.id}?sheet=tracking`} className="ghost-button">
                    {trackingCreated ? "更新跟踪" : "加入跟踪"}
                  </RouteLink>
                )}
                <RouteLink to={`/credit/warning/assets/${asset.id}`} className="primary-button">
                  查看资产详情
                </RouteLink>
              </div>
            </article>
          ))}
        </div>
      </WarningSection>
    </>
  );
}

export function WarningAssetDetailPage() {
  const { assetId = "" } = useParams();
  const warningAsset = getWarningAsset(assetId);
  const defaultAsset = getDefaultAsset(assetId);

  if (warningAsset) return <PrewarningAssetDetail asset={warningAsset} />;
  if (defaultAsset) return <DefaultAssetDetail asset={defaultAsset} />;

  return (
    <WarningScreen title="风险资产详情" fallbackBackTo="/credit/warning">
      <StatusPanel state="error" title="未找到该风险资产" description="资产可能已被移除，或当前链接不再有效。" />
    </WarningScreen>
  );
}

function PrewarningAssetDetail({ asset }: { asset: WarningAsset }) {
  const customer = customers[asset.customerId];
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [toast, setToast] = useState<string | null>(null);
  const [trackingValue, setTrackingValue] = useState<TrackingFormValue | undefined>(() => readWarningDefaultSession().trackedAssetValues?.[asset.id]);
  const [trackingCreated, setTrackingCreated] = useState(() => {
    const session = readWarningDefaultSession();
    return Boolean(session.trackedAssetValues?.[asset.id] ?? session.trackedAssetIds?.includes(asset.id));
  });
  const [reportValue, setReportValue] = useState(() => readWarningDefaultSession().reportAssetValues?.[asset.id]);
  const [reportPrepared, setReportPrepared] = useState(() => {
    const session = readWarningDefaultSession();
    return Boolean(session.reportAssetValues?.[asset.id] ?? session.reportAssetIds?.includes(asset.id));
  });
  const trackingOpen = searchParams.get("sheet") === "tracking";
  const reportOpen = searchParams.get("sheet") === "report";
  const simulateFailure = searchParams.get("simulate") === "tracking-error";
  const simulateReportFailure = searchParams.get("simulate") === "report-error";
  const closeSheet = useCallback(() => {
    if ((location.state as { warningSheet?: boolean } | null)?.warningSheet) {
      navigate(-1);
      return;
    }
    const next = new URLSearchParams(searchParams);
    next.delete("sheet");
    setSearchParams(next, { replace: true, state: location.state });
  }, [location.state, navigate, searchParams, setSearchParams]);

  const openSheet = (sheet: "tracking" | "report") => {
    const next = new URLSearchParams(searchParams);
    next.set("sheet", sheet);
    setSearchParams(next, { state: { ...(location.state ?? {}), warningSheet: true } });
  };

  return (
    <WarningScreen title="预警资产详情" fallbackBackTo={`/credit/warning/customers/${customer.id}`} className="warning-asset-detail-page">
      <section className="warning-asset-hero">
        <div className="warning-asset-hero__status">
          <RiskStatusTag level={asset.warningLevel} />
          <span>预警日期 {asset.warningDate}</span>
        </div>
        <span>重大预警规模</span>
        <AmountValue value={asset.amountBillion.toFixed(2)} />
        <h2>{customer.name}</h2>
      </section>

      <WarningSection title="风险事实">
        <div className="warning-fact-card">
          <DetailRows
            rows={[
              { label: "当前状态", value: <RiskStatusTag level={asset.warningLevel} /> },
              { label: "预警日期", value: asset.warningDate },
              { label: "成员公司", value: asset.memberCompany },
              { label: "所属集团", value: customer.groupName },
              {
                label: "预警原因",
                value: asset.triggerReason ? <ExpandableText text={asset.triggerReason} /> : <span className="is-muted">暂无可用触发原因明细</span>,
                wide: true,
              },
            ]}
          />
        </div>
      </WarningSection>

      <CollapsibleTimelineSection
        items={asset.transitions.map((item) => ({ date: item.date, title: item.title, detail: item.detail, tone: "warning" }))}
        label="完整记录"
        expandedNote="此前迁移记录：当前未提供"
      />

      <div className="warning-button-row is-sticky-safe">
        <button
          type="button"
          className="ghost-button"
          onClick={() => openSheet("report")}
        >
          <FilePlus2 size={16} /> {reportPrepared ? "更新报告草稿" : "加入风险报告"}
        </button>
        <button type="button" className="primary-button" onClick={() => openSheet("tracking")}>
          <Target size={16} /> {trackingCreated ? "更新重点跟踪" : "加入重点跟踪"}
        </button>
      </div>

      <TrackingSetupSheet
        open={trackingOpen}
        subject={`${customer.name}重大预警事项`}
        memberCompany={asset.memberCompany}
        initialValue={trackingValue}
        simulateFailure={simulateFailure}
        onClose={closeSheet}
        onSubmit={(value) => {
          const session = readWarningDefaultSession();
          updateWarningDefaultSession({
            trackedAssetIds: Array.from(new Set([...(session.trackedAssetIds ?? []), asset.id])),
            trackedAssetValues: { ...(session.trackedAssetValues ?? {}), [asset.id]: value },
          });
          setTrackingValue(value);
          setTrackingCreated(true);
          closeSheet();
          setToast(trackingCreated ? "重点跟踪设置已更新" : "重点跟踪任务已创建");
        }}
      />
      <ReportAddSheet
        open={reportOpen}
        subject={`${customer.name}重大预警事项`}
        summary={`${asset.amountBillion.toFixed(2)} 亿元，${asset.warningDate} 进入重大预警；触发原因明细当前未提供。`}
        kind="warning"
        initialValue={reportValue}
        simulateFailure={simulateReportFailure}
        onClose={closeSheet}
        onSubmit={(value) => {
          const session = readWarningDefaultSession();
          updateWarningDefaultSession({
            reportAssetIds: Array.from(new Set([...(session.reportAssetIds ?? []), asset.id])),
            reportAssetValues: { ...(session.reportAssetValues ?? {}), [asset.id]: value },
          });
          setReportValue(value);
          setReportPrepared(true);
          closeSheet();
          setToast(reportPrepared ? "报告草稿已更新" : "报告内容已准备");
        }}
      />
      <WarningToast message={toast} onDismiss={() => setToast(null)} />
    </WarningScreen>
  );
}

function DefaultAssetDetail({ asset }: { asset: DefaultAsset }) {
  const customer = customers[asset.customerId];
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [toast, setToast] = useState<string | null>(null);
  const fullFieldsRef = useRef<HTMLElement>(null);
  const hasConfirmedTrackingRecord = asset.id === "guangxi-baise-047";
  const [trackingValue, setTrackingValue] = useState<TrackingFormValue | undefined>(() => {
    const session = readWarningDefaultSession();
    return hasConfirmedTrackingRecord ? session.trackingValue : session.trackedAssetValues?.[asset.id];
  });
  const [trackingCreated, setTrackingCreated] = useState(() => {
    const session = readWarningDefaultSession();
    return hasConfirmedTrackingRecord
      ? Boolean(session.trackingValue)
      : Boolean(session.trackedAssetValues?.[asset.id] ?? session.trackedAssetIds?.includes(asset.id));
  });
  const sheetOpen = searchParams.get("sheet") === "tracking";
  const simulateFailure = searchParams.get("simulate") === "tracking-error";
  const closeSheet = useCallback(() => {
    if ((location.state as { warningSheet?: boolean } | null)?.warningSheet) {
      navigate(-1);
      return;
    }
    const next = new URLSearchParams(searchParams);
    next.delete("sheet");
    setSearchParams(next, { replace: true, state: location.state });
  }, [location.state, navigate, searchParams, setSearchParams]);
  const openTracking = () => {
    const next = new URLSearchParams(searchParams);
    next.set("sheet", "tracking");
    setSearchParams(next, { state: { ...(location.state ?? {}), warningSheet: true } });
  };
  const timelineItems = [
    ...(asset.disbursementDate
      ? [{ date: asset.disbursementDate, title: "放款", detail: `${asset.businessType ?? "相关"}业务开始。`, tone: "neutral" as const }]
      : []),
    ...(asset.maturityDate ? [{ date: asset.maturityDate, title: "资产到期", detail: "合同到期日。", tone: "warning" as const }] : []),
    {
      date: asset.defaultDate,
      title: "出险认定",
      detail: `${asset.defaultReason ?? "出险原因未提供"}，出险规模 ${asset.amountBillion.toFixed(2)} 亿元。`,
      tone: "danger" as const,
    },
  ];

  return (
    <WarningScreen title="出险资产详情" fallbackBackTo={`/credit/warning/customers/${customer.id}`} className="warning-asset-detail-page is-default">
      <section className="warning-asset-hero is-default">
        <div className="warning-asset-hero__status">
          <RiskStatusTag defaultStatus={asset.defaultStatus} />
          <span>出险日期 {asset.defaultDate}</span>
        </div>
        <span>出险资产规模</span>
        <AmountValue value={asset.amountBillion.toFixed(2)} />
        <h2>{customer.name}</h2>
      </section>

      <WarningSection title="关键风险事实">
        <div className="warning-fact-card">
          <DetailRows
            rows={[
              { label: "出险类别", value: asset.defaultCategory ? `${asset.defaultCategory}（${asset.defaultReason ?? "原因未提供"}）` : <span className="is-muted">未提供</span>, wide: true },
              {
                label: "逾期时长",
                value:
                  asset.overdueDaysAtRecognition === null ? (
                    <span className="is-muted">未提供</span>
                  ) : (
                    <span className="warning-derived-value">
                      {asset.overdueDaysAtRecognition} 天
                      <span className="provenance-tag provenance-tag--derived">派生数据</span>
                    </span>
                  ),
              },
              { label: "出险日期", value: asset.defaultDate },
              { label: "到期日", value: asset.maturityDate ?? <span className="is-muted">未提供</span> },
              { label: "数据口径", value: "按出险认定日计算" },
            ]}
          />
        </div>
      </WarningSection>

      <WarningSection title="业务信息" action={<span className="warning-section-label">资产级</span>}>
        <div className="warning-fact-card">
          <DetailRows
            rows={[
              { label: "成员公司", value: asset.memberCompany },
              { label: "业务类型", value: asset.businessType ?? <span className="is-muted">未提供</span> },
              { label: "出险规模", value: `${asset.amountBillion.toFixed(2)} 亿元` },
              { label: "项目 / 产品", value: asset.projectName, wide: true },
              { label: "资金来源", value: asset.fundingSource ?? <span className="is-muted">未提供</span> },
            ]}
          />
        </div>
      </WarningSection>

      <div className="warning-button-row">
        {trackingCreated && hasConfirmedTrackingRecord ? (
          <RouteLink to="/watch/tracking/guangxi-baise-default" className="ghost-button">
            <Target size={16} /> 查看重点跟踪
          </RouteLink>
        ) : (
          <button type="button" className="ghost-button" onClick={openTracking}>
            <Target size={16} /> {trackingCreated ? "更新重点跟踪" : "加入重点跟踪"}
          </button>
        )}
        <button
          type="button"
          className="primary-button"
          onClick={() => {
            const target = fullFieldsRef.current;
            if (!target) return;
            const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
            target.focus({ preventScroll: true });
          }}
        >
          <ListFilter size={16} /> 查看完整字段
        </button>
      </div>

      <WarningSection title="完整业务字段" action={<span className="warning-section-label">资产事实</span>}>
        <section ref={fullFieldsRef} className="warning-full-fields" tabIndex={-1}>
          <DetailRows
            rows={[
              { label: "投资组合", value: asset.portfolio ?? "—" },
              { label: "放款日", value: asset.disbursementDate ?? <span className="is-muted">未提供</span> },
              { label: "到期日", value: asset.maturityDate ?? <span className="is-muted">未提供</span> },
              {
                label: "担保方名称",
                value:
                  asset.guarantors.length > 0 ? (
                    <ul className="warning-guarantor-list">
                      {asset.guarantors.map((guarantor) => (
                        <li key={guarantor}>{guarantor}</li>
                      ))}
                    </ul>
                  ) : (
                    "未提供"
                  ),
                wide: true,
              },
              { label: "出险类别", value: asset.defaultCategory ?? <span className="is-muted">未提供</span> },
              { label: "出险原因", value: asset.defaultReason ? <ExpandableText text={asset.defaultReason} /> : <span className="is-muted">未提供</span> },
              { label: "出险日期", value: asset.defaultDate },
              { label: "出险规模", value: <strong className="is-danger">{asset.amountBillion.toFixed(2)} 亿元</strong> },
            ]}
          />
        </section>
      </WarningSection>

      <WarningSection title="关键时间线" action={<span className="warning-section-label">按时间</span>}>
        <div className="warning-timeline-card">
          <Timeline items={timelineItems} />
        </div>
      </WarningSection>

      <div className="warning-button-row is-sticky-safe">
        {hasConfirmedTrackingRecord ? (
          <RouteLink to="/watch/tracking/guangxi-baise-default?sheet=report" className="ghost-button">
            <FilePlus2 size={16} /> 加入风险报告
          </RouteLink>
        ) : (
          <button type="button" className="ghost-button" disabled title="该演示资产暂无可关联的跟踪记录">
            <FilePlus2 size={16} /> 加入风险报告
          </button>
        )}
        {trackingCreated && hasConfirmedTrackingRecord ? (
          <RouteLink to="/watch/tracking/guangxi-baise-default" className="primary-button">
            <Target size={16} /> 查看重点跟踪
          </RouteLink>
        ) : (
          <button type="button" className="primary-button" onClick={openTracking}>
            <Target size={16} /> {trackingCreated ? "更新重点跟踪" : "加入重点跟踪"}
          </button>
        )}
      </div>

      <TrackingSetupSheet
        open={sheetOpen}
        subject={`${customer.name}出险事项`}
        memberCompany={asset.memberCompany}
        initialValue={trackingValue}
        simulateFailure={simulateFailure}
        onClose={closeSheet}
        onSubmit={(value) => {
          if (hasConfirmedTrackingRecord) {
            updateWarningDefaultSession({ trackingValue: value });
            navigate("/watch/tracking/guangxi-baise-default", {
              replace: true,
              state: {
                returnTo: `${location.pathname}${location.search.replace(/([?&])sheet=tracking(&|$)/, "$1").replace(/[?&]$/, "")}`,
                justCreated: true,
                trackingValue: value,
              },
            });
            return;
          }
          const session = readWarningDefaultSession();
          updateWarningDefaultSession({
            trackedAssetIds: Array.from(new Set([...(session.trackedAssetIds ?? []), asset.id])),
            trackedAssetValues: { ...(session.trackedAssetValues ?? {}), [asset.id]: value },
          });
          setTrackingValue(value);
          setTrackingCreated(true);
          closeSheet();
          setToast(trackingCreated ? "重点跟踪设置已更新" : "重点跟踪任务已创建");
        }}
      />
      <WarningToast message={toast} onDismiss={() => setToast(null)} />
    </WarningScreen>
  );
}

export function WarningTrackingDetailPage() {
  const { trackingId = trackingRecord.id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigationState = location.state as { justCreated?: boolean; trackingValue?: TrackingFormValue; warningSheet?: boolean } | null;
  const persistedSession = useMemo(() => readWarningDefaultSession(), []);
  const [toast, setToast] = useState<string | null>(() => (navigationState?.justCreated ? "已加入重点跟踪" : null));
  const [reportValue, setReportValue] = useState(() => persistedSession.reportDraft);
  const [reportPrepared, setReportPrepared] = useState(() => Boolean(persistedSession.reportPrepared ?? persistedSession.reportDraft));
  const effectiveTracking = {
    owner: navigationState?.trackingValue?.owner ?? persistedSession.trackingValue?.owner ?? trackingRecord.owner,
    dueDate: navigationState?.trackingValue?.dueDate ?? persistedSession.trackingValue?.dueDate ?? trackingRecord.dueDate,
    cadence: navigationState?.trackingValue?.cadence ?? persistedSession.trackingValue?.cadence ?? trackingRecord.cadence,
  };
  const [latestProgress, setLatestProgress] = useState(
    () =>
      persistedSession.latestProgress ?? {
        title: trackingRecord.latestUpdateTitle,
        detail: trackingRecord.latestUpdateDetail,
        date: trackingRecord.latestUpdateDate,
      },
  );
  const [records, setRecords] = useState<Array<{ date: string; title: string; detail: string; tone: "danger" | "warning" | "neutral" }>>(() =>
    persistedSession.progressRecords ?? trackingTimeline.map((item) => ({ date: item.shortDate, title: item.title, detail: item.detail, tone: item.tone })),
  );
  const reportOpen = searchParams.get("sheet") === "report";
  const updateOpen = searchParams.get("sheet") === "progress" || searchParams.get("sheet") === "update";
  const simulateReportFailure = searchParams.get("simulate") === "report-error";

  const closeSheet = useCallback(() => {
    if ((location.state as { warningSheet?: boolean } | null)?.warningSheet) {
      navigate(-1);
      return;
    }
    const next = new URLSearchParams(searchParams);
    next.delete("sheet");
    setSearchParams(next, { replace: true, state: location.state });
  }, [location.state, navigate, searchParams, setSearchParams]);

  const openSheet = (sheet: "progress" | "report") => {
    const next = new URLSearchParams(searchParams);
    next.set("sheet", sheet);
    setSearchParams(next, { state: { ...(location.state ?? {}), warningSheet: true } });
  };

  if (trackingId !== trackingRecord.id) {
    return (
      <WarningScreen title="重点跟踪" fallbackBackTo="/watch/tracking" showAsk={false}>
        <StatusPanel state="error" title="未找到该跟踪事项" />
      </WarningScreen>
    );
  }

  return (
    <WarningScreen title="重点跟踪" fallbackBackTo="/credit/warning/assets/guangxi-baise-047" className="warning-tracking-page" showAsk={false}>
      <section className="warning-tracking-hero">
        <header>
          <div>
            <RiskStatusTag defaultStatus={trackingRecord.riskStatus} />
            <RiskStatusTag trackingStatus={trackingRecord.status} />
          </div>
          <span className="provenance-tag provenance-tag--demo">演示数据</span>
        </header>
        <h2>{trackingRecord.title}</h2>
        <p>关联资产：0.47 亿元 · {trackingRecord.ownerCompany}</p>
        <div className="warning-tracking-meta">
          <div>
            <span>责任人</span>
            <strong>{effectiveTracking.owner}</strong>
          </div>
          <div>
            <span>截止日期</span>
            <strong>{effectiveTracking.dueDate}</strong>
          </div>
          <div>
            <span>跟踪频率</span>
            <strong>{effectiveTracking.cadence}</strong>
          </div>
          <div>
            <span>最近更新</span>
            <strong>{latestProgress.date}</strong>
          </div>
        </div>
      </section>

      <WarningSection
        title="最新进展"
        action={
          <button
            type="button"
            className="warning-inline-action"
            onClick={() => openSheet("progress")}
          >
            <PencilLine size={15} /> 更新
          </button>
        }
      >
        <article className="warning-progress-card">
          <h3>{latestProgress.title}</h3>
          <p>{latestProgress.detail}</p>
          <small>演示进展 · {latestProgress.date}</small>
        </article>
      </WarningSection>

      <CollapsibleTimelineSection items={records} title="跟踪记录" label="完整记录" />

      <div className="warning-button-row is-sticky-safe">
        <RouteLink to="/credit/warning/assets/guangxi-baise-047" className="ghost-button">
          查看原资产
        </RouteLink>
        <button
          type="button"
          className="primary-button"
          onClick={() => openSheet("report")}
        >
          <FilePlus2 size={16} /> {reportPrepared ? "更新报告草稿" : "加入风险报告"}
        </button>
      </div>

      <ProgressUpdateSheet
        open={updateOpen}
        onClose={closeSheet}
        onSubmit={(detail) => {
          const nextProgress = { title: "已更新跟踪进展", detail, date: WARNING_DATA_AS_OF };
          const nextRecords = [{ date: WARNING_DATA_AS_OF, title: "更新进展", detail, tone: "warning" as const }, ...records];
          setLatestProgress(nextProgress);
          setRecords(nextRecords);
          updateWarningDefaultSession({ latestProgress: nextProgress, progressRecords: nextRecords });
          closeSheet();
          setToast("跟踪进展已保存");
        }}
      />
      <ReportAddSheet
        open={reportOpen}
        subject={trackingRecord.title}
        summary="广西百色试验区发展集团有限公司0.47亿元非标投资资产于2026-06-01因本息实质逾期出险。"
        initialValue={reportValue}
        simulateFailure={simulateReportFailure}
        onClose={closeSheet}
        onSubmit={(value) => {
          updateWarningDefaultSession({ reportDraft: value, reportPrepared: true });
          setReportValue(value);
          setReportPrepared(true);
          closeSheet();
          setToast(reportPrepared ? "报告草稿已更新" : "报告内容已准备");
        }}
      />
      <WarningToast message={toast} onDismiss={() => setToast(null)} />
    </WarningScreen>
  );
}
