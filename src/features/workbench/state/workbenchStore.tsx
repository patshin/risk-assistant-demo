import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from "react";

export type WorkbenchRole = "executive" | "risk-lead" | "line-lead" | "manager";
export type WorkbenchScope = "group" | "credit" | "investment" | "watching";

export type AssignedTask = {
  name: string;
  owner: string;
  due: string;
  checks: string[];
};

export type ProgressUpdate = {
  detail: string;
  judgment: string;
  nextUpdate: string;
  updatedAt: string;
};

export type WorkbenchState = {
  role: WorkbenchRole;
  scope: WorkbenchScope;
  unreadChanges: number;
  huadongDecision: "pending" | "special-review" | "observe" | "request-materials";
  huadongTask?: AssignedTask;
  baiseProgress?: ProgressUpdate;
  ciiReportIncluded: boolean;
  missingMaterialsRequested: boolean;
  queueFilter: string;
  queueQuery: string;
  queueSort: "priority" | "deadline" | "updated";
  trackingFilter: string;
};

type WorkbenchAction =
  | { type: "set-role-scope"; role: WorkbenchRole; scope: WorkbenchScope }
  | { type: "mark-read" }
  | { type: "set-decision"; value: Exclude<WorkbenchState["huadongDecision"], "pending"> }
  | { type: "assign-task"; value: AssignedTask }
  | { type: "update-baise"; value: Omit<ProgressUpdate, "updatedAt"> }
  | { type: "confirm-cii-report" }
  | { type: "request-materials" }
  | { type: "set-queue-filter"; value: string }
  | { type: "set-queue-query"; value: string }
  | { type: "set-queue-sort"; value: WorkbenchState["queueSort"] }
  | { type: "set-tracking-filter"; value: string }
  | { type: "reset" };

const STORAGE_KEY = "risk-assistant-demo:workbench:v1";

const initialState: WorkbenchState = {
  role: "risk-lead",
  scope: "group",
  unreadChanges: 3,
  huadongDecision: "pending",
  ciiReportIncluded: false,
  missingMaterialsRequested: false,
  queueFilter: "全部",
  queueQuery: "",
  queueSort: "priority",
  trackingFilter: "全部",
};

function readInitialState(): WorkbenchState {
  try {
    if (new URLSearchParams(window.location.search).get("resetWorkbench") === "1") {
      window.localStorage.removeItem(STORAGE_KEY);
      return initialState;
    }
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? { ...initialState, ...(JSON.parse(saved) as Partial<WorkbenchState>) } : initialState;
  } catch {
    return initialState;
  }
}

function reducer(state: WorkbenchState, action: WorkbenchAction): WorkbenchState {
  switch (action.type) {
    case "set-role-scope":
      return { ...state, role: action.role, scope: action.scope };
    case "mark-read":
      return { ...state, unreadChanges: 0 };
    case "set-decision":
      return { ...state, huadongDecision: action.value };
    case "assign-task":
      return { ...state, huadongTask: action.value };
    case "update-baise":
      return { ...state, baiseProgress: { ...action.value, updatedAt: "刚刚" } };
    case "confirm-cii-report":
      return { ...state, ciiReportIncluded: true };
    case "request-materials":
      return { ...state, missingMaterialsRequested: true };
    case "set-queue-filter":
      return { ...state, queueFilter: action.value };
    case "set-queue-query":
      return { ...state, queueQuery: action.value };
    case "set-queue-sort":
      return { ...state, queueSort: action.value };
    case "set-tracking-filter":
      return { ...state, trackingFilter: action.value };
    case "reset":
      return initialState;
    default:
      return state;
  }
}

type WorkbenchContextValue = {
  state: WorkbenchState;
  dispatch: React.Dispatch<WorkbenchAction>;
  readiness: number;
  pendingCount: number;
};

const WorkbenchContext = createContext<WorkbenchContextValue | null>(null);

export function WorkbenchProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, readInitialState);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const value = useMemo(() => {
    const completed = Number(state.huadongDecision !== "pending") + Number(Boolean(state.baiseProgress)) + Number(state.ciiReportIncluded) + Number(Boolean(state.huadongTask));
    return {
      state,
      dispatch,
      readiness: Math.min(100, 75 + completed * 5),
      pendingCount: Math.max(0, 4 - completed),
    };
  }, [state]);

  return <WorkbenchContext.Provider value={value}>{children}</WorkbenchContext.Provider>;
}

export function useWorkbench() {
  const value = useContext(WorkbenchContext);
  if (!value) throw new Error("useWorkbench must be used inside WorkbenchProvider");
  return value;
}

export function clearWorkbenchDemoState() {
  window.localStorage.removeItem(STORAGE_KEY);
}

export function resetWorkbenchDemoState() {
  clearWorkbenchDemoState();
  window.location.reload();
}
