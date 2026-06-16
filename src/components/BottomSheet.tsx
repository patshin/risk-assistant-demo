import type { ReactNode } from "react";
import { X } from "lucide-react";

type BottomSheetProps = {
  open: boolean;
  title: ReactNode;
  children: ReactNode;
  onClose: () => void;
};

export function BottomSheet({ open, title, children, onClose }: BottomSheetProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="sheet-layer" role="presentation">
      <button className="sheet-layer__backdrop" type="button" aria-label="关闭弹层" onClick={onClose} />
      <section className="bottom-sheet" role="dialog" aria-modal="true" aria-label={typeof title === "string" ? title : "半屏详情"}>
        <div className="bottom-sheet__handle" />
        <header>
          <h2>{title}</h2>
          <button className="icon-button" type="button" aria-label="关闭" onClick={onClose}>
            <X size={19} />
          </button>
        </header>
        <div className="bottom-sheet__body">{children}</div>
      </section>
    </div>
  );
}
