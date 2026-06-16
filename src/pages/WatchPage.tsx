import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  Bell,
  Building2,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Flame,
  Globe2,
  Landmark,
  ListFilter,
  MessageCircle,
  Megaphone,
  PieChart,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { BottomAskBar, PageHeader, PillTag } from "../components";

const todayItems = [
  {
    title: "地产政策边际放松，关注销售修复持续性",
    level: "高",
    source: "政策与经营",
    time: "10 分钟前",
    ai: "政策宽松预期，但销售与回款修复仍需验证。",
    actions: ["查看影响链路", "加入跟踪"],
  },
  {
    title: "债市波动加剧，10Y 利率上行至 2.35%",
    level: "中",
    source: "市场异动",
    time: "25 分钟前",
    ai: "久期资产估值压力上升，建议密切关注利率结果。",
    actions: ["查看压力影响", "加入跟踪"],
  },
  {
    title: "某省城投平台再融资压力上升",
    level: "中",
    source: "区域风险",
    time: "1 小时前",
    ai: "区域融资收缩与隐性债偿压共振，需关注相关客户敞口。",
    actions: ["查看客户", "生成排查清单"],
  },
];

const trackingPreview = [
  { title: "地产链条风险", status: "升温中", meta: "已跟踪 3 天 ｜ 新增 4 家相关客户预警", icon: Building2 },
  { title: "债市波动风险", status: "观察中", meta: "已跟踪 5 天 ｜ 信用利差仍走阔", icon: BarChart3 },
];

const summaryStats = [
  { label: "风险预警总数", value: "32", change: "较昨日 +6", icon: Bell },
  { label: "新增预警", value: "5", change: "较昨日 +2", icon: Megaphone },
  { label: "处置中事项", value: "12", change: "较昨日 -1", icon: ClipboardList },
  { label: "已完成事项", value: "9", change: "较昨日 +3", icon: CheckCircle2 },
];

const trackingItems = [
  {
    title: "地产链条风险",
    status: "升温中",
    days: "已跟踪 3 天",
    update: "10 分钟前更新",
    ai: "销售修复偏弱与回款压力共振，相关客户预警增加。",
    latest: "新增 4 家相关客户预警，1 条舆情信号升温。",
    actions: ["查看详情", "生成排查清单"],
    icon: Building2,
  },
  {
    title: "债市波动风险",
    status: "观察中",
    days: "已跟踪 5 天",
    update: "25 分钟前更新",
    ai: "利率上行与信用利差走阔并存，久期资产承压。",
    latest: "10Y 利率上行至 2.35%，信用利差扩大 9bp。",
    actions: ["查看压力影响", "更新汇报"],
    icon: BarChart3,
  },
  {
    title: "某省城投再融资风险",
    status: "观察中",
    days: "已跟踪 2 天",
    update: "1 小时前更新",
    ai: "区域融资收缩与隐债化解压力共振。",
    latest: "相关平台融资成本上升，需关注关联客户敞口。",
    actions: ["查看客户", "生成排查清单"],
    icon: Landmark,
  },
  {
    title: "重点客户舆情风险",
    status: "升温中",
    days: "已跟踪 4 天",
    update: "2 小时前更新",
    ai: "负面舆情与经营压力信号叠加。",
    latest: "新增 2 条负面舆情，涉及地产与建筑客户。",
    actions: ["查看客户", "继续追问"],
    icon: Megaphone,
  },
  {
    title: "组合久期风险",
    status: "趋稳",
    days: "已跟踪 7 天",
    update: "今天更新",
    ai: "利率敏感仍需关注，但短期波动趋缓。",
    latest: "压力测试结果较昨日改善，组合回撤风险小幅回落。",
    actions: ["查看压力测试", "生成简报"],
    icon: PieChart,
  },
];

