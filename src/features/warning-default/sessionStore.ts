import type { ReportDraftValue, TrackingFormValue } from "./types";

export type TrackingProgressRecord = {
  date: string;
  title: string;
  detail: string;
  tone: "danger" | "warning" | "neutral";
};

type WarningDefaultSession = {
  trackingValue?: TrackingFormValue;
  latestProgress?: {
    title: string;
    detail: string;
    date: string;
  };
  progressRecords?: TrackingProgressRecord[];
  reportDraft?: ReportDraftValue;
  reportPrepared?: boolean;
  trackedAssetIds?: string[];
  trackedAssetValues?: Record<string, TrackingFormValue>;
  reportAssetIds?: string[];
  reportAssetValues?: Record<string, ReportDraftValue>;
};

const SESSION_KEY = "risk-assistant.warning-default.session.v1";

export function readWarningDefaultSession(): WarningDefaultSession {
  try {
    const value = window.sessionStorage.getItem(SESSION_KEY);
    if (!value) return {};
    const parsed: unknown = JSON.parse(value);
    if (!isRecord(parsed)) return {};

    const session: WarningDefaultSession = {};
    if (isTrackingValue(parsed.trackingValue)) session.trackingValue = parsed.trackingValue;
    if (isProgressValue(parsed.latestProgress)) session.latestProgress = parsed.latestProgress;
    if (Array.isArray(parsed.progressRecords)) {
      const records = parsed.progressRecords.filter(isProgressRecord);
      if (records.length) session.progressRecords = records;
    }
    if (isReportDraft(parsed.reportDraft)) session.reportDraft = parsed.reportDraft;
    if (typeof parsed.reportPrepared === "boolean") session.reportPrepared = parsed.reportPrepared;
    if (Array.isArray(parsed.trackedAssetIds)) session.trackedAssetIds = parsed.trackedAssetIds.filter(isNonEmptyString);
    if (isRecord(parsed.trackedAssetValues)) {
      const values = Object.fromEntries(Object.entries(parsed.trackedAssetValues).filter((entry): entry is [string, TrackingFormValue] => isNonEmptyString(entry[0]) && isTrackingValue(entry[1])));
      if (Object.keys(values).length) session.trackedAssetValues = values;
    }
    if (Array.isArray(parsed.reportAssetIds)) session.reportAssetIds = parsed.reportAssetIds.filter(isNonEmptyString);
    if (isRecord(parsed.reportAssetValues)) {
      const values = Object.fromEntries(
        Object.entries(parsed.reportAssetValues).filter(
          (entry): entry is [string, ReportDraftValue] => isNonEmptyString(entry[0]) && isReportDraft(entry[1]),
        ),
      );
      if (Object.keys(values).length) session.reportAssetValues = values;
    }
    return session;
  } catch {
    return {};
  }
}

export function updateWarningDefaultSession(patch: Partial<WarningDefaultSession>) {
  const next = { ...readWarningDefaultSession(), ...patch };
  try {
    window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(next));
  } catch {
    // Session persistence is a convenience for this local demo; the current page state remains usable if storage is unavailable.
  }
  return next;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && Boolean(value.trim());
}

function isDate(value: unknown): value is string {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function isTrackingValue(value: unknown): value is TrackingFormValue {
  return (
    isRecord(value) &&
    isNonEmptyString(value.owner) &&
    isDate(value.dueDate) &&
    (value.cadence === "每日" || value.cadence === "每周" || value.cadence === "每月")
  );
}

function isProgressValue(value: unknown): value is NonNullable<WarningDefaultSession["latestProgress"]> {
  return isRecord(value) && isNonEmptyString(value.title) && isNonEmptyString(value.detail) && isNonEmptyString(value.date);
}

function isProgressRecord(value: unknown): value is TrackingProgressRecord {
  return (
    isRecord(value) &&
    isNonEmptyString(value.date) &&
    isNonEmptyString(value.title) &&
    isNonEmptyString(value.detail) &&
    (value.tone === "danger" || value.tone === "warning" || value.tone === "neutral")
  );
}

function isReportDraft(value: unknown): value is ReportDraftValue {
  return (
    isRecord(value) &&
    isNonEmptyString(value.reportId) &&
    typeof value.includeRiskFacts === "boolean" &&
    typeof value.includeAssetFields === "boolean" &&
    typeof value.includeTrackingProgress === "boolean"
  );
}
