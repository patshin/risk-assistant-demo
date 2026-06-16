import type { ReactNode } from "react";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <main className="app-frame">
      <div className="phone-shell">{children}</div>
    </main>
  );
}
