export type CompareBasis = "previousMonth" | "yearStart";
export type MetricCompareBasis = CompareBasis | "previousYear";
export type DataOrigin = "reference-confirmed" | "demo-consistent" | "provisional-label";
export type DataStatus = "reviewed" | "provisional";
export type RiskLevel = "normal" | "attention" | "decision";
export type VerificationStatus = "confirmed" | "pending";
export type EventState = "observe" | "warming" | "improving" | "stable" | "mitigated";
export type TrackingStatus = "untracked" | "pending" | "tracking" | "warming" | "improving" | "mitigated" | "closed";
export type ReportStatus = "notIncluded" | "draft" | "included";
export type ChangeCategory = "return" | "var" | "scale";
export type FixtureName = "default" | "empty" | "singlePoint" | "extreme" | "longText" | "error";

export type Metric = {
  id: string;
  label: string;
  value: number | null;
  unit: "%" | "亿元" | "bp" | "个";
  precision: number;
  scope: string;
  source: string;
  origin: DataOrigin;
  comparisonValues?: Partial<Record<MetricCompareBasis, number>>;
  comparisonOrigin?: DataOrigin;
};

export type EvidenceValueRef =
  | { kind: "metric"; metricId: string }
  | { kind: "member"; memberId: string; field: "scale" | "annualReturn" | "varValue" }
  | { kind: "asset"; assetClassId: AssetClassId; field: "amount" };

export type Evidence = {
  id: string;
  ref: EvidenceValueRef;
  label: string;
  source: string;
  scope: string;
  origin: DataOrigin;
};

export type Member = {
  id: string;
  shortName: string;
  fullName: string;
  origin: DataOrigin;
  comparisonOrigin: DataOrigin;
  scale: number;
  previousScale: number | null;
  annualReturn: number | null;
  previousAnnualReturn: number | null;
  varValue: number | null;
  previousVarValue: number | null;
  supportsReturnData: boolean;
  supportsVarData: boolean;
  supportsFactorVarData: boolean;
  assetAmounts: Record<AssetClassId, number>;
  factorVar: Record<FactorId, number | null>;
};

export type AssetClassId = "fixedIncome" | "equity" | "alternative" | "other";
export type AssetClass = {
  id: AssetClassId;
  name: string;
  amount: number;
  color: string;
  origin: DataOrigin;
};

export type FactorId = "interestRate" | "equity" | "currency";
export type VarFactor = {
  id: FactorId;
  name: string;
  value: number;
  previousValue: number;
  description: string;
};

export type VarTrendSeriesKey = "group" | "interestRate" | "equity" | "fx";
export type VarTrendPoint = {
  period: string;
  group: number | null;
  interestRate: number | null;
  equity: number | null;
  fx: number | null;
  groupLimit: number | null;
};

export type InvestmentChange = {
  id: string;
  category: ChangeCategory;
  title: string;
  summary: string;
  conclusion: string;
  riskLevel: RiskLevel;
  verification: VerificationStatus;
  eventState: EventState;
  trackingStatus: TrackingStatus;
  reportStatus: ReportStatus;
  memberIds: string[];
  assetClassIds: AssetClassId[];
  factorIds: FactorId[];
  evidenceIds: string[];
  metricIds: string[];
  updatedAt: string;
};

export type InvestmentRiskSnapshot = {
  id: string;
  period: string;
  periodLabel: string;
  dataStatus: DataStatus;
  reviewedAt: string;
  defaultCompareBasis: CompareBasis;
  groupName: string;
  scopeNote: string;
  metrics: Record<string, Metric>;
  evidence: Record<string, Evidence>;
  assets: AssetClass[];
  members: Member[];
  varFactors: VarFactor[];
  varTrend: VarTrendPoint[];
  ciiMonthlyTrend: Array<{ label: string; value: number }>;
  changes: InvestmentChange[];
  sourceSystems: string[];
};

export type CiiViewId = "group" | "life" | "property" | "pension" | "health";
export type CiiMetricDataStatus = DataStatus | "missing";
export type CiiMetricTrend = "up" | "down" | "flat" | "unavailable";

export type CiiMetricData = {
  id: string;
  label: string;
  value: number | null;
  unit: "%" | "亿元";
  deltaValue: number | null;
  deltaUnit: "bp" | "亿元";
  comparisonLabel: string;
  trend: CiiMetricTrend;
  dataStatus: CiiMetricDataStatus;
  dataScope: string;
  source: string;
};

export type CiiTrendPoint = {
  period: string;
  currentValue: number | null;
  groupValue: number | null;
};

export type CiiManagementInterpretation = {
  conclusion: string;
  evidence: string[];
  uncertainty: string;
  action: string;
};

export type CiiViewData = {
  id: CiiViewId;
  label: string;
  memberId?: Exclude<CiiViewId, "group">;
  annualAmount: CiiMetricData;
  annualRate: CiiMetricData;
  monthlyAmount: CiiMetricData;
  monthlyRate: CiiMetricData;
  monthlyTrend: CiiTrendPoint[];
  attentionTitle: string;
  attentionBody: string;
  interpretation: CiiManagementInterpretation;
  sourceLabel: string;
  updatedAt: string;
};

export const ciiViewOrder: CiiViewId[] = ["group", "life", "property", "pension", "health"];

