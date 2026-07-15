import { useLocation, useNavigate } from "react-router-dom";
import { ChevronRight, Database, Layers3, ShieldCheck, TrendingDown } from "lucide-react";
import { SectionTitle } from "../../components";
import { AIConclusion, AssetDonut, ChangeCard, InvestmentPage, MetricTile } from "../../components/investment";
import { formatNumber, getSnapshotForSearch } from "../../data/investmentRisk";

export function InvestmentOverviewPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { snapshot, error } = getSnapshotForSearch(location.search);
  const totalVar = snapshot.metrics.totalVar;
  const varUsage = snapshot.metrics.varUsage;
  const monthlyRate = snapshot.metrics.ciiMonthlyRate;
  const totalScaleValue = snapshot.metrics.groupScale.value;
  const totalScale = totalScaleValue ?? 0;
  const attentionChanges = snapshot.changes.filter((change) => change.riskLevel === "attention");
  const hasCoreMetrics = monthlyRate.value !== null && totalVar.value !== null && varUsage.value !== null;
  const varWithinLimit = varUsage.value !== null && varUsage.value <= 100;
  const scaleIsCompact = totalScaleValue !== null && Math.abs(totalScaleValue) >= 40000;

  const openRoute = (route: string) => navigate(`${route}${location.search}`, { state: { returnTo: `${location.pathname}${location.search}` } });

  if (error) {
    return (
      <InvestmentPage title="投资风险" subtitle={`${snapshot.periodLabel} · 集团口径`} snapshot={snapshot} backTo="/">
        <section className="investment-state-card is-error">
          <h2>暂时无法获取投资风险数据</h2>
          <p>数据服务返回异常，请稍后重试。当前不展示可能失真的管理结论。</p>
          <button type="button" onClick={() => navigate("/investment", { replace: true })}>重新加载</button>
        </section>
      </InvestmentPage>
    );
  }

  return (
    <InvestmentPage title="投资风险" subtitle={`${snapshot.periodLabel} · 集团口径`} snapshot={snapshot} backTo="/">
      <div className="investment-meta-row" aria-label="数据状态">
        <span>{snapshot.defaultCompareBasis === "previousMonth" ? "较上月" : "较上年末"}</span>
        <span>{snapshot.groupName}</span>
        <span className={snapshot.dataStatus === "reviewed" ? "is-reviewed" : ""}><ShieldCheck size={14} />{snapshot.dataStatus === "reviewed" ? "已复核" : "待复核"}</span>
      </div>

      <section className="investment-hero-card">
        <div className="investment-hero-card__heading">
          <div>
            <h2>{hasCoreMetrics ? (varWithinLimit ? "收益转负需关注，VaR 仍在限额内" : "收益与 VaR 均需关注") : "本期关键指标等待数据补齐"}</h2>
          </div>
          <TrendingDown size={28} />
        </div>
        <div className="investment-metric-grid">
          <MetricTile metric={totalVar} delta={snapshot.metrics.varDelta.value === null ? "暂无复核数据" : `较上月 ${formatNumber(snapshot.metrics.varDelta.value)} 亿元`} tone={varWithinLimit ? "good" : "attention"} />
          <MetricTile metric={varUsage} hideSupportingText tone={varWithinLimit ? "neutral" : "attention"} />
          <MetricTile metric={monthlyRate} label="月 CII 收益率" delta={snapshot.metrics.ciiMonthlyDelta.value === null ? "暂无复核数据" : `较上月 ${formatNumber(snapshot.metrics.ciiMonthlyDelta.value)}bp`} tone="attention" />
        </div>
        <p className="investment-scope-caption">VaR：VaR 计量资产 · 收益：四家险资 CII 口径</p>
      </section>

      <section className="investment-section">
        <SectionTitle title="需关注的变化" action="查看全部" onAction={() => openRoute("/investment/changes")} />
        {attentionChanges.length ? (
          <div className="investment-card-stack">
            {attentionChanges.map((change) => (
              <ChangeCard key={change.id} change={change} onClick={() => openRoute(`/investment/changes/${change.id}`)} />
            ))}
          </div>
        ) : (
          <div className="investment-state-card"><h3>本期未发现需要管理层处理的重大变化</h3><p>可继续查看 VaR、收益和规模详情。</p></div>
        )}
      </section>

      <section className="investment-section">
        <SectionTitle title="投资规模与结构" />
        <button className="investment-scale-summary" type="button" onClick={() => openRoute("/investment/structure")}>
          <div><span>集团管理规模</span><strong>{formatNumber(totalScaleValue === null ? null : scaleIsCompact ? totalScaleValue / 10000 : totalScaleValue, scaleIsCompact ? 2 : 0)}<em>{totalScaleValue === null ? "" : scaleIsCompact ? "万亿元" : "亿元"}</em></strong></div>
          <div><span>CII 年化收益率</span><strong>{formatNumber(snapshot.metrics.ciiAnnualRate.value, 2)}<em>{snapshot.metrics.ciiAnnualRate.value === null ? "" : "%"}</em></strong></div>
          <div><span>集团 VaR</span><strong>{formatNumber(snapshot.metrics.totalVar.value)}<em>{snapshot.metrics.totalVar.value === null ? "" : "亿元"}</em></strong></div>
          <ChevronRight size={19} />
        </button>
        <div className="investment-surface-card">
          {totalScaleValue === null ? <div className="investment-empty-chart"><strong>暂无资产结构数据</strong><span>当前期间没有可展示的资产金额</span></div> : <AssetDonut assets={snapshot.assets} total={totalScale} />}
        </div>
      </section>

      <section className="investment-section investment-navigation-grid" aria-label="投资风险分析入口">
        <button type="button" onClick={() => openRoute("/investment/var")}><Database size={20} /><span><strong>VaR 分析</strong><small>限额、趋势与因子</small></span><ChevronRight size={17} /></button>
        <button type="button" onClick={() => openRoute("/investment/performance")}><TrendingDown size={20} /><span><strong>收益分析</strong><small>CII 与成员比较</small></span><ChevronRight size={17} /></button>
        <button type="button" onClick={() => openRoute("/investment/structure")}><Layers3 size={20} /><span><strong>规模结构</strong><small>资产与成员分布</small></span><ChevronRight size={17} /></button>
      </section>

      <section className="investment-section">
        <SectionTitle title="成员机构" />
        {totalScaleValue !== null ? <div className="investment-member-grid">
          {snapshot.members.map((member) => (
            <button key={member.id} type="button" onClick={() => openRoute(`/investment/member/${member.id}`)}>
              <span>{member.shortName}</span>
              <strong>{formatNumber(member.scale)} 亿</strong>
              <ChevronRight size={16} />
            </button>
          ))}
        </div> : <div className="investment-state-card"><h3>暂无成员规模数据</h3><p>当前期间不展示可能被误解为 0 的成员数值。</p></div>}
      </section>

      <AIConclusion>{snapshot.metrics.ciiMonthlyRate.value === null ? "本期关键收益与 VaR 指标暂无复核数据，需等待数据补齐后再形成管理判断；当前不按 0 展示。" : `本月优先核验 CII 月度收益率 ${formatNumber(snapshot.metrics.ciiMonthlyRate.value, 2)}% 的持续性，同时保留对养老险成员 VaR 的口径关注；当前不构成投资或调仓建议。`}</AIConclusion>

      <section className="investment-source-card">
        <h2>数据来源</h2>
        <p>{snapshot.sourceSystems.join(" · ")}</p>
        <small>数据期间 {snapshot.periodLabel} · 复核时间 {snapshot.reviewedAt}</small>
      </section>
    </InvestmentPage>
  );
}
