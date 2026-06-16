import { Mic, Plus } from "lucide-react";

type BottomAskBarProps = {
  onOpen: () => void;
};

export function BottomAskBar({ onOpen }: BottomAskBarProps) {
  return (
    <div className="bottom-ask">
      <button className="bottom-ask__input" type="button" onClick={onOpen}>
        <span>问风险、生成报告、追踪预警…</span>
        <Mic size={20} />
      </button>
      <button className="bottom-ask__plus" type="button" aria-label="添加任务" onClick={onOpen}>
        <Plus size={22} />
      </button>
    </div>
  );
}
