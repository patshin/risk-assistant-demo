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

export type AIAlertTickerItem = {
  id: string;
  title: string;
  isHot: boolean;
  route?: string;
};

export type AIAlertNewsItem = {
  id: string;
  time: string;
  isNew?: boolean;
  title: string;
  summary: string;
  tags: string[];
  route: string;
};

export type RiskBriefAI = {
  conclusion: string;
  reasons: string[];
  action: string;
};

export type RiskTemperatureBrief = {
  temperature: number;
  change: string;
  level: string;
  drivers: string[];
  ai: RiskBriefAI;
  route: string;
};

export type RiskEventPriority = "P0" | "P1" | "P2";

export type RiskEventAction = {
  label: string;
  route?: string;
};

export type RiskEvent = {
  id: string;
  priority: RiskEventPriority;
  typeLabel: string;
  title: string;
  subtitle: string;
  badge: string;
  riskLevelChange?: string;
  riskScore?: number;
  signals: string[];
  ai: RiskBriefAI;
  route: string;
  actions: RiskEventAction[];
};

export type RiskMigrationBrief = {
  route: string;
  funnel: Array<{
    label: string;
    count: number;
    delta: string;
  }>;
  subsidiaries: Array<{
    name: string;
    change: string;
    tone: "up" | "watch";
  }>;
  factors: Array<{
    label: string;
    value: number;
  }>;
  ai: RiskBriefAI;
};

export type ImpactBrief = {
  items: Array<{
    key: "industry" | "customer" | "subsidiary" | "var" | "holding";
    title: string;
    detail: string;
    route: string;
  }>;
  ai: RiskBriefAI;
};

export type StrategyBrief = {
  route: string;
  items: Array<{
    scope: string;
    suggestion: string;
    route: string;
  }>;
  ai: RiskBriefAI;
};

export type ClientRiskPanorama = {
  name: string;
  industry: string;
  exposure: string;
  subsidiary: string;
  updateTime: string;
  badge: string;
  level: string;
  levelChange: string;
  score: number;
  scoreChange: string;
  trend: number[];
  timeline: Array<{
    label: string;
    date: string;
    state: "done" | "current" | "future";
  }>;
  sources: Array<{
    label: string;
    value: number;
    detail: string;
  }>;
  signals: Array<{
    title: string;
    detail: string;
  }>;
  ai: RiskBriefAI & {
    defaultProbability: number;
  };
};

export type IndustryRiskAnalysis = {
  name: string;
  updateTime: string;
  badge: string;
  index: number;
  indexChange: string;
  trend: Array<{ label: string; value: number }>;
  features: string[];
  impact: Array<{ label: string; value: string }>;
  topCustomers: Array<{ name: string; score: number }>;
  ai: RiskBriefAI & {
    spreadPath: string[];
  };
};

export type MarketShockAnalysis = {
  title: string;
  updateTime: string;
  spreadChange: string;
  spreadDelta: string;
  trend: Array<{ label: string; value: number }>;
  varChange: string;
  varDelta: string;
  assets: Array<{
    name: string;
    impact: string;
    exposure: string;
  }>;
  ai: RiskBriefAI & {
    path: string[];
  };
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
    subtitle: "规模 / 收益 / VaR",
    temperatureLabel: "需关注",
    tagVariant: "mediumHigh",
    visualType: "donut",
  },
  {
    key: "watch",
    title: "个人工作台",
    subtitle: "重点预警 / 数据摘要\n领导指引",
    temperatureLabel: "待处理 5",
    metaLabel: null,
    tagVariant: "warming",
    visualType: "bell",
  },
];

export const todayRiskTemperature: RiskTemperatureBrief = {
  temperature: 68,
  change: "+6 vs 昨日",
  level: "中等偏高",
  drivers: ["地产链压力", "债市波动", "大客户舆情"],
  route: "/risk/migration",
  ai: {
    conclusion: "今天最需要关注的是信用风险从预警向出险迁移。",
    reasons: ["华东建设集团风险评分抬升至 86。", "地产链现金流压力与债市波动同步升温。", "平安银行、寿险相关客户暴露有重叠。"],
    action: "建议先处理 P0 大客户风险，再启动地产链组合排查。",
  },
};