const assetAmounts = {
  bank: { fixedIncome: 9000, equity: 0, alternative: 1700, other: 3363 },
  life: { fixedIncome: 2900, equity: 809, alternative: 350, other: 1283 },
  pension: { fixedIncome: 1700, equity: 1801, alternative: 250, other: 163 },
  property: { fixedIncome: 100, equity: 805, alternative: 40, other: 23 },
  health: { fixedIncome: 60, equity: 613, alternative: 30, other: 56 },
  securities: { fixedIncome: 250, equity: 214, alternative: 137, other: 24 },
  founderSecurities: { fixedIncome: 150, equity: 65, alternative: 50, other: 60 },
} satisfies Record<string, Record<AssetClassId, number>>;

const members: Member[] = [
  {
    id: "bank",
    shortName: "平安银行",
    fullName: "平安银行股份有限公司",
    origin: "reference-confirmed",
    comparisonOrigin: "demo-consistent",
    scale: 14063,
    previousScale: 13843,
    annualReturn: null,
    previousAnnualReturn: null,
    varValue: null,
    previousVarValue: null,
    supportsReturnData: false,
    supportsVarData: false,
    supportsFactorVarData: false,
    assetAmounts: assetAmounts.bank,
    factorVar: { interestRate: null, equity: null, currency: null },
  },
  {
    id: "life",
    shortName: "寿险",
    fullName: "平安人寿保险股份有限公司",
    origin: "reference-confirmed",
    comparisonOrigin: "demo-consistent",
    scale: 5342,
    previousScale: 5262,
    annualReturn: 39.15,
    previousAnnualReturn: 38.8,
    varValue: 121,
    previousVarValue: 113,
    supportsReturnData: true,
    supportsVarData: true,
    supportsFactorVarData: true,
    assetAmounts: assetAmounts.life,
    factorVar: { interestRate: 377, equity: 265, currency: 562 },
  },
  {
    id: "pension",
    shortName: "养老险",
    fullName: "平安养老保险股份有限公司",
    origin: "reference-confirmed",
    comparisonOrigin: "demo-consistent",
    scale: 3914,
    previousScale: 3850,
    annualReturn: 75.43,
    previousAnnualReturn: 74.74,
    varValue: 608,
    previousVarValue: 562,
    supportsReturnData: true,
    supportsVarData: true,
    supportsFactorVarData: true,
    assetAmounts: assetAmounts.pension,
    factorVar: { interestRate: 768, equity: 622, currency: 864 },
  },
  {
    id: "property",
    shortName: "产险",
    fullName: "平安财产保险股份有限公司",
    origin: "reference-confirmed",
    comparisonOrigin: "demo-consistent",
    scale: 968,
    previousScale: 940,
    annualReturn: 82.62,
    previousAnnualReturn: 81.84,
    varValue: 145,
    previousVarValue: 157,
    supportsReturnData: true,
    supportsVarData: true,
    supportsFactorVarData: true,
    assetAmounts: assetAmounts.property,
    factorVar: { interestRate: 197, equity: 112, currency: 194 },
  },
  {
    id: "health",
    shortName: "健康险",
    fullName: "平安健康保险股份有限公司",
    origin: "reference-confirmed",
    comparisonOrigin: "demo-consistent",
    scale: 759,
    previousScale: 738,
    annualReturn: 57.84,
    previousAnnualReturn: 57.3,
    varValue: 227,
    previousVarValue: 245,
    supportsReturnData: true,
    supportsVarData: true,
    supportsFactorVarData: true,
    assetAmounts: assetAmounts.health,
    factorVar: { interestRate: 294, equity: 291, currency: 192 },
  },
  {
    id: "securities",
    shortName: "证券",
    fullName: "平安证券股份有限公司",
    origin: "reference-confirmed",
    comparisonOrigin: "demo-consistent",
    scale: 625,
    previousScale: 598,
    annualReturn: null,
    previousAnnualReturn: null,
    varValue: 3,
    previousVarValue: 3,
    supportsReturnData: false,
    supportsVarData: true,
    supportsFactorVarData: false,
    assetAmounts: assetAmounts.securities,
    factorVar: { interestRate: null, equity: null, currency: null },
  },
  {
    id: "founderSecurities",
    shortName: "方正证券",
    fullName: "方正证券股份有限公司",
    origin: "reference-confirmed",
    comparisonOrigin: "demo-consistent",
    scale: 325,
    previousScale: 305,
    annualReturn: null,
    previousAnnualReturn: null,
    varValue: 4,
    previousVarValue: 4,
    supportsReturnData: false,
    supportsVarData: true,
    supportsFactorVarData: false,
    assetAmounts: assetAmounts.founderSecurities,
    factorVar: { interestRate: null, equity: null, currency: null },
  },
];

const referenceOrigin: DataOrigin = "reference-confirmed";
const roundTo = (value: number, precision = 0) => Number(value.toFixed(precision));

const canonicalValues = {
  groupScale: 25996,
  groupScalePreviousMonth: 25536,
  groupScaleYearStart: 23937,
  ciiAnnualRate: 66.15,
  ciiAnnualRatePreviousMonth: 65.53,
  ciiMonthlyRate: -2.47,
  ciiMonthlyRatePreviousMonth: -1.77,
  ciiMonthlyAmount: 8859,
  ciiMonthlyAmountPreviousMonth: 3568,
  totalVar: 426,
  totalVarPreviousMonth: 498,
  varLimit: 800,
  interestRateVar: 451,
  interestRateVarPreviousMonth: 544,
  equityScale: 4307,
  equityVar: 71,
  equityVarPreviousMonth: 88,
  fxVar: 3,
  fxVarPreviousMonth: 7,
  equityAnnualReturn: 26.91,
  equityAnnualReturnPreviousYear: 13.77,
};

