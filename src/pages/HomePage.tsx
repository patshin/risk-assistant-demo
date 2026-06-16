import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Menu, MessageCircleMore } from "lucide-react";
import { BottomAskBar, BottomSheet, MiniLineChart, RiskCard } from "../components";
import { entryIcon, homeEntries, reminders, type HomeEntry } from "../data/mockRisk";

type SheetState =
  | { type: "assistant" }
  | { type: "entry"; entry: HomeEntry }
  | null;

export function HomePage() {
  const navigate = useNavigate();
  const [sheet, setSheet] = useState<SheetState>(null);

  const sheetTitle = useMemo(() => {
    if (!sheet) {
      return "";
    }
    if (sheet.type === "assistant") {
      return "基于首页继续追问";
    }
    if (sheet.type === "entry") {
      return sheet.entry.title;
    }
    return "";
  }, [sheet]);

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
                        : setSheet({ type: "entry", entry })
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

      <BottomAskBar onOpen={() => setSheet({ type: "assistant" })} />
      <BottomSheet open={sheet !== null} title={sheetTitle} onClose={() => setSheet(null)}>
        {sheet?.type === "assistant" ? <AssistantSheet /> : null}
        {sheet?.type === "entry" ? <EntrySheet entry={sheet.entry} /> : null}
      </BottomSheet>
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

function AssistantSheet() {
  return (
    <div className="assistant-sheet">
      <div className="assistant-prompt">
        <p>我会结合首页的今日简报、四类风险入口和主动提醒回答。可以让我生成汇报、解释风险来源，或把某个信号加入跟踪。</p>
      </div>
      <div className="quick-asks">
        <button type="button">生成今天的领导汇报</button>
        <button type="button">解释地产链条风险</button>
        <button type="button">把债市久期风险加入跟踪</button>
      </div>
      <div className="sheet-note">
        <h3>上下文</h3>
        <p>当前页面：AI 智能风控助手首页。已识别 3 条主动提醒，近期看点待处理 5 项。</p>
      </div>
    </div>
  );
}

function EntrySheet({ entry }: { entry: HomeEntry }) {
  return (
    <div className="assistant-sheet">
      <div className="assistant-prompt">
        <p>{entry.title}当前{entry.metaLabel ?? "风险温度"}为{entry.temperatureLabel}。AI 建议先查看上升项，再判断是否需要生成专项说明或加入重点跟踪。</p>
      </div>
      <div className="quick-asks">
        <button type="button">查看影响对象</button>
        <button type="button">生成处置建议</button>
        <button type="button">继续追问</button>
      </div>
      <div className="sheet-note">
        <h3>覆盖范围</h3>
        <p>{entry.subtitle.replace("\n", "，")}。后续页面会展开为独立风险工作区。</p>
      </div>
    </div>
  );
}
