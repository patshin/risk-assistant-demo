import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronRight, CircleAlert, Info } from "lucide-react";
import { BottomAskBar, BottomSheet, PageHeader, SectionTitle, useCopilot } from "../../components";
import {
  AIConclusion,
  AssetDonut,
  Delta,
  HorizontalBars,
  InvestmentPage,
  VarFactorList,
  VarTrendSection,
  type InvestmentRouteState,
} from "../../components/investment";
import { GroupVarOverviewCard } from "../../components/investment/GroupVarOverviewCard";
import {
  CiiAnnualRanking,
  CiiAttention,
  CiiDataMeta,
  CiiGroupComparison,
  CiiManagementInsight,
  CiiMonthlyTrend,
  CiiOverview,
  CiiViewTabs,
} from "../../components/investment/CiiPerformance";
import {
  assetShare,
  formatNumber,
  getCiiAnnualRanking,
  getCiiGroupComparison,
  getCiiViewData,
  getCiiViewMetricIds,
  getSnapshotForSearch,
  isCiiViewId,
  metricDelta,
  selectRemainingVarLimit,
  selectVarFactorItems,
  selectVarLimitUsage,
} from "../../data/investmentRisk";

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return <section className="investment-state-card is-error"><h2>暂时无法获取投资风险数据</h2><p>数据服务返回异常，当前不展示可能失真的分析。</p><button type="button" onClick={onRetry}>重新加载</button></section>;
}

export function InvestmentVarPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { snapshot, error } = getSnapshotForSearch(location.search);
  const ranking = snapshot.members.filter((member) => member.varValue !== null).sort((a, b) => (b.varValue ?? 0) - (a.varValue ?? 0));
  const factorMax = Math.max(...snapshot.members.flatMap((member) => Object.values(member.factorVar).filter((value): value is number => value !== null)), 1);
  const groupVar = snapshot.metrics.totalVar.value;
  const groupLimit = snapshot.metrics.varLimit.value;
  const groupVarDelta = metricDelta(snapshot.metrics.totalVar, "previousMonth");
  const limitUsage = selectVarLimitUsage(snapshot);
  const remainingLimit = selectRemainingVarLimit(snapshot);
  const factorItems = selectVarFactorItems(snapshot);

  return (
    <InvestmentPage title="VaR 分析" subtitle={`${snapshot.periodLabel} · VaR 计量资产`} snapshot={snapshot} sourceContext={{ metricIds: ["totalVar", "varUsage", "varDelta"] }}>
      {error ? <ErrorState onRetry={() => navigate(location.pathname, { replace: true })} /> : (
        <>
          <GroupVarOverviewCard
            value={groupVar}
            previousMonthDelta={groupVarDelta}
            limit={groupLimit}
            limitUsage={limitUsage}
            remainingLimit={remainingLimit}
          />

          <section className="investment-section">
            <SectionTitle title="近 6 个月 VaR 趋势" />
            <VarTrendSection data={snapshot.varTrend} periodLabel={snapshot.periodLabel} />
          </section>

          <section className="investment-section">
            <div className="var-factor-section-heading">
              <SectionTitle title="主要风险因子" />
              <span>单位：亿元</span>
            </div>
            <VarFactorList items={factorItems} />
            <p className="investment-boundary-note"><CircleAlert size={15} />因子 VaR 反映敏感度，彼此相关，不能相加得到集团 VaR。</p>
          </section>

          <section className="investment-section">
            <SectionTitle title="成员 VaR 排名" />
            <div className="investment-surface-card">
              <HorizontalBars rows={ranking.map((member) => ({ id: member.id, label: member.shortName, value: member.varValue ?? 0 }))} onRow={(memberId) => navigate(`/investment/member/${memberId}${location.search}`, { state: { returnTo: `${location.pathname}${location.search}` } })} />
            </div>
          </section>

          <section className="investment-section">
            <SectionTitle title="成员因子矩阵" />
            <div className="investment-factor-matrix" role="table" aria-label="成员因子 VaR 数值强弱矩阵">
              <div className="investment-factor-matrix__head" role="row"><span>成员</span>{snapshot.varFactors.map((factor) => <span key={factor.id}>{factor.name}</span>)}</div>
              {snapshot.members.map((member) => (
                <button role="row" type="button" key={member.id} onClick={() => navigate(`/investment/member/${member.id}${location.search}`, { state: { returnTo: `${location.pathname}${location.search}` } })}>
                  <strong role="cell">{member.shortName}</strong>
                  {snapshot.varFactors.map((factor) => {
                    const value = member.factorVar[factor.id];
                    return <span role="cell" key={factor.id} style={{ "--matrix-strength": value === null ? 0 : value / factorMax } as React.CSSProperties}>{value === null ? "—" : value}</span>;
                  })}
                </button>
              ))}
            </div>
            <div className="investment-matrix-legend"><span>较低</span><i aria-hidden="true" /><span>较高</span></div>
            <p className="investment-boundary-note"><CircleAlert size={15} />颜色仅表示数值强弱，不代表风险等级；成员因子 VaR 也不可相加。</p>
          </section>

          <AIConclusion>{snapshot.metrics.totalVar.value === null ? "集团 VaR 暂无复核数据，当前不生成风险趋势判断；养老险成员值仍需先核验口径。" : `集团 VaR 为 ${formatNumber(snapshot.metrics.totalVar.value)} 亿元，限额使用率 ${formatNumber(snapshot.metrics.varUsage.value, 1)}%；养老险排名居首仅触发核验，不直接判为高风险。`}</AIConclusion>
        </>
      )}
    </InvestmentPage>
  );
}

