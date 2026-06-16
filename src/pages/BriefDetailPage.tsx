import { useState } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  ChartNoAxesCombined,
  ChevronRight,
  CircleAlert,
  FileText,
  Flame,
  Landmark,
  LineChart,
  MessageCircle,
  Share2,
  ShieldCheck,
  ThermometerSun,
  UsersRound,
} from "lucide-react";
import { BottomSheet, PageHeader, PillTag } from "../components";

type SheetType = "impact" | "action" | null;

const summaryItems = [
  "地产链条资金压力扩散，部分区域回款放缓，风险敞口上升。",
  "债市收益率波动加剧，久期资产回撤扩大，需关注流动性变化。",
  "个别重点客户舆情热度上升，潜在声誉与合作稳定性风险。",
];

const riskRows = [
  {
    title: "地产链条风险升温",
    level: "高",
    score: "+8",
    icon: Building2,
    tone: "danger",
    bullets: ["房企销售走弱", "回款延迟增多", "供应商资金占用上升"],
    actions: ["影响链路", "处置建议", "加入跟踪"],
  },
  {
    title: "债市波动加剧",
    level: "中高",
    score: "+6",
    icon: LineChart,
    tone: "warning",
    bullets: ["收益率快速上行", "信用利差走阔", "久期资产回撤"],
    actions: ["压力影响", "投资点评", "加入跟踪"],
  },
  {
    title: "重点客户舆情预警",
    level: "中",
    score: "+5",
    icon: UsersRound,
    tone: "watch",
    bullets: ["舆情热度上升", "负面信息扩散", "合作稳定性存疑"],
    actions: ["客户清单", "跟踪任务", "加入跟踪"],
  },
];

const causeItems = [
  { label: "宏观周期", value: "+2.1", width: "86%" },
  { label: "金融市场", value: "+1.8", width: "74%" },
  { label: "信用事件", value: "+1.3", width: "58%" },
  { label: "舆情研报", value: "+0.8", width: "42%" },
];

const impactObjects = [
  { title: "重点行业", desc: "地产、建筑、金融", icon: Building2 },
  { title: "重点客户", desc: "23家客户需关注", icon: UsersRound },
  { title: "重点资产", desc: "债券、权益、信贷", icon: ChartNoAxesCombined },
  { title: "重点区域", desc: "华东、华南、华中", icon: Landmark },
];

const nextSteps = [
  "加强地产链条客户授信与回款监控，关注资金链承压主体",
  "优化债券组合久期，关注流动性与利率拐点信号",
  "跟踪重点客户舆情动态，制定声誉风险应对预案",
];

