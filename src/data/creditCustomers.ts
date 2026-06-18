export type CreditRiskLevel = "一级预警" | "二级预警" | "已出险" | "关注中";

export type CreditCustomer = {
  id: string;
  name: string;
  riskLevel: CreditRiskLevel;
  riskScore: number;
  scoreDelta: number;
  mainRisks: string[];
  latestUpdate: string;
  updatedAt: string;
};

export type MigrationTrendPoint = {
  month: string;
  normalToWarning: number;
  warningToDefault: number;
};

export type RiskFactorItem = {
  type: string;
  count: number;
};

export type SubsidiaryRiskItem = {
  company: string;
  warning: number;
  defaulted: number;
  change: number;
  insight: string;
};

export type AIPredictedCustomer = {
  name: string;
  probability: number;
  reason: string;
  suggestion: string;
};

export type ConcentrationDimension = "客户" | "行业" | "区域";

export type ConcentrationMetric = {
  label: string;
  value: string;
  detail: string;
  sparkline?: "line" | "bars";
};

export type ConcentrationTrendPoint = {
  month: string;
  ratio: number;
};

export type ConcentrationSource = {
  name: string;
  tag: string;
  description: string;
  riskRatio: string;
  monthChange: string;
  riskChange: string;
  icon: "building" | "landmark" | "group" | "customer";
};

export type ConcentrationDistributionItem = {
  label: string;
  value: string;
  color?: string;
};

export type ConcentrationRiskView = {
  brief: string;
  explain: string;
  suggestion: string;
  metrics: ConcentrationMetric[];
  trendTitle: string;
  trendData: ConcentrationTrendPoint[];
  trendReadout: string;
  sources: ConcentrationSource[];
  sourceActionLabel: string;
  sourceSortLabel: string;
  distributionTitle: string;
  distributionItems: ConcentrationDistributionItem[];
  distributionMode: "dot" | "bar";
  insight: string;
  actions: string[];
};

export const customerFilters = ["全部", "一级预警", "二级预警", "已出险", "关注中"] as const;
export type CustomerFilter = (typeof customerFilters)[number];

