import { createElement, type ReactNode } from "react";
import { Bell, CircleUserRound, Landmark, PieChart } from "lucide-react";

export type HomeEntry = {
  key: string;
  title: string;
  subtitle: string;
  temperatureLabel: string;
  metaLabel?: string | null;
  tagVariant: "high" | "mediumHigh" | "watch" | "warming" | "tracked" | "neutral";
  visualType: "line" | "user" | "donut" | "bell";
};

export type Reminder = {
  id: string;
  title: string;
  badge?: string;
  detail: string;
  suggestion: string;
};

export const homeEntries: HomeEntry[] = [
  {
    key: "macro",
    title: "宏观风险",
    subtitle: "周期性 / 系统性\n金融市场",
    temperatureLabel: "中高",
    tagVariant: "mediumHigh",
    visualType: "line",
  },
  {
    key: "credit",
    title: "信用风险",
    subtitle: "大户 / 集中度\n行业信用",
    temperatureLabel: "较高",
    tagVariant: "high",
    visualType: "user",
  },
  {
    key: "investment",
    title: "投资风险",
    subtitle: "组合风险\n压力测试",
    temperatureLabel: "中等",
    tagVariant: "watch",
    visualType: "donut",
  },
  {
    key: "watch",
    title: "近期看点",
    subtitle: "重点预警 / 数据摘要\n领导指引",
    temperatureLabel: "待处理 5",
    metaLabel: null,
    tagVariant: "warming",
    visualType: "bell",
  },
];

export const reminders: Reminder[] = [
  {
    id: "estate",
    title: "地产链条风险信号升温",
    badge: "新",
    detail: "AI 识别到 6 家关联企业现金流覆盖率下行，供应商回款周期连续两周拉长。",
    suggestion: "建议将地产链条加入重点跟踪，并生成一页式领导汇报。",
  },
  {
    id: "bond",
    title: "债市波动加剧，关注久期风险",
    detail: "长久期债券组合对利率上行更敏感，本周压力情景下净值回撤扩大。",
    suggestion: "建议复核久期暴露，关注低流动性持仓的处置窗口。",
  },
  {
    id: "public",
    title: "重点客户出现舆情预警",
    detail: "重点客户近 24 小时负面信息热度上升，关联授信余额与担保链条需要复核。",
    suggestion: "建议联动客户经理补充尽调，并将处置进度同步到近期看点。",
  },
];

export function entryIcon(type: HomeEntry["visualType"]): ReactNode {
  if (type === "user") {
    return createElement(CircleUserRound, { size: 42, strokeWidth: 1.7 });
  }

  if (type === "donut") {
    return createElement(PieChart, { size: 44, strokeWidth: 1.6 });
  }

  if (type === "bell") {
    return createElement(Bell, { size: 44, strokeWidth: 1.6 });
  }

  return createElement(Landmark, { size: 42, strokeWidth: 1.6 });
}
