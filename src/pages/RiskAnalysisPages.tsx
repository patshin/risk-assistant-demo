import { type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  Building2,
  ChevronRight,
  Clock3,
  FileText,
  Landmark,
  PauseCircle,
  Radar,
  Share2,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  UserRoundCheck,
  WalletCards,
} from "lucide-react";
import { PageHeader } from "../components";
import {
  clientRiskPanorama,
  industryRiskAnalysis,
  marketShockAnalysis,
  type ClientRiskPanorama,
  type IndustryRiskAnalysis,
  type MarketShockAnalysis,
  type RiskBriefAI,
} from "../data/mockRisk";

export function ClientRiskPanoramaPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const data = clientRiskPanorama;
  const backPath = getReturnTo(location.state, "/brief");

  return (
    <RiskAnalysisLayout title="客户风险全景" onBack={() => navigate(backPath)}>
      <ClientHero data={data} />
      <SegmentTabs items={["风险概览", "风险信号", "敞口信息", "关联图谱"]} />
      <section className="risk-detail-card glass-card">
        <SectionTitle title="风险评级" right={data.levelChange} />
        <div className="client-rating-row">
          <MetricTile value="A1" label="一级预警" sub="一线跟踪" />
          <MetricTile value={String(data.score)} label="风险分" sub={`较昨日 ${data.scoreChange}`} highlight />
          <div className="mini-trend-card">
            <span>风险趋势</span>
            <MiniLineChart values={data.trend} height={48} />
          </div>
        </div>
      </section>

      <section className="risk-detail-card glass-card">
        <SectionTitle title="风险状态时间轴" />
        <div className="risk-timeline">
          {data.timeline.map((item, index) => (
            <div className={`risk-timeline__node is-${item.state}`} key={item.label}>
              <span>{index + 1}</span>
              <strong>{item.label}</strong>
              <em>{item.date}</em>
              {index < data.timeline.length - 1 ? <ArrowRight size={17} /> : null}
            </div>
          ))}
        </div>
      </section>

      <section className="risk-detail-card glass-card">
        <SectionTitle title="风险来源拆解" />
        <div className="risk-source-grid">
          {data.sources.map((source) => (
            <div className="risk-source-item" key={source.label}>
              <div>
                <span>{source.label}</span>
                <strong>{source.value}</strong>
              </div>
              <i>
                <b style={{ width: `${source.value}%` }} />
              </i>
              <em>{source.detail}</em>
            </div>
          ))}
        </div>
      </section>

      <section className="risk-detail-card glass-card">
        <SectionTitle title="风险信号（近30天）" />
        <div className="risk-signal-list">
          {data.signals.map((signal) => (
            <button type="button" key={signal.title}>
              <ShieldAlert size={18} />
              <span>
                <strong>{signal.title}</strong>
                <em>{signal.detail}</em>
              </span>
              <ChevronRight size={16} />
            </button>
          ))}
        </div>
      </section>

      <AIAnalysisCard ai={data.ai} probability={data.ai.defaultProbability} />
      <div className="risk-analysis-actions">
        <button className="risk-action-button risk-action-button--ghost" type="button">
          <PauseCircle size={17} />
          暂停授信
        </button>
        <button className="risk-action-button risk-action-button--ghost" type="button">
          <UserRoundCheck size={17} />
          加入重点监控
        </button>
        <button className="risk-action-button risk-action-button--primary" type="button">
          <FileText size={17} />
          生成处置方案
        </button>
      </div>
    </RiskAnalysisLayout>
  );
}

export function IndustryRiskAnalysisPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const data = industryRiskAnalysis;
  const backPath = getReturnTo(location.state, "/brief");

  return (
    <RiskAnalysisLayout title="行业风险分析" onBack={() => navigate(backPath)}>
      <HeaderHero title={data.name} badge={data.badge} updateTime={data.updateTime} />
      <SegmentTabs items={["风险概览", "重点客户", "区域分布", "关联路径"]} />

      <section className="risk-detail-card industry-index-card glass-card">
        <SectionTitle title="行业风险指数" />
        <div className="index-chart-row">
          <div>
            <strong>{data.index}</strong>
            <span>/ 100</span>
            <em>较昨日 {data.indexChange}</em>
          </div>
          <MiniLineChart values={data.trend.map((item) => item.value)} labels={data.trend.map((item) => item.label)} height={86} />
        </div>
      </section>

      <section className="risk-detail-card glass-card">
        <SectionTitle title="风险特征" />
        <ul className="risk-feature-list">
          {data.features.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
        <div className="impact-mini-grid">
          {data.impact.map((item) => (
            <div key={item.label}>
              <Building2 size={18} />
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="risk-detail-card glass-card">
        <SectionTitle title="重点风险客户 TOP5" right="查看全部" />
        <div className="top-customer-list">
          {data.topCustomers.map((customer, index) => (
            <button type="button" key={customer.name}>
              <em>{index + 1}</em>
              <strong>{customer.name}</strong>
              <span>{customer.score}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="risk-detail-card glass-card">
        <SectionTitle title="风险扩散路径" right="AI重点" />
        <div className="spread-path">
          {data.ai.spreadPath.map((item, index) => (
            <div key={item}>
              <span>{index + 1}</span>
              <strong>{item}</strong>
              {index < data.ai.spreadPath.length - 1 ? <ArrowRight size={16} /> : null}
            </div>
          ))}
        </div>
      </section>

      <AIAnalysisCard ai={data.ai} />
    </RiskAnalysisLayout>
  );
}

export function MarketShockAnalysisPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const data = marketShockAnalysis;
  const backPath = getReturnTo(location.state, "/brief");

  return (
    <RiskAnalysisLayout title="风险冲击分析" onBack={() => navigate(backPath)}>
      <HeaderHero title={data.title} updateTime={data.updateTime} />
      <SegmentTabs items={["市场概览", "VaR维度", "影响资产", "传导分析"]} />

      <section className="risk-detail-card market-spread-card glass-card">
        <SectionTitle title="利差变化（中低评级信用债）" right={`较昨日 ${data.spreadDelta}`} />
        <div className="market-shock-kpi">
          <strong>{data.spreadChange}</strong>
          <span>信用利差</span>
        </div>
        <MiniLineChart values={data.trend.map((item) => item.value)} labels={data.trend.map((item) => item.label)} height={112} />
      </section>

      <section className="risk-detail-card glass-card">
        <SectionTitle title="组合VaR变化" right="查看组合" />
        <div className="var-change-panel">
          <Radar size={34} />
          <span>
            <strong>{data.varChange}</strong>
            <em>较昨日 {data.varDelta}</em>
          </span>
          <p>信用债组合与弱资质主体持仓的风险暴露同步上升。</p>
        </div>
      </section>

      <section className="risk-detail-card glass-card">
        <SectionTitle title="资产影响分析" />
        <div className="asset-impact-list">
          {data.assets.map((asset) => (
            <button type="button" key={asset.name}>
              <WalletCards size={18} />
              <span>
                <strong>{asset.name}</strong>
                <em>{asset.impact}</em>
              </span>
              <b>{asset.exposure}</b>
            </button>
          ))}
        </div>
      </section>

      <section className="risk-detail-card glass-card">
        <SectionTitle title="影响路径" right="AI推演" />
        <div className="spread-path spread-path--market">
          {data.ai.path.map((item, index) => (
            <div key={item}>
              <span>{index + 1}</span>
              <strong>{item}</strong>
              {index < data.ai.path.length - 1 ? <ArrowRight size={16} /> : null}
            </div>
          ))}
        </div>
      </section>

      <AIAnalysisCard ai={data.ai} />
    </RiskAnalysisLayout>
  );
}

function RiskAnalysisLayout({ title, onBack, children }: { title: string; onBack: () => void; children: ReactNode }) {
  return (
    <div className="page risk-analysis-page">
      <div className="page-scroll risk-analysis-scroll">
        <PageHeader
          title={title}
          onBack={onBack}
          action={
            <button className="icon-button" type="button" aria-label="分享">
              <Share2 size={18} />
            </button>
          }
        />
        {children}
      </div>
    </div>
  );
}

function ClientHero({ data }: { data: ClientRiskPanorama }) {
  return (
    <section className="risk-analysis-hero">
      <div>
        <h2>{data.name}</h2>
        <p>更新时间：{data.updateTime}</p>
      </div>
      <span>{data.badge}</span>
      <div className="client-info-grid">
        <InfoPill label="所属行业" value={data.industry} />
        <InfoPill label="敞口规模" value={data.exposure} />
        <InfoPill label="所属子公司" value={data.subsidiary} />
      </div>
    </section>
  );
}

function getReturnTo(state: unknown, fallback: string) {
  if (state && typeof state === "object" && "returnTo" in state) {
    const returnTo = (state as { returnTo?: unknown }).returnTo;
    if (typeof returnTo === "string") {
      return returnTo;
    }
  }

  return fallback;
}

function HeaderHero({ title, badge, updateTime }: { title: string; badge?: string; updateTime: string }) {
  return (
    <section className="risk-analysis-hero">
      <div>
        <h2>{title}</h2>
        <p>更新时间：{updateTime}</p>
      </div>
      {badge ? <span>{badge}</span> : null}
    </section>
  );
}

function SegmentTabs({ items }: { items: string[] }) {
  return (
    <div className="risk-detail-tabs" role="tablist" aria-label="分析维度">
      {items.map((item, index) => (
        <button className={index === 0 ? "is-active" : ""} type="button" role="tab" aria-selected={index === 0} key={item}>
          {item}
        </button>
      ))}
    </div>
  );
}

function InfoPill({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function SectionTitle({ title, right }: { title: string; right?: string }) {
  return (
    <div className="risk-detail-title">
      <h3>{title}</h3>
      {right ? <span>{right}</span> : null}
    </div>
  );
}

function MetricTile({ value, label, sub, highlight = false }: { value: string; label: string; sub: string; highlight?: boolean }) {
  return (
    <div className={`client-metric-tile${highlight ? " is-highlight" : ""}`}>
      <strong>{value}</strong>
      <span>{label}</span>
      <em>{sub}</em>
    </div>
  );
}

function AIAnalysisCard({ ai, probability }: { ai: RiskBriefAI; probability?: number }) {
  return (
    <section className="risk-detail-card ai-risk-judgement glass-card">
      <SectionTitle title="AI风险判断" right={probability ? `出险概率 ${probability}%` : undefined} />
      <div>
        <Sparkles size={16} />
        <p>{ai.conclusion}</p>
      </div>
      <ol>
        {ai.reasons.slice(0, 3).map((reason) => (
          <li key={reason}>{reason}</li>
        ))}
      </ol>
      <strong>{ai.action}</strong>
    </section>
  );
}

function MiniLineChart({ values, labels, height = 70 }: { values: number[]; labels?: string[]; height?: number }) {
  const width = 210;
  const padding = 12;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(max - min, 1);
  const points = values.map((value, index) => {
    const x = padding + (index / Math.max(values.length - 1, 1)) * (width - padding * 2);
    const y = height - padding - ((value - min) / range) * (height - padding * 2);
    return { x, y, value };
  });
  const path = points.map((point) => `${point.x},${point.y}`).join(" ");

  return (
    <div className="detail-line-chart" style={{ minHeight: height }}>
      <svg viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
        <polyline points={path} fill="none" stroke="url(#riskDetailLine)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((point, index) => (
          <circle cx={point.x} cy={point.y} r={index === points.length - 1 ? 4 : 2.4} key={`${point.x}-${point.y}`} />
        ))}
        <defs>
          <linearGradient id="riskDetailLine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ffb15f" />
            <stop offset="100%" stopColor="#ff6a00" />
          </linearGradient>
        </defs>
      </svg>
      {labels ? (
        <div className="detail-line-chart__labels">
          {labels.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
