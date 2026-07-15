import { ArrowRight, CalendarDays, Landmark, ShieldAlert, WalletCards } from "lucide-react";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  getPrewarningReferenceCustomer,
  getPrewarningSelectedMemberView,
  prewarningReferenceData,
  type PrewarningSelectorKey,
} from "./data";
import {
  MemberCompanyOverview,
  MemberCompanySelector,
  MemberCompanyTable,
  MemberCustomerList,
  MigrationCustomerList,
  MigrationOverview,
  MigrationStructureList,
  MigrationSummaryCard,
  PrewarningScopeMeta,
  PrewarningSectionHeading,
  PrewarningSummaryCard,
  TopMemberCompanies,
  WarningGradeCards,
  WarningStructureChart,
} from "./PrewarningReferenceComponents";
import { WarningCustomerDetailPage as LegacyWarningCustomerDetailPage } from "./WarningDefaultPages";
import { RiskStatusTag, WarningScreen } from "./WarningDefaultComponents";

const selectorKeys = new Set<PrewarningSelectorKey>(prewarningReferenceData.selectorOptions.map((option) => option.key));

function resolveSelector(value: string | null): PrewarningSelectorKey {
  return value && selectorKeys.has(value as PrewarningSelectorKey) ? (value as PrewarningSelectorKey) : "group";
}

export function PrewarningOverviewPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const selected = resolveSelector(searchParams.get("member"));
  const topMembers = prewarningReferenceData.memberCompanies.filter((member) =>
    prewarningReferenceData.topMemberKeys.includes(member.key as (typeof prewarningReferenceData.topMemberKeys)[number]),
  );
  const selectedMemberView = selected === "group" ? undefined : getPrewarningSelectedMemberView(selected);
  const returnTo = `${location.pathname}${location.search}`;

  function selectMember(key: PrewarningSelectorKey) {
    const next = new URLSearchParams(searchParams);
    if (key === "group") next.delete("member");
    else next.set("member", key);
    setSearchParams(next, { replace: true });
  }

  function openMigrationDetails() {
    navigate("/credit/warning/prewarnings/migrations", { state: { returnTo } });
  }

  function openCustomer(customerId: string) {
    navigate(`/credit/warning/customers/${customerId}`, { state: { returnTo } });
  }

  return (
    <WarningScreen
      title="预警资产"
      fallbackBackTo="/credit/warning"
      className="prewarning-redesign"
      askPlaceholder="问预警资产、成员公司或迁移情况…"
      copilotContext={`预警资产页面，当前成员公司筛选：${selected}`}
    >
      <main className="prewarning-redesign__content">
        <PrewarningScopeMeta asOf={prewarningReferenceData.summary.asOf} />
        <PrewarningSummaryCard summary={prewarningReferenceData.summary} />
        <WarningGradeCards grades={prewarningReferenceData.grades} />
        <WarningStructureChart periods={prewarningReferenceData.structurePeriods} onOpenMigrations={openMigrationDetails} />
        <MemberCompanySelector options={prewarningReferenceData.selectorOptions} selected={selected} onSelect={selectMember} />

        {selectedMemberView ? (
          <div className="prewarning-member-result" aria-live="polite">
            <MemberCompanyOverview title={selectedMemberView.label} metrics={selectedMemberView.metrics} />
            <MemberCustomerList
              title={`${selectedMemberView.label}客户列表`}
              customers={selectedMemberView.customers}
              onOpenCustomer={openCustomer}
            />
          </div>
        ) : (
          <div className="prewarning-member-result" aria-live="polite">
            <TopMemberCompanies members={topMembers} />
            <MemberCompanyTable members={prewarningReferenceData.memberCompanies} />
          </div>
        )}
      </main>
    </WarningScreen>
  );
}

export function PrewarningMigrationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = (location.state as { returnTo?: string } | null)?.returnTo ?? "/credit/warning/prewarnings";

  function openCustomer(customerId: string) {
    navigate(`/credit/warning/customers/${customerId}`, {
      state: { returnTo: `${location.pathname}${location.search}` },
    });
  }

  return (
    <WarningScreen
      title="预警迁移明细"
      fallbackBackTo={returnTo}
      className="prewarning-redesign prewarning-migration-redesign"
      askPlaceholder="问预警迁移、重点客户或结构变化…"
      copilotContext="预警迁移明细页面"
    >
      <main className="prewarning-redesign__content">
        <p className="prewarning-migration-date">数据截至 {prewarningReferenceData.summary.asOf}</p>
        <MigrationSummaryCard summary={prewarningReferenceData.summary} />
        <MigrationOverview periods={prewarningReferenceData.periods} />
        <MigrationStructureList migrations={prewarningReferenceData.migrations} />
        <MigrationCustomerList customers={prewarningReferenceData.migrationCustomers} onOpenCustomer={openCustomer} />
      </main>
    </WarningScreen>
  );
}