export function BriefDetailPage() {
  const navigate = useNavigate();
  const [sheet, setSheet] = useState<SheetType>(null);

  return (
    <div className="page brief-page">
      <div className="page-scroll brief-detail">
        <StatusBar time="23:06" />
        <PageHeader
          title="今日风险简报"
          onBack={() => navigate("/")}
          action={
            <button className="icon-button" type="button" aria-label="分享">
              <Share2 size={18} />
            </button>
          }
        />

        <section className="risk-hero glass-card">
          <div className="risk-hero__copy">
            <span className="ai-chip">AI已完成今日风险巡检</span>
            <h2>
              集团风险温度：<strong>中等偏高</strong>
            </h2>
            <div className="risk-score">
              <strong>68</strong>
              <span>/ 100</span>
              <em>+6 vs 昨日</em>
            </div>
            <p>主要受地产链条、债市波动与重点客户舆情影响。</p>
          </div>
          <div className="risk-hero__thermo" aria-hidden="true">
            <ThermometerSun size={58} />
          </div>
        </section>

        <section className="brief-card-block glass-card">
          <h2>
            <CircleAlert size={17} />
            AI 风险摘要
          </h2>
          <ol className="number-list">
            {summaryItems.map((item, index) => (
              <li key={item}>
                <span>{index + 1}</span>
                <p>{item}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="brief-card-block glass-card">
          <h2>今日重点风险</h2>
          <div className="risk-list">
            {riskRows.map((risk, index) => (
              <article className={`risk-row risk-row--${risk.tone}`} key={risk.title}>
                <div className="risk-row__icon">
                  <risk.icon size={24} />
                </div>
                <div className="risk-row__main">
                  <header>
                    <h3>{risk.title}</h3>
                    <PillTag variant={index === 0 ? "high" : index === 1 ? "mediumHigh" : "watch"}>{risk.level}</PillTag>
                    <strong>{risk.score}↗</strong>
                  </header>
                  <ul>
                    {risk.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                </div>
                <div className="risk-row__actions">
                  {risk.actions.map((action) => (
                    <button
                      type="button"
                      key={action}
                      onClick={
                        action === "影响链路"
                          ? () => setSheet("impact")
                          : action === "处置建议"
                            ? () => setSheet("action")
                            : undefined
                      }
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="brief-two-col">
          <section className="brief-card-block glass-card">
            <h2>风险变化归因</h2>
            <div className="cause-list">
              {causeItems.map((item) => (
                <div className="cause-item" key={item.label}>
                  <span>{item.label}</span>
                  <div>
                    <i style={{ width: item.width }} />
                  </div>
                  <em>{item.value}</em>
                </div>
              ))}
            </div>
          </section>

          <section className="brief-card-block glass-card">
            <h2>可能影响对象</h2>
            <div className="impact-grid">
              {impactObjects.map((item) => (
                <article key={item.title}>
                  <item.icon size={20} />
                  <strong>{item.title}</strong>
                  <p>{item.desc}</p>
                </article>
              ))}
            </div>
          </section>
        </div>

        <section className="brief-card-block glass-card">
          <h2>AI建议下一步</h2>
          <div className="next-step-list">
            {nextSteps.map((step) => (
              <button type="button" key={step}>
                <span>{step}</span>
                <ChevronRight size={17} />
              </button>
            ))}
          </div>
        </section>
      </div>

      <div className="brief-bottom-actions">
        <button className="primary-button" type="button" onClick={() => navigate("/report")}>
          <FileText size={18} />
          生成领导汇报
        </button>
        <button className="ghost-button" type="button">
          <MessageCircle size={18} />
          继续追问
        </button>
      </div>

      <BottomSheet
        open={sheet !== null}
        title={
          sheet === "impact" ? (
            <>
              风险传导链路 <span className="sheet-title-tag">AI推理结果</span>
            </>
          ) : (
            <>
              AI处置建议 <span className="sheet-title-tag">AI生成</span>
            </>
          )
        }
        onClose={() => setSheet(null)}
      >
        {sheet === "impact" ? <ImpactSheet /> : null}
        {sheet === "action" ? <ActionSheet /> : null}
      </BottomSheet>
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

function ImpactSheet() {
  const chain = ["地产销售偏弱", "房企现金流承压", "上下游回款放缓", "相关客户经营压力上升", "集团授信/债券敞口承压"];
  const evidence = [
    ["商品房销售同比走弱", "国家统计局", "06/16 08:45"],
    ["相关主体融资压力上升", "Wind资讯", "06/16 08:15"],
    ["上游账期延长", "企业调研纪要", "06/16 07:50"],
  ];

  return (
    <div className="impact-sheet">
      <section className="sheet-summary">
        <ShieldCheck size={42} />
        <p>
          <strong>地产链条风险正在向集团信用与投资侧传导。</strong>
          受销售偏弱影响，房企现金流承压，回款放缓，进而影响集团授信与债券等投资敞口。
        </p>
      </section>

      <SheetSection title="风险传导链路">
        <div className="chain-flow">
          {chain.map((item) => (
            <div className="chain-node" key={item}>
              <LineChart size={21} />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </SheetSection>

      <SheetSection title="可能影响对象">
        <div className="sheet-impact-grid">
          {impactObjects.map((item) => (
            <article key={item.title}>
              <item.icon size={20} />
              <strong>{item.title}</strong>
              <p>{item.desc}</p>
            </article>
          ))}
        </div>
      </SheetSection>

      <SheetSection title="关键证据">
        <div className="evidence-list">
          {evidence.map(([text, source, time]) => (
            <div key={text}>
              <span>{text}</span>
              <em>{source}</em>
              <small>{time}</small>
            </div>
          ))}
        </div>
      </SheetSection>

      <div className="sheet-action-row">
        <button className="primary-button" type="button">
          <UsersRound size={17} />
          查看受影响客户
        </button>
        <button className="ghost-button" type="button">
          <MessageCircle size={17} />
          生成汇报话术
        </button>
        <button className="ghost-button" type="button">
          <CircleAlert size={17} />
          继续追问
        </button>
      </div>
    </div>
  );
}

function ActionSheet() {
  const actionGroups = [
    {
      title: "立即行动",
      items: [
        { title: "加强授信与回款监控", desc: ["收紧新增信贷节奏，重点审核高风险行业", "加强回款监控，预警逾期与异常账户"], cta: "创建跟踪任务", icon: Flame },
        { title: "关注重点风险主体", desc: ["23家重点客户风险事件跟踪", "关注舆情、评级与经营变动"], cta: "查看重点客户", icon: UsersRound },
      ],
    },
    {
      title: "进一步排查",
      items: [
        { title: "排查担保/关联敞口", desc: ["梳理对外担保及交叉担保情况", "排查关联交易及隐性敞口风险"], cta: "生成排查清单", icon: ShieldCheck },
        { title: "评估市场与组合影响", desc: ["评估债市波动对组合净值影响", "测算风险敞口与潜在损失范围"], cta: "查看压力影响", icon: ChartNoAxesCombined },
      ],
    },
  ];

  return (
    <div className="action-sheet">
      <section className="sheet-summary">
        <ShieldCheck size={42} />
        <p>
          <strong>针对地产链条风险升温，建议从授信监控、风险排查和领导汇报三方面同步推进。</strong>
        </p>
      </section>

      {actionGroups.map((group) => (
        <SheetSection key={group.title} title={group.title}>
          <div className="action-card-grid">
            {group.items.map((item) => (
              <article key={item.title}>
                <item.icon size={22} />
                <h3>{item.title}</h3>
                <ul>
                  {item.desc.map((desc) => (
                    <li key={desc}>{desc}</li>
                  ))}
                </ul>
                <button type="button">
                  {item.cta}
                  <ChevronRight size={16} />
                </button>
              </article>
            ))}
          </div>
        </SheetSection>
      ))}

      <SheetSection title="汇报与协同">
        <div className="coordination-list">
          <button type="button">
            <FileText size={20} />
            <span>
              <strong>生成领导汇报摘要</strong>
              一键生成简报要点与风险应对建议
            </span>
            <ChevronRight size={17} />
          </button>
          <button type="button">
            <UsersRound size={20} />
            <span>
              <strong>同步至本周风险例会</strong>
              共享风险要点与处置进展
            </span>
            <ChevronRight size={17} />
          </button>
        </div>
      </SheetSection>

      <SheetSection title="建议优先级">
        <div className="priority-row">
          <span className="priority priority--high">高优先级</span>
          <span className="priority priority--week">本周完成</span>
          <span className="priority priority--green">影响授信与投资</span>
        </div>
      </SheetSection>

      <div className="sheet-action-row sheet-action-row--three">
        <button className="primary-button" type="button">创建跟踪任务</button>
        <button className="ghost-button" type="button">生成排查清单</button>
        <button className="ghost-button" type="button">继续追问</button>
      </div>
    </div>
  );
}

function SheetSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="sheet-section">
      <h3>{title}</h3>
      {children}
    </section>
  );
}
