export type CreditRiskLevel = "一级预警" | "二级预警" | "已出险" | "关注中";
export type CreditRating = "1A" | "1B" | "1C" | "1D" | "2A" | "2B" | "2C" | "2D";
export type RatingTrend = "down" | "stable";

export type ExternalEventCounts = {
  sentiment: number;
  litigation: number;
  enforcement: number;
  regulatory?: number;
  announcement?: number;
  guaranteeChain?: boolean;
};

export type CreditCustomer = {
  id: string;
  name: string;
  riskLevel: CreditRiskLevel;
  rating?: CreditRating;
  ratingTrend?: RatingTrend;
  riskScore: number;
  scoreDelta: number;
  mainRisks: string[];
  externalEvents?: ExternalEventCounts;
  latestUpdate: string;
  updatedAt: string;
};

export type RatingTimelineItem = {
  month: string;
  rating: CreditRating;
  changed?: boolean;
};

export type RatingReason = {
  title: string;
  description: string;
  impact: "影响较大" | "影响中等";
};

export type ExternalRiskEvent = {
  time: string;
  type: "负面舆情" | "诉讼" | "被执行" | "监管" | "公告";
  title: string;
  summary: string;
  impact: string;
  factors: string[];
};

export type RiskUpdate = {
  title: string;
  detail: string;
  time: string;
};

export type DisposalAdvice = {
  customerName: string;
  customerId: string;
  rating: CreditRating;
  ratingTrend: RatingTrend;
  riskStatus: CreditRiskLevel;
  disposalLevel: string;
  urgency: number;
  summary: string;
  actions: Array<{
    title: string;
    description: string;
    priority: "高优先级" | "中优先级" | "低优先级";
  }>;
  aiInterpretation: string;
};

