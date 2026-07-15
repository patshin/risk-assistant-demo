export type DataProvenance = "confirmed" | "derived" | "demo";

export type RiskLevel = "normal" | "level1" | "level2" | "major";
export type RiskTrend = "increasing" | "decreasing" | "stable" | "new";
export type WarningStatus = "none" | "active" | "released" | "historical";
export type WarningTransitionType = "entered" | "upgraded" | "downgraded" | "released" | "reentered" | "convertedToDefault";
export type DefaultStatus = "none" | "defaulted" | "historical";
export type LimitStatus = "normal" | "warning" | "exceeded";
export type ManagementStrategy = "monitorOnly" | "keyTracking" | "includeInReport";
export type DispositionStatus = "notProvided";
export type TrackingStatus = "notTracking" | "tracking" | "creationPending";
export type TrackingPriority = "normal" | "key";

export type MemberCompany =
  | "医保科技"
  | "租赁"
  | "银行"
  | "不动产"
  | "信托"
  | "寿险"
  | "资产管理"
  | "产险"
  | "海外控股"
  | "基金"
  | "健康保险"
  | "理财子"
  | "证券"
  | "陆金所"
  | "养老险"
  | "普惠金融"
  | "平安资本"
  | "陆基金"
  | "方正证券";

export type MemberScope = "集团汇总" | "全部成员公司" | MemberCompany;

export type ProvenanceLabel = {
  kind: DataProvenance;
  label: string;
};

type CorporateCustomerBase = {
  id: string;
  name: string;
  groupName: string;
  memberCompany: MemberCompany;
  riskTrend: RiskTrend;
  limitStatus: LimitStatus;
  managementStrategy: ManagementStrategy;
  dispositionStatus?: DispositionStatus;
  trackingStatus: TrackingStatus;
  trackingPriority: TrackingPriority;
};

type CorporateCustomerRiskState =
  | {
      defaultStatus: "none";
      warningStatus: "active";
      currentRiskLevel: Exclude<RiskLevel, "normal">;
    }
  | {
      defaultStatus: "none";
      warningStatus: Exclude<WarningStatus, "active">;
      currentRiskLevel?: RiskLevel;
    }
  | {
      defaultStatus: Exclude<DefaultStatus, "none">;
      warningStatus: "none";
      currentRiskLevel?: never;
    };

export type CorporateCustomer = CorporateCustomerBase & CorporateCustomerRiskState;

export type WarningAsset = {
  id: string;
  customerId: string;
  amountBillion: number;
  memberCompany: MemberCompany;
  warningLevel: RiskLevel;
  warningStatus: WarningStatus;
  warningDate: string;
  productName: string;
  triggerReason: string | null;
  provenance: DataProvenance;
  transitions: Array<{
    date: string;
    type: WarningTransitionType;
    title: string;
    detail: string;
    provenance: DataProvenance;
  }>;
};

export type DefaultAsset = {
  id: string;
  customerId: string;
  amountBillion: number;
  memberCompany: MemberCompany;
  businessType: string | null;
  projectName: string;
  portfolio: string | null;
  fundingSource: string | null;
  disbursementDate: string | null;
  maturityDate: string | null;
  guarantors: string[];
  defaultCategory: string | null;
  defaultReason: string | null;
  defaultDate: string;
  overdueDaysAtRecognition: number | null;
  overdueDaysProvenance?: DataProvenance;
  defaultStatus: DefaultStatus;
  provenance: DataProvenance;
};

export type WarningLevelSnapshot = {
  level: RiskLevel;
  label: string;
  amountBillion: number;
  share: number;
  monthChangeBillion: number;
  color: string;
};

export type CustomerListFilter = {
  query: string;
  member: "all" | "health-tech" | "leasing" | "bank" | "real-estate" | "trust";
  period: "today" | "month" | "custom";
  dateFrom: string;
  dateTo: string;
  sort: "amount" | "recent";
  category: "all" | "overdue" | "other";
};

export type TrackingRecord = {
  id: string;
  assetId: string;
  title: string;
  riskStatus: DefaultStatus;
  status: TrackingStatus;
  priority: TrackingPriority;
  ownerCompany: MemberCompany;
  owner: string;
  dueDate: string;
  cadence: "每周" | "每日" | "每月";
  latestUpdateDate: string;
  latestUpdateTitle: string;
  latestUpdateDetail: string;
  provenance: DataProvenance;
};

export type TrackingFormValue = {
  owner: string;
  dueDate: string;
  cadence: TrackingRecord["cadence"];
};

export type ReportDraftValue = {
  reportId: string;
  includeRiskFacts: boolean;
  includeAssetFields: boolean;
  includeTrackingProgress: boolean;
};
