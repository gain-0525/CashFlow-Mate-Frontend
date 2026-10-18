import { BrowserRouter, Routes, Route } from "react-router";

import AppLayout from "./components/layout/AppLayout";
import DashboardPage from "./pages/DashboardPage";
import SalesPage from "./pages/SalesPage";
import SettlementsPage from "./pages/SettlementsPage";
import ReconciliationPage from "./pages/ReconciliationPage";
import ExpensesPage from "./pages/ExpensesPage";
import ForecastPage from "./pages/ForecastPage";
import GuidePage from "./pages/GuidePage";
import CashFlowCalendarPage from "./pages/CashFlowCalendarPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/guide" element={<GuidePage />} />
          <Route path="/sales" element={<SalesPage />} />
          <Route path="/settlements" element={<SettlementsPage />} />
          <Route path="/reconciliation" element={<ReconciliationPage />} />
          <Route path="/expenses" element={<ExpensesPage />} />
          <Route path="/forecast" element={<ForecastPage />} />
          <Route path="/calendar" element={<CashFlowCalendarPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