export function PrewarningCustomerRoutePage() {
  const { customerId = "" } = useParams();
  const referenceCustomer = getPrewarningReferenceCustomer(customerId);
  if (!referenceCustomer) return <LegacyWarningCustomerDetailPage />;
  return <PrewarningReferenceCustomerDetail referenceCustomer={referenceCustomer} />;
}

function PrewarningReferenceCustomerDetail({
  referenceCustomer,
}: {
  referenceCustomer: NonNullable<ReturnType<typeof getPrewarningReferenceCustomer>>;
}) {
  if (referenceCustomer.kind === "leasing") {
    const { customer } = referenceCustomer;
    return (
      <WarningScreen
        title="客户风险详情"
        fallbackBackTo="/credit/warning/prewarnings?member=leasing"
        className="prewarning-reference-customer"
        askPlaceholder="问当前客户的预警事实…"
        copilotContext={`预警客户：${customer.name}`}
      >
        <main className="prewarning-reference-customer__content">
          <section className="prewarning-reference-customer__hero">
            <span className="prewarning-reference-customer__icon"><Landmark aria-hidden="true" /></span>
            <div>
              <RiskStatusTag level={customer.riskLevel} />
              <h1>{customer.name}</h1>
              <p>所属集团：{customer.groupName}</p>
            </div>
          </section>
          <PrewarningSectionHeading title="预警事实" />
          <section className="prewarning-reference-facts">
            <Fact icon={<CalendarDays aria-hidden="true" />} label="预警日期" value={customer.warningDate} />
            <Fact icon={<WalletCards aria-hidden="true" />} label="预警金额" value={`${customer.warningAmountBillion}亿元`} />
            <Fact icon={<ShieldAlert aria-hidden="true" />} label="风险等级" value={riskLevelLabel(customer.riskLevel)} />
          </section>
        </main>
      </WarningScreen>
    );
  }

  const { customer } = referenceCustomer;
  return (
    <WarningScreen
      title="客户风险详情"
      fallbackBackTo="/credit/warning/prewarnings/migrations"
      className="prewarning-reference-customer"
      askPlaceholder="问当前客户的迁移事实…"
      copilotContext={`迁移客户：${customer.name}`}
    >
      <main className="prewarning-reference-customer__content">
        <section className="prewarning-reference-customer__hero">
          <span className="prewarning-reference-customer__icon"><Landmark aria-hidden="true" /></span>
          <div>
            <span className="prewarning-reference-customer__migration-tag">
              {migrationStageLabel(customer.fromLevel)}
              <ArrowRight aria-hidden="true" />
              {migrationStageLabel(customer.toLevel)}
            </span>
            <h1>{customer.name}</h1>
            <p>所属集团：{customer.groupName}</p>
          </div>
        </section>
        <PrewarningSectionHeading title="迁移事实" />
        <section className="prewarning-reference-facts">
          <Fact icon={<CalendarDays aria-hidden="true" />} label="迁移日期" value={customer.migrationDate} />
          <Fact icon={<WalletCards aria-hidden="true" />} label="迁移资产金额" value={`${customer.migrationAmountBillion}亿元`} />
          <Fact icon={<ShieldAlert aria-hidden="true" />} label="迁移类型" value={`${migrationStageLabel(customer.fromLevel)} → ${migrationStageLabel(customer.toLevel)}`} />
        </section>
      </main>
    </WarningScreen>
  );
}

function Fact({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <span>{icon}</span>
      <p><small>{label}</small><strong>{value}</strong></p>
    </div>
  );
}

function riskLevelLabel(level: "major" | "level2" | "level1") {
  return level === "major" ? "重大预警" : level === "level2" ? "二级预警" : "一级预警";
}

function migrationStageLabel(stage: "level1" | "level2" | "major" | "defaulted") {
  if (stage === "level1") return "一级";
  if (stage === "level2") return "二级";
  if (stage === "major") return "重大";
  return "出险";
}