export const todayRiskEvents: RiskEvent[] = [
  {
    id: "east-construction",
    priority: "P0",
    typeLabel: "大客户风险",
    title: "华东建设集团",
    subtitle: "正常 → 预警，存在出险迁移风险",
    badge: "预警 → 出险风险",
    riskLevelChange: "正常 → 一级预警",
    riskScore: 86,
    signals: ["现金流净流入弱化", "新增司法执行", "负面舆情升温"],
    route: "/risk/client/east-construction",
    actions: [
      { label: "查看详情", route: "/risk/client/east-construction" },
      { label: "加入跟踪" },
      { label: "生成处置方案" },
    ],
    ai: {
      conclusion: "短期流动性断裂概率上升，需要按最高优先级处理。",
      reasons: ["现金流覆盖率连续两周下滑。", "商票逾期与司法信息同时出现。", "与地产链上下游客户存在担保和回款关联。"],
      action: "建议纳入一级跟踪，并在今日内形成授信与担保排查清单。",
    },
  },
  {
    id: "real-estate-chain",
    priority: "P1",
    typeLabel: "行业风险",
    title: "地产链资金收缩加剧",
    subtitle: "行业进入流动性收缩阶段",
    badge: "行业风险",
    signals: ["回款周期延长", "融资成本上升", "建筑工程客户承压"],
    route: "/risk/industry/real-estate-chain",
    actions: [
      { label: "趋势分析", route: "/risk/industry/real-estate-chain" },
      { label: "影响客户" },
      { label: "应对建议" },
    ],
    ai: {
      conclusion: "地产链风险已经从单点客户扩散为行业链条压力。",
      reasons: ["销售回款恢复弱于预期。", "建筑工程和建材客户账期拉长。", "城投与地产上下游客户风险存在交叉。"],
      action: "建议对地产—建筑—城投传导链路建立专项监控。",
    },
  },
  {
    id: "market-shock",
    priority: "P2",
    typeLabel: "市场/黑天鹅",
    title: "债市利差快速扩大",
    subtitle: "市场风险可能放大信用再定价",
    badge: "市场风险",
    signals: ["利率下行加速", "信用利差扩大", "低评级主体估值波动"],
    route: "/risk/market/shock",
    actions: [
      { label: "市场分析", route: "/risk/market/shock" },
      { label: "组合影响" },
      { label: "对冲建议" },
    ],
    ai: {
      conclusion: "债市波动可能放大弱资质客户的再融资压力。",
      reasons: ["信用利差走阔压低再融资可得性。", "低评级信用债成交折价扩大。", "部分客户授信与投资组合风险同时暴露。"],
      action: "建议同步复核信用债持仓与重点授信客户名单。",
    },
  },
];

export const riskMigrationBrief: RiskMigrationBrief = {
  route: "/risk/migration",
  funnel: [
    { label: "正常", count: 345, delta: "+68" },
    { label: "预警", count: 63, delta: "+16" },
    { label: "出险", count: 15, delta: "+5" },
  ],
  subsidiaries: [
    { name: "平安银行", change: "+6 高风险客户", tone: "up" },
    { name: "平安寿险", change: "+4 预警客户", tone: "up" },
    { name: "平安资管", change: "组合波动升温", tone: "watch" },
  ],
  factors: [
    { label: "现金流承压", value: 38 },
    { label: "舆情升温", value: 24 },
    { label: "债市波动", value: 21 },
    { label: "担保链复杂", value: 17 },
  ],
  ai: {
    conclusion: "风险迁移正在从预警端向出险端加速。",
    reasons: ["正常转预警客户较昨日增加 16 家。", "现金流承压仍是最大迁移驱动。", "平安银行与寿险客户池存在风险重合。"],
    action: "建议今天先锁定 15 家出险客户和 63 家预警客户中的高关联主体。",
  },
};

