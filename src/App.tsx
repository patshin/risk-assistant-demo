import { useLayoutEffect, useRef } from "react";
import { Navigate, Route, Routes, useLocation, useNavigationType } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { GlobalCopilotProvider } from "./components/GlobalCopilot";
import {
  DefaultAssetsPage,
  DefaultCustomerListPage,
  PrewarningAssetsPage,
  WarningAssetDetailPage,
  WarningCustomerDetailPage,
  WarningCustomerListPage,
  WarningMigrationsPage,
  WarningOverviewPage,
  WarningTrackingDetailPage,
} from "./features/warning-default/WarningDefaultPages";
import { BriefDetailPage } from "./pages/BriefDetailPage";
import { CreditRiskPage, RiskMigrationTrendPage } from "./pages/CreditRiskPage";
import { CreditCustomerListPage } from "./pages/CreditCustomerListPage";
import { CustomerRiskDetailPage } from "./pages/CustomerRiskDetailPage";
import { HomePage } from "./pages/HomePage";
import { InvestmentOverviewPage } from "./pages/investment/InvestmentOverviewPage";
import { InvestmentChangeDetailPage, InvestmentChangesPage } from "./pages/investment/InvestmentChangePages";
import { InvestmentPerformancePage, InvestmentStructurePage, InvestmentVarPage } from "./pages/investment/InvestmentAnalysisPages";
import { InvestmentAssetPage, InvestmentMemberPage } from "./pages/investment/InvestmentDetailPages";
import { InvestmentReportPreviewPage, InvestmentTrackingDetailPage } from "./pages/investment/InvestmentWorkflowPages";
import { LargeExposureDetailPage, LargeExposureListPage } from "./pages/LargeExposurePage";
import { MacroRiskPage } from "./pages/MacroRiskPage";
import { ReportPage } from "./pages/ReportPage";
import { ClientRiskPanoramaPage, IndustryRiskAnalysisPage, MarketShockAnalysisPage } from "./pages/RiskAnalysisPages";
import { AlertTimelinePage, TodayFocusPage, TrackingListPage, WatchPage } from "./pages/WatchPage";

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
          <Route path="/credit/warning" element={<WarningOverviewPage />} />
          <Route path="/credit/warning/prewarnings" element={<PrewarningAssetsPage />} />
          <Route path="/credit/warning/prewarnings/migrations" element={<WarningMigrationsPage />} />
          <Route path="/credit/warning/prewarnings/customers" element={<WarningCustomerListPage />} />
          <Route path="/credit/warning/defaults" element={<DefaultAssetsPage />} />
          <Route path="/credit/warning/defaults/customers" element={<DefaultCustomerListPage />} />
          <Route path="/credit/warning/customers/:customerId" element={<WarningCustomerDetailPage />} />
          <Route path="/credit/warning/assets/:assetId" element={<WarningAssetDetailPage />} />
          <Route path="/credit/customers" element={<CreditCustomerListPage />} />
          <Route path="/credit/large-exposure" element={<Navigate to="/credit?tab=large" replace />} />
          <Route path="/credit/large-exposure/list" element={<LargeExposureListPage />} />
          <Route path="/credit/large-exposure/:id" element={<LargeExposureDetailPage />} />
          <Route path="/risk/migration" element={<RiskMigrationTrendPage />} />
          <Route path="/risk/customer/:id" element={<CustomerRiskDetailPage />} />
          <Route path="/investment" element={<InvestmentOverviewPage />} />
          <Route path="/investment/changes" element={<InvestmentChangesPage />} />
          <Route path="/investment/changes/:changeId" element={<InvestmentChangeDetailPage />} />
          <Route path="/investment/var" element={<InvestmentVarPage />} />
          <Route path="/investment/performance" element={<InvestmentPerformancePage />} />
          <Route path="/investment/structure" element={<InvestmentStructurePage />} />
          <Route path="/investment/member/:memberId" element={<InvestmentMemberPage />} />
          <Route path="/investment/asset/:assetClassId" element={<InvestmentAssetPage />} />
          <Route path="/watch" element={<WatchPage />} />
          <Route path="/watch/alerts" element={<AlertTimelinePage />} />
          <Route path="/risk/ai-alerts" element={<AlertTimelinePage />} />
          <Route path="/watch/today" element={<TodayFocusPage />} />
          <Route path="/watch/tracking" element={<TrackingListPage />} />
          <Route path="/watch/tracking/guangxi-baise-default" element={<WarningTrackingDetailPage />} />
          <Route path="/watch/tracking/:trackingId" element={<InvestmentTrackingDetailPage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/report/investment/:draftId" element={<InvestmentReportPreviewPage />} />
          <Route path="/risk/client/:id" element={<ClientRiskPanoramaPage />} />
          <Route path="/risk/industry/:type" element={<IndustryRiskAnalysisPage />} />
          <Route path="/risk/market/shock" element={<MarketShockAnalysisPage />} />
        </Routes>
      </GlobalCopilotProvider>
    </AppShell>
  );
}

function ScrollToTop() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const positions = useRef(new Map<string, number>());
  const previous = useRef({ key: location.key, pathname: location.pathname });

  useLayoutEffect(() => {
    const scrollContainer = document.querySelector<HTMLElement>(".phone-shell");
    const priorEntry = previous.current;
    const currentScroll = scrollContainer?.scrollTop ?? 0;
    positions.current.set(priorEntry.key, currentScroll);

    const samePage = priorEntry.pathname === location.pathname;
    const target = samePage ? currentScroll : navigationType === "POP" ? (positions.current.get(location.key) ?? 0) : 0;
    const frame = window.requestAnimationFrame(() => {
      if (!samePage) {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }
      scrollContainer?.scrollTo(0, target);
    });
    previous.current = { key: location.key, pathname: location.pathname };
    return () => window.cancelAnimationFrame(frame);
  }, [location.key, location.pathname, navigationType]);

  return null;
}