export function InvestmentPerformancePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { openCopilot } = useCopilot();
  const [scopeOpen, setScopeOpen] = useState(false);
  const { snapshot, error } = getSnapshotForSearch(location.search);
  const routeState = location.state as InvestmentRouteState | null;
  const params = new URLSearchParams(location.search);
  const requestedView = params.get("view");
  const activeView = isCiiViewId(requestedView) ? requestedView : "group";
  const currentData = getCiiViewData(snapshot, activeView);
  const groupData = getCiiViewData(snapshot, "group");
  const ranking = getCiiAnnualRanking(snapshot);
  const comparison = activeView === "group" ? null : getCiiGroupComparison(snapshot, activeView);

  const changeView = (view: typeof activeView) => {
    if (view === activeView && requestedView === view) return;
    const nextParams = new URLSearchParams(location.search);
    nextParams.set("view", view);
    navigate({ pathname: location.pathname, search: nextParams.toString() }, { state: location.state });
    window.requestAnimationFrame(() => document.querySelector<HTMLElement>(".phone-shell")?.scrollTo({ top: 0, behavior: "auto" }));
  };

  const retry = () => {
    const nextParams = new URLSearchParams(location.search);
    nextParams.delete("fixture");
    if (!nextParams.has("view")) nextParams.set("view", activeView);
    navigate({ pathname: location.pathname, search: nextParams.toString() }, { replace: true, state: location.state });
  };

  const openPerformanceCopilot = () => openCopilot({
    intent: "general",
    sourceContext: {
      module: "investment-risk",
      page: "performance",
      view: activeView,
      snapshotId: snapshot.id,
      route: `${location.pathname}${location.search}`,
      period: snapshot.period,
      dataStatus: snapshot.dataStatus,
      compareBasis: snapshot.defaultCompareBasis,
      metricIds: getCiiViewMetricIds(activeView),
    },
  });

  return (
    <div className="page investment-page investment-performance-page">
      <div className="investment-performance-page__scroll">
        <div className="investment-performance-header">
          <PageHeader
            title="收益分析"
            onBack={() => navigate(routeState?.returnTo ?? "/investment")}
            action={<button className="icon-button" type="button" aria-label="查看数据口径" onClick={() => setScopeOpen(true)}><Info size={20} /></button>}
          />
          <p>{snapshot.periodLabel} · {snapshot.dataStatus === "reviewed" ? "已复核" : "待复核"}</p>
          <CiiViewTabs activeView={activeView} onChange={changeView} />
        </div>

        <main id="cii-performance-panel" role="tabpanel" aria-labelledby={`cii-view-tab-${activeView}`}>
          {error ? (
            <section className="cii-performance-error" role="alert">
              <CircleAlert size={27} />
              <h2>收益数据加载失败</h2>
              <p>当前不展示可能失真的收益分析，请重新加载已复核数据。</p>
              <button type="button" onClick={retry}>重新加载</button>
            </section>
          ) : (
            <>
              <CiiOverview data={currentData} />
              <CiiAttention
                data={currentData}
                onOpen={activeView === "group" && snapshot.changes.some((change) => change.id === "cii-monthly-negative")
                  ? () => navigate(`/investment/changes/cii-monthly-negative${location.search}`, { state: { returnTo: `${location.pathname}${location.search}` } })
                  : undefined}
              />
              {activeView === "group" ? (
                <CiiAnnualRanking rows={ranking} onSelect={changeView} />
              ) : comparison ? (
                <CiiGroupComparison current={currentData} group={groupData} annualDifferenceBp={comparison.annualDifferenceBp} monthlyDifferenceBp={comparison.monthlyDifferenceBp} />
              ) : null}
              <CiiMonthlyTrend data={currentData.monthlyTrend} view={currentData} />
              <CiiManagementInsight data={currentData} />
              <CiiDataMeta data={currentData} />
            </>
          )}
        </main>
      </div>
      <BottomAskBar
        placeholder={activeView === "group" ? "问集团收益表现、成员差异和后续动作…" : `比较${currentData.label}与集团、解释收益变化…`}
        onOpen={openPerformanceCopilot}
      />
      <BottomSheet open={scopeOpen} title="数据口径与范围" className="investment-sheet" onClose={() => setScopeOpen(false)}>
        <div className="investment-scope-list">
          <div className="investment-scope-row"><span>统计对象</span><strong>{currentData.label}</strong></div>
          <div className="investment-scope-row"><span>收益口径</span><strong>{currentData.label} CII 口径</strong></div>
          <div className="investment-scope-row"><span>期间</span><strong>{snapshot.periodLabel}</strong></div>
          <div className="investment-scope-row"><span>状态</span><strong className="is-success">已复核 · {currentData.updatedAt}</strong></div>
        </div>
        <div className="investment-scope-warning">
          <CircleAlert size={18} />
          <p>{activeView === "group"
            ? "集团数据覆盖四家险资 CII 汇总口径；成员排名和集团合计使用同一复核期间。"
            : `${currentData.label}月 CII 收益额、收益率及月度趋势尚未补齐；当前仅展示已复核年 CII 指标和集团月度基准。`}</p>
        </div>
      </BottomSheet>
    </div>
  );
}

