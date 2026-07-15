import type {
  CorporateCustomer,
  CustomerListFilter,
  DefaultAsset,
  MemberCompany,
  ProvenanceLabel,
  TrackingRecord,
  WarningAsset,
  WarningLevelSnapshot,
} from "./types";

export const WARNING_DATA_AS_OF = "2026-06-24";
export const WARNING_THREE_MONTH_START = "2026-04-01";

export const provenanceLabels: Record<"confirmed" | "derived" | "demo", ProvenanceLabel> = {
  confirmed: { kind: "confirmed", label: "业务事实" },
  derived: { kind: "derived", label: "派生数据" },
  demo: { kind: "demo", label: "演示数据" },
};

export const warningOverview = {
  asOf: WARNING_DATA_AS_OF,
  monthlyMajorWarning: { amountBillion: 0.6, customerCount: 5 },
  dailyMajorWarning: { amountBillion: 0, customerCount: 0 },
  monthlyDefault: { amountBillion: 0.83, customerCount: 7 },
  dailyDefault: { amountBillion: 0.05, customerCount: 1 },
  warningStock: { amountBillion: 3342, customerCount: 964 },
  defaultStock: { amountBillion: 2967, customerCount: 731 },
  previousWarningStockAmountBillion: 3358,
} as const;

export const warningLevelStructure: WarningLevelSnapshot[] = [
  { level: "major", label: "重大预警", amountBillion: 1162, share: 34.77, monthChangeBillion: -9, color: "#e14b26" },
  { level: "level2", label: "二级预警", amountBillion: 1320, share: 39.49, monthChangeBillion: -3, color: "#ff7a1a" },
  { level: "level1", label: "一级预警", amountBillion: 860, share: 25.74, monthChangeBillion: -4, color: "#e6a729" },
];

export type PrewarningSelectorKey = "group" | "bank" | "leasing" | "life" | "trust" | "all";
export type PrewarningTrendDirection = "up" | "down";
export type PrewarningMigrationStage = "level1" | "level2" | "major" | "defaulted";

export type PrewarningPeriodSnapshot = {
  key: "previous" | "current";
  label: string;
  totalAmountBillion: number;
  customerCount: number;
  levels: Array<{
    level: "major" | "level2" | "level1";
    label: string;
    amountBillion: number;
    color: string;
  }>;
};

export type PrewarningMemberCompanyRecord = {
  key: "bank" | "realEstate" | "assetManagement" | "leasing" | "insurance" | "trust" | "consumerFinance" | "supplyChainFinance";
  label: string;
  warningAssetBillion: number;
  warningCustomerCount: number;
  majorWarningBillion?: number;
  monthChangePercent: number;
  trend: PrewarningTrendDirection;
  iconTone: "orange" | "blue" | "amber" | "green" | "purple" | "cyan";
};

export type PrewarningLeasingCustomer = {
  customerId: string;
  name: string;
  groupName: string;
  warningDate: string;
  warningAmountBillion: number;
  riskLevel: "major" | "level2" | "level1";
};

export type PrewarningMigrationRecord = {
  id: string;
  fromLevel: PrewarningMigrationStage;
  toLevel: PrewarningMigrationStage;
  amountBillion: number;
  customerCount: number;
};

export type PrewarningMigrationCustomer = {
  customerId: string;
  name: string;
  groupName: string;
  migrationDate: string;
  migrationAmountBillion: number;
  fromLevel: PrewarningMigrationStage;
  toLevel: PrewarningMigrationStage;
};

const prewarningPeriodSnapshots: PrewarningPeriodSnapshot[] = [
  {
    key: "previous",
    label: "05月末",
    totalAmountBillion: 3358,
    customerCount: 964,
    levels: [
      { level: "major", label: "重大预警", amountBillion: 1171, color: "#e74721" },
      { level: "level2", label: "二级预警", amountBillion: 1323, color: "#ff7908" },
      { level: "level1", label: "一级预警", amountBillion: 864, color: "#e7a214" },
    ],
  },
  {
    key: "current",
    label: "06-24",
    totalAmountBillion: 3342,
    customerCount: 964,
    levels: [
      { level: "major", label: "重大预警", amountBillion: 1162, color: "#e74721" },
      { level: "level2", label: "二级预警", amountBillion: 1320, color: "#ff7908" },
      { level: "level1", label: "一级预警", amountBillion: 860, color: "#e7a214" },
    ],
  },
];

