import { useEffect, useId, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

type BottomSheetProps = {
  open: boolean;
  title: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  onClose: () => void;
};

export function BottomSheet({ open, title, children, footer, className = "", onClose }: BottomSheetProps) {
  const panelRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  const titleId = useId();

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    const scrollContainer = document.querySelector<HTMLElement>(".phone-shell");
    const previousContainerOverflow = scrollContainer?.style.overflowY ?? "";
    document.body.style.overflow = "hidden";
    if (scrollContainer) scrollContainer.style.overflowY = "hidden";
    window.requestAnimationFrame(() => closeRef.current?.focus());

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      if (scrollContainer) scrollContainer.style.overflowY = previousContainerOverflow;
      previousFocus?.focus();
    };
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <div className="sheet-layer" role="presentation">
      <button className="sheet-layer__backdrop" type="button" aria-label="关闭弹层" onClick={onClose} />
      <section
        ref={panelRef}
        className={`bottom-sheet${footer ? " has-footer" : ""}${className ? ` ${className}` : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="bottom-sheet__handle" />
        <header>
          <h2 id={titleId}>{title}</h2>
          <button ref={closeRef} className="icon-button" type="button" aria-label="关闭" onClick={onClose}>
            <X size={19} />
          </button>
        </header>
        <div className="bottom-sheet__body">{children}</div>
        {footer ? <footer className="bottom-sheet__footer">{footer}</footer> : null}
      </section>
    </div>
  );
}
