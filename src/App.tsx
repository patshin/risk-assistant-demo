import { useLayoutEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { GlobalCopilotProvider } from "./components/GlobalCopilot";
import { BriefDetailPage } from "./pages/BriefDetailPage";
import { CreditRiskPage } from "./pages/CreditRiskPage";
import { HomePage } from "./pages/HomePage";
import { InvestmentRiskPage } from "./pages/InvestmentRiskPage";
import { MacroRiskPage } from "./pages/MacroRiskPage";
import { ReportPage } from "./pages/ReportPage";
import { TodayFocusPage, TrackingListPage, WatchPage } from "./pages/WatchPage";

export default function App() {
  return (
    <AppShell>
      <GlobalCopilotProvider>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/brief" element={<BriefDetailPage />} />
          <Route path="/macro" element={<MacroRiskPage />} />
          <Route path="/credit" element={<CreditRiskPage />} />
          <Route path="/investment" element={<InvestmentRiskPage />} />
          <Route path="/watch" element={<WatchPage />} />
          <Route path="/watch/today" element={<TodayFocusPage />} />
          <Route path="/watch/tracking" element={<TrackingListPage />} />
          <Route path="/report" element={<ReportPage />} />
        </Routes>
      </GlobalCopilotProvider>
    </AppShell>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname]);

  return null;
}