const metrics: Record<string, Metric> = {
  groupScale: { id: "groupScale", label: "集团投资规模", value: canonicalValues.groupScale, unit: "亿元", precision: 0, scope: "集团投资资产", source: "投资资产管理系统", origin: referenceOrigin, comparisonValues: { previousMonth: canonicalValues.groupScalePreviousMonth, yearStart: canonicalValues.groupScaleYearStart }, comparisonOrigin: "demo-consistent" },
  ciiAnnualRate: { id: "ciiAnnualRate", label: "CII 年化综合投资收益率", value: canonicalValues.ciiAnnualRate, unit: "%", precision: 2, scope: "四家险资 CII 口径", source: "CII 收益报表", origin: referenceOrigin, comparisonValues: { previousMonth: canonicalValues.ciiAnnualRatePreviousMonth }, comparisonOrigin: "demo-consistent" },
  ciiAnnualAmount: { id: "ciiAnnualAmount", label: "CII 年化综合投资收益额", value: 14550, unit: "亿元", precision: 0, scope: "四家险资 CII 口径", source: "CII 收益报表", origin: referenceOrigin },
  ciiAnnualDelta: { id: "ciiAnnualDelta", label: "年化收益率较上月", value: roundTo((canonicalValues.ciiAnnualRate - canonicalValues.ciiAnnualRatePreviousMonth) * 100), unit: "bp", precision: 0, scope: "四家险资 CII 口径", source: "CII 收益报表", origin: referenceOrigin },
  ciiMonthlyRate: { id: "ciiMonthlyRate", label: "CII 月度综合投资收益率", value: canonicalValues.ciiMonthlyRate, unit: "%", precision: 2, scope: "四家险资 CII 口径", source: "CII 收益报表", origin: referenceOrigin, comparisonValues: { previousMonth: canonicalValues.ciiMonthlyRatePreviousMonth }, comparisonOrigin: "demo-consistent" },
  ciiMonthlyAmount: { id: "ciiMonthlyAmount", label: "CII 月度综合投资收益额", value: canonicalValues.ciiMonthlyAmount, unit: "亿元", precision: 0, scope: "四家险资 CII 口径", source: "CII 收益报表", origin: referenceOrigin, comparisonValues: { previousMonth: canonicalValues.ciiMonthlyAmountPreviousMonth }, comparisonOrigin: "demo-consistent" },
  ciiMonthlyDelta: { id: "ciiMonthlyDelta", label: "月度收益率较上月", value: roundTo((canonicalValues.ciiMonthlyRate - canonicalValues.ciiMonthlyRatePreviousMonth) * 100), unit: "bp", precision: 0, scope: "四家险资 CII 口径", source: "CII 收益报表", origin: referenceOrigin },
  ciiMonthlyAmountDelta: { id: "ciiMonthlyAmountDelta", label: "月度收益额较上月", value: canonicalValues.ciiMonthlyAmount - canonicalValues.ciiMonthlyAmountPreviousMonth, unit: "亿元", precision: 0, scope: "四家险资 CII 口径", source: "CII 收益报表", origin: referenceOrigin },
  totalVar: { id: "totalVar", label: "集团 VaR", value: canonicalValues.totalVar, unit: "亿元", precision: 0, scope: "VaR 计量资产", source: "市场风险计量系统", origin: referenceOrigin, comparisonValues: { previousMonth: canonicalValues.totalVarPreviousMonth }, comparisonOrigin: "demo-consistent" },
  varLimit: { id: "varLimit", label: "VaR 管理限额", value: canonicalValues.varLimit, unit: "亿元", precision: 0, scope: "VaR 计量资产", source: "市场风险计量系统", origin: referenceOrigin },
  varDelta: { id: "varDelta", label: "VaR 较上月", value: canonicalValues.totalVar - canonicalValues.totalVarPreviousMonth, unit: "亿元", precision: 0, scope: "VaR 计量资产", source: "市场风险计量系统", origin: referenceOrigin },
  varUsage: { id: "varUsage", label: "VaR 限额使用率", value: roundTo((canonicalValues.totalVar / canonicalValues.varLimit) * 100, 1), unit: "%", precision: 1, scope: "VaR 计量资产", source: "市场风险计量系统", origin: referenceOrigin },
  varRemaining: { id: "varRemaining", label: "VaR 剩余额度", value: canonicalValues.varLimit - canonicalValues.totalVar, unit: "亿元", precision: 0, scope: "VaR 计量资产", source: "市场风险计量系统", origin: referenceOrigin },
  equityScale: { id: "equityScale", label: "权益资产规模", value: canonicalValues.equityScale, unit: "亿元", precision: 0, scope: "集团投资资产", source: "投资资产管理系统", origin: referenceOrigin },
  equityShare: { id: "equityShare", label: "权益资产占比", value: roundTo((canonicalValues.equityScale / canonicalValues.groupScale) * 100, 1), unit: "%", precision: 1, scope: "集团投资资产", source: "投资资产管理系统", origin: referenceOrigin },
  equityVar: { id: "equityVar", label: "权益因子 VaR", value: canonicalValues.equityVar, unit: "亿元", precision: 0, scope: "VaR 计量资产", source: "市场风险计量系统", origin: referenceOrigin, comparisonValues: { previousMonth: canonicalValues.equityVarPreviousMonth }, comparisonOrigin: "demo-consistent" },
  equityAnnualReturn: { id: "equityAnnualReturn", label: "权益资产年化收益率", value: canonicalValues.equityAnnualReturn, unit: "%", precision: 2, scope: "四家险资 CII 口径", source: "CII 收益报表", origin: referenceOrigin, comparisonValues: { previousYear: canonicalValues.equityAnnualReturnPreviousYear }, comparisonOrigin: "demo-consistent" },
};

