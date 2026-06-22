type SectionTitleProps = {
  title: string;
  action?: string;
  onAction?: () => void;
};

export function SectionTitle({ title, action, onAction }: SectionTitleProps) {
  return (
    <div className="section-title section-header">
      <h2>{title}</h2>
      {action ? (
        <button type="button" onClick={onAction}>
          {action}
        </button>
      ) : null}
    </div>
  );
}
