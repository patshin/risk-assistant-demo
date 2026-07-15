import { useMemo, useRef, type KeyboardEvent } from "react";
import {
  ArrowUpRight,
  ChartNoAxesCombined,
  ChevronRight,
  CircleHelp,
  Database,
  Lightbulb,
  Sparkles,
} from "lucide-react";
import { SectionTitle } from "../SectionTitle";
import {
  ciiViewOrder,
  formatNumber,
  type CiiMetricData,
  type CiiTrendPoint,
  type CiiViewData,
  type CiiViewId,
} from "../../data/investmentRisk";

const viewLabels: Record<CiiViewId, string> = {
  group: "集团",
  life: "寿险",
  property: "产险",
  pension: "养老险",
  health: "健康险",
};

export function CiiViewTabs({ activeView, onChange }: { activeView: CiiViewId; onChange: (view: CiiViewId) => void }) {
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex: number | null = null;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % ciiViewOrder.length;
    if (event.key === "ArrowLeft") nextIndex = (index - 1 + ciiViewOrder.length) % ciiViewOrder.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = ciiViewOrder.length - 1;
    if (nextIndex === null) return;
    event.preventDefault();
    const nextView = ciiViewOrder[nextIndex];
    tabRefs.current[nextIndex]?.focus();
    onChange(nextView);
  };

  return (
    <div className="cii-view-tabs" role="tablist" aria-label="收益分析视角">
      {ciiViewOrder.map((view, index) => (
        <button
          ref={(node) => { tabRefs.current[index] = node; }}
          id={`cii-view-tab-${view}`}
          key={view}
          type="button"
          role="tab"
          aria-selected={activeView === view}
          aria-controls="cii-performance-panel"
          tabIndex={activeView === view ? 0 : -1}
          className={activeView === view ? "is-active" : ""}
          onClick={() => onChange(view)}
          onKeyDown={(event) => handleKeyDown(event, index)}
        >
          {viewLabels[view]}
        </button>
      ))}
    </div>
  );
}

export function CiiOverview({ data }: { data: CiiViewData }) {
  const metrics = [data.annualAmount, data.annualRate, data.monthlyAmount, data.monthlyRate];
  return (
    <section className="cii-overview" aria-labelledby="cii-overview-title">
      <article className="cii-overview__hero">
        <div className="cii-overview__hero-copy">
          <span id="cii-overview-title">年 CII 收益率 <CircleHelp size={16} aria-label="按当前 CII 复核口径统计" /></span>
          <strong>{formatCiiValue(data.annualRate)}</strong>
          <CiiMetricDelta metric={data.annualRate} favorable />
        </div>
        <div className="cii-overview__visual" aria-hidden="true">
          <i /><i /><i /><i />
          <ChartNoAxesCombined size={30} />
        </div>
      </article>

      <div className="cii-overview__grid">
        {metrics.map((metric) => <CiiMetricCard key={metric.id} metric={metric} />)}
      </div>
    </section>
  );
}

function CiiMetricCard({ metric }: { metric: CiiMetricData }) {
  return (
    <article className="cii-metric-card">
      <span>{metric.label}</span>
      <strong>{formatCiiValue(metric)}</strong>
      <CiiMetricDelta metric={metric} favorable={metric.id.endsWith("annualRate")} />
    </article>
  );
}

function CiiMetricDelta({ metric, favorable = false }: { metric: CiiMetricData; favorable?: boolean }) {
  if (metric.deltaValue === null) return <small className="cii-metric-delta is-missing">暂无复核数据</small>;
  const positive = metric.deltaValue > 0;
  return (
    <small className={`cii-metric-delta${favorable && positive ? " is-good" : ""}`}>
      {positive ? <ArrowUpRight size={14} /> : null}
      {metric.comparisonLabel} <b>{positive ? "+" : ""}{formatNumber(metric.deltaValue)}{metric.deltaUnit}</b>
    </small>
  );
}

function formatCiiValue(metric: CiiMetricData) {
  if (metric.value === null) return "—";
  const precision = metric.unit === "%" ? 2 : 0;
  return <>{formatNumber(metric.value, precision)}<em>{metric.unit}</em></>;
}

export function CiiAttention({ data, onOpen }: { data: CiiViewData; onOpen?: () => void }) {
  return (
    <section className={`cii-attention${data.id === "group" ? " is-group" : ""}`} aria-labelledby="cii-attention-title">
      <div className="cii-attention__icon"><Lightbulb size={22} /></div>
      <div>
        <span>本月需关注</span>
        <h2 id="cii-attention-title">{data.attentionTitle}</h2>
        <p>{data.attentionBody}</p>
      </div>
      {onOpen ? <button type="button" aria-label="查看月度收益变化" onClick={onOpen}><ChevronRight size={19} /></button> : null}
    </section>
  );
}