const evidence: Record<string, Evidence> = Object.fromEntries(
  Object.values(metrics).map((metric) => [
    `e-${metric.id}`,
    { id: `e-${metric.id}`, ref: { kind: "metric", metricId: metric.id }, label: metric.label, source: metric.source, scope: metric.scope, origin: metric.origin },
  ]),
);

evidence["e-member-pension-var"] = {
  id: "e-member-pension-var",
  ref: { kind: "member", memberId: "pension", field: "varValue" },
  label: "养老险成员 VaR",
  source: "市场风险计量系统",
  scope: "养老险成员计量值 · 无独立限额",
  origin: "reference-confirmed",
};

export const investmentRiskSnapshot: InvestmentRiskSnapshot = {
  id: "investment-2026-06-reviewed",
  period: "2026-06",
  periodLabel: "2026 年 6 月",
  dataStatus: "reviewed",
  reviewedAt: "2026-07-08 18:00",
  defaultCompareBasis: "previousMonth",
  groupName: "集团",
  scopeNote: "收益与 VaR 使用不同计量资产范围，不能直接相加或相互替代。",
  metrics,
  evidence,
  assets: [
    { id: "fixedIncome", name: "固定收益", amount: 14160, color: "#f4a261", origin: "reference-confirmed" },
    { id: "equity", name: "权益", amount: 4307, color: "#ff6a00", origin: "reference-confirmed" },
    { id: "alternative", name: "另类", amount: 2557, color: "#efc283", origin: "reference-confirmed" },
    { id: "other", name: "其他", amount: 4972, color: "#d8c5ad", origin: "provisional-label" },
  ],
  members,
  varFactors: [
    { id: "interestRate", name: "利率", value: canonicalValues.interestRateVar, previousValue: canonicalValues.interestRateVarPreviousMonth, description: "主要来自固收资产利率敏感度" },
    { id: "equity", name: "权益", value: canonicalValues.equityVar, previousValue: canonicalValues.equityVarPreviousMonth, description: "主要来自权益市场波动" },
    { id: "currency", name: "汇率", value: canonicalValues.fxVar, previousValue: canonicalValues.fxVarPreviousMonth, description: "外币资产敞口较小" },
  ],
  varTrend: [
    { period: "1月", group: 489, interestRate: 512, equity: 82, fx: 6, groupLimit: canonicalValues.varLimit },
    { period: "2月", group: 472, interestRate: 497, equity: 76, fx: 5, groupLimit: canonicalValues.varLimit },
    { period: "3月", group: 505, interestRate: 561, equity: 94, fx: 8, groupLimit: canonicalValues.varLimit },
    { period: "4月", group: 468, interestRate: 526, equity: 85, fx: 6, groupLimit: canonicalValues.varLimit },
    { period: "5月", group: canonicalValues.totalVarPreviousMonth, interestRate: canonicalValues.interestRateVarPreviousMonth, equity: canonicalValues.equityVarPreviousMonth, fx: canonicalValues.fxVarPreviousMonth, groupLimit: canonicalValues.varLimit },
    { period: "6月", group: canonicalValues.totalVar, interestRate: canonicalValues.interestRateVar, equity: canonicalValues.equityVar, fx: canonicalValues.fxVar, groupLimit: canonicalValues.varLimit },
  ],
  ciiMonthlyTrend: [
    { label: "1月", value: 0.54 },
    { label: "2月", value: -0.86 },
    { label: "3月", value: 1.12 },
    { label: "4月", value: -0.41 },
    { label: "5月", value: -1.77 },
    { label: "6月", value: -2.47 },
  ],
  changes: [
    {
      id: "cii-monthly-negative",
      category: "return",
      title: "CII 月度综合投资收益率转负",
      summary: "月度综合投资收益率为 -2.47%，较上月下降 70bp，需关注连续性。",
      conclusion: "本月收益转负是当前首要关注变化，但单月数据不足以判断趋势反转。",
      riskLevel: "attention",
      verification: "confirmed",
      eventState: "warming",
      trackingStatus: "untracked",
      reportStatus: "notIncluded",
      memberIds: ["property", "pension", "health", "life"],
      assetClassIds: ["equity"],
      factorIds: ["equity"],
      evidenceIds: ["e-ciiMonthlyRate", "e-ciiMonthlyAmount", "e-ciiAnnualRate"],
      metricIds: ["ciiMonthlyRate", "ciiMonthlyAmount", "ciiAnnualRate"],
      updatedAt: "2026-07-08 18:00",
    },
    {
      id: "pension-var-leading",
      category: "var",
      title: "养老险成员 VaR 排名居首",
      summary: "养老险 VaR 为 608 亿元；该值无独立限额，不应直接解释为高风险。",
      conclusion: "需先核验成员口径与因子暴露，再决定是否升级管理关注。",
      riskLevel: "attention",
      verification: "pending",
      eventState: "observe",
      trackingStatus: "untracked",
      reportStatus: "notIncluded",
      memberIds: ["pension"],
      assetClassIds: ["fixedIncome", "equity"],
      factorIds: ["interestRate", "equity", "currency"],
      evidenceIds: ["e-member-pension-var"],
      metricIds: [],
      updatedAt: "2026-07-08 18:00",
    },
    {
      id: "group-var-improving",
      category: "var",
      title: "集团 VaR 较上月下降",
      summary: "集团 VaR 降至 426 亿元，较上月减少 72 亿元，限额使用率为 53.3%。",
      conclusion: "集团 VaR 本月趋稳，仍需持续观察主要因子变化。",
      riskLevel: "normal",
      verification: "confirmed",
      eventState: "improving",
      trackingStatus: "untracked",
      reportStatus: "notIncluded",
      memberIds: ["pension", "health", "property", "life"],
      assetClassIds: ["fixedIncome", "equity"],
      factorIds: ["interestRate", "equity", "currency"],
      evidenceIds: ["e-totalVar", "e-varDelta", "e-varUsage"],
      metricIds: ["totalVar", "varDelta", "varUsage"],
      updatedAt: "2026-07-08 18:00",
    },
    {
      id: "group-scale-observe",
      category: "scale",
      title: "集团投资规模保持稳定",
      summary: "集团投资规模为 25,996 亿元，资产结构以固定收益为主。",
      conclusion: "规模与结构暂无需立即行动，继续按月观察即可。",
      riskLevel: "normal",
      verification: "confirmed",
      eventState: "observe",
      trackingStatus: "untracked",
      reportStatus: "notIncluded",
      memberIds: ["bank", "life", "pension", "property", "health", "securities", "founderSecurities"],
      assetClassIds: ["fixedIncome", "equity", "alternative", "other"],
      factorIds: [],
      evidenceIds: ["e-groupScale", "e-equityScale"],
      metricIds: ["groupScale", "equityScale"],
      updatedAt: "2026-07-08 18:00",
    },
  ],
  sourceSystems: ["投资资产管理系统", "CII 收益报表", "市场风险计量系统"],
};