const prewarningMemberCompanies: PrewarningMemberCompanyRecord[] = [
  { key: "bank", label: "银行", warningAssetBillion: 140.02, warningCustomerCount: 3842, majorWarningBillion: 217.82, monthChangePercent: 8.42, trend: "up", iconTone: "orange" },
  { key: "realEstate", label: "不动产", warningAssetBillion: 59.11, warningCustomerCount: 1286, majorWarningBillion: 86.35, monthChangePercent: 3.21, trend: "down", iconTone: "blue" },
  { key: "assetManagement", label: "资产管理", warningAssetBillion: 65, warningCustomerCount: 1075, majorWarningBillion: 72.18, monthChangePercent: 5.32, trend: "up", iconTone: "amber" },
  { key: "leasing", label: "租赁", warningAssetBillion: 38.47, warningCustomerCount: 865, monthChangePercent: 2.11, trend: "down", iconTone: "green" },
  { key: "insurance", label: "保险", warningAssetBillion: 24.66, warningCustomerCount: 642, monthChangePercent: 1.78, trend: "up", iconTone: "purple" },
  { key: "trust", label: "信托", warningAssetBillion: 19.88, warningCustomerCount: 421, monthChangePercent: 0.94, trend: "down", iconTone: "cyan" },
  { key: "consumerFinance", label: "消费金融", warningAssetBillion: 12.36, warningCustomerCount: 317, monthChangePercent: 2.35, trend: "up", iconTone: "blue" },
  { key: "supplyChainFinance", label: "供应链金融", warningAssetBillion: 6.21, warningCustomerCount: 196, monthChangePercent: 1.62, trend: "down", iconTone: "orange" },
];

const prewarningLeasingCustomers: PrewarningLeasingCustomer[] = [
  { customerId: "huadong-city-construction", name: "华东城建集团有限公司", groupName: "城建发展集团", warningDate: "2026-06-21", warningAmountBillion: 68.5, riskLevel: "major" },
  { customerId: "zhongyuan-equipment", name: "中原装备制造有限公司", groupName: "中原工业集团", warningDate: "2026-06-19", warningAmountBillion: 42.3, riskLevel: "level2" },
  { customerId: "bohai-energy-chemical", name: "渤海能源化工有限公司", groupName: "渤海控股集团", warningDate: "2026-06-18", warningAmountBillion: 28.7, riskLevel: "level1" },
  { customerId: "southwest-trade-logistics", name: "西南商贸物流有限公司", groupName: "西南商贸集团", warningDate: "2026-06-17", warningAmountBillion: 19.8, riskLevel: "level1" },
];

const prewarningMigrations: PrewarningMigrationRecord[] = [
  { id: "level1-to-level2", fromLevel: "level1", toLevel: "level2", amountBillion: 98, customerCount: 176 },
  { id: "level2-to-major", fromLevel: "level2", toLevel: "major", amountBillion: 62, customerCount: 104 },
  { id: "major-to-defaulted", fromLevel: "major", toLevel: "defaulted", amountBillion: 8, customerCount: 16 },
];

const prewarningMigrationCustomers: PrewarningMigrationCustomer[] = [
  { customerId: "huaxia-energy", name: "华夏能源股份有限公司", groupName: "华夏集团", migrationDate: "2026-06-24", migrationAmountBillion: 12.6, fromLevel: "level2", toLevel: "major" },
  { customerId: "yuanhang-construction", name: "远航建设集团有限公司", groupName: "远航集团", migrationDate: "2026-06-24", migrationAmountBillion: 9.8, fromLevel: "level1", toLevel: "level2" },
  { customerId: "shengshi-trade", name: "盛世贸易有限公司", groupName: "盛世集团", migrationDate: "2026-06-23", migrationAmountBillion: 5.1, fromLevel: "major", toLevel: "defaulted" },
];

