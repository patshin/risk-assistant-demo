export type MatterId = "huadong" | "baise" | "cii" | "changning";

export type Matter = {
  id: MatterId;
  priority: "P0" | "P1" | "P2";
  risk: string;
  status: string;
  category: string;
  title: string;
  why: string;
  responsibility: string;
  evidence: string;
  updatedAt: string;
  due: string;
  queueFilter: "待决策" | "超期" | "待确认" | "待核验";
};

export const matters: Record<MatterId, Matter> = {
  huadong: {
    id: "huadong",
    priority: "P0",
    risk: "集中度超限",
    status: "需你决策",
    category: "跨模块",
    title: "华东建设集团：占用率升至 128%，重大预警信号同步增加",
    why: "占用率由 121% 升至 128%，司法执行信号增加，且融资与投资主体关系仍需交叉核验。",
    responsibility: "今日 17:00 前确认管理策略，并决定是否启动专项核查。",
    evidence: "4 项已确认 · 1 项待补充",
    updatedAt: "09:25",
    due: "今日 17:00",
    queueFilter: "待决策",
  },
  baise: {
    id: "baise",
    priority: "P1",
    risk: "已出险",
    status: "已超期",
    category: "信用",
    title: "广西百色试验区发展集团：0.47 亿元出险事项待更新进展",
    why: "本息已形成实质逾期，资产事实已确认；今日 09:00 应更新的回收与担保处置进展尚未补充。",
    responsibility: "补充最新回收和担保处置进展，判断风险是否缓释。",
    evidence: "资产事实已确认 · 进展待补充",
    updatedAt: "08:50",
    due: "已超期 30 分钟",
    queueFilter: "超期",
  },
  cii: {
    id: "cii",
    priority: "P1",
    risk: "收益变化",
    status: "待确认",
    category: "投资",
    title: "CII 月度综合投资收益率转负，等待确认纳入本周汇报",
    why: "月度综合投资收益率为 -2.47%，较上期下降 70bp；集团 VaR 仍在限额内。",
    responsibility: "确认是否纳入本周风险例会，并保留收益与 VaR 的口径边界。",
    evidence: "4 项数据已确认",
    updatedAt: "09:32",
    due: "今日 15:00",
    queueFilter: "待确认",
  },
  changning: {
    id: "changning",
    priority: "P2",
    risk: "重大预警",
    status: "待核验",
    category: "信用",
    title: "常宁市尚宇高级中学：重大预警原因明细仍缺失",
    why: "重大预警事实已进入系统，但触发原因、现金流变化和支撑材料尚不完整。",
    responsibility: "分派成员补齐原因与现金流材料，完成后再形成风险判断。",
    evidence: "2 项已确认 · 2 项信息缺口",
    updatedAt: "08:40",
    due: "明日 12:00",
    queueFilter: "待核验",
  },
};

export const matterOrder: MatterId[] = ["huadong", "baise", "cii", "changning"];

export const changes = [
  {
    id: "change-cii",
    time: "09:32",
    type: "投资收益",
    title: "CII 月度综合投资收益率转负",
    metric: "-2.47%",
    detail: "较上期下降 70bp · 集团 VaR 426 亿元 · 限额使用率 53.3%",
    source: "投资风险快照",
    matterId: "cii" as MatterId,
  },
  {
    id: "change-huadong",
    time: "09:25",
    type: "跨模块升级",
    title: "华东建设集团司法执行与集中度信号同步升级",
    metric: "128%",
    detail: "集中度限额占用率由 121% 升至 128%",
    source: "信用风险 · 集中度监测",
    matterId: "huadong" as MatterId,
  },
  {
    id: "change-baise",
    time: "08:50",
    type: "跟踪超期",
    title: "广西百色出险事项未按约定时间更新",
    metric: "+30m",
    detail: "应于 09:00 更新回收与担保处置进展",
    source: "重点跟踪任务",
    matterId: "baise" as MatterId,
  },
];

export const trackingItems = [
  {
    id: "baise",
    matterId: "baise" as MatterId,
    state: "升温中",
    title: "广西百色出险事项回收与担保处置",
    owner: "李敏",
    due: "今日 09:00",
    latest: "约定更新时间已过，尚未补充回收和担保处置进展。",
    next: "立即更新进展，并同步本周汇报材料。",
  },
  {
    id: "cii",
    matterId: "cii" as MatterId,
    state: "观察中",
    title: "CII 月度收益变化与 VaR 口径",
    owner: "陈璐",
    due: "2026-08-08",
    latest: "收益变化已关联 4 项证据，集团 VaR 仍在限额内。",
    next: "下期快照复核收益方向与成员 VaR 口径。",
  },
  {
    id: "huadong",
    matterId: "huadong" as MatterId,
    state: "待确认",
    title: "华东建设集团集中度与主体关系核验",
    owner: "未指定",
    due: "今日 17:00",
    latest: "司法执行与集中度信号已确认，投资主体关系仍待核验。",
    next: "确认管理策略并指定核验责任人。",
  },
  {
    id: "duration",
    state: "趋稳",
    title: "久期错配周度观察",
    owner: "王哲",
    due: "本周五",
    latest: "本周敞口较上周回落，未触发升级阈值。",
    next: "周五复核资产负债两端久期变化。",
  },
];

export const reportItems = [
  {
    id: "cii",
    matterId: "cii" as MatterId,
    title: "CII 月度投资收益变化",
    module: "投资风险",
    updatedAt: "09:38",
    boundary: "收益覆盖四家险资 CII 口径；VaR 覆盖 VaR 计量资产。",
  },
  {
    id: "baise",
    matterId: "baise" as MatterId,
    title: "广西百色出险事项",
    module: "信用风险",
    updatedAt: "08:50",
    boundary: "资产事实已确认；处置进展需由责任人更新后方可纳入正式汇报。",
  },
  {
    id: "huadong",
    matterId: "huadong" as MatterId,
    title: "华东建设集团集中度升级",
    module: "跨模块风险",
    updatedAt: "09:25",
    boundary: "融资敞口已确认；投资主体关系与管理策略仍待人工确认。",
  },
];

export const roleOptions = [
  { value: "executive", label: "高层管理者", hint: "优先看待决策、重大升级和会议议题" },
  { value: "risk-lead", label: "集团风险负责人", hint: "优先看重要事项、责任分布和超期状态" },
  { value: "line-lead", label: "专业条线负责人", hint: "优先看条线研判、团队任务和待核验结论" },
  { value: "manager", label: "风险经理", hint: "优先看我的任务、信息缺口和临近期限" },
] as const;

export const scopeOptions = [
  { value: "group", label: "集团口径", hint: "跨信用、投资和集中度风险" },
  { value: "credit", label: "信用风险条线", hint: "预警、出险、迁移、集中度及客户风险" },
  { value: "investment", label: "投资风险条线", hint: "收益、VaR、组合与成员公司投资风险" },
  { value: "watching", label: "我关注的事项", hint: "仅显示我关注或分派给我的事项" },
] as const;