export function InvestmentStructurePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { snapshot, error } = getSnapshotForSearch(location.search);
  const totalValue = snapshot.metrics.groupScale.value;
  const total = totalValue ?? 0;
  const totalIsCompact = totalValue !== null && Math.abs(totalValue) >= 40000;
  const rankedMembers = [...snapshot.members].sort((a, b) => b.scale - a.scale);

  return (
    <InvestmentPage title="规模与结构" subtitle={`${snapshot.periodLabel} · 集团投资资产`} snapshot={snapshot} sourceContext={{ metricIds: ["groupScale", "equityScale"] }}>
      {error ? <ErrorState onRetry={() => navigate(location.pathname, { replace: true })} /> : (
        <>
          <section className="investment-structure-hero"><span>集团管理规模</span><strong>{formatNumber(totalValue === null ? null : totalIsCompact ? totalValue / 10000 : totalValue, totalIsCompact ? 2 : 0)}<em>{totalValue === null ? "" : totalIsCompact ? "万亿元" : "亿元"}</em></strong><p>{totalValue === null ? "当前期间暂无可用规模数据，不按 0 展示。" : "四类资产合计与七家成员规模均严格勾稽。"}</p></section>
          <section className="investment-section"><SectionTitle title="资产结构" /><div className="investment-surface-card">{totalValue === null ? <div className="investment-empty-chart"><strong>暂无资产结构数据</strong><span>当前期间没有可展示的资产金额</span></div> : <AssetDonut assets={snapshot.assets} total={total} />}</div></section>
          <section className="investment-section">
            <SectionTitle title="资产类别" />
            {total > 0 ? <div className="investment-asset-list">
              {snapshot.assets.map((asset) => (
                <button key={asset.id} type="button" onClick={() => navigate(`/investment/asset/${asset.id}${location.search}`, { state: { returnTo: `${location.pathname}${location.search}` } })}>
                  <i style={{ backgroundColor: asset.color }} /><span><strong>{asset.name}</strong><small>{assetShare(asset.amount, snapshot).toFixed(1)}%</small></span><em>{formatNumber(asset.amount)} 亿</em><ChevronRight size={17} />
                </button>
              ))}
            </div> : <div className="investment-empty-chart"><strong>暂无资产结构数据</strong><span>当前期间没有可展示的资产金额</span></div>}
          </section>
          <section className="investment-section"><SectionTitle title="成员规模排名" /><div className="investment-surface-card"><HorizontalBars rows={rankedMembers.filter((member) => member.scale > 0).map((member) => ({ id: member.id, label: member.shortName, value: member.scale }))} onRow={(memberId) => navigate(`/investment/member/${memberId}${location.search}`, { state: { returnTo: `${location.pathname}${location.search}` } })} /></div></section>
          <AIConclusion>{totalValue === null ? "当前期间暂无可用规模数据，需等待数据补齐后再描述资产结构；不按 0 展示。" : `集团投资资产以固定收益为主，权益占比 ${assetShare(snapshot.assets.find((asset) => asset.id === "equity")?.amount ?? 0, snapshot).toFixed(1)}%。结构页只描述规模分布，不据此生成调仓或交易建议。`}</AIConclusion>
        </>
      )}
    </InvestmentPage>
  );
}