const todayAllItems = [
  ...todayItems,
  {
    title: "重点客户负面舆情热度上升",
    level: "高",
    source: "信用",
    time: "2 小时前",
    ai: "负面信息扩散速度加快，建议同步客户经理复核敞口。",
    actions: ["查看客户", "加入跟踪"],
  },
  {
    title: "权益成长板块回撤扩大",
    level: "中",
    source: "投资",
    time: "3 小时前",
    ai: "组合波动可能上升，建议关注权益仓位和压力测试结果。",
    actions: ["查看压力影响", "生成点评"],
  },
];

const todayFilters = ["全部", "高优先级", "宏观", "信用", "投资", "政策", "市场"];
const trackingFilters = ["全部", "升温中", "观察中", "趋稳", "宏观", "信用", "投资"];

export function WatchPage() {
  const navigate = useNavigate();

  return (
    <div className="page watch-page">
      <div className="page-scroll watch-detail">
        <StatusBar />
        <PageHeader title="近期看点" onBack={() => navigate("/")} />

        <AISummary
          title="AI 今日总览"
          body="今日新增 3 条重点风险，2 条建议进入本周汇报，1 条建议立即跟踪。"
          chips={["宏观 1", "信用 1", "投资 1"]}
          action="查看简报"
        />

        <SectionTitle title="今日重点" action="全部" onAction={() => navigate("/watch/today")} />
        <div className="today-focus-list">
          {todayItems.map((item) => (
            <TodayFocusCard key={item.title} item={item} />
          ))}
        </div>

        <SectionTitle title="重点跟踪速览" action="全部" onAction={() => navigate("/watch/tracking")} />
        <section className="tracking-preview-card glass-card">
          {trackingPreview.map((item) => (
            <article key={item.title}>
              <item.icon size={22} />
              <strong>{item.title}</strong>
              <PillTag variant={item.status === "升温中" ? "warming" : "tracked"}>{item.status}</PillTag>
              <span>{item.meta}</span>
              <ChevronRight size={17} />
            </article>
          ))}
        </section>

        <SectionTitle title="数据摘要" />
        <div className="watch-stat-grid">
          {summaryStats.map((item) => (
            <article className="watch-stat-card glass-card" key={item.label}>
              <item.icon size={24} />
              <div>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
                <em>{item.change}</em>
              </div>
            </article>
          ))}
        </div>

        <SectionTitle title="领导指引" />
        <section className="leader-guidance glass-card">
          <p>请重点关注地产链条风险传导及重点客户现金流情况，做好前瞻预警。</p>
          <footer>集团风险委员会　06-01</footer>
        </section>
      </div>

      <BottomAskBar onOpen={() => undefined} />
    </div>
  );
}

export function TodayFocusPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("全部");

  return (
    <div className="page watch-page">
      <div className="page-scroll watch-detail">
        <StatusBar />
        <PageHeader title="今日重点" onBack={() => navigate("/watch")} />
        <AISummary
          title="AI 今日摘要"
          body="今日重点事项集中在地产政策、债市波动与城投再融资压力，建议优先处理高优先级与信用相关事项。"
          chips={["高优先级 2", "宏观 1", "信用 2"]}
          action="生成今日简报"
        />
        <ChipRow items={todayFilters} active={filter} onChange={setFilter} />
        <div className="today-focus-list">
          {todayAllItems.map((item) => (
            <TodayFocusCard key={item.title} item={item} />
          ))}
        </div>
        <AIActionCard items={["将高优先级事项加入本周汇报。", "同步地产链条与城投风险至重点跟踪。"]} />
      </div>
      <BottomAskBar onOpen={() => undefined} />
    </div>
  );
}