export const categoryLabels: Record<ChangeCategory, string> = { return: "收益", var: "VaR", scale: "规模" };
export const riskLevelLabels: Record<RiskLevel, string> = { normal: "正常", attention: "需关注", decision: "待决策" };
export const verificationLabels: Record<VerificationStatus, string> = { confirmed: "已核验", pending: "待核验" };
export const eventStateLabels: Record<EventState, string> = { observe: "观察", warming: "升温", improving: "趋稳", stable: "稳定", mitigated: "已缓释" };
export const trackingStatusLabels: Record<TrackingStatus, string> = { untracked: "未跟踪", pending: "待确认", tracking: "跟踪中", warming: "升温中", improving: "改善中", mitigated: "已缓释", closed: "已关闭" };

export function formatNumber(value: number | null, precision = 0) {
  if (value === null) return "—";
  return new Intl.NumberFormat("zh-CN", { minimumFractionDigits: precision, maximumFractionDigits: precision }).format(value);
}

export function formatMetricParts(metric: Metric, signed = false) {
  if (metric.value === null) return { value: "—", unit: "" };
  const sign = signed && metric.value > 0 ? "+" : "";
  if (metric.unit === "亿元" && Math.abs(metric.value) >= 40000) {
    return { value: `${sign}${formatNumber(metric.value / 10000, 2)}`, unit: "万亿元" };
  }
  return { value: `${sign}${formatNumber(metric.value, metric.precision)}`, unit: metric.unit };
}

export function formatMetric(metric: Metric, signed = false) {
  const formatted = formatMetricParts(metric, signed);
  return `${formatted.value}${formatted.unit}`;
}

export function metricDelta(metric: Metric, basis: MetricCompareBasis) {
  const baseline = metric.comparisonValues?.[basis];
  return metric.value === null || baseline === undefined ? null : metric.value - baseline;
}

export function metricPercentDelta(metric: Metric, basis: MetricCompareBasis) {
  const baseline = metric.comparisonValues?.[basis];
  if (metric.value === null || baseline === undefined || baseline === 0) return null;
  return ((metric.value - baseline) / baseline) * 100;
}

export function memberDelta(member: Member, field: "scale" | "annualReturn" | "varValue") {
  const previousField = field === "scale" ? "previousScale" : field === "annualReturn" ? "previousAnnualReturn" : "previousVarValue";
  const current = member[field];
  const previous = member[previousField];
  return current === null || previous === null ? null : current - previous;
}

export function resolveEvidence(evidenceItem: Evidence, snapshot = investmentRiskSnapshot): Metric | undefined {
  if (evidenceItem.ref.kind === "metric") return snapshot.metrics[evidenceItem.ref.metricId];
  if (evidenceItem.ref.kind === "asset") {
    const assetClassId = evidenceItem.ref.assetClassId;
    const asset = snapshot.assets.find((item) => item.id === assetClassId);
    if (!asset) return undefined;
    return { id: evidenceItem.id, label: evidenceItem.label, value: asset.amount, unit: "亿元", precision: 0, scope: evidenceItem.scope, source: evidenceItem.source, origin: evidenceItem.origin };
  }
  const memberId = evidenceItem.ref.memberId;
  const member = snapshot.members.find((item) => item.id === memberId);
  if (!member) return undefined;
  const field = evidenceItem.ref.field;
  return {
    id: evidenceItem.id,
    label: evidenceItem.label,
    value: member[field],
    unit: field === "annualReturn" ? "%" : "亿元",
    precision: field === "annualReturn" ? 2 : 0,
    scope: evidenceItem.scope,
    source: evidenceItem.source,
    origin: evidenceItem.origin,
  };
}

