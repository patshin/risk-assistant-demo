import { Bot, Mic, Plus } from "lucide-react";

type BottomAskBarProps = {
  onOpen: () => void;
  placeholder?: string;
};

export function BottomAskBar({ onOpen, placeholder = "问风险、生成报告、追踪预警…" }: BottomAskBarProps) {
  return (
    <div className="bottom-ask">
      <button className="bottom-ask__input" type="button" onClick={onOpen}>
        <span className="bottom-ask__bot" aria-hidden="true">
          <Bot size={18} />
        </span>
        <span>{placeholder}</span>
        <Mic size={20} />
      </button>
      <button className="bottom-ask__plus" type="button" aria-label="添加任务" onClick={onOpen}>
        <Plus size={22} />
      </button>
    </div>
  );
}