export type CiiRankingRow = { view: Exclude<CiiViewId, "group">; label: string; value: number | null };

export function CiiAnnualRanking({ rows, onSelect }: { rows: CiiRankingRow[]; onSelect: (view: CiiRankingRow["view"]) => void }) {
  const maximum = Math.max(...rows.map((row) => row.value ?? 0), 1);
  return (
    <section className="cii-performance-section" aria-labelledby="cii-ranking-title">
      <SectionTitle title="成员年 CII 收益率排名" />
      <div className="cii-ranking-card">
        {rows.map((row, index) => (
          <button key={row.view} type="button" onClick={() => onSelect(row.view)}>
            <span className="cii-ranking-card__rank">{index + 1}</span>
            <span className="cii-ranking-card__body">
              <span><b>{row.label}</b><strong>{row.value === null ? "—" : `${formatNumber(row.value, 2)}%`}</strong></span>
              <i><em style={{ width: `${row.value === null ? 0 : Math.max(6, row.value / maximum * 100)}%` }} /></i>
            </span>
            <ChevronRight size={17} />
          </button>
        ))}
      </div>
      <p className="cii-performance-note">排名仅覆盖四家险资；其他成员没有 CII 口径数据，不按 0 计入。</p>
    </section>
  );
}

export function CiiGroupComparison({
  current,
  group,
  annualDifferenceBp,
  monthlyDifferenceBp,
}: {
  current: CiiViewData;
  group: CiiViewData;
  annualDifferenceBp: number | null;
  monthlyDifferenceBp: number | null;
}) {
  return (
    <section className="cii-performance-section" aria-labelledby="cii-comparison-title">
      <SectionTitle title="与集团对比" />
      <div className="cii-comparison-card">
        <CiiComparisonRow label="年 CII 收益率" current={current.annualRate.value} group={group.annualRate.value} differenceBp={annualDifferenceBp} currentLabel={current.label} />
        <CiiComparisonRow label="月 CII 收益率" current={current.monthlyRate.value} group={group.monthlyRate.value} differenceBp={monthlyDifferenceBp} currentLabel={current.label} />
      </div>
    </section>
  );
}

function CiiComparisonRow({
  label,
  current,
  group,
  differenceBp,
  currentLabel,
}: {
  label: string;
  current: number | null;
  group: number | null;
  differenceBp: number | null;
  currentLabel: string;
}) {
  const maximum = Math.max(Math.abs(current ?? 0), Math.abs(group ?? 0), 1);
  return (
    <article className="cii-comparison-row">
      <header><strong>{label}</strong><span>{differenceBp === null ? "差异暂无复核数据" : `${differenceBp >= 0 ? "高于" : "低于"}集团 ${formatNumber(Math.abs(differenceBp))}bp`}</span></header>
      <div className="cii-comparison-row__bar is-current"><span>{currentLabel}</span><i><em style={{ width: `${current === null ? 0 : Math.max(5, Math.abs(current) / maximum * 100)}%` }} /></i><strong>{current === null ? "—" : `${formatNumber(current, 2)}%`}</strong></div>
      <div className="cii-comparison-row__bar is-group"><span>集团</span><i><em style={{ width: `${group === null ? 0 : Math.max(5, Math.abs(group) / maximum * 100)}%` }} /></i><strong>{group === null ? "—" : `${formatNumber(group, 2)}%`}</strong></div>
    </article>
  );
}

type ChartPoint = { x: number; y: number; value: number; period: string };

function createSegments(points: Array<ChartPoint | null>) {
  const segments: ChartPoint[][] = [];
  let current: ChartPoint[] = [];
  points.forEach((point) => {
    if (point) current.push(point);
    if (!point && current.length) {
      segments.push(current);
      current = [];
    }
  });
  if (current.length) segments.push(current);
  return segments;
}

