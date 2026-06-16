type DonutChartProps = {
  value: number;
  label?: string;
  size?: number;
};

export function DonutChart({ value, label, size = 72 }: DonutChartProps) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const dash = (Math.min(Math.max(value, 0), 100) / 100) * circumference;

  return (
    <div className="donut" style={{ width: size, height: size }} role="img" aria-label={`${label ?? "占比"} ${value}%`}>
      <svg viewBox="0 0 72 72">
        <circle className="donut__track" cx="36" cy="36" r={radius} />
        <circle className="donut__value" cx="36" cy="36" r={radius} strokeDasharray={`${dash} ${circumference - dash}`} />
      </svg>
      <span>{value}%</span>
    </div>
  );
}
