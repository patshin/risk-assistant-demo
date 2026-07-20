import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { BottomAskBar } from "../../components/BottomAskBar";
import { useCopilot, type WorkbenchCopilotAction } from "../../components/GlobalCopilot";
import { matters, type MatterId } from "./data/workbenchDemoData";
import { WorkbenchHeader, WorkbenchIdentity, WorkbenchTabs, type WorkbenchSheetName } from "./components/WorkbenchUI";
import { WorkbenchSheets } from "./components/WorkbenchSheets";

type WorkbenchActions = {
  openSheet: (name: Exclude<WorkbenchSheetName, null>) => void;
  notify: (message: string) => void;
  askCopilot: (context?: string, matterId?: MatterId) => void;
};

const WorkbenchActionsContext = createContext<WorkbenchActions | null>(null);

export function useWorkbenchActions() {
  const value = useContext(WorkbenchActionsContext);
  if (!value) throw new Error("useWorkbenchActions must be used inside WorkbenchLayout");
  return value;
}

function pageFromPath(pathname: string) {
  if (pathname.includes("/matter/")) return "matter" as const;
  if (pathname.endsWith("/queue")) return "queue" as const;
  if (pathname.endsWith("/tracking")) return "tracking" as const;
  if (pathname.endsWith("/reports")) return "reports" as const;
  return "overview" as const;
}

export function WorkbenchLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams<{ matterId?: MatterId }>();
  const { openCopilot } = useCopilot();
  const [activeSheet, setActiveSheet] = useState<WorkbenchSheetName>(null);
  const [toast, setToast] = useState("");
  const detail = location.pathname.includes("/watch/matter/");
  const page = pageFromPath(location.pathname);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2400);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const openFromCopilot = (action: WorkbenchCopilotAction) => {
    if (action === "assign") setActiveSheet("assign");
    if (action === "material") setActiveSheet("materials");
    if (action === "queue") navigate("/watch/queue");
    if (action === "reports") navigate("/watch/reports");
  };

  const actions = useMemo<WorkbenchActions>(() => ({
    openSheet: setActiveSheet,
    notify: setToast,
    askCopilot: (context, matterId) => {
      const resolvedMatterId = matterId ?? params.matterId;
      const matter = resolvedMatterId ? matters[resolvedMatterId] : undefined;
      openCopilot({
        context: context ?? (matter ? `${matter.title} · 当前事项研判` : "个人工作台 · 今日责任队列"),
        workbenchContext: { page, matterId: resolvedMatterId, label: matter?.title },
        onWorkbenchAction: openFromCopilot,
      });
    },
  }), [openCopilot, page, params.matterId]);

  return (
    <WorkbenchActionsContext.Provider value={actions}>
      <div className={`workbench-page${detail ? " is-detail" : ""}`}>
        <WorkbenchHeader detail={detail} onSearch={() => setActiveSheet("search")} onMore={() => setActiveSheet("directive")} />
        {!detail ? <><WorkbenchIdentity onScope={() => setActiveSheet("scope")} /><WorkbenchTabs /></> : null}
        <main className="wb-main"><Outlet /></main>
        <BottomAskBar onOpen={() => actions.askCopilot()} placeholder={detail ? "追问当前事项、证据与行动…" : "问今日风险、任务与汇报准备…"} />
        <WorkbenchSheets activeSheet={activeSheet} onClose={() => setActiveSheet(null)} onToast={setToast} />
        {toast ? <div className="wb-toast" role="status"><CheckCircle2 size={17} />{toast}</div> : null}
      </div>
    </WorkbenchActionsContext.Provider>
  );
}

export function WorkbenchSection({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`wb-section${className ? ` ${className}` : ""}`}>{children}</section>;
}
