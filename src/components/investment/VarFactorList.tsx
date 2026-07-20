import { formatNumber, type VarFactorItem } from "../../data/investmentRisk";

type VarFactorListProps = {
  items: VarFactorItem[];
};

export function VarFactorList({ items }: VarFactorListProps) {
  const maxValue = items.reduce((maximum, item) => {
    if (item.value === null) return maximum;
    return Math.max(maximum, item.value);
  }, 0);

  return (
    <div className="var-factor-list-card" role="list" aria-label="主要风险因子 VaR 金额">
      {items.map((item, index) => {
        const value = item.value;
        const hasValue = value !== null;
        const visualWidth = value !== null && value > 0 && maxValue > 0
          ? `max(6px, ${(value / maxValue) * 100}%)`
          : null;
        const description = hasValue && item.previousMonthValue !== null
          ? `上月 ${formatNumber(item.previousMonthValue)} 亿 · ${item.description}`
          : "暂无复核数据";

        return (
          <article className="var-factor-row" key={item.id} role="listitem">
            <span className="var-factor-rank" aria-hidden="true">{index + 1}</span>
            <div className="var-factor-main">
              <div className="var-factor-heading">
                <strong>{item.label}</strong>
                <span className="var-factor-value">
                  <b>{formatNumber(item.value)}</b>
                  {hasValue ? <small>亿元</small> : null}
                </span>
              </div>
              <div className="var-factor-track" aria-hidden="true">
                {visualWidth ? <span className="var-factor-fill" style={{ width: visualWidth }} /> : null}
              </div>
              <p>{description}</p>
            </div>
          </article>
        );
      })}
    </div>
  );
}
