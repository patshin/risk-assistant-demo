import { useEffect, useMemo, useRef, useState, type FormEvent, type MutableRefObject } from "react";
import { AlertCircle, Check } from "lucide-react";
import { BottomSheet } from "../../components";
import { memberFilterValues, reportTargets, WARNING_DATA_AS_OF, WARNING_THREE_MONTH_START } from "./data";
import type { CustomerListFilter, ReportDraftValue, TrackingFormValue } from "./types";

function useDirtyBrowserBackGuard(
  open: boolean,
  dirty: boolean,
  message: string,
  allowNextNavigation: MutableRefObject<boolean>,
) {
  useEffect(() => {
    if (!open) return;
    const handlePopState = () => {
      if (allowNextNavigation.current) {
        allowNextNavigation.current = false;
        return;
      }
      if (!dirty || window.confirm(message)) return;
      allowNextNavigation.current = true;
      window.history.forward();
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [allowNextNavigation, dirty, message, open]);
}

type FilterSheetProps = {
  open: boolean;
  mode: "warning" | "default";
  value: CustomerListFilter;
  onClose: () => void;
  onApply: (value: CustomerListFilter) => void;
};

type MetricDefinitionSheetProps = {
  open: boolean;
  onClose: () => void;
};

function SheetHeading({ title, subtitle, badge }: { title: string; subtitle: string; badge?: number }) {
  return (
    <span className="warning-sheet-heading">
      <span className="warning-sheet-title">
        {title} {badge ? <em>{badge}</em> : null}
      </span>
      <small>{subtitle}</small>
    </span>
  );
}

export function MetricDefinitionSheet({ open, onClose }: MetricDefinitionSheetProps) {
  return (
    <BottomSheet
      open={open}
      title={<SheetHeading title="指标口径" subtitle="解释总览中的客户数与资产金额" />}
      className="warning-definition-sheet"
      onClose={onClose}
      footer={
        <div className="warning-sheet-actions">
          <button type="button" className="ghost-button" onClick={onClose}>
            关闭
          </button>
          <button type="button" className="primary-button warning-definition-confirm" onClick={onClose}>
            我知道了
          </button>
        </div>
      }
    >
      <dl className="warning-definition-list">
        <div>
          <dt>客户户数</dt>
          <dd>按法人公司去重。法人客户存在任一出险资产时，只计入出险客户数。</dd>
        </div>
        <div>
          <dt>风险资产金额</dt>
          <dd>按每笔资产自身当前状态归类。同一法人客户名下可同时存在预警资产金额和出险资产金额。</dd>
        </div>
        <div>
          <dt>新增重大预警</dt>
          <dd>统计期内进入重大预警的规模，包括由二级预警升级为重大预警。</dd>
        </div>
        <div>
          <dt>数据状态</dt>
          <dd>真实零显示 0；数据不可用显示“—”或“暂无数据”。</dd>
        </div>
      </dl>
    </BottomSheet>
  );
}

export function CustomerFilterSheet({ open, mode, value, onClose, onApply }: FilterSheetProps) {
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    if (open) setDraft(value);
  }, [open, value]);

  const activeCount = useMemo(
    () => Number(draft.member !== "all") + Number(draft.period !== "month") + Number(draft.sort !== "amount") + Number(mode === "default" && draft.category !== "all"),
    [draft, mode],
  );

  return (
    <BottomSheet
      open={open}
      title={
        <SheetHeading
          title="筛选与排序"
          subtitle={mode === "warning" ? "重大预警法人客户" : "出险法人客户"}
          badge={activeCount}
        />
      }
      className="warning-filter-sheet"
      onClose={onClose}
      footer={
        <div className="warning-sheet-actions">
          <button
            type="button"
            className="ghost-button"
            onClick={() => {
              setDraft((current) => ({
                ...current,
                member: "all",
                period: "month",
                dateFrom: "2026-06-01",
                dateTo: WARNING_DATA_AS_OF,
                sort: "amount",
                category: "all",
              }));
            }}
          >
            重置
          </button>
          <button
            type="button"
            className="primary-button"
            onClick={() => {
              onApply(draft);
            }}
          >
            应用筛选
          </button>
        </div>
      }
    >
      <fieldset className="warning-filter-group">
        <legend>成员公司</legend>
        <div className="warning-choice-grid">
          {memberFilterValues.map((option) => (
            <label key={option.value} className={draft.member === option.value ? "is-selected" : undefined}>
              <input
                type="radio"
                name="filter-member"
                value={option.value}
                checked={draft.member === option.value}
                onChange={() => setDraft((current) => ({ ...current, member: option.value }))}
              />
              <span>{option.label}</span>
              {draft.member === option.value ? <Check size={15} /> : null}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="warning-filter-group">
        <legend>{mode === "warning" ? "预警时间" : "出险日期"}</legend>
        <div className="warning-choice-grid is-three">
          {([
            ["month", mode === "warning" ? "本月新增" : "本月"],
            ["today", mode === "warning" ? "本日新增" : "本日"],
            ["custom", "近3个月"],
          ] as const).map(([valueKey, label]) => (
            <label key={valueKey} className={draft.period === valueKey ? "is-selected" : undefined}>
              <input
                type="radio"
                name="filter-period"
                value={valueKey}
                checked={draft.period === valueKey}
                onChange={() => setDraft((current) => ({
                  ...current,
                  period: valueKey,
                  dateFrom: valueKey === "custom" ? WARNING_THREE_MONTH_START : current.dateFrom,
                  dateTo: valueKey === "custom" ? WARNING_DATA_AS_OF : current.dateTo,
                }))}
              />
              <span>{label}</span>
              {draft.period === valueKey ? <Check size={15} /> : null}
            </label>
          ))}
        </div>
      </fieldset>

      {mode === "default" ? (
        <fieldset className="warning-filter-group">
          <legend>出险类别</legend>
          <div className="warning-choice-grid">
            {([
              ["all", "全部类别"],
              ["overdue", "逾期（本息实质逾期）"],
              ["other", "其他"],
            ] as const).map(([valueKey, label]) => (
              <label key={valueKey} className={draft.category === valueKey ? "is-selected" : undefined}>
                <input
                  type="radio"
                  name="filter-category"
                  value={valueKey}
                  checked={draft.category === valueKey}
                  onChange={() => setDraft((current) => ({ ...current, category: valueKey }))}
                />
                <span>{label}</span>
                {draft.category === valueKey ? <Check size={15} /> : null}
              </label>
            ))}
          </div>
        </fieldset>
      ) : null}

      <fieldset className="warning-filter-group">
        <legend>排序</legend>
        <div className="warning-choice-grid">
          {([
            ["amount", "规模从高到低"],
            ["recent", "按最近时间"],
          ] as const).map(([valueKey, label]) => (
            <label key={valueKey} className={draft.sort === valueKey ? "is-selected" : undefined}>
              <input
                type="radio"
                name="filter-sort"
                value={valueKey}
                checked={draft.sort === valueKey}
                onChange={() => setDraft((current) => ({ ...current, sort: valueKey }))}
              />
              <span>{label}</span>
              {draft.sort === valueKey ? <Check size={15} /> : null}
            </label>
          ))}
        </div>
      </fieldset>
    </BottomSheet>
  );
}

type TrackingSheetProps = {
  open: boolean;
  subject: string;
  memberCompany: string;
  initialValue?: TrackingFormValue;
  simulateFailure?: boolean;
  onClose: () => void;
  onSubmit: (value: TrackingFormValue) => void | Promise<void>;
};

export function TrackingSetupSheet({ open, subject, memberCompany, initialValue, simulateFailure = false, onClose, onSubmit }: TrackingSheetProps) {
  const [value, setValue] = useState<TrackingFormValue>(() => initialValue ?? { owner: "", dueDate: "", cadence: "每周" });
  const [state, setState] = useState<"idle" | "submitting" | "error">("idle");
  const [touched, setTouched] = useState(false);
  const failedOnce = useRef(false);
  const allowNextNavigation = useRef(false);

  useDirtyBrowserBackGuard(open, touched, "尚未保存跟踪设置，确认放弃已填写内容吗？", allowNextNavigation);

  useEffect(() => {
    if (open) {
      setValue(initialValue ?? { owner: "", dueDate: "", cadence: "每周" });
      setState("idle");
      setTouched(false);
      failedOnce.current = false;
      allowNextNavigation.current = false;
    }
  }, [initialValue, open]);

  const canSubmit = Boolean(value.owner && value.dueDate) && state !== "submitting";

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!canSubmit) return;
    setState("submitting");
    try {
      await new Promise((resolve) => window.setTimeout(resolve, 350));
      if (simulateFailure && !failedOnce.current) {
        failedOnce.current = true;
        throw new Error("simulated tracking failure");
      }
      allowNextNavigation.current = true;
      await onSubmit(value);
    } catch {
      allowNextNavigation.current = false;
      setState("error");
    }
  }

  function requestClose() {
    if (state === "submitting") return;
    if (touched && !window.confirm("尚未保存跟踪设置，确认放弃已填写内容吗？")) return;
    allowNextNavigation.current = true;
    onClose();
  }

  return (
    <BottomSheet
      open={open}
      title={<SheetHeading title={initialValue ? "更新重点跟踪" : "加入重点跟踪"} subtitle="轻量连接风险跟踪，不改变风险状态" />}
      className="warning-form-sheet warning-tracking-sheet"
      onClose={requestClose}
      footer={
        <div className="warning-sheet-actions">
          <button type="button" className="ghost-button" onClick={requestClose} disabled={state === "submitting"}>
            取消
          </button>
          <button type="submit" form="warning-tracking-form" className="primary-button" disabled={!canSubmit}>
            {state === "submitting" ? "正在保存…" : initialValue ? "保存更新" : "确认跟踪"}
          </button>
        </div>
      }
    >
      <form id="warning-tracking-form" className="warning-form warning-compact-form" onSubmit={handleSubmit}>
        <div className="warning-compact-row is-readonly">
          <span>跟踪主题</span>
          <strong title={subject}>{subject}</strong>
        </div>

        <div className="warning-compact-row is-readonly">
          <span>责任成员公司</span>
          <strong>{memberCompany}</strong>
        </div>

        <label className="warning-compact-row">
          <span>责任人</span>
          <select
            value={value.owner}
            onChange={(event) => {
              setTouched(true);
              setValue((current) => ({ ...current, owner: event.target.value }));
            }}
            required
          >
            <option value="">请选择责任人</option>
            <option value={`${memberCompany}风险管理部 · 李明`}>{memberCompany}风险管理部 · 李明</option>
            <option value={`${memberCompany}风险管理部 · 待指派`}>{memberCompany}风险管理部 · 待指派</option>
            <option value="集团风险管理部 · 王宁">集团风险管理部 · 王宁</option>
          </select>
        </label>

        <label className="warning-compact-row">
          <span>截止日期</span>
          <input
            type="date"
            min={WARNING_DATA_AS_OF}
            value={value.dueDate}
            onInput={(event) => {
              const nextDueDate = event.currentTarget.value;
              setTouched(true);
              setValue((current) => ({ ...current, dueDate: nextDueDate }));
            }}
            required
          />
        </label>

        <label className="warning-compact-row">
          <span>跟踪频率</span>
          <select
            value={value.cadence}
            onChange={(event) => {
              setTouched(true);
              setValue((current) => ({ ...current, cadence: event.target.value as TrackingFormValue["cadence"] }));
            }}
          >
            <option value="每日">每日</option>
            <option value="每周">每周</option>
            <option value="每月">每月</option>
          </select>
        </label>

        <div className="warning-compact-notice"><strong>说明：</strong><span>责任人和期限属于跟踪模块字段；本模块仅提供发起入口。</span></div>

        {state === "error" ? (
          <div className="warning-form-error" role="alert">
            <AlertCircle size={17} /> 创建失败，请核对信息后重试。已填写内容不会丢失。
          </div>
        ) : null}
      </form>
    </BottomSheet>
  );
}

type ReportSheetProps = {
  open: boolean;
  subject?: string;
  summary?: string;
  kind?: "warning" | "default";
  initialValue?: ReportDraftValue;
  simulateFailure?: boolean;
  onClose: () => void;
  onSubmit: (value: ReportDraftValue) => void | Promise<void>;
};

function createReportDraft(kind: "warning" | "default"): ReportDraftValue {
  return {
    reportId: reportTargets[0].id,
    includeRiskFacts: true,
    includeAssetFields: true,
    includeTrackingProgress: kind === "default",
  };
}

export function ReportAddSheet({
  open,
  subject = "广西百色试验区发展集团出险事项",
  summary = "0.47 亿元，本息实质逾期；已关联责任人、期限与催收进展。",
  kind = "default",
  initialValue,
  simulateFailure = false,
  onClose,
  onSubmit,
}: ReportSheetProps) {
  const [value, setValue] = useState<ReportDraftValue>(() => initialValue ?? createReportDraft(kind));
  const [state, setState] = useState<"idle" | "submitting" | "error">("idle");
  const [touched, setTouched] = useState(false);
  const failedOnce = useRef(false);
  const allowNextNavigation = useRef(false);
  const hasContent = value.includeRiskFacts || value.includeAssetFields || value.includeTrackingProgress;
  const contentOptions =
    kind === "warning"
      ? ([
          ["includeRiskFacts", "预警事实与规模", "重大预警等级、规模与发生日期"],
          ["includeAssetFields", "资产关键字段", "成员公司、法人客户与状态记录"],
        ] as const)
      : ([
          ["includeRiskFacts", "出险事实与规模", "0.47 亿元，本息实质逾期"],
          ["includeAssetFields", "资产关键字段", "到期日、担保方与资金来源"],
          ["includeTrackingProgress", "最新跟踪进展", "责任人、期限与催收进展"],
        ] as const);

  useDirtyBrowserBackGuard(open, touched, "报告内容尚未保存，确认放弃本次修改吗？", allowNextNavigation);

  useEffect(() => {
    if (open) {
      setValue(initialValue ?? createReportDraft(kind));
      setState("idle");
      setTouched(false);
      failedOnce.current = false;
      allowNextNavigation.current = false;
    }
  }, [initialValue, kind, open]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!hasContent || state === "submitting") return;
    setState("submitting");
    try {
      await new Promise((resolve) => window.setTimeout(resolve, 350));
      if (simulateFailure && !failedOnce.current) {
        failedOnce.current = true;
        throw new Error("simulated report failure");
      }
      allowNextNavigation.current = true;
      await onSubmit(value);
    } catch {
      allowNextNavigation.current = false;
      setState("error");
    }
  }

  function requestClose() {
    if (state === "submitting") return;
    if (touched && !window.confirm("报告内容尚未保存，确认放弃本次修改吗？")) return;
    allowNextNavigation.current = true;
    onClose();
  }

  return (
    <BottomSheet
      open={open}
      title={<SheetHeading title={initialValue ? "更新报告草稿" : "加入风险报告"} subtitle="将已确认事实加入报告草稿" />}
      className="warning-form-sheet warning-report-sheet"
      onClose={requestClose}
      footer={
        <div className="warning-sheet-actions">
          <button type="button" className="ghost-button" onClick={requestClose} disabled={state === "submitting"}>
            取消
          </button>
          <button className="primary-button" type="submit" form="warning-report-form" disabled={!hasContent || state === "submitting"}>
            {state === "submitting" ? "正在保存…" : initialValue ? "保存草稿更新" : "加入报告草稿"}
          </button>
        </div>
      }
    >
      <form id="warning-report-form" className="warning-form warning-compact-form" onSubmit={handleSubmit}>
        <label className="warning-compact-row warning-report-target">
          <span>目标报告</span>
          <select
            value={value.reportId}
            onChange={(event) => {
              setTouched(true);
              setValue((current) => ({ ...current, reportId: event.target.value }));
            }}
          >
            {reportTargets.map((report) => (
              <option key={report.id} value={report.id}>
                {report.label}
              </option>
            ))}
          </select>
        </label>
        <span className="warning-tag provenance-tag--demo warning-report-demo">演示流程</span>

        <fieldset className="warning-report-content">
          <legend>包含内容</legend>
          {contentOptions.map(([key, title, description]) => (
            <label key={key}>
              <input
                type="checkbox"
                checked={value[key]}
                onChange={(event) => {
                  setTouched(true);
                  setValue((current) => ({ ...current, [key]: event.target.checked }));
                }}
              />
              <span>
                <strong>{title}</strong>
                <small className="sr-only">{description}</small>
              </span>
            </label>
          ))}
        </fieldset>

        <section className="warning-report-summary">
          <h3>事实摘要预览</h3>
          <p>{summary}</p>
          <small className="sr-only">对象：{subject}。数据截至 {WARNING_DATA_AS_OF}；仅写入草稿，发布前需人工确认。</small>
        </section>

        {!hasContent ? <p className="warning-form-hint">至少选择一项写入内容。</p> : null}
        {state === "error" ? (
          <div className="warning-form-error" role="alert">
            <AlertCircle size={17} /> 加入失败，请重试。选项已为你保留。
          </div>
        ) : null}
      </form>
    </BottomSheet>
  );
}

type ProgressUpdateSheetProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (detail: string) => void | Promise<void>;
};

export function ProgressUpdateSheet({ open, onClose, onSubmit }: ProgressUpdateSheetProps) {
  const [detail, setDetail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const allowNextNavigation = useRef(false);

  useDirtyBrowserBackGuard(open, Boolean(detail.trim()), "跟踪进展尚未保存，确认放弃已填写内容吗？", allowNextNavigation);

  useEffect(() => {
    if (open) {
      setDetail("");
      setSubmitting(false);
      allowNextNavigation.current = false;
    }
  }, [open]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!detail.trim() || submitting) return;
    setSubmitting(true);
    await new Promise((resolve) => window.setTimeout(resolve, 300));
    allowNextNavigation.current = true;
    await onSubmit(detail.trim());
  }

  function requestClose() {
    if (submitting) return;
    if (detail.trim() && !window.confirm("跟踪进展尚未保存，确认放弃已填写内容吗？")) return;
    allowNextNavigation.current = true;
    onClose();
  }

  return (
    <BottomSheet
      open={open}
      title={<SheetHeading title="更新跟踪进展" subtitle="记录已确认的最新行动和结果" />}
      className="warning-form-sheet warning-progress-sheet"
      onClose={requestClose}
      footer={
        <div className="warning-sheet-actions">
          <button type="button" className="ghost-button" onClick={requestClose} disabled={submitting}>
            取消
          </button>
          <button type="submit" form="warning-progress-form" className="primary-button" disabled={!detail.trim() || submitting}>
            {submitting ? "正在保存…" : "保存进展"}
          </button>
        </div>
      }
    >
      <form id="warning-progress-form" className="warning-form" onSubmit={handleSubmit}>
        <label className="warning-form-field">
          <span>本次进展</span>
          <textarea
            rows={5}
            value={detail}
            maxLength={240}
            placeholder="记录回款、担保落实或下一步安排…"
            onChange={(event) => setDetail(event.target.value)}
          />
          <small>{detail.length}/240</small>
        </label>
      </form>
    </BottomSheet>
  );
}