export const impactBrief: ImpactBrief = {
  items: [
    { key: "industry", title: "重点行业", detail: "4 个行业升温", route: "/risk/industry/real-estate-chain" },
    { key: "customer", title: "重点客户", detail: "4-9 家重点", route: "/risk/client/east-construction" },
    { key: "holding", title: "重点持仓", detail: "双重关注", route: "/risk/holding/key" },
    { key: "var", title: "VaR 上升", detail: "3.1%", route: "/risk/var" },
    { key: "subsidiary", title: "子公司", detail: "风险上升", route: "/risk/subsidiary/平安银行" },
  ],
  ai: {
    conclusion: "影响对象集中在地产链、重点客户和平安银行相关暴露。",
    reasons: ["行业、客户、子公司三类对象出现重叠。", "华东建设集团同时影响银行授信与投资组合。", "寿险长期合作机构中地产链客户占比上升。"],
    action: "建议以子公司为责任主体拆分处置清单。",
  },
};

export const strategyBrief: StrategyBrief = {
  route: "/risk/strategy/group",
  items: [
    { scope: "平安银行", suggestion: "追踪 P0 客户授信敞口，今日完成担保链核查。", route: "/risk/strategy/bank" },
    { scope: "平安寿险", suggestion: "复核地产链长期合作机构，关注现金流和舆情共振。", route: "/risk/strategy/life" },
    { scope: "平安资管", suggestion: "评估信用债与权益组合的弱资质主体穿透暴露。", route: "/risk/strategy/asset-management" },
  ],
  ai: {
    conclusion: "今天的策略重点是先控大客户，再控行业链条和组合波动。",
    reasons: ["P0 客户可能牵动授信、担保和投资组合。", "地产链风险与区域、子公司客户池重叠。", "市场波动会放大弱资质主体再融资压力。"],
    action: "建议生成一页式领导汇报，并按银行、寿险、资管拆分责任动作。",
  },
};

export const clientRiskPanorama: ClientRiskPanorama = {
  name: "华东建设集团",
  industry: "地产链 / 建筑工程",
  exposure: "23.6 亿",
  subsidiary: "平安银行",
  updateTime: "05-20 09:30",
  badge: "预警 → 出险风险",
  level: "A1 一级预警",
  levelChange: "较昨日 +2 级",
  score: 86,
  scoreChange: "+12",
  trend: [42, 48, 54, 50, 66, 58, 78, 86],
  timeline: [
    { label: "正常", date: "2024-12-01", state: "done" },
    { label: "预警", date: "2025-03-10", state: "done" },
    { label: "一级预警", date: "2025-04-25", state: "current" },
    { label: "出险风险", date: "关注中", state: "future" },
  ],
  sources: [
    { label: "现金流", value: 86, detail: "3 个月净流入为负" },
    { label: "舆情", value: 74, detail: "负面报道 23 条上升" },
    { label: "司法", value: 68, detail: "新增被执行信息" },
    { label: "行业", value: 72, detail: "地产链资金收缩" },
  ],
  signals: [
    { title: "现金流持续恶化", detail: "经营现金流连续 3 个月转负" },
    { title: "新增被执行信息", detail: "新增执行金额 1.2 亿元" },
    { title: "舆情负面增加", detail: "负面新闻 23 条，较上周上升" },
  ],
  ai: {
    conclusion: "短期流动性断裂概率上升，已从普通预警进入一级预警处置区间。",
    reasons: ["现金流覆盖弱化与商票逾期同步出现。", "新增司法执行信息提高出险触发概率。", "地产链回款压力会继续传导到担保和授信关系。"],
    action: "建议暂停新增授信，纳入重点监控，并在今日生成处置方案。",
    defaultProbability: 67,
  },
};