export const creditCustomers: CreditCustomer[] = [
  { id: "c001", name: "华东建设集团", riskLevel: "一级预警", riskScore: 86, scoreDelta: 12, mainRisks: ["现金流承压", "商票逾期", "舆情风险"], latestUpdate: "新增 2 条负面舆情", updatedAt: "更新 2 小时前" },
  { id: "c002", name: "中南实业有限公司", riskLevel: "一级预警", riskScore: 83, scoreDelta: 10, mainRisks: ["债务承压", "担保风险", "司法风险"], latestUpdate: "新增被执行信息", updatedAt: "更新 4 小时前" },
  { id: "c003", name: "滨海地产控股", riskLevel: "一级预警", riskScore: 81, scoreDelta: 9, mainRisks: ["销售回款放缓", "债券展期", "融资收缩"], latestUpdate: "境内债展期规模上升", updatedAt: "更新 6 小时前" },
  { id: "c004", name: "华南置业集团", riskLevel: "一级预警", riskScore: 79, scoreDelta: 8, mainRisks: ["短债压力", "回款延迟", "存货去化慢"], latestUpdate: "新增 3 家供应商账期延长", updatedAt: "更新 8 小时前" },
  { id: "c005", name: "东部城建发展", riskLevel: "一级预警", riskScore: 78, scoreDelta: 7, mainRisks: ["区域融资压力", "关联担保", "现金流缺口"], latestUpdate: "融资成本环比上行", updatedAt: "更新 10 小时前" },
  { id: "c006", name: "北辰投资集团", riskLevel: "一级预警", riskScore: 76, scoreDelta: 6, mainRisks: ["评级展望下调", "流动性紧张", "担保链复杂"], latestUpdate: "评级机构调整展望", updatedAt: "更新 12 小时前" },
  { id: "c007", name: "天合能源股份", riskLevel: "二级预警", riskScore: 69, scoreDelta: 5, mainRisks: ["盈利下滑", "行业景气下降"], latestUpdate: "一季度净利下滑 35%", updatedAt: "更新 1 天前" },
  { id: "c008", name: "华中建材控股", riskLevel: "二级预警", riskScore: 68, scoreDelta: 5, mainRisks: ["需求偏弱", "应收账款增加"], latestUpdate: "应收账款周转天数上升", updatedAt: "更新 1 天前" },
  { id: "c009", name: "西南产业投资", riskLevel: "二级预警", riskScore: 67, scoreDelta: 4, mainRisks: ["区域项目延期", "收益覆盖不足"], latestUpdate: "重点项目现金流低于预期", updatedAt: "更新 1 天前" },
  { id: "c010", name: "江北供应链集团", riskLevel: "二级预警", riskScore: 66, scoreDelta: 4, mainRisks: ["上下游账期延长", "库存压力"], latestUpdate: "核心供应商回款周期拉长", updatedAt: "更新 2 天前" },
  { id: "c011", name: "远洋贸易有限公司", riskLevel: "二级预警", riskScore: 65, scoreDelta: 4, mainRisks: ["订单波动", "汇率敞口"], latestUpdate: "海外订单取消率上升", updatedAt: "更新 2 天前" },
  { id: "c012", name: "长三角开发集团", riskLevel: "二级预警", riskScore: 64, scoreDelta: 3, mainRisks: ["资产周转慢", "关联交易上升"], latestUpdate: "关联往来余额增加", updatedAt: "更新 2 天前" },
  { id: "c013", name: "中部商业运营", riskLevel: "二级预警", riskScore: 63, scoreDelta: 3, mainRisks: ["租金回款放缓", "现金覆盖不足"], latestUpdate: "核心商圈出租率下滑", updatedAt: "更新 3 天前" },
  { id: "c014", name: "南岭制造集团", riskLevel: "二级预警", riskScore: 62, scoreDelta: 3, mainRisks: ["毛利承压", "订单恢复偏慢"], latestUpdate: "毛利率连续两季下降", updatedAt: "更新 3 天前" },
  { id: "c015", name: "海西基础设施", riskLevel: "二级预警", riskScore: 61, scoreDelta: 2, mainRisks: ["再融资压力", "偿债集中"], latestUpdate: "下季度到期债务较集中", updatedAt: "更新 3 天前" },
  { id: "c016", name: "金桥控股集团", riskLevel: "二级预警", riskScore: 60, scoreDelta: 2, mainRisks: ["担保余额高", "现金流波动"], latestUpdate: "对外担保余额上升", updatedAt: "更新 4 天前" },
  { id: "c017", name: "华北物流集团", riskLevel: "二级预警", riskScore: 59, scoreDelta: 2, mainRisks: ["运价下行", "融资成本上升"], latestUpdate: "经营现金流小幅转弱", updatedAt: "更新 4 天前" },
  { id: "c018", name: "蓝湾文旅发展", riskLevel: "二级预警", riskScore: 58, scoreDelta: 2, mainRisks: ["客流恢复不稳", "固定支出高"], latestUpdate: "节后入住率低于预期", updatedAt: "更新 5 天前" },
  { id: "c019", name: "恒瑞地产集团", riskLevel: "已出险", riskScore: 94, scoreDelta: 18, mainRisks: ["债务逾期", "司法冻结", "项目停工"], latestUpdate: "新增债务逾期公告", updatedAt: "更新 30 分钟前" },
  { id: "c020", name: "盛达建筑工程", riskLevel: "已出险", riskScore: 91, scoreDelta: 16, mainRisks: ["被执行信息", "工程款拖欠", "担保代偿"], latestUpdate: "新增被执行金额 1.2 亿", updatedAt: "更新 1 小时前" },
  { id: "c021", name: "宏信置业有限公司", riskLevel: "已出险", riskScore: 89, scoreDelta: 14, mainRisks: ["票据逾期", "债券违约", "舆情扩散"], latestUpdate: "票据逾期名单新增", updatedAt: "更新 3 小时前" },
  { id: "c022", name: "江南科技园区", riskLevel: "关注中", riskScore: 54, scoreDelta: 2, mainRisks: ["租售恢复偏慢", "融资审批延后"], latestUpdate: "重点项目审批进度延后", updatedAt: "更新 5 天前" },
  { id: "c023", name: "星河商业集团", riskLevel: "关注中", riskScore: 53, scoreDelta: 2, mainRisks: ["租金减免", "坪效下降"], latestUpdate: "部分门店租金调整", updatedAt: "更新 5 天前" },
  { id: "c024", name: "云港产业控股", riskLevel: "关注中", riskScore: 52, scoreDelta: 1, mainRisks: ["订单延迟", "库存周转放缓"], latestUpdate: "库存周转天数小幅上升", updatedAt: "更新 6 天前" },
  { id: "c025", name: "华远能源开发", riskLevel: "关注中", riskScore: 51, scoreDelta: 1, mainRisks: ["价格波动", "回款节奏放缓"], latestUpdate: "主要产品价格回落", updatedAt: "更新 6 天前" },
  { id: "c026", name: "北方农商集团", riskLevel: "关注中", riskScore: 50, scoreDelta: 1, mainRisks: ["季节性波动", "担保余额较高"], latestUpdate: "担保余额保持高位", updatedAt: "更新 7 天前" },
  { id: "c027", name: "新城物业服务", riskLevel: "关注中", riskScore: 49, scoreDelta: 1, mainRisks: ["回款放缓", "关联房企压力"], latestUpdate: "关联主体现金流承压", updatedAt: "更新 7 天前" },
  { id: "c028", name: "启明医药控股", riskLevel: "关注中", riskScore: 48, scoreDelta: 1, mainRisks: ["研发投入高", "现金覆盖下降"], latestUpdate: "研发费用率继续上升", updatedAt: "更新 7 天前" },
];