export function TrackingListPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("全部");

  return (
    <div className="page watch-page">
      <div className="page-scroll watch-detail">
        <StatusBar />
        <PageHeader
          title="重点跟踪"
          onBack={() => navigate("/watch")}
          action={
            <button className="icon-button" type="button" aria-label="筛选">
              <ListFilter size={18} />
            </button>
          }
        />
        <AISummary
          title="AI 跟踪总览"
          body="当前跟踪 6 项重点风险，其中 2 项升温、3 项观察中、1 项趋稳。建议优先关注地产链条与债市波动。"
          chips={["升温中 2", "观察中 3", "趋稳 1"]}
          action="生成跟踪简报"
        />
        <ChipRow items={trackingFilters} active={filter} onChange={setFilter} />
        <div className="tracking-card-list">
          {trackingItems.map((item) => (
            <TrackingCard key={item.title} item={item} />
          ))}
        </div>
        <AIActionCard items={["本周建议优先复核地产链条相关客户的授信与回款监控。", "同步更新债市波动与组合久期风险至本周例会材料。"]} />
      </div>
      <BottomAskBar onOpen={() => undefined} />
    </div>
  );
}

function AISummary({ title, body, chips, action }: { title: string; body: string; chips: string[]; action: string }) {
  return (
    <section className="watch-ai-summary glass-card">
      <div className="watch-ai-badge">AI</div>
      <div>
        <h2>{title}</h2>
        <p>{body}</p>
        <div className="watch-summary-chips">
          {chips.map((chip) => (
            <span key={chip}>{chip}</span>
          ))}
        </div>
      </div>
      <button type="button">
        {action}
        <ChevronRight size={16} />
      </button>
    </section>
  );
}

function SectionTitle({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <div className="watch-section-title">
      <h2>{title}</h2>
      {action ? (
        <button type="button" onClick={onAction}>
          {action}
          <ChevronRight size={15} />
        </button>
      ) : null}
    </div>
  );
}

function TodayFocusCard({ item }: { item: (typeof todayItems)[number] }) {
  return (
    <article className="today-focus-card glass-card">
      <div className={`today-level today-level--${item.level === "高" ? "high" : "middle"}`}>{item.level}</div>
      <div>
        <header>
          <h3>{item.title}</h3>
          <span>{item.source} · {item.time}</span>
        </header>
        <p>
          <Sparkles size={14} />
          AI 判断：{item.ai}
        </p>
        <div className="watch-action-row">
          {item.actions.map((action) => (
            <button type="button" key={action}>
              {action}
              <ChevronRight size={15} />
            </button>
          ))}
        </div>
      </div>
    </article>
  );
}

function TrackingCard({ item }: { item: (typeof trackingItems)[number] }) {
  return (
    <article className="tracking-risk-card glass-card">
      <div className="tracking-risk-card__icon">
        <item.icon size={25} />
      </div>
      <div>
        <header>
          <h3>{item.title}</h3>
          <PillTag variant={item.status === "升温中" ? "warming" : item.status === "趋稳" ? "tracked" : "watch"}>{item.status}</PillTag>
        </header>
        <span>{item.days} ｜ {item.update}</span>
        <p><Sparkles size={14} /> AI 判断：{item.ai}</p>
        <p><Flame size={14} /> 最新变化：{item.latest}</p>
        <div className="watch-action-row">
          {item.actions.map((action) => (
            <button type="button" key={action}>
              {action}
              <ChevronRight size={15} />
            </button>
          ))}
        </div>
      </div>
      <ChevronRight size={18} />
    </article>
  );
}

function ChipRow({ items, active, onChange }: { items: string[]; active: string; onChange: (item: string) => void }) {
  return (
    <div className="watch-chip-row">
      {items.map((item) => (
        <button className={item === active ? "is-active" : ""} type="button" key={item} onClick={() => onChange(item)}>
          {item}
        </button>
      ))}
    </div>
  );
}

function AIActionCard({ items }: { items: string[] }) {
  return (
    <section className="watch-ai-actions glass-card">
      <h2>
        <Sparkles size={18} />
        AI 建议动作
      </h2>
      {items.map((item) => (
        <button type="button" key={item}>
          <ShieldCheck size={18} />
          <span>{item}</span>
          <ChevronRight size={17} />
        </button>
      ))}
    </section>
  );
}

function StatusBar() {
  return (
    <div className="status-bar" aria-hidden="true">
      <span>9:41</span>
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
