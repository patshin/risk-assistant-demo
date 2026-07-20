import { useId, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { formatNumber, type VarTrendPoint, type VarTrendSeriesKey } from "../../data/investmentRisk";

type VarSeriesConfig = {
  tabLabel: string;
  metricLabel: string;
  showGroupLimit: boolean;
  interpretationSuffix?: string;
};

const varSeriesConfig = {
  group: { tabLabel: "集团", metricLabel: "集团 VaR", showGroupLimit: true },
  interestRate: { tabLabel: "利率", metricLabel: "利率 VaR", showGroupLimit: false, interpretationSuffix: "仍是主要风险因子" },
  equity: { tabLabel: "权益", metricLabel: "权益 VaR", showGroupLimit: false },
  fx: { tabLabel: "汇率", metricLabel: "汇率 VaR", showGroupLimit: false, interpretationSuffix: "整体敞口较小" },
} satisfies Record<VarTrendSeriesKey, VarSeriesConfig>;

const seriesKeys = Object.keys(varSeriesConfig) as VarTrendSeriesKey[];

const chartWidth = 328;
const chartHeight = 260;
const plotLeft = 42;
const plotRight = 8;
const plotTop = 35;
const plotBottom = 224;

function getNiceStep(maxValue: number) {
  if (maxValue <= 10) return 2;
  if (maxValue <= 50) return 10;
  if (maxValue <= 100) return 20;
  if (maxValue <= 300) return 50;
  if (maxValue <= 600) return 100;
  if (maxValue <= 1000) return 200;
  return Math.ceil(maxValue / 5 / 100) * 100;
}

function createNiceAxis(rawMax: number) {
  const step = getNiceStep(rawMax);
  const roundedMax = Math.ceil(rawMax / step) * step;
  const yMax = roundedMax <= rawMax ? roundedMax + step : roundedMax;
  return {
    step,
    yMax,
    ticks: Array.from({ length: Math.floor(yMax / step) + 1 }, (_, index) => index * step),
  };
}

function narrativePeriod(period: string) {
  return period.replace(/(\d+)月/, "$1 月");
}

function buildSeriesInsight(data: VarTrendPoint[], series: VarTrendSeriesKey, config: VarSeriesConfig) {
  const available = data.flatMap((point) => {
    const value = point[series];
    return value === null ? [] : [{ period: point.period, value }];
  });

  if (available.length === 0) {
    return `当前暂无 ${config.metricLabel} 趋势数据，空值不按 0 展示。`;
  }

  const latest = available.at(-1)!;
  if (available.length === 1) {
    return `${narrativePeriod(latest.period)}${config.metricLabel} 为 ${formatNumber(latest.value)} 亿元；当前仅有一期数据。`;
  }

  const previous = available.at(-2)!;
  const delta = latest.value - previous.value;
  const movement = delta < 0 ? "降至" : delta > 0 ? "升至" : "为";
  const comparison = delta < 0
    ? `较 ${narrativePeriod(previous.period)}下降 ${formatNumber(Math.abs(delta))} 亿元`
    : delta > 0
      ? `较 ${narrativePeriod(previous.period)}上升 ${formatNumber(delta)} 亿元`
      : `与 ${narrativePeriod(previous.period)}持平`;
  const suffix = config.interpretationSuffix ? `，${config.interpretationSuffix}` : "";

  if (series !== "group") {
    return `${narrativePeriod(latest.period)}${config.metricLabel} ${movement} ${formatNumber(latest.value)} 亿元，${comparison}${suffix}。`;
  }

  const latestPoint = [...data].reverse().find((point) => point.group !== null);
  const limit = latestPoint?.groupLimit ?? null;
  if (limit === null) {
    return `${narrativePeriod(latest.period)}${config.metricLabel} ${movement} ${formatNumber(latest.value)} 亿元，${comparison}；集团 VaR 限额未配置。`;
  }

  const comparable = data.filter((point) => point.group !== null && point.groupLimit !== null);
  const continuouslyBelow = comparable.length > 1 && comparable.every((point) => point.group! < point.groupLimit!);
  const limitComparison = latest.value < limit
    ? continuouslyBelow ? "持续低于集团限额" : "低于集团限额"
    : latest.value > limit ? "高于集团限额" : "处于集团限额";
  return `${narrativePeriod(latest.period)}${config.metricLabel} ${movement} ${formatNumber(latest.value)} 亿元，${comparison}，${limitComparison}。`;
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
  const selectedConfig = varSeriesConfig[selectedSeries];
  const showGroupLimit = selectedConfig.showGroupLimit;
  const hasSeriesData = data.some((point) => point[selectedSeries] !== null);
  const hasGroupLimitData = data.some((point) => point.groupLimit !== null);

  const chart = useMemo(() => {
    const selectedValues = data.flatMap((point) => {
      const value = point[selectedSeries];
      return value !== null && value >= 0 ? [value] : [];
    });
    const groupLimitValues = showGroupLimit
      ? data.flatMap((point) => point.groupLimit !== null && point.groupLimit >= 0 ? [point.groupLimit] : [])
      : [];
    const rawMax = Math.max(...selectedValues, ...groupLimitValues, 0);
    const axis = createNiceAxis(rawMax);
    const plotWidth = chartWidth - plotLeft - plotRight;
    const plotHeight = plotBottom - plotTop;
    const step = plotWidth / Math.max(data.length, 1);
    const xFor = (index: number) => plotLeft + step * (index + 0.5);
    const yFor = (value: number) => plotBottom - (value / axis.yMax) * plotHeight;
    let limitPath = "";
    let segmentOpen = false;

    if (showGroupLimit) data.forEach((point, index) => {
      if (point.groupLimit === null) {
        segmentOpen = false;
        return;
      }
      const command = segmentOpen ? "L" : "M";
      limitPath += `${command}${xFor(index)} ${yFor(point.groupLimit)} `;
      segmentOpen = true;
    });

    return {
      ...axis,
      step,
      xFor,
      yFor,
      limitPath: limitPath.trim(),
    };
  }, [data, selectedSeries, showGroupLimit]);

  const insight = useMemo(
    () => buildSeriesInsight(data, selectedSeries, selectedConfig),
    [data, selectedConfig, selectedSeries],
  );
  const ariaSummary = !hasSeriesData
    ? `暂无近 6 个月${selectedConfig.metricLabel}数据`
    : data.map((point) => {
        const metric = `${point.period}${selectedConfig.metricLabel}${point[selectedSeries] === null ? "无数据" : `${point[selectedSeries]}亿元`}`;
        if (!showGroupLimit) return metric;
        return `${metric}，集团限额${point.groupLimit === null ? "未配置" : `${point.groupLimit}亿元`}`;
      }).join("；");
  const latestLimitPoint = [...data]
    .map((point, index) => ({ point, index }))
    .reverse()
    .find(({ point }) => point.groupLimit !== null);

  return (
    <div className="investment-var-trend-stack">
      <div className="investment-surface-card investment-var-trend">
      <div className="investment-var-trend__tabs" role="tablist" aria-label="VaR 趋势指标">
        {seriesKeys.map((seriesKey) => {
          const config = varSeriesConfig[seriesKey];
          return (
            <button
              key={seriesKey}
              type="button"
              role="tab"
              aria-selected={selectedSeries === seriesKey}
              aria-controls={panelId}
              className={selectedSeries === seriesKey ? "is-active" : undefined}
              onClick={() => setSelectedSeries(seriesKey)}
            >
              {config.tabLabel}
            </button>
          );
        })}
      </div>

      <div className="investment-var-trend__meta">
        <div className="investment-var-trend__legend" aria-label="图例">
          <span><i className="investment-var-trend__bar-key" aria-hidden="true" />{selectedConfig.metricLabel}</span>
          {showGroupLimit && hasGroupLimitData ? <span><i className="investment-var-trend__limit-key" aria-hidden="true"><b /></i>集团 VaR 限额</span> : null}
        </div>
      </div>

      <div id={panelId} className="investment-var-trend__panel" role="tabpanel">
        {!hasSeriesData ? (
          <div className="investment-var-trend__empty">
            <strong>暂无近 6 个月 VaR 数据</strong>
            <span>当前指标没有可用于绘图的复核值</span>
          </div>
        ) : (
          <>
            <span className="investment-var-trend__unit">单位：亿元</span>
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} role="img" aria-label={ariaSummary}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#ff9b45" />
                  <stop offset="1" stopColor="#ff6a00" />
                </linearGradient>
              </defs>

            {[...chart.ticks].reverse().map((tick) => {
              const y = chart.yFor(tick);
              return (
                <g key={tick}>
                  <line className="investment-var-trend__grid" x1={plotLeft} x2={chartWidth - plotRight} y1={y} y2={y} />
                  <text className="investment-var-trend__axis-label" x={plotLeft - 7} y={y + 3} textAnchor="end">{formatNumber(tick)}</text>
                </g>
              );
            })}

              <g key={selectedSeries} className="investment-var-trend__series">
              {data.map((point, index) => {
              const value = point[selectedSeries];
              const x = chart.xFor(index);
              const barWidth = Math.min(27, chart.step * 0.52);
              const scaledHeight = value === null ? 0 : plotBottom - chart.yFor(Math.max(0, value));
              const barHeight = value === null || value === 0 ? 0 : Math.max(3, scaledHeight);
              const barY = plotBottom - barHeight;

              return (
                <g key={point.period}>
                  {value === null ? (
                    <text className="investment-var-trend__value" x={x} y={plotBottom - 7} textAnchor="middle">—</text>
                  ) : (
                    <>
                      {value > 0 ? (
                        <rect className="investment-var-trend__bar" x={x - barWidth / 2} y={barY} width={barWidth} height={barHeight} rx="3" fill={`url(#${gradientId})`}>
                          <title>{point.period} {selectedConfig.metricLabel} {formatNumber(value)} 亿元</title>
                        </rect>
                      ) : null}
                      <text className="investment-var-trend__value" x={x} y={value === 0 ? plotBottom - 7 : Math.max(plotTop + 9, barY - 7)} textAnchor="middle">{formatNumber(value)}</text>
                    </>
                  )}
                  <text className="investment-var-trend__period" x={x} y={248} textAnchor="middle">{point.period}</text>
                </g>
              );
              })}

            {showGroupLimit && chart.limitPath ? <path className="investment-var-trend__limit-line" d={chart.limitPath} /> : null}
            {showGroupLimit ? data.map((point, index) => point.groupLimit === null ? null : (
              <circle
                key={`limit-${point.period}`}
                className="investment-var-trend__limit-dot"
                cx={chart.xFor(index)}
                cy={chart.yFor(point.groupLimit)}
                r="3.5"
              >
                <title>{point.period} 集团 VaR 限额 {formatNumber(point.groupLimit)} 亿元</title>
              </circle>
            )) : null}
            {showGroupLimit && latestLimitPoint?.point.groupLimit !== null && latestLimitPoint?.point.groupLimit !== undefined ? (
              <text
                className="investment-var-trend__limit-value"
                x={chart.xFor(latestLimitPoint.index) - 8}
                y={Math.max(plotTop + 8, chart.yFor(latestLimitPoint.point.groupLimit) - 8)}
                textAnchor="end"
              >
                {formatNumber(latestLimitPoint.point.groupLimit)}
              </text>
            ) : null}
              </g>
            </svg>
          </>
        )}
        {hasSeriesData && data.filter((point) => point[selectedSeries] !== null).length === 1 ? <p className="investment-var-trend__data-note">当前仅有一期数据</p> : null}
        {hasSeriesData && showGroupLimit && !hasGroupLimitData ? <p className="investment-var-trend__data-note">集团 VaR 限额未配置</p> : null}
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
            <strong id={`${interpretationId}-title`}>趋势解读</strong>
          </span>
          <ChevronDown className={isInterpretationOpen ? "is-open" : undefined} size={18} aria-hidden="true" />
        </button>
        <div id={interpretationId} className="investment-var-trend-ai__body" hidden={!isInterpretationOpen}>
          <ul>
            <li>{insight}</li>
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