export const prewarningReferenceData = {
  summary: {
    asOf: WARNING_DATA_AS_OF,
    assetAmountBillion: warningOverview.warningStock.amountBillion,
    customerCount: warningOverview.warningStock.customerCount,
    monthChangeBillion: -16,
    monthChangePercent: -0.48,
  },
  grades: warningLevelStructure,
  periods: prewarningPeriodSnapshots,
  selectorOptions: [
    { key: "group", label: "集团汇总" },
    { key: "bank", label: "银行" },
    { key: "leasing", label: "租赁" },
    { key: "life", label: "寿险" },
    { key: "trust", label: "信托" },
    { key: "all", label: "全部成员公司" },
  ] as Array<{ key: PrewarningSelectorKey; label: string }>,
  memberCompanies: prewarningMemberCompanies,
  topMemberKeys: ["bank", "realEstate", "assetManagement"] as const,
  leasing: {
    overview: {
      assetAmountBillion: 842,
      groupSharePercent: 25.2,
      customerCount: 218,
      monthCustomerChange: -6,
      majorWarningBillion: 312,
      leasingWarningSharePercent: 37,
    },
    customers: prewarningLeasingCustomers,
  },
  migrations: prewarningMigrations,
  migrationCustomers: prewarningMigrationCustomers,
} as const;

export function getPrewarningReferenceCustomer(customerId: string) {
  const leasingCustomer = prewarningLeasingCustomers.find((customer) => customer.customerId === customerId);
  if (leasingCustomer) return { kind: "leasing" as const, customer: leasingCustomer };
  const migrationCustomer = prewarningMigrationCustomers.find((customer) => customer.customerId === customerId);
  return migrationCustomer ? { kind: "migration" as const, customer: migrationCustomer } : undefined;
}

export const customers: Record<string, CorporateCustomer> = {
  "changning-shangyu": {
    id: "changning-shangyu",
    name: "常宁市尚宇高级中学有限公司",
    groupName: "湖南尚宇教育投资集团",
    memberCompany: "医保科技",
    defaultStatus: "none",
    warningStatus: "active",
    currentRiskLevel: "major",
    riskTrend: "new",
    limitStatus: "normal",
    managementStrategy: "monitorOnly",
    trackingStatus: "notTracking",
    trackingPriority: "normal",
  },
  "oulong-auto": {
    id: "oulong-auto",
    name: "欧龙汽车贸易集团有限公司",
    groupName: "欧龙汽车贸易集团",
    memberCompany: "租赁",
    defaultStatus: "none",
    warningStatus: "active",
    currentRiskLevel: "major",
    riskTrend: "new",
    limitStatus: "normal",
    managementStrategy: "monitorOnly",
    trackingStatus: "notTracking",
    trackingPriority: "normal",
  },
  "guangxi-baise": {
    id: "guangxi-baise",
    name: "广西百色试验区发展集团有限公司",
    groupName: "广西百色城市产业发展集团",
    memberCompany: "租赁",
    defaultStatus: "defaulted",
    warningStatus: "none",
    riskTrend: "new",
    limitStatus: "normal",
    managementStrategy: "monitorOnly",
    trackingStatus: "notTracking",
    trackingPriority: "normal",
  },
  "taizhou-yingrun": {
    id: "taizhou-yingrun",
    name: "泰州盈润光伏科技有限公司",
    groupName: "江苏长明新能源电力科技集团",
    memberCompany: "租赁",
    defaultStatus: "defaulted",
    warningStatus: "none",
    riskTrend: "new",
    limitStatus: "normal",
    managementStrategy: "monitorOnly",
    trackingStatus: "notTracking",
    trackingPriority: "normal",
  },
};