export const migrationTrendData: MigrationTrendPoint[] = [
  { month: "1月", normalToWarning: 9, warningToDefault: 2 },
  { month: "2月", normalToWarning: 11, warningToDefault: 3 },
  { month: "3月", normalToWarning: 8, warningToDefault: 2 },
  { month: "4月", normalToWarning: 13, warningToDefault: 3 },
  { month: "5月", normalToWarning: 14, warningToDefault: 4 },
  { month: "6月", normalToWarning: 18, warningToDefault: 5 },
];

export const riskFactorData: RiskFactorItem[] = [
  { type: "现金流承压", count: 12 },
  { type: "债务逾期", count: 8 },
  { type: "担保风险", count: 7 },
  { type: "司法风险", count: 6 },
  { type: "舆情风险", count: 5 },
  { type: "行业景气度下行", count: 4 },
];

export const subsidiaryRiskData: SubsidiaryRiskItem[] = [
  {
    company: "平安银行",
    warning: 15,
    defaulted: 5,
    change: 6,
    insight: "对公客户风险迁徙最明显，城投、地产上下游和中小企业现金流压力上升",
  },
  {
    company: "平安寿险",
    warning: 12,
    defaulted: 3,
    change: 4,
    insight: "地产链、医养服务及长期合作机构客户风险升温，现金流和舆情信号共振",
  },
  {
    company: "平安产险",
    warning: 9,
    defaulted: 2,
    change: 3,
    insight: "建筑工程、物流运输及供应链客户风险升温，需关注回款与赔付压力",
  },
  {
    company: "平安养老险",
    warning: 5,
    defaulted: 1,
    change: 1,
    insight: "企业年金相关客户经营承压，建议关注缴费稳定性与企业信用变化",
  },
  {
    company: "平安健康险",
    warning: 4,
    defaulted: 0,
    change: 1,
    insight: "医疗服务、医药流通客户账期拉长，但暂未形成明显出险扩散",
  },
];