export const industryRiskAnalysis: IndustryRiskAnalysis = {
  name: "地产链",
  updateTime: "05-20 09:30",
  badge: "行业风险",
  index: 72,
  indexChange: "+8",
  trend: [
    { label: "05-14", value: 50 },
    { label: "05-15", value: 54 },
    { label: "05-16", value: 57 },
    { label: "05-17", value: 62 },
    { label: "05-18", value: 59 },
    { label: "05-19", value: 67 },
    { label: "05-20", value: 72 },
  ],
  features: ["回款周期延长，资金链压力上升", "融资成本提高，信用收缩明显", "部分房企存在流动性风险暴露"],
  impact: [
    { label: "客户数", value: "23 家" },
    { label: "授信关联", value: "90.8 亿" },
    { label: "关联子公司", value: "5 个" },
  ],
  topCustomers: [
    { name: "华东建设集团", score: 86 },
    { name: "中南置业集团", score: 78 },
    { name: "平安商业有限公司", score: 72 },
  ],
  ai: {
    conclusion: "行业进入流动性收缩阶段，风险可能继续向上下游客户扩散。",
    reasons: ["销售回款和融资渠道同时承压。", "建筑工程、建材和城投客户出现账期拉长。", "高风险客户与子公司授信暴露存在重合。"],
    action: "建议对地产—建筑—城投传导链路建立专项监控。",
    spreadPath: ["地产回款放缓", "工程款账期拉长", "供应链客户现金流承压", "授信客户评级下调"],
  },
};

export const marketShockAnalysis: MarketShockAnalysis = {
  title: "债市利差快速扩大",
  updateTime: "05-20 09:00",
  spreadChange: "+38 bps",
  spreadDelta: "+12 bps",
  trend: [
    { label: "05-14", value: 26 },
    { label: "05-15", value: 34 },
    { label: "05-16", value: 42 },
    { label: "05-17", value: 40 },
    { label: "05-18", value: 58 },
    { label: "05-19", value: 46 },
    { label: "00:00", value: 76 },
  ],
  varChange: "+3.1%",
  varDelta: "+0.8%",
  assets: [
    { name: "信用债组合", impact: "估值波动扩大", exposure: "128.6 亿" },
    { name: "地产链授信客户", impact: "再融资压力上升", exposure: "43 家" },
    { name: "弱资质主体持仓", impact: "信用利差敏感", exposure: "18.4 亿" },
  ],
  ai: {
    conclusion: "本轮冲击来自信用利差快速走阔，会放大弱资质主体再融资压力。",
    reasons: ["中低评级信用债估值回撤加快。", "利率曲线波动推高组合 VaR。", "授信客户与持仓主体存在交叉暴露。"],
    action: "建议压降弱资质信用债久期，并同步复核重点授信客户再融资能力。",
    path: ["利差扩大", "估值回撤", "组合 VaR 上升", "客户再融资压力抬升"],
  },
};

export const reminders: Reminder[] = [
  {
    id: "estate",
    title: "地产链条风险信号升温",
    badge: "热",
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
    suggestion: "建议联动客户经理补充尽调，并将处置进度同步到个人工作台。",
  },
  {
    id: "supply-chain",
    title: "供应链集中度风险上升",
    detail: "AI 识别到建筑工程供应商集中度连续两周抬升，部分客户回款依赖单一核心方。",
    suggestion: "建议生成供应链集中度排查清单，并同步相关子公司风险联系人。",
  },
  {
    id: "urban-investment",
    title: "城投平台再融资压力加大",
    detail: "区域融资环境偏紧，部分城投相关客户短债滚续压力较上月上升。",
    suggestion: "建议关注再融资窗口和关联担保链，纳入本周重点跟踪。",
  },
  {
    id: "credit-card",
    title: "信用卡不良率小幅上升",
    detail: "消费信贷组合早期逾期率轻微抬头，AI 判断需观察连续性。",
    suggestion: "建议复核高风险客群画像，并观察未来两周迁徙变化。",
  },
  {
    id: "overseas",
    title: "海外市场波动增加，关注外部风险",
    detail: "海外权益与汇率波动同步加大，可能影响跨境资产估值和外币敞口。",
    suggestion: "建议关注外部市场冲击路径，必要时生成压力情景分析。",
  },
];

