import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Building2,
  ChevronRight,
  FileText,
  Flame,
  Landmark,
  MessageCircle,
  Share2,
  ShieldAlert,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { PageHeader, PillTag, useCopilot } from "../components";
import {
  impactBrief,
  riskMigrationBrief,
  strategyBrief,
  todayRiskEvents,
  todayRiskTemperature,
  type ImpactBrief,
  type RiskBriefAI,
  type RiskEvent,
  type RiskEventPriority,
  type RiskMigrationBrief,
  type RiskTemperatureBrief,
  type StrategyBrief,
} from "../data/mockRisk";

const priorityVariant: Record<RiskEventPriority, "high" | "mediumHigh" | "warming"> = {
  P0: "high",
  P1: "mediumHigh",
  P2: "warming",
};

const priorityIcon: Record<RiskEventPriority, typeof Flame> = {
  P0: Flame,
  P1: Building2,
  P2: ShieldAlert,
};

export function BriefDetailPage() {
  const navigate = useNavigate();
  const { openCopilot } = useCopilot();

  return (
    <div className="page brief-page">
      <div className="page-scroll brief-detail">
        <StatusBar time="9:41" />
        <PageHeader
          title="今日风险简报"
          onBack={() => navigate("/")}
          action={
            <button className="icon-button" type="button" aria-label="分享">
              <Share2 size={18} />
            </button>
          }
        />

        <RiskTemperatureCard data={todayRiskTemperature} onOpenRoute={navigate} />
        <RiskEventList items={todayRiskEvents} onOpenRoute={navigate} />
        <RiskMigrationPanel data={riskMigrationBrief} onOpenRoute={navigate} />
        <ImpactPanel data={impactBrief} onOpenRoute={navigate} />
        <StrategyPanel data={strategyBrief} onOpenRoute={navigate} />
      </div>

      <div className="brief-bottom-actions">
        <button className="primary-button" type="button" onClick={() => navigate("/report")}>
          <FileText size={18} />
          生成领导汇报
        </button>
        <button className="ghost-button" type="button" onClick={() => openCopilot({ context: "正在基于今日风险简报继续追问" })}>
          <MessageCircle size={18} />
          继续追问
        </button>
      </div>
    </div>
  );
}

function RiskTemperatureCard({ data, onOpenRoute }: { data: RiskTemperatureBrief; onOpenRoute: (route: string) => void }) {
  return (
    <button className="risk-temperature-card glass-card" type="button" onClick={() => onOpenRoute(data.route)}>
      <div className="risk-temperature-card__visual">
        <div className="risk-temperature-card__gauge" aria-label={`风险温度 ${data.temperature}`}>
          <svg viewBox="0 0 128 82" aria-hidden="true">
            <path className="risk-temperature-card__track" d="M18 68a46 46 0 0 1 92 0" />
            <path className="risk-temperature-card__progress" d="M18 68a46 46 0 0 1 78 -33" />
          </svg>
          <strong>{data.temperature}</strong>
          <span>/100</span>
        </div>
      </div>
      <div className="risk-temperature-card__body">
        <span className="risk-temperature-card__eyebrow">风险温度</span>
        <strong>{data.level}</strong>
        <p className="risk-temperature-card__delta">{data.change}</p>
      </div>
      <div className="risk-driver-list">
        <span>主要驱动:</span>
        <p>{data.drivers.join("、")}</p>
      </div>
      <span className="risk-temperature-card__arrow" aria-hidden="true">
        <ChevronRight size={18} />
      </span>
      <AIOutput ai={data.ai} compact />
    </button>
  );
}

function RiskEventList({ items, onOpenRoute }: { items: RiskEvent[]; onOpenRoute: (route: string) => void }) {
  return (
    <section className="brief-section">
      <SectionHeader title="今日必须处理风险" action="查看全部" />
      <div className="risk-event-list">
        {items.map((item) => (
          <RiskEventCard event={item} key={item.id} onOpenRoute={onOpenRoute} />
        ))}
      </div>
    </section>
  );
}

function RiskEventCard({ event, onOpenRoute }: { event: RiskEvent; onOpenRoute: (route: string) => void }) {
  const Icon = priorityIcon[event.priority];

  return (
    <article className={`risk-event-card risk-event-card--${event.priority.toLowerCase()} glass-card`} role="button" tabIndex={0} onClick={() => onOpenRoute(event.route)} onKeyDown={(evt) => evt.key === "Enter" && onOpenRoute(event.route)}>
      <header>
        <div className="risk-event-card__priority">
          <Icon size={17} />
          {event.priority}
        </div>
        <span>{event.typeLabel}</span>
        <PillTag variant={priorityVariant[event.priority]}>{event.badge}</PillTag>
      </header>

      <div className="risk-event-card__body">
        <h3>{event.title}</h3>
        <p>{event.subtitle}</p>
        {event.riskScore ? (
          <div className="risk-event-card__score">
            <span>风险评分</span>
            <strong>{event.riskScore}</strong>
            {event.riskLevelChange ? <em>{event.riskLevelChange}</em> : null}
          </div>
        ) : null}
        <ul>
          {event.signals.slice(0, 3).map((signal) => (
            <li key={signal}>{signal}</li>
          ))}
        </ul>
        <AIOutput ai={event.ai} />
      </div>

      <div className="risk-event-card__actions">
        {event.actions.map((action) => (
          <button
            type="button"
            key={action.label}
            onClick={(evt) => {
              evt.stopPropagation();
              if (action.route) {
                onOpenRoute(action.route);
              }
            }}
          >
            {action.label}
          </button>
        ))}
      </div>
    </article>
  );
}