export const aiPredictedCustomers: AIPredictedCustomer[] = [
  {
    name: "华东建设集团",
    probability: 76,
    reason: "现金流承压 + 商票逾期 + 负面舆情增加",
    suggestion: "建议纳入一级跟踪",
  },
  {
    name: "中南实业有限公司",
    probability: 68,
    reason: "担保链风险 + 新增被执行信息",
    suggestion: "建议排查关联担保",
  },
  {
    name: "天合能源股份",
    probability: 61,
    reason: "盈利下滑 + 行业景气度下降",
    suggestion: "建议关注财务披露",
  },
];

export const concentrationTrendData: ConcentrationTrendPoint[] = [
  { month: "1月", ratio: 27 },
  { month: "2月", ratio: 28 },
  { month: "3月", ratio: 29 },
  { month: "4月", ratio: 31 },
  { month: "5月", ratio: 32 },
  { month: "6月", ratio: 34 },
];

export const industryTrendData: ConcentrationTrendPoint[] = [
  { month: "1月", ratio: 55 },
  { month: "2月", ratio: 56 },
  { month: "3月", ratio: 58 },
  { month: "4月", ratio: 61 },
  { month: "5月", ratio: 63 },
  { month: "6月", ratio: 66 },
];

export const regionTrendData: ConcentrationTrendPoint[] = [
  { month: "1月", ratio: 28 },
  { month: "2月", ratio: 29 },
  { month: "3月", ratio: 31 },
  { month: "4月", ratio: 33 },
  { month: "5月", ratio: 34 },
  { month: "6月", ratio: 36 },
];

export const concentrationSources: ConcentrationSource[] = [
  {
    name: "华东建设集团",
    tag: "地产链",
    description: "现金流承压、地产链客户、负面舆情增加",
    riskRatio: "8.6%",
    monthChange: "+1.4%",
    riskChange: "+12",
    icon: "building",
  },
  {
    name: "中南实业有限公司",
    tag: "城投平台",
    description: "担保链复杂、新增被执行信息",
    riskRatio: "6.2%",
    monthChange: "+0.9%",
    riskChange: "+8",
    icon: "customer",
  },
  {
    name: "平安城市建设投资集团",
    tag: "关联集团",
    description: "关联客户多、区域集中度上升",
    riskRatio: "5.1%",
    monthChange: "+0.7%",
    riskChange: "+6",
    icon: "group",
  },
];

export const industrySources: ConcentrationSource[] = [
  {
    name: "地产链客户群",
    tag: "行业",
    description: "区域集中、现金流压力上升",
    riskRatio: "28%",
    monthChange: "+6",
    riskChange: "+6",
    icon: "building",
  },
  {
    name: "城投相关客户",
    tag: "行业",
    description: "区域财政承压、再融资风险需关注",
    riskRatio: "21%",
    monthChange: "+4",
    riskChange: "+4",
    icon: "landmark",
  },
  {
    name: "建筑工程客户",
    tag: "行业",
    description: "回款周期拉长、项目结算压力增加",
    riskRatio: "17%",
    monthChange: "+3",
    riskChange: "+3",
    icon: "building",
  },
];

export const regionSources: ConcentrationSource[] = [
  {
    name: "华东区域客户池",
    tag: "区域",
    description: "地产链与建筑工程客户重合度较高",
    riskRatio: "36%",
    monthChange: "+7%",
    riskChange: "+9",
    icon: "building",
  },
  {
    name: "华南区域客户池",
    tag: "区域",
    description: "制造与供应链客户回款周期拉长",
    riskRatio: "23%",
    monthChange: "+3%",
    riskChange: "+4",
    icon: "landmark",
  },
  {
    name: "华中区域客户池",
    tag: "区域",
    description: "城投与工程类客户风险评分同步上行",
    riskRatio: "21%",
    monthChange: "+2%",
    riskChange: "+3",
    icon: "group",
  },
];

export const concentrationDistributionItems: ConcentrationDistributionItem[] = [
  { label: "地产链客户", value: "42%", color: "#ff6a00" },
  { label: "城投平台", value: "28%", color: "#ff8a2a" },
  { label: "关联集团", value: "18%", color: "#f5c75f" },
  { label: "其他", value: "12%", color: "#d7d2ca" },
];