export function CiiMonthlyTrend({ data, view }: { data: CiiTrendPoint[]; view: CiiViewData }) {
  const chart = useMemo(() => {
    const valid = data.flatMap((point) => view.id === "group"
      ? [point.currentValue]
      : [point.currentValue, point.groupValue]).filter((value): value is number => value !== null);
    if (!valid.length) return null;
    const width = 340;
    const height = 200;
    const left = 30;
    const right = 14;
    const top = 30;
    const bottom = 42;
    const rawMin = Math.min(0, ...valid);
    const rawMax = Math.max(0, ...valid);
    const spread = Math.max(rawMax - rawMin, 1);
    const min = rawMin - spread * 0.14;
    const max = rawMax + spread * 0.14;
    const x = (index: number) => data.length === 1 ? (left + width - right) / 2 : left + index * ((width - left - right) / (data.length - 1));
    const y = (value: number) => top + (max - value) / (max - min) * (height - top - bottom);
    const mapPoints = (key: "currentValue" | "groupValue") => data.map((point, index) => point[key] === null ? null : ({ x: x(index), y: y(point[key]), value: point[key], period: point.period }));
    return { width, height, top, bottom, zeroY: y(0), current: mapPoints("currentValue"), group: mapPoints("groupValue") };
  }, [data, view.id]);

  const hasCurrent = data.some((point) => point.currentValue !== null);
  const hasGroup = data.some((point) => point.groupValue !== null);
  const singlePoint = data.filter((point) => point.currentValue !== null || point.groupValue !== null).length === 1;

  return (
    <section className="cii-performance-section" aria-labelledby="cii-trend-title">
      <SectionTitle title="近 6 个月月 CII 收益率" />
      <div className="cii-trend-card">
        {!chart ? (
          <div className="cii-trend-empty"><ChartNoAxesCombined size={25} /><strong>暂无近 6 个月复核数据</strong><span>数据补齐后再展示趋势</span></div>
        ) : (
          <>
            <div className="cii-trend-card__legend">
              {view.id !== "group" ? <span className="is-current"><i />{view.label}</span> : null}
              <span className={view.id === "group" ? "is-current" : "is-group"}><i />集团</span>
              <em>单位：%</em>
            </div>
            <svg viewBox={`0 0 ${chart.width} ${chart.height}`} role="img" aria-label={`${view.label}近 6 个月月 CII 收益率趋势`}>
              <line className="cii-trend-zero" x1="30" x2="326" y1={chart.zeroY} y2={chart.zeroY} />
              {view.id !== "group" ? createSegments(chart.group).map((segment, index) => <polyline key={`group-${index}`} className="cii-trend-line is-group" points={segment.map((point) => `${point.x},${point.y}`).join(" ")} />) : null}
              {createSegments(chart.current).map((segment, index) => <polyline key={`current-${index}`} className="cii-trend-line is-current" points={segment.map((point) => `${point.x},${point.y}`).join(" ")} />)}
              {(hasCurrent ? chart.current : chart.group).map((point, index) => point ? (
                <g key={`${point.period}-${index}`}>
                  <circle className={hasCurrent ? "cii-trend-point is-current" : "cii-trend-point is-group"} cx={point.x} cy={point.y} r="3.5" />
                  <text className={hasCurrent ? "cii-trend-value is-current" : "cii-trend-value is-group"} x={point.x} y={point.y < chart.top + 12 ? point.y + 17 : point.y - 9}>{formatNumber(point.value, 2)}</text>
                </g>
              ) : null)}
              {data.map((point, index) => {
                const x = data.length === 1 ? 170 : 30 + index * (296 / (data.length - 1));
                return <text key={point.period} className="cii-trend-period" x={x} y={chart.height - 13}>{point.period}</text>;
              })}
            </svg>
            {!hasCurrent && hasGroup ? <p className="cii-trend-card__notice">当前成员公司暂无完整月度趋势，灰色虚线为集团基准。</p> : null}
            {hasCurrent && data.some((point) => point.currentValue === null) ? <p className="cii-trend-card__notice">部分月份暂无复核数据，折线缺口不按 0 补齐。</p> : null}
            {singlePoint ? <p className="cii-trend-card__notice">当前仅有 1 个月复核数据，暂不判断趋势。</p> : null}
          </>
        )}
      </div>
    </section>
  );
}

export function CiiManagementInsight({ data }: { data: CiiViewData }) {
  return (
    <section className="cii-management-card" aria-labelledby="cii-management-title">
      <header><span><Sparkles size={17} />AI</span><div><h2 id="cii-management-title">管理解读</h2><p>基于已复核指标生成，需由负责人确认</p></div></header>
      <div className="cii-management-card__block"><span>结论</span><p>{data.interpretation.conclusion}</p></div>
      <div className="cii-management-card__block"><span>证据</span><ul>{data.interpretation.evidence.map((item) => <li key={item}>{item}</li>)}</ul></div>
      <div className="cii-management-card__block"><span>不确定性</span><p>{data.interpretation.uncertainty}</p></div>
      <div className="cii-management-card__block is-action"><span>管理动作</span><p>{data.interpretation.action}</p></div>
    </section>
  );
}

export function CiiDataMeta({ data }: { data: CiiViewData }) {
  return (
    <footer className="cii-data-meta">
      <span><Database size={13} />数据来源：{data.sourceLabel}</span>
      <span>更新于 {data.updatedAt}</span>
    </footer>
  );
}