function RiskMigrationPanel({ data, onOpenRoute }: { data: RiskMigrationBrief; onOpenRoute: (route: string) => void }) {
  const maxFactor = Math.max(...data.factors.map((item) => item.value));

  return (
    <button className="brief-panel risk-migration-panel glass-card" type="button" onClick={() => onOpenRoute(data.route)}>
      <SectionHeader title="风险迁移趋势" action="查看详情" />
      <div className="risk-funnel">
        {data.funnel.map((item, index) => (
          <div className="risk-funnel__node" key={item.label}>
            <span>{item.label}</span>
            <strong>{item.count}</strong>
            <em>{item.delta}</em>
            {index < data.funnel.length - 1 ? <ArrowRight size={18} /> : null}
          </div>
        ))}
      </div>
      <div className="risk-migration-panel__sub">
        {data.subsidiaries.map((item) => (
          <span className={item.tone === "up" ? "is-up" : ""} key={item.name}>
            {item.name}
            <b>{item.change}</b>
          </span>
        ))}
      </div>
      <div className="risk-factor-breakdown">
        {data.factors.map((item) => (
          <div key={item.label}>
            <span>{item.label}</span>
            <i>
              <b style={{ width: `${(item.value / maxFactor) * 100}%` }} />
            </i>
            <em>{item.value}%</em>
          </div>
        ))}
      </div>
      <AIOutput ai={data.ai} />
    </button>
  );
}

function ImpactPanel({ data, onOpenRoute }: { data: ImpactBrief; onOpenRoute: (route: string) => void }) {
  const iconMap = {
    industry: Building2,
    customer: UsersRound,
    subsidiary: Landmark,
    var: ShieldAlert,
    holding: FileText,
  } satisfies Record<ImpactBrief["items"][number]["key"], typeof Building2>;

  return (
    <section className="brief-panel impact-panel glass-card">
      <SectionHeader title="影响对象（结构视角）" />
      <div className="impact-strip" aria-label="影响对象入口">
        {data.items.map((item) => {
          const Icon = iconMap[item.key];
          return (
            <button type="button" key={item.key} onClick={() => onOpenRoute(item.route)}>
              <span>
                <Icon size={20} />
              </span>
              <strong>{item.title}</strong>
              <em>{item.detail}</em>
            </button>
          );
        })}
      </div>
      <AIOutput ai={data.ai} />
    </section>
  );
}

function StrategyPanel({ data, onOpenRoute }: { data: StrategyBrief; onOpenRoute: (route: string) => void }) {
  return (
    <section className="brief-panel strategy-panel glass-card">
      <SectionHeader title="AI策略建议" action="查看全部" />
      <div className="strategy-list">
        {data.items.map((item) => (
          <button type="button" key={item.scope} onClick={() => onOpenRoute(item.route)}>
            <span>
              <strong>{item.scope}</strong>
              {item.suggestion}
            </span>
            <ChevronRight size={17} />
          </button>
        ))}
      </div>
      <AIOutput ai={data.ai} />
    </section>
  );
}

function AIOutput({ ai, compact = false }: { ai: RiskBriefAI; compact?: boolean }) {
  return (
    <div className={`brief-ai-output${compact ? " brief-ai-output--compact" : ""}`}>
      <h4>
        <Sparkles size={14} />
        AI判断
      </h4>
      <p>{ai.conclusion}</p>
      <ol>
        {ai.reasons.slice(0, 3).map((reason) => (
          <li key={reason}>{reason}</li>
        ))}
      </ol>
      <strong>{ai.action}</strong>
    </div>
  );
}

function SectionHeader({ title, action }: { title: string; action?: string }) {
  return (
    <div className="brief-section-title">
      <h2>{title}</h2>
      {action ? (
        <span>
          {action}
          <ChevronRight size={14} />
        </span>
      ) : null}
    </div>
  );
}

function StatusBar({ time }: { time: string }) {
  return (
    <div className="status-bar" aria-hidden="true">
      <span>{time}</span>
      <div className="status-bar__icons">
        <span className="signal">
          <span />
          <span />
          <span />
        </span>
        <span>Wi-Fi</span>
        <span className="battery" />
      </div>
    </div>
  );
}
