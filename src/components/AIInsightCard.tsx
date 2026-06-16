import type { ReactNode } from "react";
import { Sparkles } from "lucide-react";

type AIInsightCardProps = {
  title: string;
  children: ReactNode;
  action?: string;
  onAction?: () => void;
};

export function AIInsightCard({ title, children, action, onAction }: AIInsightCardProps) {
  return (
    <article className="ai-card">
      <div className="ai-card__mark">
        <Sparkles size={18} />
        <span>AI</span>
      </div>
      <div className="ai-card__content">
        <h3>{title}</h3>
        <div>{children}</div>
        {action ? (
          <button className="ghost-button" type="button" onClick={onAction}>
            {action}
          </button>
        ) : null}
      </div>
    </article>
  );
}
