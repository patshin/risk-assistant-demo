import { useNavigate } from "react-router-dom";
import {
  Bookmark,
  BookOpenText,
  Building2,
  ChartNoAxesCombined,
  ChevronRight,
  ClipboardList,
  Download,
  FileText,
  Landmark,
  MessageCircle,
  Mic,
  Presentation,
  Save,
  Share2,
  Shield,
  Target,
  UsersRound,
} from "lucide-react";
import { PageHeader, useCopilot } from "../components";

const reportBullets = [
  "地产链条风险升温，部分区域回款放缓，风险敞口上升，需严控资金敞口。",
  "债市波动加剧，久期资产回撤扩大，流动性不确定性上升。",
  "重点客户舆情需关注，个别负面信息扩散，潜在声誉风险提升。",
];

const objectCards = [
  { title: "行业", desc: "地产、建筑、金融", icon: Building2 },
  { title: "客户", desc: "23家高风险客户需关注", icon: UsersRound },
  { title: "资产", desc: "债券、权益、信贷", icon: ChartNoAxesCombined },
  { title: "区域", desc: "华东、华南、华中", icon: Landmark },
];

const reportActions = [
  "加强地产链条客户授信与回款监控，关注资金链承压主体",
  "压降高久期资产敞口，优化投资组合久期与流动性结构",
  "跟踪重点客户舆情动态，制定声誉风险应对预案",
];

const evidenceItems = [
  { text: "1-5月房地产开发投资累计同比下降 10.1%，新开工面积同比 -23.6%", source: "统计局" },
  { text: "本周10Y国债收益率上行18bp，利率债净价指数回撤0.42%", source: "Wind" },
  { text: "监测到3家重点客户负面舆情传播量环比上升 56%", source: "内部监测" },
];

export function ReportPage() {
  const navigate = useNavigate();
  const { openCopilot } = useCopilot();

  return (
    <div className="page report-page">
      <div className="page-scroll report-detail">
        <StatusBar time="09:30" />
        <PageHeader
          title="领导汇报"
          badge={<span className="header-ai-badge">AI生成</span>}
          onBack={() => navigate("/brief")}
          action={
            <div className="header-action-group">
              <button className="icon-button" type="button" aria-label="收藏">
                <Bookmark size={18} />
              </button>
              <button className="icon-button" type="button" aria-label="分享">
                <Share2 size={18} />
              </button>
            </div>
          }
        />

        <section className="report-card report-summary-card glass-card">
          <header>
            <h2>本周风险汇报摘要</h2>
            <span>生成于 09:30</span>
          </header>
          <div className="report-summary-card__body">
            <div className="report-hero-art" aria-hidden="true">
              <Shield size={64} />
            </div>
            <ul>
              {reportBullets.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="report-card glass-card">
          <h2>
            <MessageCircle size={18} />
            一句话汇报口径
          </h2>
          <div className="quote-box">本周集团风险整体偏高，地产链条与债市压力叠加，需重点关注重点客户舆情并强化流动性与敞口管理。</div>
        </section>

        <section className="report-card glass-card">
          <h2>
            <UsersRound size={18} />
            重点影响对象
          </h2>
          <div className="report-object-grid">
            {objectCards.map((item) => (
              <article key={item.title}>
                <item.icon size={20} />
                <strong>{item.title}</strong>
                <p>{item.desc}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="report-card glass-card">
          <h2>
            <Target size={18} />
            建议动作
          </h2>
          <div className="report-action-list">
            {reportActions.map((item) => (
              <button key={item} type="button">
                <span>{item}</span>
                <ChevronRight size={17} />
              </button>
            ))}
          </div>
        </section>

        <section className="report-card glass-card">
          <h2>
            <BookOpenText size={18} />
            支撑证据
          </h2>
          <div className="report-evidence-list">
            {evidenceItems.map((item) => (
              <div key={item.text}>
                <span>{item.text}</span>
                <em>{item.source}</em>
              </div>
            ))}
          </div>
        </section>

        <section className="report-card glass-card">
          <h2>
            <ClipboardList size={18} />
            汇报形式
          </h2>
          <div className="format-options">
            <button type="button">
              <Mic size={18} />
              30秒口播版
            </button>
            <button className="is-selected" type="button">
              <Presentation size={18} />
              一页PPT版
            </button>
            <button type="button">
              <ClipboardList size={18} />
              处置建议版
            </button>
          </div>
        </section>
      </div>

      <div className="report-bottom-actions">
        <button className="primary-button" type="button">
          <Save size={18} />
          保存到汇报库
        </button>
        <button className="ghost-button" type="button">
          <Download size={18} />
          导出PPT/PDF
        </button>
        <button className="ghost-button" type="button" onClick={() => openCopilot({ context: "正在基于领导汇报继续追问" })}>
          <MessageCircle size={18} />
          继续追问
        </button>
      </div>
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
