type DonutChartProps = {
  value: number;
  label?: string;
  size?: number;
  centerText?: string;
  segments?: Array<{
    label: string;
    value: number;
    color: string;
  }>;
};

export function DonutChart({ value, label, size = 72, centerText, segments }: DonutChartProps) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const safeValue = Math.min(Math.max(value, 0), 100);
  const dash = (safeValue / 100) * circumference;
  const resolvedSegments =
    segments?.map((segment) => ({
      ...segment,
      value: Math.max(segment.value, 0),
    })) ?? [];
  const totalSegments = resolvedSegments.reduce((sum, segment) => sum + segment.value, 0);
  let segmentOffset = 0;

  return (
    <div
      className="donut"
      style={{ width: size, height: size }}
      role="img"
      aria-label={
        segments?.length
          ? `${label ?? "占比"} ${resolvedSegments
              .map((segment) => `${segment.label} ${segment.value}%`)
              .join("，")}`
          : `${label ?? "占比"} ${safeValue}%`
      }
    >
      <svg viewBox="0 0 72 72">
        <circle className="donut__track" cx="36" cy="36" r={radius} />
        {resolvedSegments.length
          ? resolvedSegments.map((segment) => {
              const segmentLength = totalSegments > 0 ? (segment.value / totalSegments) * circumference : 0;
              const dashOffset = circumference - segmentOffset;
              segmentOffset += segmentLength;

              return (
                <circle
                  key={segment.label}
                  className="donut__segment"
                  cx="36"
                  cy="36"
                  r={radius}
                  stroke={segment.color}
                  strokeDasharray={`${segmentLength} ${circumference - segmentLength}`}
                  strokeDashoffset={dashOffset}
                />
              );
            })
          : <circle className="donut__value" cx="36" cy="36" r={radius} strokeDasharray={`${dash} ${circumference - dash}`} />}
      </svg>
      <span>{centerText ?? `${safeValue}%`}</span>
    </div>
  );
}