export const industryDistributionItems: ConcentrationDistributionItem[] = [
  { label: "地产", value: "28%", color: "#ff6a00" },
  { label: "城投", value: "21%", color: "#ff8a2a" },
  { label: "建筑", value: "17%", color: "#f5c75f" },
  { label: "制造", value: "14%", color: "#ffc78e" },
  { label: "其他", value: "20%", color: "#d7d2ca" },
];

export const regionDistributionItems: ConcentrationDistributionItem[] = [
  { label: "华东", value: "36%" },
  { label: "华南", value: "23%" },
  { label: "华中", value: "21%" },
  { label: "华北", value: "20%" },
];

export const concentrationRiskViews: Record<ConcentrationDimension, ConcentrationRiskView> = {
  客户: {
    brief: "本月信用风险集中度继续上升，前 20 大客户风险敞口占比升至 34%，较上月增加 5%。AI 发现部分高风险客户同时集中于地产链、华东区域和关联集团授信，存在多维共振风险。",
    explain: "本月集中度上升主要由三类因素驱动：一是前 20 大客户风险敞口占比持续提升；二是地产链、城投、建筑行业风险同步升高；三是华东区域高敞口客户与关联集团授信存在重叠，形成客户、行业、区域三维共振。",
    suggestion: "建议降低地产链新增敞口增长，对华东区域高敞口客户开展组合排查，将关联集团客户纳入统一额度管理，并对前 20 大客户建立动态监控和预警阈值。",
    metrics: [
      { label: "集中度评分", value: "74", detail: "↑ 9 较上月", sparkline: "line" },
      { label: "前20客户敞口占比", value: "34%", detail: "↑ 5% 较上月", sparkline: "line" },
      { label: "高集中客户数", value: "12 家", detail: "较上月 +2 家", sparkline: "line" },
      { label: "AI 共振风险", value: "高", detail: "客户 × 行业 × 区域", sparkline: "bars" },
    ],
    trendTitle: "前20客户风险敞口占比趋势",
    trendData: concentrationTrendData,
    trendReadout: "前 20 大客户敞口占比连续 4 个月上升，说明风险正在向少数大客户和关联集团集中，需关注单一集团风险传导。",
    sources: concentrationSources,
    sourceActionLabel: "查看全部高集中客户",
    sourceSortLabel: "按风险占比排序",
    distributionTitle: "高集中客户结构",
    distributionItems: concentrationDistributionItems,
    distributionMode: "bar",
    insight: "当前集中度上升不是单一客户暴露，而是多个高风险客户在行业、区域和关联关系上的重叠。建议优先排查高敞口、高关联、高风险评分上升客户。",
    actions: [
      "对前 20 大客户建立集中度动态监控与预警阈值。",
      "将高敞口、高关联、高风险评分上升客户纳入专项跟踪。",
      "对关联集团客户执行统一额度管理，防止风险传导。",
      "对客户、行业、区域三维重合客户生成排查清单。",
    ],
  },
  行业: {
    brief: "本月行业风险集中度继续升高，前三行业风险占比达到 66%，较上月上升 8%。地产链、城投、建筑三类风险同步上行，AI 判断存在行业间传导压力。",
    explain: "行业集中度上升主要由地产链现金流承压、城投再融资压力和建筑工程回款周期拉长共同驱动，三类客户在供应链和区域上存在传导关系。",
    suggestion: "建议降低地产链新增敞口增长，对地产—建筑—城投传导链路建立专项监控，并对前三高集中行业设置月度阈值和预警机制。",
    metrics: [
      { label: "行业集中度评分", value: "76", detail: "↑ 8 较上月", sparkline: "line" },
      { label: "前三行业风险占比", value: "66%", detail: "↑ 8% 较上月", sparkline: "line" },
      { label: "高集中行业数", value: "3 个", detail: "地产、城投、建筑", sparkline: "line" },
      { label: "AI 传导风险", value: "高", detail: "行业间同步上行", sparkline: "bars" },
    ],
    trendTitle: "前三行业风险占比趋势",
    trendData: industryTrendData,
    trendReadout: "前三行业风险占比连续上行，地产链与城投相关客户同步恶化，可能通过建筑工程和供应链客户进一步传导。",
    sources: industrySources,
    sourceActionLabel: "查看全部高集中行业",
    sourceSortLabel: "按风险占比排序",
    distributionTitle: "行业集中分布",
    distributionItems: industryDistributionItems,
    distributionMode: "dot",
    insight: "行业集中度上升主要来自地产链和城投相关客户的同步恶化，建议对地产—建筑—城投之间的传导链路进行专项监控。",
    actions: [
      "降低地产链新增敞口增长，控制行业集中度持续上升。",
      "对地产—建筑—城投传导链路建立专项监控。",
      "对前三高集中行业设置月度阈值和预警机制。",
      "生成行业集中度风险汇报，纳入管理层周报。",
    ],
  },
  区域: {
    brief: "本月区域集中度继续上升，华东区域风险占比达到 36%，较上月上升 7%。AI 发现华东区域高风险客户与地产链、建筑工程客户重合度较高。",
    explain: "区域集中度上升主要来自华东高敞口客户风险评分抬升，同时这些客户与地产链、建筑工程及部分关联集团客户高度重合，形成区域与行业叠加风险。",
    suggestion: "建议对华东区域高敞口客户开展组合排查，识别区域内地产链、建筑工程和关联集团重合客户，并建立专项跟踪池。",
    metrics: [
      { label: "区域集中度评分", value: "72", detail: "↑ 7 较上月", sparkline: "line" },
      { label: "华东风险占比", value: "36%", detail: "↑ 7% 较上月", sparkline: "line" },
      { label: "前三区域合计", value: "80%", detail: "风险区域重合", sparkline: "line" },
      { label: "AI 共振风险", value: "中高", detail: "区域 × 行业 × 客户", sparkline: "bars" },
    ],
    trendTitle: "华东区域风险占比趋势",
    trendData: regionTrendData,
    trendReadout: "华东区域风险占比持续上升，且与地产链、建筑工程和关联集团客户重合度较高，需避免区域风险被单一维度低估。",
    sources: regionSources,
    sourceActionLabel: "查看全部高集中区域客户",
    sourceSortLabel: "按风险占比排序",
    distributionTitle: "区域集中分布",
    distributionItems: regionDistributionItems,
    distributionMode: "bar",
    insight: "区域风险集中并非单独由区域因素导致，而是与地产链、建筑工程和部分集团关联客户共同叠加。建议对华东区域高敞口客户建立专项跟踪池。",
    actions: [
      "对华东区域高敞口客户开展组合排查。",
      "识别区域内地产链、建筑工程和关联集团重合客户。",
      "对区域集中度连续上升客户建立专项跟踪池。",
      "生成区域集中度风险排查清单。",
    ],
  },
};

export function getCustomerStatusVariant(riskLevel: CreditRiskLevel) {
  if (riskLevel === "一级预警" || riskLevel === "已出险") {
    return "warming" as const;
  }

  if (riskLevel === "二级预警") {
    return "mediumHigh" as const;
  }

  return "watch" as const;
}

export function filterCreditCustomers(filter: CustomerFilter) {
  if (filter === "全部") {
    return creditCustomers;
  }

  return creditCustomers.filter((customer) => customer.riskLevel === filter);
}

export function creditCustomerStats() {
  return {
    total: creditCustomers.length,
    firstLevel: creditCustomers.filter((customer) => customer.riskLevel === "一级预警").length,
    secondLevel: creditCustomers.filter((customer) => customer.riskLevel === "二级预警").length,
    defaulted: creditCustomers.filter((customer) => customer.riskLevel === "已出险").length,
    watching: creditCustomers.filter((customer) => customer.riskLevel === "关注中").length,
  };
}