export const warningAssets: WarningAsset[] = [
  {
    id: "changning-shangyu-20260623",
    customerId: "changning-shangyu",
    amountBillion: 0.25,
    memberCompany: "医保科技",
    warningLevel: "major",
    warningStatus: "active",
    warningDate: "2026-06-23",
    productName: "常宁市尚宇高级中学有限公司",
    triggerReason: null,
    provenance: "confirmed",
    transitions: [
      {
        date: "2026-06-23",
        type: "entered",
        title: "进入重大预警",
        detail: "本月新增重大预警规模 0.25 亿元。",
        provenance: "confirmed",
      },
    ],
  },
  {
    id: "oulong-auto-20260615",
    customerId: "oulong-auto",
    amountBillion: 0.24,
    memberCompany: "租赁",
    warningLevel: "major",
    warningStatus: "active",
    warningDate: "2026-06-15",
    productName: "欧龙汽车贸易集团有限公司",
    triggerReason: null,
    provenance: "confirmed",
    transitions: [
      {
        date: "2026-06-15",
        type: "entered",
        title: "进入重大预警",
        detail: "本月新增重大预警规模 0.24 亿元。",
        provenance: "confirmed",
      },
    ],
  },
];

export const defaultAssets: DefaultAsset[] = [
  {
    id: "guangxi-baise-047",
    customerId: "guangxi-baise",
    amountBillion: 0.47,
    memberCompany: "租赁",
    businessType: "非标投资",
    projectName: "广西百色试验区发展集团有限公司",
    portfolio: null,
    fundingSource: "一方资金",
    disbursementDate: "2022-05-23",
    maturityDate: "2026-05-23",
    guarantors: ["广西百色开发投资集团有限公司", "广西百色城市建设投资发展集团有限公司"],
    defaultCategory: "逾期",
    defaultReason: "本息实质逾期",
    defaultDate: "2026-06-01",
    overdueDaysAtRecognition: 9,
    overdueDaysProvenance: "derived",
    defaultStatus: "defaulted",
    provenance: "confirmed",
  },
  {
    id: "taizhou-yingrun-013",
    customerId: "taizhou-yingrun",
    amountBillion: 0.13,
    memberCompany: "租赁",
    businessType: null,
    projectName: "泰州盈润光伏科技有限公司",
    portfolio: null,
    fundingSource: null,
    disbursementDate: null,
    maturityDate: null,
    guarantors: [],
    defaultCategory: null,
    defaultReason: null,
    defaultDate: "2026-06-01",
    overdueDaysAtRecognition: null,
    defaultStatus: "defaulted",
    provenance: "confirmed",
  },
];

export const defaultTrendDemo = [2962, 2963, 2964, 2965, 2966, 2967] as const;

export const trackingRecord: TrackingRecord = {
  id: "guangxi-baise-default",
  assetId: "guangxi-baise-047",
  title: "广西百色试验区发展集团出险事项",
  riskStatus: "defaulted",
  status: "tracking",
  priority: "key",
  ownerCompany: "租赁",
  owner: "租赁风险管理部 · 李明",
  dueDate: "2026-06-30",
  cadence: "每周",
  latestUpdateDate: "2026-06-20",
  latestUpdateTitle: "已发起逾期款项催收",
  latestUpdateDetail: "正在核实两家担保方的履约安排，下一次更新聚焦回款计划与担保落实情况。",
  provenance: "demo",
};

export const trackingTimeline = [
  { date: "2026-06-20", shortDate: "06-20", title: "更新进展", detail: "已发起催收并核实担保安排。", tone: "warning" },
  { date: "2026-06-02", shortDate: "06-02", title: "加入重点跟踪", detail: "设置责任人、期限与每周跟踪频率。", tone: "warning" },
  { date: "2026-06-01", shortDate: "06-01", title: "资产出险", detail: "本息实质逾期，规模 0.47 亿元。", tone: "danger" },
] as const;

export const reportTargets = [{ id: "group-risk-weekly-202606", label: "2026年6月集团风险周报" }] as const;

export const warningCopilotFacts = {
  prompt: "本月新增重大预警和出险规模分别是多少？",
  majorWarning: { amountBillion: 0.6, customerCount: 5 },
  defaulted: { amountBillion: 0.83, customerCount: 7 },
  asOf: WARNING_DATA_AS_OF,
  majorItem: "常宁市尚宇高级中学有限公司 0.25 亿元",
  defaultItem: "广西百色试验区发展集团有限公司 0.47 亿元",
} as const;