export function assetShare(amount: number, snapshot = investmentRiskSnapshot) {
  const total = snapshot.metrics.groupScale.value;
  return total === null || total === 0 ? 0 : (amount / total) * 100;
}

export function getMember(memberId: string | undefined, snapshot = investmentRiskSnapshot) {
  return snapshot.members.find((member) => member.id === memberId) ?? snapshot.members.find((member) => member.id === "pension")!;
}

export function getAsset(assetId: string | undefined, snapshot = investmentRiskSnapshot) {
  return snapshot.assets.find((asset) => asset.id === assetId) ?? snapshot.assets.find((asset) => asset.id === "equity")!;
}

export function getChange(changeId: string | undefined, snapshot = investmentRiskSnapshot): InvestmentChange {
  return snapshot.changes.find((change) => change.id === changeId) ?? snapshot.changes[0] ?? investmentRiskSnapshot.changes[0];
}

export function getMetric(metricId: string, snapshot = investmentRiskSnapshot) {
  return snapshot.metrics[metricId];
}

export function getEvidenceForChange(change: InvestmentChange, snapshot = investmentRiskSnapshot) {
  return change.evidenceIds.map((id) => snapshot.evidence[id]).filter(Boolean);
}

export function getSnapshotForSearch(search: string): { snapshot: InvestmentRiskSnapshot; fixture: FixtureName; error: boolean } {
  const params = new URLSearchParams(search);
  const fixture = (import.meta.env.DEV ? params.get("fixture") : null) as FixtureName | null;
  const allowed: FixtureName[] = ["default", "empty", "singlePoint", "extreme", "longText", "error"];
  const resolved = fixture && allowed.includes(fixture) ? fixture : "default";

  const requestedDataStatus: DataStatus = params.get("dataStatus") === "provisional" ? "provisional" : "reviewed";
  const requestedCompare: CompareBasis = ["yearStart", "previousYearEnd"].includes(params.get("compare") ?? "") ? "yearStart" : "previousMonth";
  const needsClone = resolved !== "default" || requestedDataStatus !== investmentRiskSnapshot.dataStatus || requestedCompare !== investmentRiskSnapshot.defaultCompareBasis;
  const clone = needsClone ? structuredClone(investmentRiskSnapshot) : investmentRiskSnapshot;
  clone.dataStatus = requestedDataStatus;
  clone.defaultCompareBasis = requestedCompare;

  if (resolved === "error") return { snapshot: clone, fixture: resolved, error: true };
  if (resolved === "default") return { snapshot: clone, fixture: resolved, error: false };

  if (resolved === "empty") {
    clone.changes = [];
    clone.varTrend = [];
    clone.ciiMonthlyTrend = [];
    Object.values(clone.metrics).forEach((metric) => { metric.value = null; metric.comparisonValues = {}; });
    clone.assets = clone.assets.map((asset) => ({ ...asset, amount: 0 }));
    clone.members = clone.members.map((member) => ({
      ...member,
      scale: 0,
      previousScale: null,
      annualReturn: null,
      previousAnnualReturn: null,
      varValue: null,
      previousVarValue: null,
      assetAmounts: { fixedIncome: 0, equity: 0, alternative: 0, other: 0 },
      factorVar: { interestRate: null, equity: null, currency: null },
    }));
  }
  if (resolved === "singlePoint") {
    clone.varTrend = [clone.varTrend.at(-1)!];
    clone.ciiMonthlyTrend = [clone.ciiMonthlyTrend.at(-1)!];
  }
  if (resolved === "extreme") {
    clone.members = clone.members.map((member) => ({
      ...member,
      scale: member.scale * 10,
      previousScale: member.previousScale === null ? null : member.previousScale * 10,
      assetAmounts: Object.fromEntries(Object.entries(member.assetAmounts).map(([key, value]) => [key, value * 10])) as Record<AssetClassId, number>,
    }));
    clone.assets = clone.assets.map((asset) => ({ ...asset, amount: asset.amount * 10 }));
    clone.metrics.groupScale.value = 259960;
    clone.metrics.groupScale.comparisonValues = { previousMonth: 255360, yearStart: 239370 };
    clone.metrics.equityScale.value = 43070;
    clone.metrics.ciiAnnualAmount.value = 145500;
    clone.metrics.ciiMonthlyAmount.value = -88590;
    clone.metrics.ciiMonthlyRate.value = -22.47;
    clone.metrics.ciiMonthlyDelta.value = -2070;
    clone.metrics.ciiMonthlyAmountDelta.value = -102740;
    clone.metrics.varUsage.value = 128.4;
    clone.metrics.totalVar.value = 1027;
    clone.metrics.varDelta.value = 529;
    clone.metrics.varRemaining.value = -227;
    clone.varTrend = clone.varTrend.map((point, index) => ({ ...point, group: index === clone.varTrend.length - 1 ? 1027 : point.group }));
    clone.ciiMonthlyTrend = clone.ciiMonthlyTrend.map((point, index) => ({ ...point, value: index === clone.ciiMonthlyTrend.length - 1 ? -22.47 : point.value }));
    clone.changes = clone.changes.map((change) => {
      if (change.id === "cii-monthly-negative") return { ...change, summary: "月度综合投资收益率为 -22.47%，较上月下降 2,070bp，需关注连续性。", conclusion: "本月收益显著转负，是当前首要关注变化，但仍需先核验极值数据后再升级判断。" };
      if (change.id === "group-var-improving") return { ...change, title: "集团 VaR 超过管理限额", summary: "集团 VaR 升至 1,027 亿元，较上月增加 529 亿元，限额使用率为 128.4%。", conclusion: "集团 VaR 已超过管理限额，需立即核验数据并升级管理关注。", riskLevel: "decision", eventState: "warming" };
      if (change.id === "group-scale-observe") return { ...change, summary: "集团投资规模为 259,960 亿元，资产结构以固定收益为主。" };
      return change;
    });
  }
  if (resolved === "longText") {
    clone.members = clone.members.map((member, index) => index === 0 ? { ...member, shortName: "平安银行股份有限公司资产管理业务单元", fullName: "平安银行股份有限公司资产管理与集团投资协同业务单元" } : member);
    clone.changes[0].title = `${clone.changes[0].title}并需持续核验多口径数据一致性`;
    clone.changes[0].summary = `${clone.changes[0].summary} 该说明用于验证极长业务文案在窄屏、放大字体和弹层中的自然换行，不改变任何业务结论。`;
    clone.varFactors[0].description = `${clone.varFactors[0].description}，并包含跨期限、跨市场和成员公司之间的口径核验说明`;
  }
  return { snapshot: clone, fixture: resolved, error: false };
}

