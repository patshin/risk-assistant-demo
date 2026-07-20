import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, ChevronRight, FileCheck2, ListFilter, Search, Send, Sparkles } from "lucide-react";
import { BottomSheet } from "../../../components/BottomSheet";
import { roleOptions, scopeOptions } from "../data/workbenchDemoData";
import { useWorkbench, type WorkbenchRole, type WorkbenchScope } from "../state/workbenchStore";
import type { WorkbenchSheetName } from "./WorkbenchUI";

type Props = {
  activeSheet: WorkbenchSheetName;
  onClose: () => void;
  onToast: (message: string) => void;
};

function SheetTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return <span className="wb-sheet-title"><span>{title}</span><small>{subtitle}</small></span>;
}

export function WorkbenchSheets({ activeSheet, onClose, onToast }: Props) {
  const { state, dispatch } = useWorkbench();
  const navigate = useNavigate();
  const [role, setRole] = useState<WorkbenchRole>(state.role);
  const [scope, setScope] = useState<WorkbenchScope>(state.scope);
  const [taskName, setTaskName] = useState(state.huadongTask?.name ?? "核验投资持仓与主体关系");
  const [owner, setOwner] = useState(state.huadongTask?.owner ?? "李敏");
  const [due, setDue] = useState(state.huadongTask?.due ?? "2026-07-16T15:00");
  const [checks, setChecks] = useState<string[]>(state.huadongTask?.checks ?? ["投资持仓与主体关系", "融资与担保关系"]);
  const [progress, setProgress] = useState(state.baiseProgress?.detail ?? "担保处置材料已取得，正在与责任单位核对最新回收安排。");
  const [judgment, setJudgment] = useState(state.baiseProgress?.judgment ?? "风险尚未缓释");
  const [nextUpdate, setNextUpdate] = useState(state.baiseProgress?.nextUpdate ?? "2026-07-17T09:00");
  const [decision, setDecision] = useState<"special-review" | "observe" | "request-materials">("special-review");
  const [materialChecks, setMaterialChecks] = useState(["触发原因明细", "现金流与偿债安排"]);

  useEffect(() => {
    if (activeSheet !== "scope") return;
    setRole(state.role);
    setScope(state.scope);
  }, [activeSheet, state.role, state.scope]);

  const toggleCheck = (value: string, values: string[], setValues: (next: string[]) => void) => {
    setValues(values.includes(value) ? values.filter((item) => item !== value) : [...values, value]);
  };

  const finish = (message: string) => {
    onClose();
    onToast(message);
  };

  return (
    <>
      <BottomSheet
        open={activeSheet === "scope"}
        title={<SheetTitle title="切换工作视角" subtitle="角色决定优先级，数据范围决定可见事项" />}
        className="workbench-sheet"
        onClose={onClose}
        footer={<button className="wb-primary-button" type="button" onClick={() => { dispatch({ type: "set-role-scope", role, scope }); finish("工作视角已更新"); }}>应用视角</button>}
      >
        <fieldset className="wb-option-group"><legend>我的角色</legend>{roleOptions.map((item) => <label key={item.value} className={role === item.value ? "is-selected" : ""}><input type="radio" name="role" checked={role === item.value} onChange={() => setRole(item.value)} /><span className="wb-option-radio">{role === item.value ? <Check size={13} /> : null}</span><span><strong>{item.label}</strong><small>{item.hint}</small></span></label>)}</fieldset>
        <fieldset className="wb-option-group"><legend>数据范围</legend>{scopeOptions.map((item) => <label key={item.value} className={scope === item.value ? "is-selected" : ""}><input type="radio" name="scope" checked={scope === item.value} onChange={() => setScope(item.value)} /><span className="wb-option-radio">{scope === item.value ? <Check size={13} /> : null}</span><span><strong>{item.label}</strong><small>{item.hint}</small></span></label>)}</fieldset>
      </BottomSheet>

      <BottomSheet
        open={activeSheet === "assign"}
        title={<SheetTitle title="分派核验任务" subtitle="任务结果会回写事项、跟踪与汇报准备度" />}
        className="workbench-sheet"
        onClose={onClose}
        footer={<button className="wb-primary-button" type="button" onClick={() => { dispatch({ type: "assign-task", value: { name: taskName, owner, due, checks } }); finish(`已分派给${owner}`); }}><Send size={17} />确认分派</button>}
      >
        <div className="wb-form-field"><label htmlFor="wb-task-name">任务名称</label><input id="wb-task-name" value={taskName} onChange={(event) => setTaskName(event.target.value)} /></div>
        <div className="wb-form-grid"><div className="wb-form-field"><label htmlFor="wb-owner">责任人</label><select id="wb-owner" value={owner} onChange={(event) => setOwner(event.target.value)}><option>李敏</option><option>陈璐</option><option>王哲</option></select></div><div className="wb-form-field"><label htmlFor="wb-due">完成时间</label><input id="wb-due" type="datetime-local" value={due} onChange={(event) => setDue(event.target.value)} /></div></div>
        <fieldset className="wb-check-group"><legend>核验范围</legend>{["投资持仓与主体关系", "融资与担保关系", "现金流与司法执行"].map((item) => <label key={item}><input type="checkbox" checked={checks.includes(item)} onChange={() => toggleCheck(item, checks, setChecks)} /><span>{checks.includes(item) ? <Check size={13} /> : null}</span>{item}</label>)}</fieldset>
      </BottomSheet>

      <BottomSheet
        open={activeSheet === "progress"}
        title={<SheetTitle title="更新跟踪进展" subtitle="保留事实、判断与下次更新时间的边界" />}
        className="workbench-sheet"
        onClose={onClose}
        footer={<button className="wb-primary-button" type="button" onClick={() => { dispatch({ type: "update-baise", value: { detail: progress, judgment, nextUpdate } }); finish("进展已更新，并同步汇报准备度"); }}><Check size={17} />保存并同步</button>}
      >
        <div className="wb-form-field"><label htmlFor="wb-progress">最新进展</label><textarea id="wb-progress" rows={4} value={progress} onChange={(event) => setProgress(event.target.value)} /></div>
        <div className="wb-form-field"><label htmlFor="wb-judgment">人工判断</label><select id="wb-judgment" value={judgment} onChange={(event) => setJudgment(event.target.value)}><option>风险尚未缓释</option><option>风险部分缓释</option><option>风险明显缓释</option></select></div>
        <div className="wb-form-field"><label htmlFor="wb-next-update">下次更新时间</label><input id="wb-next-update" type="datetime-local" value={nextUpdate} onChange={(event) => setNextUpdate(event.target.value)} /></div>
      </BottomSheet>

      <BottomSheet
        open={activeSheet === "materials"}
        title={<SheetTitle title="补充缺失材料" subtitle="向责任人发起补充请求，材料到达前不形成确定结论" />}
        className="workbench-sheet"
        onClose={onClose}
        footer={<button className="wb-primary-button" type="button" onClick={() => { dispatch({ type: "request-materials" }); finish("材料补充请求已发出"); }}><Send size={17} />发送请求</button>}
      >
        <fieldset className="wb-check-group"><legend>需要补充</legend>{["触发原因明细", "现金流与偿债安排", "融资与担保关系", "最近一期管理层说明"].map((item) => <label key={item}><input type="checkbox" checked={materialChecks.includes(item)} onChange={() => toggleCheck(item, materialChecks, setMaterialChecks)} /><span>{materialChecks.includes(item) ? <Check size={13} /> : null}</span>{item}</label>)}</fieldset>
        <div className="wb-form-field"><label htmlFor="wb-material-note">补充说明</label><textarea id="wb-material-note" rows={3} defaultValue="请于明日 12:00 前补充，并注明数据时间与来源。" /></div>
      </BottomSheet>

      <BottomSheet
        open={activeSheet === "decision"}
        title={<SheetTitle title="确认管理策略" subtitle="本次确认会写入事项记录，并更新待处理状态" />}
        className="workbench-sheet"
        onClose={onClose}
        footer={<button className="wb-primary-button" type="button" onClick={() => { dispatch({ type: "set-decision", value: decision }); finish("管理策略已确认并留痕"); }}><Check size={17} />确认并留痕</button>}
      >
        <fieldset className="wb-option-group wb-decision-options"><legend>选择策略</legend>{[
          { value: "special-review" as const, label: "启动专项核查", hint: "确认风险升级，分派主体关系与敞口核验任务" },
          { value: "observe" as const, label: "维持观察", hint: "保留当前级别，待下一批证据到达后再判断" },
          { value: "request-materials" as const, label: "先补材料", hint: "暂不形成管理结论，补齐信息后重新提交" },
        ].map((item) => <label key={item.value} className={decision === item.value ? "is-selected" : ""}><input type="radio" name="decision" checked={decision === item.value} onChange={() => setDecision(item.value)} /><span className="wb-option-radio">{decision === item.value ? <Check size={13} /> : null}</span><span><strong>{item.label}</strong><small>{item.hint}</small></span></label>)}</fieldset>
      </BottomSheet>

      <BottomSheet
        open={activeSheet === "directive"}
        title={<SheetTitle title="会议口径与指令" subtitle="供本周风险例会前复核，不替代人工确认" />}
        className="workbench-sheet"
        onClose={onClose}
        footer={<button className="wb-primary-button" type="button" onClick={() => { onClose(); navigate("/watch/reports"); }}><FileCheck2 size={17} />进入汇报准备</button>}
      >
        <div className="wb-directive"><span><Sparkles size={18} /></span><div><strong>建议会议口径</strong><p>先讲华东建设集团集中度与司法执行信号的同步升级，再说明广西百色出险处置进度缺口，最后补充 CII 收益转负但 VaR 仍在限额内的边界。</p></div></div>
        <ol className="wb-directive-list"><li><strong>会前必须完成</strong><span>确认华东建设集团管理策略与责任人。</span></li><li><strong>需补充事实</strong><span>广西百色最新回收与担保处置进展。</span></li><li><strong>需人工确认</strong><span>CII 是否纳入本周正式汇报。</span></li></ol>
      </BottomSheet>

      <BottomSheet
        open={activeSheet === "search"}
        title={<SheetTitle title="查找工作项" subtitle="可按事项名称、风险类型或责任人快速定位" />}
        className="workbench-sheet wb-search-sheet"
        onClose={onClose}
      >
        <div className="wb-search-box"><Search size={18} /><input aria-label="搜索工作项" placeholder="例如：华东建设、超期、李敏" value={state.queueQuery} onChange={(event) => dispatch({ type: "set-queue-query", value: event.target.value })} /><button type="button" aria-label="应用搜索" onClick={() => { onClose(); navigate("/watch/queue"); }}><ChevronRight size={18} /></button></div>
        <button className="wb-search-shortcut" type="button" onClick={() => { onClose(); navigate("/watch/queue"); }}><ListFilter size={18} /><span><strong>打开待处理队列</strong><small>查看筛选、排序与责任状态</small></span><ChevronRight size={17} /></button>
      </BottomSheet>
    </>
  );
}
