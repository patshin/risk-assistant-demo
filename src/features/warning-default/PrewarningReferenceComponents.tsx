import { useMemo, type ReactNode } from "react";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Building2,
  ChevronRight,
  Landmark,
  ShieldAlert,
  UsersRound,
  WalletCards,
} from "lucide-react";
import {
  formatAmount,
  type PrewarningCorporateCustomer,
  type PrewarningMemberCompanyRecord,
  type PrewarningMigrationCustomer,
  type PrewarningMigrationRecord,
  type PrewarningMigrationStage,
  type PrewarningMonthlyStructureSnapshot,
  type PrewarningOverviewMetric,
  type PrewarningPeriodSnapshot,
  type PrewarningSelectorKey,
} from "./data";
import type { WarningLevelSnapshot } from "./types";

type Summary = {
  assetAmountBillion: number;
  customerCount: number;
};

const stageLabels: Record<PrewarningMigrationStage, string> = {
  level1: "一级",
  level2: "二级",
  major: "重大",
  defaulted: "出险",
};

const stageClassNames: Record<PrewarningMigrationStage, string> = {
  level1: "level1",
  level2: "level2",
  major: "major",
  defaulted: "defaulted",
};

const memberIconMap: Record<PrewarningMemberCompanyRecord["key"], ReactNode> = {
  bank: <Landmark aria-hidden="true" />,
  realEstate: <Building2 aria-hidden="true" />,
  assetManagement: <WalletCards aria-hidden="true" />,
  leasing: <WalletCards aria-hidden="true" />,
  insurance: <ShieldAlert aria-hidden="true" />,
  trust: <UsersRound aria-hidden="true" />,
  consumerFinance: <WalletCards aria-hidden="true" />,
  supplyChainFinance: <Building2 aria-hidden="true" />,
};

const WARNING_STRUCTURE_CHART = {
  width: 340,
  height: 254,
  plotLeft: 42,
  plotRight: 336,
  plotTop: 34,
  plotBottom: 222,
  yMax: 4000,
  barWidth: 30,
  barRadius: 7,
  dateBaseline: 246,
} as const;

const WARNING_STRUCTURE_TICKS = [0, 1000, 2000, 3000, 4000] as const;

function roundChartCoordinate(value: number) {
  return Math.round(value * 10) / 10;
}

function createWarningStructureLayout(periods: readonly PrewarningMonthlyStructureSnapshot[]) {
  const plotHeight = WARNING_STRUCTURE_CHART.plotBottom - WARNING_STRUCTURE_CHART.plotTop;
  const slotWidth = (WARNING_STRUCTURE_CHART.plotRight - WARNING_STRUCTURE_CHART.plotLeft) / periods.length;
  const bars = periods.map((period, index) => {
    const centerX = WARNING_STRUCTURE_CHART.plotLeft + slotWidth * (index + 0.5);
    const totalHeight = (period.totalAmountBillion / WARNING_STRUCTURE_CHART.yMax) * plotHeight;
    let cumulativeHeight = 0;
    const segments = period.levels.map((level) => {
      const height = (level.amountBillion / WARNING_STRUCTURE_CHART.yMax) * plotHeight;
      cumulativeHeight += height;
      return {
        ...level,
        height: roundChartCoordinate(height),
        y: roundChartCoordinate(WARNING_STRUCTURE_CHART.plotBottom - cumulativeHeight),
      };
    });

    return {
      ...period,
      centerX: roundChartCoordinate(centerX),
      x: roundChartCoordinate(centerX - WARNING_STRUCTURE_CHART.barWidth / 2),
      top: roundChartCoordinate(WARNING_STRUCTURE_CHART.plotBottom - totalHeight),
      height: roundChartCoordinate(totalHeight),
      labelY: roundChartCoordinate(WARNING_STRUCTURE_CHART.plotBottom - totalHeight - 9),
      segments,
    };
  });
  const latestLevels = periods[periods.length - 1]?.levels ?? [];
  const first = periods[0];
  const may = periods[periods.length - 2];
  const latest = periods[periods.length - 1];

  return {
    bars,
    legendLevels: [...latestLevels].reverse(),
    summary:
      first && may && latest
        ? `预警资产近六个月由${formatAmount(first.totalAmountBillion, 0)}亿元上升至5月末${formatAmount(may.totalAmountBillion, 0)}亿元，6月24日为${formatAmount(latest.totalAmountBillion, 0)}亿元。`
        : "预警资产近六个月结构图。",
  };
}

