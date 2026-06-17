import { useNavigate } from "react-router-dom";
import { ChevronRight, Menu, MessageCircleMore } from "lucide-react";
import { BottomAskBar, MiniLineChart, RiskCard, useCopilot } from "../components";
import { entryIcon, homeEntries, reminders } from "../data/mockRisk";

export function HomePage() {
  const navigate = useNavigate();
  const { openCopilot } = useCopilot();

  return (
    <div className="page">
      <div className="page-scroll">
        <StatusBar />

        <div className="home-top-actions">
          <button className="icon-button" type="button" aria-label="打开菜单">
            <Menu size={22} />
          </button>
          <button className="icon-button" type="button" aria-label="打开助手资料">
            <MessageCircleMore size={21} />
          </button>
        </div>

        <section className="hero-greeting" aria-label="问候">
          <div className="ai-avatar" aria-hidden="true">
            <div className="ai-avatar__face">
              <span />
              <span />
            </div>
          </div>
          <h1>早上好，张总</h1>
          <p>我是您的智能风控助手</p>
        </section>

        <section className="brief-card glass-card">
          <h2>今日风险简报</h2>
          <p>
            集团整体风险温度中等偏高，<em>3个等级风险上升</em>，建议重点关注。
          </p>
          <button className="ghost-button" type="button" onClick={() => navigate("/brief")}>
            查看详情
          </button>
        </section>

        <section className="entry-grid" aria-label="四大风险入口">
          {homeEntries.map((entry) => (
            <RiskCard
              key={entry.key}
              title={entry.title}
              subtitle={entry.subtitle}
              temperatureLabel={entry.temperatureLabel}
              metaLabel={entry.metaLabel}
              tagVariant={entry.tagVariant}
              visual={entry.visualType === "line" ? <MiniLineChart data={[12, 20, 17, 31, 28, 44]} /> : entryIcon(entry.visualType)}
              onClick={() =>
                entry.key === "macro"
                  ? navigate("/macro")
                  : entry.key === "credit"
                    ? navigate("/credit")
                  : entry.key === "investment"
                      ? navigate("/investment")
                      : entry.key === "watch"
                        ? navigate("/watch")
                        : openCopilot({ context: `正在分析“${entry.title}”` })
              }
            />
          ))}
        </section>

        <section className="reminder-card glass-card">
          <div className="reminder-card__head">
            <h2>AI 主动提醒</h2>
            <ChevronRight size={22} />
          </div>
          <ul className="reminder-list">
            {reminders.map((reminder) => (
              <li key={reminder.id}>
                <div className="reminder-list__row">
                  <i aria-hidden="true" />
                  <span>
                    {reminder.title}
                    {reminder.badge ? <b className="pill-tag pill-tag--warming">{reminder.badge}</b> : null}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <BottomAskBar onOpen={() => openCopilot({ context: "正在分析“首页风险总览与主动提醒”" })} />
    </div>
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