export const aiAlertTickerItems: AIAlertTickerItem[] = [
  {
    id: "alert-investment-cii",
    title: "CII 月度综合投资收益率转负",
    isHot: true,
    route: "/investment/changes/cii-monthly-negative",
  },
  {
    id: "alert-001",
    title: "重点客户出现舆情预警",
    isHot: true,
  },
  {
    id: "alert-002",
    title: "地产链条风险信号升温",
    isHot: false,
  },
  {
    id: "alert-003",
    title: "债市波动加剧，关注久期风险",
    isHot: true,
  },
  {
    id: "alert-004",
    title: "供应链集中度风险上升",
    isHot: false,
  },
  {
    id: "alert-005",
    title: "城投平台再融资压力加大",
    isHot: false,
  },
  {
    id: "alert-006",
    title: "信用卡不良率小幅上升",
    isHot: false,
  },
  {
    id: "alert-007",
    title: "海外市场波动增加，关注外部风险",
    isHot: true,
  },
];

export const aiAlertNewsItems: AIAlertNewsItem[] = [
  {
    id: "news-investment-cii",
    time: "09:32",
    isNew: true,
    title: "CII 月度综合投资收益率转负",
    summary: "月度综合投资收益率为 -2.47%，较上月下降 70bp，建议关注连续性。",
    tags: ["投资风险"],
    route: "/investment/changes/cii-monthly-negative",
  },
  {
    id: "news-001",
    time: "09:25",
    isNew: true,
    title: "地产链条风险信号升温",
    summary: "多家地产企业出现资金链紧张迹象，需重点跟踪核心大户现金流。",
    tags: ["信用风险"],
    route: "/risk/industry/real-estate-chain",
  },
  {
    id: "news-002",
    time: "09:18",
    title: "债市波动加剧，关注久期风险",
    summary: "国债收益率快速上行，信用利差走阔，资管组合风险暴露上升。",
    tags: ["市场风险", "投资风险"],
    route: "/risk/market/shock",
  },
  {
    id: "news-003",
    time: "09:05",
    title: "重点客户出现舆情预警",
    summary: "华东某大型建筑企业被媒体报道项目停工，潜在信用风险上升。",
    tags: ["信用风险"],
    route: "/risk/client/east-construction",
  },
  {
    id: "news-004",
    time: "08:57",
    title: "供应链集中度风险上升",
    summary: "部分行业供应商集中度提高，回款账期延长，需关注传导风险。",
    tags: ["信用风险"],
    route: "/credit",
  },
  {
    id: "news-005",
    time: "08:43",
    title: "城投平台再融资压力加大",
    summary: "多地城投平台到期债务集中，市场融资成本上升，需提前预警。",
    tags: ["信用风险"],
    route: "/credit",
  },
  {
    id: "news-006",
    time: "08:30",
    title: "宏观数据波动，关注系统性风险",
    summary: "最新宏观数据出现波动，需关注系统性风险对资产质量的影响。",
    tags: ["宏观风险", "系统性风险"],
    route: "/macro",
  },
  {
    id: "news-007",
    time: "08:15",
    title: "信用卡不良率小幅上升",
    summary: "信用卡业务不良率较上期上升 0.06pp，需关注区域和客群分布。",
    tags: ["零售风险"],
    route: "/watch",
  },
  {
    id: "news-008",
    time: "07:58",
    title: "海外市场波动增加，关注外部风险",
    summary: "海外权益市场波动上升，可能对境外敞口资产产生影响。",
    tags: ["市场风险", "外部风险"],
    route: "/investment",
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