export function PrewarningScopeMeta({ asOf }: { asOf: string }) {
  return (
    <div className="prewarning-scope-meta" aria-label={`集团汇总，数据截至 ${asOf}`}>
      <strong>集团汇总</strong>
      <span>数据截至 {asOf}</span>
    </div>
  );
}

export function PrewarningSectionHeading({
  id,
  title,
  action,
}: {
  id?: string;
  title: string;
  action?: ReactNode;
}) {
  return (
    <header className="prewarning-section-heading">
      <h2 id={id}>{title}</h2>
      {action}
    </header>
  );
}

export function PrewarningSummaryCard({ summary }: { summary: Summary }) {
  return (
    <section className="prewarning-summary-card" aria-label="预警资产汇总">
      <div className="prewarning-summary-card__metric prewarning-summary-card__metric--asset">
        <span>预警资产</span>
        <p>
          <strong>{formatAmount(summary.assetAmountBillion, 0)}</strong>
          <em>亿元</em>
        </p>
      </div>
      <div className="prewarning-summary-card__metric">
        <span>预警客户</span>
        <p>
          <strong>{formatAmount(summary.customerCount, 0)}</strong>
          <em>户</em>
        </p>
      </div>
    </section>
  );
}

export function WarningGradeCards({ grades }: { grades: readonly WarningLevelSnapshot[] }) {
  return (
    <section aria-labelledby="prewarning-grades-title">
      <PrewarningSectionHeading id="prewarning-grades-title" title="预警等级结构" />
      <div className="prewarning-grade-grid">
        {grades.map((grade) => {
          const monthChange = formatAmount(Math.abs(grade.monthChangeBillion), 0);

          return (
            <article className={`prewarning-grade-card prewarning-grade-card--${grade.level}`} key={grade.level}>
              <span className="prewarning-grade-card__label">{grade.label}</span>
              <p className="prewarning-grade-card__amount">
                <strong>{formatAmount(grade.amountBillion, 0)}</strong>
                <em>亿元</em>
              </p>
              <p className="prewarning-grade-card__trend">
                <span className="sr-only">较上月末下降{monthChange}亿元</span>
                <span aria-hidden="true" className="prewarning-grade-card__trend-context">
                  较上月末
                </span>
                <span aria-hidden="true" className="prewarning-grade-card__trend-value">
                  <ArrowDownRight />
                  下降{monthChange}亿元
                </span>
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export function WarningStructureChart({
  periods,
  onOpenMigrations,
}: {
  periods: readonly PrewarningMonthlyStructureSnapshot[];
  onOpenMigrations: () => void;
}) {
  const chart = useMemo(() => createWarningStructureLayout(periods), [periods]);

  return (
    <section aria-labelledby="prewarning-structure-title">
      <PrewarningSectionHeading
        id="prewarning-structure-title"
        title="近期结构"
        action={
          <button className="prewarning-text-action" type="button" onClick={onOpenMigrations}>
            查看迁移明细
            <ChevronRight aria-hidden="true" />
          </button>
        }
      />
      <div className="prewarning-structure-card">
        <p className="prewarning-structure-card__unit">单位：亿元</p>
        <svg
          className="prewarning-chart"
          viewBox={`0 0 ${WARNING_STRUCTURE_CHART.width} ${WARNING_STRUCTURE_CHART.height}`}
          width={WARNING_STRUCTURE_CHART.width}
          height={WARNING_STRUCTURE_CHART.height}
          role="img"
          aria-labelledby="prewarning-chart-title prewarning-chart-description"
        >
          <title id="prewarning-chart-title">预警资产近六个月三级预警结构</title>
          <desc id="prewarning-chart-description">{chart.summary}</desc>
          <defs>
            {chart.bars.map((bar) => (
              <clipPath id={`prewarning-structure-bar-${bar.key}`} key={bar.key}>
                <rect
                  x={bar.x}
                  y={bar.top}
                  width={WARNING_STRUCTURE_CHART.barWidth}
                  height={bar.height}
                  rx={WARNING_STRUCTURE_CHART.barRadius}
                />
              </clipPath>
            ))}
          </defs>
          <g aria-hidden="true">
            {WARNING_STRUCTURE_TICKS.map((tick) => {
              const y = roundChartCoordinate(
                WARNING_STRUCTURE_CHART.plotBottom -
                  (tick / WARNING_STRUCTURE_CHART.yMax) *
                    (WARNING_STRUCTURE_CHART.plotBottom - WARNING_STRUCTURE_CHART.plotTop),
              );
              return (
                <g key={tick}>
                  <line
                    className={tick === 0 ? "prewarning-chart__axis" : "prewarning-chart__gridline"}
                    x1={WARNING_STRUCTURE_CHART.plotLeft}
                    x2={WARNING_STRUCTURE_CHART.plotRight}
                    y1={y}
                    y2={y}
                  />
                  <text className="prewarning-chart__tick-label" x={35} y={y} textAnchor="end" dominantBaseline="middle">
                    {formatAmount(tick, 0)}
                  </text>
                </g>
              );
            })}
          </g>
          {chart.bars.map((bar) => (
            <g key={bar.key}>
              <g clipPath={`url(#prewarning-structure-bar-${bar.key})`}>
                {bar.segments.map((segment) => (
                  <rect
                    className={`prewarning-chart__segment prewarning-chart__segment--${segment.level}`}
                    key={segment.level}
                    x={bar.x}
                    y={segment.y}
                    width={WARNING_STRUCTURE_CHART.barWidth}
                    height={segment.height}
                  >
                    <title>{`${bar.label} ${segment.label} ${formatAmount(segment.amountBillion, 0)}亿元`}</title>
                  </rect>
                ))}
              </g>
              <text className="prewarning-chart__total" x={bar.centerX} y={bar.labelY} textAnchor="middle">
                {formatAmount(bar.totalAmountBillion, 0)}
              </text>
              <text
                className="prewarning-chart__date"
                x={bar.centerX}
                y={WARNING_STRUCTURE_CHART.dateBaseline}
                textAnchor="middle"
              >
                {bar.label}
              </text>
            </g>
          ))}
        </svg>
        <WarningStructureLegend levels={chart.legendLevels} />
        <p className="sr-only">{chart.summary}</p>
      </div>
    </section>
  );
}

function WarningStructureLegend({
  levels,
}: {
  levels: ReadonlyArray<PrewarningMonthlyStructureSnapshot["levels"][number]>;
}) {
  return (
    <div className="prewarning-chart-legend" aria-label="图例：重大预警、二级预警、一级预警">
      {levels.map((level) => (
        <span key={level.level}>
          <i className={`prewarning-chart-legend__dot prewarning-chart-legend__dot--${level.level}`} aria-hidden="true" />
          {level.label}
        </span>
      ))}
    </div>
  );
}

export function MemberCompanySelector({
  options,
  selected,
  onSelect,
}: {
  options: ReadonlyArray<{ key: PrewarningSelectorKey; label: string }>;
  selected: PrewarningSelectorKey;
  onSelect: (key: PrewarningSelectorKey) => void;
}) {
  return (
    <section aria-labelledby="prewarning-member-title">
      <PrewarningSectionHeading id="prewarning-member-title" title="成员公司" />
      <div className="prewarning-member-chips" role="group" aria-label="成员公司筛选">
        {options.map((option) => (
          <button
            className={selected === option.key ? "is-active" : undefined}
            type="button"
            key={option.key}
            aria-pressed={selected === option.key}
            onClick={() => onSelect(option.key)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </section>
  );
}

export function TopMemberCompanies({ members }: { members: readonly PrewarningMemberCompanyRecord[] }) {
  return (
    <section aria-labelledby="top-member-companies-title">
      <PrewarningSectionHeading id="top-member-companies-title" title="重点成员公司" />
      <div className="prewarning-top-members">
        {members.map((member) => (
          <article className="prewarning-top-member-card" key={member.key}>
            <h3>{member.label}</h3>
            <dl>
              <div>
                <dt>预警资产</dt>
                <dd>{formatAmount(member.warningAssetBillion)}亿</dd>
              </div>
              <div>
                <dt>重大预警</dt>
                <dd>{formatAmount(member.majorWarningBillion ?? 0)}亿</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}

export function MemberCompanyTable({ members }: { members: readonly PrewarningMemberCompanyRecord[] }) {
  return (
    <section aria-labelledby="member-company-table-title">
      <PrewarningSectionHeading id="member-company-table-title" title="成员公司明细" />
      <div className="prewarning-member-table" role="table" aria-label="成员公司预警明细">
        <div className="prewarning-member-table__row prewarning-member-table__row--header" role="row">
          <span role="columnheader">成员公司</span>
          <span role="columnheader">预警资产<br />（亿元）</span>
          <span role="columnheader">预警客户<br />（户）</span>
          <span role="columnheader">较上月末</span>
        </div>
        {members.map((member) => (
          <div className="prewarning-member-table__row" role="row" key={member.key}>
            <span className="prewarning-member-table__name" role="cell">
              <i className={`prewarning-member-icon prewarning-member-icon--${member.iconTone}`}>{memberIconMap[member.key]}</i>
              <b>{member.label}</b>
            </span>
            <span role="cell">{formatAmount(member.warningAssetBillion)}</span>
            <span role="cell">{formatAmount(member.warningCustomerCount, 0)}</span>
            <span className={`prewarning-member-trend prewarning-member-trend--${member.trend}`} role="cell">
              {member.trend === "up" ? <ArrowUpRight aria-hidden="true" /> : <ArrowDownRight aria-hidden="true" />}
              {formatAmount(member.monthChangePercent)}%
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function MemberCompanyOverview({
  title,
  metrics,
}: {
  title: string;
  metrics: readonly PrewarningOverviewMetric[];
}) {
  return (
    <section aria-label={`${title}成员公司概览`}>
      <PrewarningSectionHeading title={`${title}成员公司概览`} />
      <div className="prewarning-leasing-overview">
        {metrics.map((metric) => (
          <article className={metric.tone ? `is-${metric.tone}` : undefined} key={metric.label}>
            <span>{metric.label}</span>
            <p>
              <strong>{metric.value}</strong>
              <em>{metric.unit}</em>
            </p>
            <small>{metric.note}</small>
          </article>
        ))}
      </div>
    </section>
  );
}

export function MemberCustomerList({
  title = "租赁客户列表",
  customers,
  onOpenCustomer,
}: {
  title?: string;
  customers: readonly PrewarningCorporateCustomer[];
  onOpenCustomer: (customerId: string) => void;
}) {
  return (
    <section aria-label={title}>
      <PrewarningSectionHeading title={title} />
      {customers.length > 0 ? (
        <div className="prewarning-customer-list">
          {customers.map((customer) => (
          <button className="prewarning-customer-row" type="button" key={customer.customerId} onClick={() => onOpenCustomer(customer.customerId)}>
            <span className={`prewarning-stage-tag prewarning-stage-tag--${customer.riskLevel}`}>{stageLabels[customer.riskLevel]}预警</span>
            <span className="prewarning-customer-row__body">
              <strong>{customer.name}</strong>
              <small>所属集团：{customer.groupName}</small>
              <span className="prewarning-customer-row__meta">
                <span>预警日期 {customer.warningDate}</span>
                <b>{formatAmount(customer.warningAmountBillion)}亿元</b>
              </span>
            </span>
            <ChevronRight aria-hidden="true" />
          </button>
          ))}
        </div>
      ) : (
        <div className="prewarning-customer-empty" role="status">
          <span><UsersRound aria-hidden="true" /></span>
          <strong>暂无已确认的客户明细</strong>
          <p>当前参考资料未提供该成员公司的客户级数据</p>
        </div>
      )}
    </section>
  );
}

export function MigrationSummaryCard({
  summary,
}: {
  summary: Summary & { monthChangeBillion: number; monthChangePercent: number };
}) {
  return (
    <section className="prewarning-migration-summary" aria-label="预警迁移汇总">
      <div>
        <span>预警资产</span>
        <p><strong>{formatAmount(summary.assetAmountBillion, 0)}</strong><em>亿元</em></p>
      </div>
      <div>
        <span>预警客户</span>
        <p><strong>{formatAmount(summary.customerCount, 0)}</strong><em>户</em></p>
      </div>
      <div className="prewarning-migration-summary__change">
        <span>较上月末</span>
        <p><strong>下降{formatAmount(Math.abs(summary.monthChangeBillion), 0)}亿元</strong></p>
        <small>{summary.monthChangePercent}%</small>
      </div>
    </section>
  );
}

export function MigrationOverview({ periods }: { periods: readonly PrewarningPeriodSnapshot[] }) {
  return (
    <section aria-labelledby="migration-overview-title">
      <PrewarningSectionHeading id="migration-overview-title" title="迁移总览" />
      <div className="prewarning-migration-overview">
        <div className="prewarning-migration-overview__periods">
          {periods.map((period, index) => (
            <div className="prewarning-migration-overview__period-wrap" key={period.key}>
              <article>
                <span>{period.label}</span>
                <p><strong>{formatAmount(period.totalAmountBillion, 0)}</strong><em>亿元</em></p>
                <small>{formatAmount(period.customerCount, 0)}户</small>
                <div className="prewarning-migration-overview__stack" aria-hidden="true">
                  {period.levels.map((level) => (
                    <i className={`is-${level.level}`} key={level.level} style={{ flexGrow: level.amountBillion }} />
                  ))}
                </div>
              </article>
              {index === 0 ? <ArrowRight className="prewarning-migration-overview__arrow" aria-label="迁移至" /> : null}
            </div>
          ))}
        </div>
        <div className="prewarning-migration-overview__legend" aria-label="图例">
          {periods[1].levels.map((level) => (
            <span key={level.level}><i className={`is-${level.level}`} />{level.label}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

export function MigrationStructureList({ migrations }: { migrations: readonly PrewarningMigrationRecord[] }) {
  return (
    <section aria-labelledby="migration-structure-title">
      <PrewarningSectionHeading id="migration-structure-title" title="迁移结构" />
      <div className="prewarning-migration-structure">
        {migrations.map((migration) => (
          <article key={migration.id}>
            <div className="prewarning-migration-route">
              <span className={`prewarning-stage-tag prewarning-stage-tag--${stageClassNames[migration.fromLevel]}`}>{stageLabels[migration.fromLevel]}</span>
              <ArrowRight aria-hidden="true" />
              <span className={`prewarning-stage-tag prewarning-stage-tag--${stageClassNames[migration.toLevel]}`}>{stageLabels[migration.toLevel]}</span>
            </div>
            <dl>
              <div><dt>迁移资产</dt><dd>{formatAmount(migration.amountBillion, 0)}亿元</dd></div>
              <div><dt>涉及客户</dt><dd>{formatAmount(migration.customerCount, 0)}户</dd></div>
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}

export function MigrationCustomerList({
  customers,
  onOpenCustomer,
}: {
  customers: readonly PrewarningMigrationCustomer[];
  onOpenCustomer: (customerId: string) => void;
}) {
  return (
    <section aria-labelledby="migration-customers-title">
      <PrewarningSectionHeading id="migration-customers-title" title="重点迁移客户" />
      <div className="prewarning-customer-list prewarning-migration-customers">
        {customers.map((customer) => (
          <button className="prewarning-customer-row" type="button" key={customer.customerId} onClick={() => onOpenCustomer(customer.customerId)}>
            <span className="prewarning-customer-row__body">
              <strong>{customer.name}</strong>
              <small>所属集团：{customer.groupName}</small>
              <span className="prewarning-customer-row__meta">
                <span className="prewarning-migration-customer__route">
                  {stageLabels[customer.fromLevel]} → {stageLabels[customer.toLevel]}
                  <i>{customer.migrationDate}</i>
                </span>
                <b>{formatAmount(customer.migrationAmountBillion)}亿元</b>
              </span>
            </span>
            <ChevronRight aria-hidden="true" />
          </button>
        ))}
      </div>
    </section>
  );
}
