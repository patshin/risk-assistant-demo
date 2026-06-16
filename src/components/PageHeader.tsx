import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";

type PageHeaderProps = {
  title: string;
  badge?: ReactNode;
  onBack?: () => void;
  action?: ReactNode;
};

export function PageHeader({ title, badge, onBack, action }: PageHeaderProps) {
  return (
    <header className="page-header">
      <button className="icon-button" type="button" aria-label="返回" onClick={onBack}>
        <ArrowLeft size={20} strokeWidth={2.2} />
      </button>
      <h1>
        {title}
        {badge ? <span>{badge}</span> : null}
      </h1>
      <div className="page-header__action">{action}</div>
    </header>
  );
}