export const memberFilterLabels: Record<CustomerListFilter["member"], string> = {
  all: "全部成员公司",
  "health-tech": "医保科技",
  leasing: "租赁",
  bank: "银行",
  "real-estate": "不动产",
  trust: "信托",
};

export const memberFilterValues: Array<{ value: CustomerListFilter["member"]; label: string }> = [
  { value: "all", label: "全部成员公司" },
  { value: "health-tech", label: "医保科技" },
  { value: "leasing", label: "租赁" },
  { value: "bank", label: "银行" },
];

export function formatAmount(value: number, maximumFractionDigits = 2) {
  return new Intl.NumberFormat("zh-CN", {
    minimumFractionDigits: value < 1 ? Math.min(2, maximumFractionDigits) : 0,
    maximumFractionDigits,
  }).format(value);
}

export function formatSignedAmount(value: number) {
  return `${value > 0 ? "+" : ""}${formatAmount(value, 0)}`;
}

export function getCustomer(customerId: string) {
  return customers[customerId];
}

export function getWarningAsset(assetId: string) {
  return warningAssets.find((asset) => asset.id === assetId);
}

export function getDefaultAsset(assetId: string) {
  return defaultAssets.find((asset) => asset.id === assetId);
}

export function getCustomerWarningAssets(customerId: string) {
  return warningAssets.filter((asset) => asset.customerId === customerId);
}

export function getCustomerDefaultAssets(customerId: string) {
  return defaultAssets.filter((asset) => asset.customerId === customerId);
}

export function filterWarningCustomers(filters: CustomerListFilter) {
  return warningAssets
    .map((asset) => ({ asset, customer: getCustomer(asset.customerId) }))
    .filter(({ customer }) => customer && matchesSearch(customer.name, customer.groupName, filters.query))
    .filter(({ asset }) => matchesMember(asset.memberCompany, filters.member))
    .filter(({ asset }) => matchesPeriod(asset.warningDate, filters))
    .sort((left, right) =>
      filters.sort === "recent"
        ? right.asset.warningDate.localeCompare(left.asset.warningDate)
        : right.asset.amountBillion - left.asset.amountBillion,
    );
}

export function filterDefaultCustomers(filters: CustomerListFilter) {
  return defaultAssets
    .map((asset) => ({ asset, customer: getCustomer(asset.customerId) }))
    .filter(({ customer }) => customer && matchesSearch(customer.name, customer.groupName, filters.query))
    .filter(({ asset }) => matchesMember(asset.memberCompany, filters.member))
    .filter(({ asset }) => matchesPeriod(asset.defaultDate, filters))
    .filter(({ asset }) =>
      filters.category === "all" ? true : filters.category === "overdue" ? asset.defaultCategory === "逾期" : asset.defaultCategory !== "逾期",
    )
    .sort((left, right) =>
      filters.sort === "recent"
        ? right.asset.defaultDate.localeCompare(left.asset.defaultDate)
        : right.asset.amountBillion - left.asset.amountBillion,
    );
}

function matchesPeriod(date: string, filters: CustomerListFilter) {
  if (filters.period === "month") return date.startsWith("2026-06");
  if (filters.period === "today") return date === WARNING_DATA_AS_OF;
  return Boolean(filters.dateFrom && filters.dateTo && date >= filters.dateFrom && date <= filters.dateTo);
}

function matchesSearch(name: string, groupName: string, query: string) {
  const normalized = query.trim().toLocaleLowerCase("zh-CN");
  return !normalized || name.toLocaleLowerCase("zh-CN").includes(normalized) || groupName.toLocaleLowerCase("zh-CN").includes(normalized);
}

function matchesMember(memberCompany: MemberCompany, filter: CustomerListFilter["member"]) {
  if (filter === "all") return true;
  const mapping: Record<Exclude<CustomerListFilter["member"], "all">, MemberCompany> = {
    "health-tech": "医保科技",
    leasing: "租赁",
    bank: "银行",
    "real-estate": "不动产",
    trust: "信托",
  };
  return memberCompany === mapping[filter];
}
