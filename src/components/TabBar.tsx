type TabItem = {
  key: string;
  label: string;
};

type TabBarProps = {
  items: TabItem[];
  activeKey: string;
  onChange: (key: string) => void;
};

export function TabBar({ items, activeKey, onChange }: TabBarProps) {
  return (
    <div className="tab-bar" role="tablist" aria-label="风险模块">
      {items.map((item) => (
        <button
          key={item.key}
          type="button"
          role="tab"
          aria-selected={item.key === activeKey}
          className={item.key === activeKey ? "is-active" : ""}
          onClick={() => onChange(item.key)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