export function getInvestmentQuery(search: string) {
  const params = new URLSearchParams(search);
  const period = params.get("period") === investmentRiskSnapshot.period ? investmentRiskSnapshot.period : investmentRiskSnapshot.period;
  const dataStatus: DataStatus = params.get("dataStatus") === "provisional" ? "provisional" : "reviewed";
  const compareBasis: CompareBasis = ["yearStart", "previousYearEnd"].includes(params.get("compare") ?? "") ? "yearStart" : "previousMonth";
  return { period, dataStatus, compareBasis };
}

const ciiViewLabels: Record<CiiViewId, string> = {
  group: "集团",
  life: "寿险",
  property: "产险",
  pension: "养老险",
  health: "健康险",
};

const ciiMemberAnnualAmounts: Record<Exclude<CiiViewId, "group">, number> = {
  life: 1994,
  property: 3670,
  pension: 6075,
  health: 2811,
};

const ciiMetricIds = ["annualAmount", "annualRate", "monthlyAmount", "monthlyRate"] as const;

function getCiiTrend(deltaValue: number | null): CiiMetricTrend {
  if (deltaValue === null) return "unavailable";
  if (deltaValue > 0) return "up";
  if (deltaValue < 0) return "down";
  return "flat";
}

function createCiiMetric({
  view,
  metricId,
  label,
  value,
  unit,
  deltaValue,
  deltaUnit,
  scope,
  snapshot,
}: {
  view: CiiViewId;
  metricId: (typeof ciiMetricIds)[number];
  label: string;
  value: number | null;
  unit: CiiMetricData["unit"];
  deltaValue: number | null;
  deltaUnit: CiiMetricData["deltaUnit"];
  scope: string;
  snapshot: InvestmentRiskSnapshot;
}): CiiMetricData {
  return {
    id: `cii.${view}.${metricId}`,
    label,
    value,
    unit,
    deltaValue,
    deltaUnit,
    comparisonLabel: "较上月",
    trend: getCiiTrend(deltaValue),
    dataStatus: value === null ? "missing" : snapshot.dataStatus,
    dataScope: scope,
    source: "CII 收益报表",
  };
}

export function isCiiViewId(value: string | null): value is CiiViewId {
  return value !== null && ciiViewOrder.includes(value as CiiViewId);
}

export function getCiiViewMetricIds(view: CiiViewId) {
  return ciiMetricIds.map((metricId) => `cii.${view}.${metricId}`);
}

