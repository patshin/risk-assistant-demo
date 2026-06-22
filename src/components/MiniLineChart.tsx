type MiniLineChartProps = {
  data: number[];
  tone?: "up" | "down" | "steady";
};

export function MiniLineChart({ data, tone = "up" }: MiniLineChartProps) {
  const width = 82;
  const height = 48;
  const paddingX = 6;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const spread = Math.max(max - min, 1);
  const points = data
    .map((value, index) => {
      const x = paddingX + (index / Math.max(data.length - 1, 1)) * (width - paddingX * 2);
      const y = height - ((value - min) / spread) * 34 - 7;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <svg className={`mini-line mini-line--${tone}`} viewBox={`0 0 ${width} ${height}`} role="img" aria-label="风险趋势折线">
      <polyline points={points} fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={width} cy={points.split(" ").at(-1)?.split(",")[1] ?? 0} r="4.8" fill="currentColor" />
    </svg>
  );
}
