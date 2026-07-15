import { useId, useMemo, useState } from "react";
import { ChevronDown, Sparkles } from "lucide-react";
import { formatNumber, type VarTrendPoint, type VarTrendSeriesKey } from "../../data/investmentRisk";

const seriesOptions: Array<{
  key: VarTrendSeriesKey;
  tabLabel: string;
  name: string;
  legend: string;
}> = [
  { key: "group", tabLabel: "集团", name: "集团 VaR", legend: "集团 VaR（实际）" },
  { key: "interestRate", tabLabel: "利率", name: "利率因子 VaR", legend: "利率因子 VaR" },
  { key: "equity", tabLabel: "权益", name: "权益因子 VaR", legend: "权益因子 VaR" },
  { key: "fx", tabLabel: "汇率", name: "汇率因子 VaR", legend: "汇率因子 VaR" },
];

const chartWidth = 320;
const chartHeight = 260;
const plotLeft = 34;
const plotRight = 8;
const plotTop = 25;
const plotBottom = 218;

function readableCeiling(value: number) {
  if (value <= 0) return 1;
  const padded = value * 1.05;
  const magnitude = 10 ** Math.floor(Math.log10(padded));
  const normalized = padded / magnitude;
  const step = [1, 1.2, 1.5, 2, 2.5, 5, 10].find((candidate) => candidate >= normalized) ?? 10;
  return step * magnitude;
}

function narrativePeriod(period: string) {
  return period.replace(/(\d+)月/, "$1 月");
}

function buildLimitInsight(data: VarTrendPoint[]) {
  const comparable = data.filter((point) => point.group !== null && point.groupLimit !== null);
  const latest = comparable.at(-1);
  if (!latest || latest.group === null || latest.groupLimit === null) {
    return "集团 VaR 与限额的对比暂无可用数据。";
  }

  const usage = latest.groupLimit > 0 ? latest.group / latest.groupLimit * 100 : null;
  const usageCopy = usage === null ? "" : `，限额使用率为 ${formatNumber(usage, 1)}%`;
  if (latest.group < latest.groupLimit) {
    const continuouslyBelow = comparable.length > 1 && comparable.every((point) => (point.group ?? 0) < (point.groupLimit ?? 0));
    const periodCopy = continuouslyBelow ? `近 ${comparable.length} 个月集团 VaR 均` : `${narrativePeriod(latest.period)}集团 VaR `;
    return `${periodCopy}低于 ${formatNumber(latest.groupLimit)} 亿元限额${usageCopy}。`;
  }
  if (latest.group > latest.groupLimit) {
    return `${narrativePeriod(latest.period)}集团 VaR 高于 ${formatNumber(latest.groupLimit)} 亿元限额${usageCopy}。`;
  }
  return `${narrativePeriod(latest.period)}集团 VaR 处于 ${formatNumber(latest.groupLimit)} 亿元限额。`;
}

function buildSeriesInsight(data: VarTrendPoint[], series: VarTrendSeriesKey, seriesName: string) {
  const available = data.flatMap((point) => {
    const value = point[series];
    return value === null ? [] : [{ period: point.period, value }];
  });

  if (available.length === 0) {
    return `当前暂无${seriesName}趋势数据，空值不按 0 展示。`;
  }

  const latest = available.at(-1)!;
  if (available.length === 1) {
    return `${narrativePeriod(latest.period)}${seriesName}为 ${formatNumber(latest.value)} 亿元；当前仅有一期数据，暂不判断变化趋势。`;
  }

  const previous = available.at(-2)!;
  const delta = latest.value - previous.value;
  const movement = delta < 0 ? "降至" : delta > 0 ? "升至" : "为";
  const comparison = delta < 0
    ? `较 ${narrativePeriod(previous.period)}下降 ${formatNumber(Math.abs(delta))} 亿元`
    : delta > 0
      ? `较 ${narrativePeriod(previous.period)}上升 ${formatNumber(delta)} 亿元`
      : `与 ${narrativePeriod(previous.period)}持平`;
  return `${narrativePeriod(latest.period)}${seriesName} ${movement} ${formatNumber(latest.value)} 亿元，${comparison}。`;
}