export function getCiiViewData(snapshot: InvestmentRiskSnapshot, view: CiiViewId): CiiViewData {
  const isGroup = view === "group";
  const member = isGroup ? undefined : snapshot.members.find((item) => item.id === view);
  const label = ciiViewLabels[view];
  const scope = isGroup ? "四家险资 CII 口径" : `${label} CII 口径`;
  const groupAnnualRate = snapshot.metrics.ciiAnnualRate.value;
  const annualRate = isGroup ? groupAnnualRate : member?.annualReturn ?? null;
  const annualRateDelta = isGroup
    ? snapshot.metrics.ciiAnnualDelta.value
    : member?.annualReturn === null || member?.annualReturn === undefined || member.previousAnnualReturn === null
      ? null
      : roundTo((member.annualReturn - member.previousAnnualReturn) * 100);
  const annualAmount = isGroup
    ? snapshot.metrics.ciiAnnualAmount.value
    : snapshot.metrics.ciiAnnualAmount.value === null
      ? null
      : ciiMemberAnnualAmounts[view as Exclude<CiiViewId, "group">];
  const monthlyAmount = isGroup ? snapshot.metrics.ciiMonthlyAmount.value : null;
  const monthlyRate = isGroup ? snapshot.metrics.ciiMonthlyRate.value : null;
  const groupTrend = snapshot.ciiMonthlyTrend.map((point) => ({ period: point.label, value: point.value }));
  const monthlyTrend = groupTrend.map((point) => ({
    period: point.period,
    currentValue: isGroup ? point.value : null,
    groupValue: point.value,
  }));
  const annualDifferenceBp = annualRate === null || groupAnnualRate === null ? null : roundTo((annualRate - groupAnnualRate) * 100);
  const rankedAnnual = snapshot.members
    .filter((item) => item.supportsReturnData && item.annualReturn !== null)
    .map((item) => ({ label: item.shortName, value: item.annualReturn as number }))
    .sort((a, b) => b.value - a.value);

  const interpretation: CiiManagementInterpretation = isGroup
    ? {
        conclusion: monthlyRate === null
          ? "本期月度收益数据尚未完整复核，当前不形成趋势判断。"
          : `集团年 CII 收益率为 ${formatNumber(annualRate, 2)}%，月 CII 收益率为 ${formatNumber(monthlyRate, 2)}%，月度表现需持续跟踪。`,
        evidence: annualRate === null || monthlyRate === null
          ? ["当前期间四项 CII 指标存在缺口", "暂无足够月度数据支持趋势判断"]
          : [
              snapshot.metrics.ciiMonthlyDelta.value === null
                ? "月 CII 收益率较上月变化暂无复核数据"
                : `月 CII 收益率较上月下降 ${formatNumber(Math.abs(snapshot.metrics.ciiMonthlyDelta.value), 0)}bp`,
              rankedAnnual.length > 1 ? `${rankedAnnual[0].label}与${rankedAnnual[1].label}年 CII 收益率居前` : "成员年 CII 收益率数据仍待补齐",
              "单月表现不足以判断趋势反转",
            ],
        uncertainty: "成员收益排名仅覆盖四家险资；月度单点变化不能单独证明收益趋势已经反转。",
        action: "复核月度收益来源，跟踪下一期变化，并由风险负责人确认是否升级管理关注。",
      }
    : {
        conclusion: annualRate === null || annualDifferenceBp === null
          ? `${label}本期年 CII 收益数据尚未完整复核。`
          : `${label}年 CII 收益率为 ${formatNumber(annualRate, 2)}%，${annualDifferenceBp >= 0 ? "高于" : "低于"}集团 ${formatNumber(Math.abs(annualDifferenceBp), 0)}bp。`,
        evidence: annualRate === null
          ? [`${label}年 CII 收益数据暂缺`, `${label}月 CII 收益数据暂缺`]
          : [
              `${label}年 CII 收益额为 ${formatNumber(annualAmount)} 亿元`,
              annualRateDelta === null
                ? "年 CII 收益率较上月变化暂无复核数据"
                : `年 CII 收益率较上月${annualRateDelta >= 0 ? "上升" : "下降"} ${formatNumber(Math.abs(annualRateDelta))}bp`,
              `${label}月 CII 收益率及近 6 个月趋势暂无完整复核数据`,
            ],
        uncertainty: `${label}月 CII 收益额、收益率和月度趋势尚未补齐，不能判断短期趋势或与集团进行月度差异比较。`,
        action: `补充并复核${label}月 CII 数据；数据确认后再评估是否需要升级跟踪。`,
      };

  return {
    id: view,
    label,
    memberId: isGroup ? undefined : view,
    annualAmount: createCiiMetric({ view, metricId: "annualAmount", label: "年 CII 额", value: annualAmount, unit: "亿元", deltaValue: null, deltaUnit: "亿元", scope, snapshot }),
    annualRate: createCiiMetric({ view, metricId: "annualRate", label: "年 CII 收益率", value: annualRate, unit: "%", deltaValue: annualRateDelta, deltaUnit: "bp", scope, snapshot }),
    monthlyAmount: createCiiMetric({ view, metricId: "monthlyAmount", label: "月 CII 额", value: monthlyAmount, unit: "亿元", deltaValue: isGroup ? snapshot.metrics.ciiMonthlyAmountDelta.value : null, deltaUnit: "亿元", scope, snapshot }),
    monthlyRate: createCiiMetric({ view, metricId: "monthlyRate", label: "月 CII 收益率", value: monthlyRate, unit: "%", deltaValue: isGroup ? snapshot.metrics.ciiMonthlyDelta.value : null, deltaUnit: "bp", scope, snapshot }),
    monthlyTrend,
    attentionTitle: isGroup
      ? monthlyRate === null ? "本期暂无月度收益复核数据" : `月度综合投资收益率为 ${formatNumber(monthlyRate, 2)}%`
      : "本月暂缺完整复核数据",
    attentionBody: isGroup
      ? monthlyRate === null ? "数据补齐前不按 0 展示，也不生成趋势判断。" : "单月表现不足以判断趋势反转，需继续跟踪下一期并核验主要来源。"
      : "待补充月 CII 收益率后进行判断。",
    interpretation,
    sourceLabel: isGroup ? "内部系统数据，四家险资 CII 口径统计" : `内部系统数据，${label} CII 口径统计`,
    updatedAt: "2026-07-01 09:00",
  };
}

export function getCiiAnnualRanking(snapshot: InvestmentRiskSnapshot) {
  return ciiViewOrder
    .filter((view): view is Exclude<CiiViewId, "group"> => view !== "group")
    .map((view) => ({ view, label: ciiViewLabels[view], value: getCiiViewData(snapshot, view).annualRate.value }))
    .sort((a, b) => {
      if (a.value === null) return 1;
      if (b.value === null) return -1;
      return b.value - a.value;
    });
}

export function getCiiGroupComparison(snapshot: InvestmentRiskSnapshot, view: Exclude<CiiViewId, "group">) {
  const current = getCiiViewData(snapshot, view);
  const group = getCiiViewData(snapshot, "group");
  return {
    annualDifferenceBp: current.annualRate.value === null || group.annualRate.value === null
      ? null
      : roundTo((current.annualRate.value - group.annualRate.value) * 100),
    monthlyDifferenceBp: current.monthlyRate.value === null || group.monthlyRate.value === null
      ? null
      : roundTo((current.monthlyRate.value - group.monthlyRate.value) * 100),
  };
}