export type CustomerRiskProfile = CreditCustomer & {
  customerCode: string;
  rating: CreditRating;
  ratingTrend: RatingTrend;
  previousRating: CreditRating;
  ratingChange: string;
  ratingStatus: string;
  overviewRiskFactors: string[];
  overviewUpdates: RiskUpdate[];
  aiJudgment: string;
  ratingTimeline: RatingTimelineItem[];
  ratingReasons: RatingReason[];
  ratingInterpretation: string;
  ratingGeneratedText: string;
  externalEvents: ExternalEventCounts;
  eventTimeline: ExternalRiskEvent[];
  eventInsight: string;
  disposalAdvice: DisposalAdvice;
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
  { id: "huadong-construction", name: "华东建设集团", rating: "1B", ratingTrend: "down", riskLevel: "一级预警", riskScore: 86, scoreDelta: 12, mainRisks: ["现金流承压", "商票逾期", "舆情风险"], externalEvents: { sentiment: 2, litigation: 1, enforcement: 1 }, latestUpdate: "新增 2 条负面舆情", updatedAt: "更新 2 小时前" },
  { id: "zhongnan-industrial", name: "中南实业有限公司", rating: "1C", ratingTrend: "down", riskLevel: "一级预警", riskScore: 83, scoreDelta: 10, mainRisks: ["债务承压", "担保风险", "司法风险"], externalEvents: { sentiment: 0, litigation: 3, enforcement: 1, guaranteeChain: true }, latestUpdate: "新增被执行信息", updatedAt: "更新 4 小时前" },
  { id: "tianhe-energy", name: "天合能源股份", rating: "2A", ratingTrend: "stable", riskLevel: "二级预警", riskScore: 72, scoreDelta: 6, mainRisks: ["盈利下滑", "行业景气度下降"], externalEvents: { sentiment: 1, litigation: 0, enforcement: 0, announcement: 1 }, latestUpdate: "一季度净利下滑 35%", updatedAt: "更新 1 天前" },
  { id: "c004", name: "华南置业集团", riskLevel: "一级预警", riskScore: 79, scoreDelta: 8, mainRisks: ["短债压力", "回款延迟", "存货去化慢"], latestUpdate: "新增 3 家供应商账期延长", updatedAt: "更新 8 小时前" },
  { id: "c005", name: "东部城建发展", riskLevel: "一级预警", riskScore: 78, scoreDelta: 7, mainRisks: ["区域融资压力", "关联担保", "现金流缺口"], latestUpdate: "融资成本环比上行", updatedAt: "更新 10 小时前" },
  { id: "c006", name: "北辰投资集团", riskLevel: "一级预警", riskScore: 76, scoreDelta: 6, mainRisks: ["评级展望下调", "流动性紧张", "担保链复杂"], latestUpdate: "评级机构调整展望", updatedAt: "更新 12 小时前" },
  { id: "c007", name: "滨海地产控股", rating: "1B", ratingTrend: "down", riskLevel: "一级预警", riskScore: 81, scoreDelta: 9, mainRisks: ["销售回款放缓", "债券展期", "融资收缩"], externalEvents: { sentiment: 1, litigation: 2, enforcement: 0 }, latestUpdate: "境内债展期规模上升", updatedAt: "更新 6 小时前" },
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

const huadongEventTimeline: ExternalRiskEvent[] = [
  {
    time: "今天 09:20",
    type: "负面舆情",
    title: "项目停工传闻扩散",
    summary: "媒体报道多个区域项目暂停施工，市场关注度上升。",
    impact: "影响较大",
    factors: ["舆情风险", "现金流承压"],
  },
  {
    time: "昨日 16:45",
    type: "被执行",
    title: "新增被执行信息",
    summary: "新增被执行记录，执行金额 3,200 万，案号（2024）沪0105执。",
    impact: "影响较大",
    factors: ["流动性压力", "担保风险"],
  },
  {
    time: "06-18 11:30",
    type: "诉讼",
    title: "新增合同纠纷案件",
    summary: "新增合同纠纷案件 1 起，涉及工程款结算，涉案金额 1,150 万元。",
    impact: "影响中等",
    factors: ["司法风险", "回款风险"],
  },
  {
    time: "06-17 14:20",
    type: "公告",
    title: "合作方披露应收账款回款周期拉长",
    summary: "合作方披露应收账款回款周期拉长，可能对公司现金流造成压力。",
    impact: "影响中等",
    factors: ["现金流承压"],
  },
];

export const disposalAdvice: DisposalAdvice = {
  customerName: "华东建设集团",
  customerId: "HDJG2024001",
  rating: "1B",
  ratingTrend: "down",
  riskStatus: "一级预警",
  disposalLevel: "一级跟踪",
  urgency: 4,
  summary: "基于客户当前风险状态、信用评级下调及外部事件，AI 建议将该客户纳入一级跟踪，并立即采取主动风险管理措施。",
  actions: [
    {
      title: "暂停新增授信",
      description: "建议暂停该客户新增授信及额度提升申请。",
      priority: "高优先级",
    },
    {
      title: "排查关联担保链",
      description: "排查该客户关联担保及上下游关联方风险。",
      priority: "高优先级",
    },
    {
      title: "加强现金流监控",
      description: "每周监控经营现金流、回款进度及资金缺口情况。",
      priority: "中优先级",
    },
    {
      title: "跟踪舆情与司法事件",
      description: "持续跟踪舆情、诉讼及被执行信息变化。",
      priority: "中优先级",
    },
  ],
  aiInterpretation: "客户风险上升主要受现金流承压、商票逾期及负面舆情影响，目前尚未进入出险，但评级已下调，建议采取主动风险管理措施，防止风险进一步扩散。",
};

const customerProfileOverrides: Record<string, Partial<CustomerRiskProfile>> = {
  "huadong-construction": {
    customerCode: "HDJG2024001",
    previousRating: "1A",
    ratingChange: "下调一级",
    ratingStatus: "需重点关注",
    overviewRiskFactors: ["现金流承压", "商票逾期", "舆情风险", "担保链复杂"],
    overviewUpdates: [
      { title: "新增 2 条负面舆情", detail: "媒体报道项目停工传闻扩散，舆情热度上升", time: "今天 09:20" },
      { title: "新增 1 条被执行信息", detail: "执行金额 3,200 万元", time: "昨日 16:45" },
      { title: "商票逾期金额扩大", detail: "新增逾期票据 1,150 万元", time: "06-18 11:30" },
    ],
    aiJudgment: "该客户风险上升主要由现金流承压、商票逾期和负面舆情共同驱动，存在进一步恶化风险，建议加强监控。",
    ratingTimeline: [
      { month: "3月", rating: "1A" },
      { month: "4月", rating: "1A" },
      { month: "5月", rating: "1B", changed: true },
      { month: "6月", rating: "1B" },
    ],
    ratingReasons: [
      { title: "经营现金流恶化", description: "近三个月经营现金流持续为负，回款周期拉长", impact: "影响较大" },
      { title: "商票逾期增加", description: "新增商票逾期记录，逾期金额扩大", impact: "影响较大" },
      { title: "行业景气度下降", description: "地产链行业资金压力扩散，行业风险上升", impact: "影响中等" },
    ],
    ratingInterpretation: "评级下调主要受经营现金流和外部融资环境影响，目前尚未进入出险状态，但若商票逾期继续扩大，可能进一步下调至 1C。",
    ratingGeneratedText: "华东建设集团本月评级由 1A 下调至 1B，主要因为现金流承压、商票逾期增加及地产链景气度下降。建议提高监控频率，并结合舆情司法事件进行综合判断。",
    externalEvents: { sentiment: 2, litigation: 1, enforcement: 1, regulatory: 0, announcement: 0 },
    eventTimeline: huadongEventTimeline,
    eventInsight: "近 7 日外部事件密度上升，且与现金流承压、商票逾期信号同步出现，说明该客户风险并非单点事件，建议纳入一级跟踪并提高监控频率。",
    disposalAdvice,
  },
  "zhongnan-industrial": {
    customerCode: "ZNSY2024008",
    previousRating: "1B",
    ratingChange: "下调一级",
    ratingStatus: "需重点关注",
    overviewRiskFactors: ["债务承压", "担保风险", "司法风险", "担保链复杂"],
    externalEvents: { sentiment: 0, litigation: 3, enforcement: 1, regulatory: 0, announcement: 0, guaranteeChain: true },
    eventTimeline: [
      { time: "今天 10:10", type: "被执行", title: "新增被执行信息", summary: "新增被执行记录，执行金额 1,800 万元。", impact: "影响较大", factors: ["流动性压力", "担保风险"] },
      { time: "昨日 15:30", type: "诉讼", title: "新增合同纠纷案件", summary: "新增合同纠纷案件 2 起，涉及供应链结算。", impact: "影响较大", factors: ["司法风险", "回款风险"] },
      { time: "近 7 日", type: "诉讼", title: "担保方涉诉信息增加", summary: "关联担保方新增诉讼信息，担保链传导风险上升。", impact: "影响中等", factors: ["担保风险"] },
    ],
  },
  "tianhe-energy": {
    customerCode: "THNY2024016",
    previousRating: "2A",
    ratingChange: "保持稳定",
    ratingStatus: "持续关注",
    overviewRiskFactors: ["盈利下滑", "行业景气度下降", "公告风险"],
    externalEvents: { sentiment: 1, litigation: 0, enforcement: 0, regulatory: 0, announcement: 1 },
    eventTimeline: [
      { time: "昨日 11:10", type: "负面舆情", title: "利润下滑报道升温", summary: "多家媒体关注能源价格波动导致盈利能力下降。", impact: "影响中等", factors: ["舆情风险", "盈利下滑"] },
      { time: "近 7 日", type: "公告", title: "一季度净利下滑 35%", summary: "公司公告显示一季度净利润同比下滑，行业景气度下降。", impact: "影响中等", factors: ["行业景气度下降"] },
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

export function getCustomerRiskProfile(id: string): CustomerRiskProfile {
  const customer = creditCustomers.find((item) => item.id === id) ?? creditCustomers[0];
  const rating = customer.rating ?? getDefaultRating(customer);
  const ratingTrend = customer.ratingTrend ?? (customer.scoreDelta >= 6 ? "down" : "stable");
  const previousRating = ratingTrend === "down" ? getPreviousRating(rating) : rating;
  const externalEvents = customer.externalEvents ?? getDefaultExternalEvents(customer);
  const defaultProfile: CustomerRiskProfile = {
    ...customer,
    rating,
    ratingTrend,
    previousRating,
    customerCode: getDefaultCustomerCode(customer.id),
    ratingChange: ratingTrend === "down" ? "下调一级" : "保持稳定",
    ratingStatus: customer.riskLevel === "关注中" ? "持续关注" : "需重点关注",
    overviewRiskFactors: customer.mainRisks.slice(0, 3),
    overviewUpdates: [
      { title: customer.latestUpdate, detail: customer.mainRisks.join("、"), time: customer.updatedAt.replace("更新 ", "") },
      { title: "风险评分继续上升", detail: `较上月上升 ${customer.scoreDelta} 分`, time: "近 7 日" },
    ],
    aiJudgment: `${customer.name}风险上升主要受${customer.mainRisks.slice(0, 3).join("、")}影响，建议提高监控频率并结合外部事件综合判断。`,
    ratingTimeline: [
      { month: "3月", rating: previousRating },
      { month: "4月", rating: previousRating },
      { month: "5月", rating, changed: ratingTrend === "down" },
      { month: "6月", rating },
    ],
    ratingReasons: customer.mainRisks.slice(0, 3).map((risk, index) => ({
      title: risk,
      description: getRiskReasonDescription(risk),
      impact: index < 2 ? "影响较大" : "影响中等",
    })),
    ratingInterpretation: `${customer.name}评级变化主要受${customer.mainRisks.slice(0, 2).join("和")}影响，目前需结合现金流、舆情司法和担保链信号继续观察。`,
    ratingGeneratedText: `${customer.name}当前评级为 ${rating}${ratingTrend === "down" ? "，较上月下调一级" : "，较上月保持稳定"}。建议结合外部事件和经营现金流变化进行综合判断。`,
    externalEvents,
    eventTimeline: getDefaultExternalTimeline(customer, externalEvents),
    eventInsight: "近 7 日外部风险信号与内部经营压力同步出现，建议纳入重点跟踪并提高监控频率。",
    disposalAdvice: getDefaultDisposalAdvice(customer, rating, ratingTrend),
  };
  const override = customerProfileOverrides[customer.id];

  if (!override) {
    return defaultProfile;
  }

  return {
    ...defaultProfile,
    ...override,
    externalEvents: override.externalEvents ?? defaultProfile.externalEvents,
    eventTimeline: override.eventTimeline ?? defaultProfile.eventTimeline,
    disposalAdvice: override.disposalAdvice ?? defaultProfile.disposalAdvice,
  };
}

function getDefaultRating(customer: CreditCustomer): CreditRating {
  if (customer.riskScore >= 90) {
    return "1D";
  }

  if (customer.riskScore >= 82) {
    return "1B";
  }

  if (customer.riskScore >= 76) {
    return "1C";
  }

  if (customer.riskScore >= 68) {
    return "2A";
  }

  if (customer.riskScore >= 60) {
    return "2B";
  }

  return "2C";
}

function getPreviousRating(rating: CreditRating): CreditRating {
  const previous: Partial<Record<CreditRating, CreditRating>> = {
    "1B": "1A",
    "1C": "1B",
    "1D": "1C",
    "2A": "1D",
    "2B": "2A",
    "2C": "2B",
    "2D": "2C",
  };

  return previous[rating] ?? rating;
}

function getDefaultCustomerCode(id: string) {
  return `KH${id.replace(/\D/g, "").padStart(4, "0") || "2024"}`;
}

function getDefaultExternalEvents(customer: CreditCustomer): ExternalEventCounts {
  const risks = customer.mainRisks.join("、");

  return {
    sentiment: risks.includes("舆情") ? 1 : 0,
    litigation: risks.includes("司法") || risks.includes("诉讼") ? 1 : 0,
    enforcement: risks.includes("被执行") || risks.includes("冻结") ? 1 : 0,
    regulatory: risks.includes("监管") ? 1 : 0,
    announcement: risks.includes("公告") || risks.includes("评级") || risks.includes("债券") ? 1 : 0,
    guaranteeChain: risks.includes("担保"),
  };
}

function getDefaultExternalTimeline(customer: CreditCustomer, counts: ExternalEventCounts): ExternalRiskEvent[] {
  const events: ExternalRiskEvent[] = [];

  if (counts.sentiment > 0) {
    events.push({ time: "近 7 日", type: "负面舆情", title: "负面舆情关注度上升", summary: `${customer.name}相关负面舆情出现上升。`, impact: "影响中等", factors: ["舆情风险"] });
  }

  if (counts.litigation > 0) {
    events.push({ time: "近 7 日", type: "诉讼", title: "新增诉讼案件", summary: `${customer.name}新增诉讼案件，需关注回款与担保风险。`, impact: "影响中等", factors: ["司法风险"] });
  }

  if (counts.enforcement > 0) {
    events.push({ time: "近 7 日", type: "被执行", title: "新增被执行信息", summary: `${customer.name}新增被执行信息，流动性压力需关注。`, impact: "影响较大", factors: ["流动性压力"] });
  }

  if ((counts.announcement ?? 0) > 0) {
    events.push({ time: "近 7 日", type: "公告", title: "公告风险信号", summary: `${customer.name}近期公告显示经营压力上升。`, impact: "影响中等", factors: ["公告风险"] });
  }

  return events.length > 0
    ? events
    : [{ time: "近 7 日", type: "公告", title: "暂无新增重大外部事件", summary: "外部事件暂未明显增多，但仍需结合内部评级持续跟踪。", impact: "影响中等", factors: ["持续关注"] }];
}

function getRiskReasonDescription(risk: string) {
  if (risk.includes("现金流") || risk.includes("回款")) {
    return "近三个月回款周期拉长，现金覆盖能力下降";
  }

  if (risk.includes("商票") || risk.includes("逾期")) {
    return "新增逾期记录，短期流动性压力上升";
  }

  if (risk.includes("行业") || risk.includes("景气")) {
    return "行业景气度下降，外部融资环境偏弱";
  }

  if (risk.includes("担保")) {
    return "关联担保链条复杂，风险传导路径增加";
  }

  return "相关风险信号持续出现，需提高监控频率";
}

function getDefaultDisposalAdvice(customer: CreditCustomer, rating: CreditRating, ratingTrend: RatingTrend): DisposalAdvice {
  return {
    customerName: customer.name,
    customerId: getDefaultCustomerCode(customer.id),
    rating,
    ratingTrend,
    riskStatus: customer.riskLevel,
    disposalLevel: customer.riskLevel === "一级预警" || customer.riskLevel === "已出险" ? "一级跟踪" : "专项关注",
    urgency: customer.riskLevel === "已出险" ? 5 : customer.riskLevel === "一级预警" ? 4 : 3,
    summary: "基于客户当前风险状态、信用评级及外部事件，AI 建议采取主动风险管理措施。",
    actions: [
      { title: "暂停新增授信", description: "建议审慎处理新增授信及额度提升申请。", priority: "高优先级" },
      { title: "排查关联担保链", description: "排查关联担保及上下游关联方风险。", priority: "高优先级" },
      { title: "加强现金流监控", description: "每周监控经营现金流、回款进度及资金缺口情况。", priority: "中优先级" },
      { title: "跟踪舆情与司法事件", description: "持续跟踪舆情、诉讼及被执行信息变化。", priority: "中优先级" },
    ],
    aiInterpretation: `客户风险上升主要受${customer.mainRisks.slice(0, 3).join("、")}影响，建议采取主动风险管理措施，防止风险进一步扩散。`,
  };
}