export function VarTrendSection({
  data,
  defaultSeries = "group",
  periodLabel,
}: {
  data: VarTrendPoint[];
  defaultSeries?: VarTrendSeriesKey;
  periodLabel?: string;
}) {
  const [selectedSeries, setSelectedSeries] = useState<VarTrendSeriesKey>(defaultSeries);
  const [isInterpretationOpen, setIsInterpretationOpen] = useState(true);
  const id = useId().replace(/:/g, "");
  const panelId = `investment-var-trend-${id}`;
  const interpretationId = `investment-var-trend-ai-${id}`;
  const gradientId = `investment-var-bars-${id}`;
  const selectedOption = seriesOptions.find((option) => option.key === selectedSeries) ?? seriesOptions[0];

  const chart = useMemo(() => {
    const values = data.flatMap((point) => {
      const selectedValue = point[selectedSeries];
      return [selectedValue, point.groupLimit].filter((value): value is number => value !== null && value >= 0);
    });
    const maximum = readableCeiling(Math.max(...values, 1));
    const plotWidth = chartWidth - plotLeft - plotRight;
    const plotHeight = plotBottom - plotTop;
    const step = plotWidth / Math.max(data.length, 1);
    const xFor = (index: number) => plotLeft + step * (index + 0.5);
    const yFor = (value: number) => plotBottom - (value / maximum) * plotHeight;
    let limitPath = "";
    let segmentOpen = false;

    data.forEach((point, index) => {
      if (point.groupLimit === null) {
        segmentOpen = false;
        return;
      }
      const command = segmentOpen ? "L" : "M";
      limitPath += `${command}${xFor(index)} ${yFor(point.groupLimit)} `;
      segmentOpen = true;
    });

    return {
      maximum,
      step,
      xFor,
      yFor,
      limitPath: limitPath.trim(),
      ticks: [maximum, maximum / 2, 0],
    };
  }, [data, selectedSeries]);

  const insights = useMemo(
    () => [buildSeriesInsight(data, selectedSeries, selectedOption.name), buildLimitInsight(data)],
    [data, selectedOption.name, selectedSeries],
  );
  const ariaSummary = data.length === 0
    ? `${selectedOption.name}暂无趋势数据`
    : data.map((point) => `${point.period}${selectedOption.name}${point[selectedSeries] === null ? "无数据" : `${point[selectedSeries]}亿元`}，集团限额${point.groupLimit === null ? "无数据" : `${point.groupLimit}亿元`}`).join("；");

  return (
    <div className="investment-var-trend-stack">
      <div className="investment-surface-card investment-var-trend">
      <div className="investment-var-trend__tabs" role="tablist" aria-label="VaR 趋势指标">
        {seriesOptions.map((option) => (
          <button
            key={option.key}
            type="button"
            role="tab"
            aria-selected={selectedSeries === option.key}
            aria-controls={panelId}
            className={selectedSeries === option.key ? "is-active" : undefined}
            onClick={() => setSelectedSeries(option.key)}
          >
            {option.tabLabel}
          </button>
        ))}
      </div>

      <div className="investment-var-trend__meta">
        <div className="investment-var-trend__legend" aria-label="图例">
          <span><i className="investment-var-trend__bar-key" aria-hidden="true" />{selectedOption.legend}</span>
          <span><i className="investment-var-trend__limit-key" aria-hidden="true"><b /></i>集团 VaR 限额</span>
        </div>
        <span className="investment-var-trend__unit">单位：亿元</span>
      </div>

      <div id={panelId} className="investment-var-trend__panel" role="tabpanel">
        {data.length === 0 ? (
          <div className="investment-var-trend__empty">
            <strong>暂无趋势数据</strong>
            <span>当前期间暂无可用 VaR 数据</span>
          </div>
        ) : (
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} role="img" aria-label={ariaSummary}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#ff9b45" />
                <stop offset="1" stopColor="#ff6a00" />
              </linearGradient>
            </defs>

            {chart.ticks.map((tick) => {
              const y = chart.yFor(tick);
              return (
                <g key={tick}>
                  <line className="investment-var-trend__grid" x1={plotLeft} x2={chartWidth - plotRight} y1={y} y2={y} />
                  <text className="investment-var-trend__axis-label" x={plotLeft - 7} y={y + 3} textAnchor="end">{formatNumber(tick)}</text>
                </g>
              );
            })}

            {data.map((point, index) => {
              const value = point[selectedSeries];
              const x = chart.xFor(index);
              const barWidth = Math.min(27, chart.step * 0.52);
              const scaledHeight = value === null ? 0 : plotBottom - chart.yFor(Math.max(0, value));
              const barHeight = value === null ? 0 : value === 0 ? 2 : Math.max(5, scaledHeight);
              const barY = plotBottom - barHeight;

              return (
                <g key={point.period}>
                  {value === null ? (
                    <text className="investment-var-trend__value" x={x} y={plotBottom - 7} textAnchor="middle">—</text>
                  ) : (
                    <>
                      <rect className="investment-var-trend__bar" x={x - barWidth / 2} y={barY} width={barWidth} height={barHeight} rx="3" fill={`url(#${gradientId})`}>
                        <title>{point.period} {selectedOption.name} {formatNumber(value)} 亿元</title>
                      </rect>
                      <text className="investment-var-trend__value" x={x} y={Math.max(plotTop + 9, barY - 7)} textAnchor="middle">{formatNumber(value)}</text>
                    </>
                  )}
                  <text className="investment-var-trend__period" x={x} y={244} textAnchor="middle">{point.period}</text>
                </g>
              );
            })}

            {chart.limitPath ? <path className="investment-var-trend__limit-line" d={chart.limitPath} /> : null}
            {data.map((point, index) => point.groupLimit === null ? null : (
              <circle
                key={`limit-${point.period}`}
                className="investment-var-trend__limit-dot"
                cx={chart.xFor(index)}
                cy={chart.yFor(point.groupLimit)}
                r="3.5"
              >
                <title>{point.period} 集团 VaR 限额 {formatNumber(point.groupLimit)} 亿元</title>
              </circle>
            ))}
            {data.at(-1)?.groupLimit !== null && data.at(-1)?.groupLimit !== undefined ? (
              <text
                className="investment-var-trend__limit-value"
                x={chart.xFor(data.length - 1) - 8}
                y={Math.max(plotTop + 8, chart.yFor(data.at(-1)!.groupLimit!) - 8)}
                textAnchor="end"
              >
                {formatNumber(data.at(-1)!.groupLimit!)}
              </text>
            ) : null}
          </svg>
        )}
        {data.length === 1 ? <p className="investment-var-trend__data-note">当前仅有一期数据</p> : null}
        {data.length > 0 && data.every((point) => point[selectedSeries] === null) ? <p className="investment-var-trend__data-note">当前指标暂无趋势值，集团限额仍保留展示</p> : null}
      </div>

      </div>

      <section className="investment-var-trend-ai" aria-labelledby={`${interpretationId}-title`}>
        <button
          className="investment-var-trend-ai__header"
          type="button"
          aria-expanded={isInterpretationOpen}
          aria-controls={interpretationId}
          onClick={() => setIsInterpretationOpen((current) => !current)}
        >
          <span className="investment-var-trend-ai__title">
            <i aria-hidden="true"><Sparkles size={16} /></i>
            <strong id={`${interpretationId}-title`}>趋势解读（AI）</strong>
          </span>
          <ChevronDown className={isInterpretationOpen ? "is-open" : undefined} size={18} aria-hidden="true" />
        </button>
        <div id={interpretationId} className="investment-var-trend-ai__body" hidden={!isInterpretationOpen}>
          <ul>
            {insights.map((insight) => <li key={insight}>{insight}</li>)}
          </ul>
          <div className="investment-var-trend-ai__footer">
            <span>数据截至：{periodLabel ?? data.at(-1)?.period ?? "当前期间"}</span>
            <span>基于当前 VaR 口径</span>
          </div>
        </div>
      </section>
    </div>
  );
}
