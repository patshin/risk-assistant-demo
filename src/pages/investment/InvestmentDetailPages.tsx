import type { CSSProperties } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { CircleAlert } from "lucide-react";
import { SectionTitle } from "../../components";
import { AssetDonut, HorizontalBars, InvestmentPage } from "../../components/investment";
import {
  assetShare,
  formatNumber,
  getAsset,
  getMember,
  getSnapshotForSearch,
  metricDelta,
  type AssetClassId,
} from "../../data/investmentRisk";

function signed(value: number | null, unit: string, precision = 0) {
  if (value === null) return "—";
  return `${value > 0 ? "+" : ""}${formatNumber(value, precision)}${unit}`;
}

export function InvestmentMemberPage() {
  const { memberId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { snapshot, error } = getSnapshotForSearch(location.search);
  const member = getMember(memberId, snapshot);
  const metricIds = member.id === "pension" ? ["totalVar", "ciiAnnualRate", "groupScale"] : ["groupScale"];
  const memberAssetRows = snapshot.assets.map((asset) => ({ ...asset, amount: member.assetAmounts[asset.id] }));
  const factorValues = Object.values(member.factorVar).filter((value): value is number => value !== null);
  const factorMax = Math.max(...factorValues, 1);
  const groupScale = snapshot.metrics.groupScale.value;
  const hasScaleData = groupScale !== null;
  const scaleShare = groupScale === null || groupScale === 0 ? null : (member.scale / groupScale) * 100;
  const varRankIndex = member.varValue === null
    ? -1
    : snapshot.members
        .filter((item) => item.varValue !== null)
        .sort((a, b) => (b.varValue ?? 0) - (a.varValue ?? 0))
        .findIndex((item) => item.id === member.id);
  const varRank = varRankIndex < 0 ? null : varRankIndex + 1;
  const groupReturn = snapshot.metrics.ciiAnnualRate.value;
  const returnGap = member.annualReturn === null || groupReturn === null ? null : member.annualReturn - groupReturn;
  const memberConclusion = member.varValue === null
    ? `${member.shortName}当前仅提供投资规模和资产结构数据。`
    : member.id === "pension"
      ? "VaR 绝对值居前，但集团尚未提供成员公司独立限额。"
      : `${member.shortName}已提供整体 VaR；成员数值没有独立限额，不据此判断风险等级。`;

  return (
    <InvestmentPage title={member.shortName} subtitle={`成员公司详情 · ${snapshot.periodLabel}`} snapshot={snapshot} backTo="/investment" sourceContext={{ memberId: member.id, metricIds }}>
      {error ? <section className="investment-state-card is-error"><h2>暂时无法获取投资风险数据</h2><p>当前不展示可能失真的成员数据。</p><button type="button" onClick={() => navigate(location.pathname, { replace: true })}>重新加载</button></section> : (
        <>
          <section className="investment-member-hero">
            {member.id === "pension" && member.varValue !== null ? <div className="investment-member-hero__tags"><span>需关注</span><span>VaR 规模居前</span></div> : null}
            <div className="investment-member-hero__metrics">
              <div><strong>{formatNumber(hasScaleData ? member.scale : null)}<em>{hasScaleData ? "亿元" : ""}</em></strong><span>投资规模</span></div>
              <div><strong>{formatNumber(member.varValue)}<em>{member.varValue === null ? "" : "亿元"}</em></strong><span>整体 VaR</span></div>
              <div><strong>{formatNumber(member.annualReturn, 2)}<em>{member.annualReturn === null ? "" : "%"}</em></strong><span>年 CII 收益率</span></div>
            </div>
            <p>{memberConclusion}</p>
          </section>

          <section className="investment-section">
            <SectionTitle title="资产结构" />
            <div className="investment-surface-card">{hasScaleData ? <AssetDonut assets={memberAssetRows} total={member.scale} /> : <div className="investment-empty-chart"><strong>暂无资产结构数据</strong><span>当前期间没有可展示的成员资产金额</span></div>}</div>
          </section>

          <section className="investment-section">
            <SectionTitle title="VaR 风险因子" />
            <div className="investment-surface-card investment-member-factor-list">
              {snapshot.varFactors.map((factor) => {
                const value = member.factorVar[factor.id];
                const width = value === null || value === 0 ? 0 : Math.max(4, (value / factorMax) * 100);
                return (
                  <div key={factor.id}>
                    <span>{factor.name} VaR</span>
                    <i><b className={`is-${factor.id}`} style={{ width: `${width}%` }} /></i>
                    <strong>{formatNumber(value)}{value === null ? "" : " 亿元"}</strong>
                  </div>
                );
              })}
              <p><CircleAlert size={14} />各因子 VaR 为独立测算，不能直接相加。</p>
            </div>
          </section>

          <section className="investment-section">
            <SectionTitle title="与集团对比" />
            <div className="investment-member-comparison">
              <div><span>规模占比</span><strong>{scaleShare === null ? "—" : `${formatNumber(scaleShare, 1)}%`}</strong></div>
              <div><span>VaR 规模排名</span><strong>{varRank === null ? "—" : `第 ${varRank}`}</strong></div>
              <div><span>CII 对集团</span><strong>{signed(returnGap, "pp", 2)}</strong></div>
            </div>
          </section>
        </>
      )}
    </InvestmentPage>
  );
}

export function InvestmentAssetPage() {
  const { assetClassId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { snapshot, error } = getSnapshotForSearch(location.search);
  const asset = getAsset(assetClassId, snapshot);
  const hasScaleData = snapshot.metrics.groupScale.value !== null;
  const share = hasScaleData ? assetShare(asset.amount, snapshot) : null;
  const isEquity = asset.id === "equity";
  const memberRows = snapshot.members
    .map((member) => ({ id: member.id, label: member.shortName, value: member.assetAmounts[asset.id as AssetClassId] }))
    .filter((row) => row.value > 0)
    .sort((a, b) => b.value - a.value);
  const leadingMember = memberRows[0];
  const assetVarValue = isEquity ? snapshot.metrics.equityVar.value : null;
  const assetReturnValue = isEquity ? snapshot.metrics.equityAnnualReturn.value : null;
  const assetVarChange = isEquity ? metricDelta(snapshot.metrics.equityVar, "previousMonth") : null;
  const assetReturnChange = isEquity ? metricDelta(snapshot.metrics.equityAnnualReturn, "previousYear") : null;
  const title = isEquity ? "权益类" : `${asset.name}资产`;
  const observation = memberRows.length === 0
    ? "当前期间暂无可用成员分布数据。"
    : isEquity
      ? `权益规模集中在${leadingMember.label}，收益改善且 VaR 回落。`
      : `${asset.name}规模以${leadingMember.label}持有金额居前；当前没有该资产类别的收益和 VaR 口径。`;

  return (
    <InvestmentPage title={title} subtitle={`资产类别详情 · ${snapshot.periodLabel}`} snapshot={snapshot} backTo="/investment/structure" sourceContext={{ assetClassId: asset.id, metricIds: isEquity ? ["equityScale", "equityShare", "equityVar", "equityAnnualReturn"] : ["groupScale"] }}>
      {error ? <section className="investment-state-card is-error"><h2>暂时无法获取投资风险数据</h2><p>当前不展示可能失真的资产数据。</p><button type="button" onClick={() => navigate(location.pathname, { replace: true })}>重新加载</button></section> : (
        <>
          <section className="investment-asset-hero" style={{ "--asset-accent": asset.color } as CSSProperties}>
            <div><strong>{formatNumber(hasScaleData ? asset.amount : null)}<em>{hasScaleData ? "亿元" : ""}</em></strong><span>集团{asset.name}投资规模 · 占比 {formatNumber(share, 1)}{share === null ? "" : "%"}</span></div>
            <div><strong>{formatNumber(assetVarValue)}<em>{assetVarValue === null ? "" : "亿元"}</em></strong><span>{isEquity ? `权益 VaR · 较上月 ${signed(assetVarChange, "亿元")}` : "该资产类别 VaR · 无该口径数据"}</span></div>
          </section>

          <section className="investment-section">
            <SectionTitle title="成员公司分布" />
            <div className="investment-surface-card"><HorizontalBars rows={memberRows} onRow={(id) => navigate(`/investment/member/${id}${location.search}`, { state: { returnTo: `${location.pathname}${location.search}` } })} /></div>
          </section>

          <section className="investment-section">
            <SectionTitle title="收益与风险" />
            <div className="investment-asset-risk-card">
              <div><span>{asset.name}年收益率</span><strong>{formatNumber(assetReturnValue, 2)}<em>{assetReturnValue === null ? "" : "%"}</em></strong><small>{isEquity ? `较上年同期 ${signed(assetReturnChange === null ? null : assetReturnChange * 100, "bp")}` : "无该口径数据"}</small></div>
              <div><span>{asset.name} VaR</span><strong>{formatNumber(assetVarValue)}<em>{assetVarValue === null ? "" : "亿元"}</em></strong><small>{isEquity ? `较上月 ${signed(assetVarChange, "亿元")}` : "无该口径数据"}</small></div>
            </div>
          </section>

          <section className="investment-observation-card">
            <div><strong>观察结论</strong><p>{observation}</p></div>
            <small>{isEquity ? "现有数据未显示需要管理层立即处置的信号。" : "除已确认的规模与成员分布外，不推断收益或风险值。"}</small>
          </section>
        </>
      )}
    </InvestmentPage>
  );
}
