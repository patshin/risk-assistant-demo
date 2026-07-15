import { defaultTrendDemo, formatAmount, warningLevelStructure, warningOverview } from "./data";

export function WarningStructureChart() {
  const total = warningLevelStructure.reduce((sum, item) => sum + item.amountBillion, 0);
  const previous = warningOverview.previousWarningStockAmountBillion;
  const previousLevels = warningLevelStructure.map((item) => ({
    ...item,
    amountBillion: item.amountBillion - item.monthChangeBillion,
  }));
  const yMax = Math.max(previous, total) * 1.1;
  const currentHeight = (total / yMax) * 112;
  const previousHeight = (previous / yMax) * 112;

  return (
    <figure className="warning-structure-chart" aria-labelledby="warning-structure-caption">
      <div className="warning-structure-chart__bars" aria-hidden="true">
        <div className="warning-structure-chart__column">
          <div className="warning-structure-chart__bar is-previous" style={{ height: `${previousHeight}px` }}>
            {previousLevels.map((item) => (
              <i key={item.level} style={{ flex: item.amountBillion, minHeight: item.amountBillion > 0 ? "2px" : 0, background: item.color }} />
            ))}
          </div>
          <div className="warning-structure-chart__label"><span>05月末</span><strong>{formatAmount(previous, 0)}</strong></div>
        </div>
        <div className="warning-structure-chart__column">
          <div className="warning-structure-chart__bar is-current" style={{ height: `${currentHeight}px` }}>
            {warningLevelStructure.map((item) => (
              <i key={item.level} style={{ flex: item.amountBillion, minHeight: item.amountBillion > 0 ? "2px" : 0, background: item.color }} />
            ))}
          </div>
          <div className="warning-structure-chart__label"><span>06-24</span><strong>{formatAmount(total, 0)}</strong></div>
        </div>
      </div>
      <div className="warning-structure-chart__legend" aria-hidden="true">
        {warningLevelStructure.map((item) => <span key={item.level}><i style={{ background: item.color }} />{item.label}</span>)}
        <span className="warning-tag warning-tag--neutral">单位：亿元</span>
      </div>
      <figcaption id="warning-structure-caption">
        预警资产规模，单位：亿元。上月末 3,358 为派生数据，其中重大预警 1,171、二级预警 1,323、一级预警 864；当前数据日 3,342 为业务事实，其中重大预警 1,162、二级预警 1,320、一级预警 860。纵轴上限按较大总量的 1.1 倍计算。
      </figcaption>
    </figure>
  );
}

export function DefaultTrendChart({ data = defaultTrendDemo }: { data?: readonly number[] }) {
  const width = 324;
  const height = 158;
  const paddingX = 18;
  const paddingY = 20;
  if (data.length === 0) {
    return (
      <figure className="default-trend-chart is-empty" aria-labelledby="default-trend-caption">
        <div className="default-trend-chart__empty">暂无趋势数据</div>
        <figcaption id="default-trend-caption">近六期出险余额趋势暂无数据。</figcaption>
      </figure>
    );
  }

  const min = Math.min(...data) - 1;
  const max = Math.max(...data) + 1;
  const usableWidth = width - paddingX * 2;
  const usableHeight = height - paddingY * 2;
  const pointDivisor = Math.max(data.length - 1, 1);
  const points = data.map((value, index) => ({
    value,
    x: data.length === 1 ? width / 2 : paddingX + (index / pointDivisor) * usableWidth,
    y: paddingY + ((max - value) / (max - min)) * usableHeight,
  }));
  const line = points.map((point) => `${point.x},${point.y}`).join(" ");

  return (
    <figure className="default-trend-chart" aria-labelledby="default-trend-caption">
      <svg role="img" aria-label={`出险余额趋势，共 ${data.length} 个数据点，从 ${data[0]} 亿元至 ${data[data.length - 1]} 亿元`} viewBox={`0 0 ${width} ${height}`}>
        {[0, 1, 2].map((lineIndex) => {
          const y = paddingY + (lineIndex / 2) * usableHeight;
          return <line key={lineIndex} x1={paddingX} x2={width - paddingX} y1={y} y2={y} className="default-trend-chart__grid" />;
        })}
        <polyline points={line} className="default-trend-chart__line" />
      </svg>
      <div className="default-trend-chart__axis" aria-hidden="true"><span>2026-01</span><span>2026-06</span></div>
      <figcaption id="default-trend-caption">出险余额演示趋势，共 {data.length} 个数据点，单位：亿元；不作为业务事实。</figcaption>
    </figure>
  );
}

export function MonthlyComparisonChart() {
  const rows = [
    { label: "新增重大预警", value: warningOverview.monthlyMajorWarning.amountBillion, max: 0.83, color: "#e65a2b" },
    { label: "新增出险", value: warningOverview.monthlyDefault.amountBillion, max: 0.83, color: "#ff8a1f" },
  ];
  return (
    <figure className="warning-comparison-chart" aria-labelledby="warning-comparison-caption">
      {rows.map((row) => (
        <div key={row.label} className="warning-comparison-chart__row">
          <div>
            <span>{row.label}</span>
            <strong>{row.value.toFixed(2)} 亿元</strong>
          </div>
          <i>
            <b style={{ width: `${(row.value / row.max) * 100}%`, background: row.color }} />
          </i>
        </div>
      ))}
      <figcaption id="warning-comparison-caption">本月新增重大预警 0.60 亿元，新增出险 0.83 亿元。</figcaption>
    </figure>
  );
}
