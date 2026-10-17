import { BrowserRouter, Routes, Route } from "react-router";

import AppLayout from "./components/layout/AppLayout";
import DashboardPage from "./pages/DashboardPage";
import SalesPage from "./pages/SalesPage";
import SettlementsPage from "./pages/SettlementsPage";
import ReconciliationPage from "./pages/ReconcilitationPage";
import ExpensesPage from "./pages/ExpensesPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/sales" element={<SalesPage />} />
          <Route path="/settlements" element={<SettlementsPage />} />
          <Route path="/reconciliation" element={<ReconciliationPage />} />
          <Route path="/expenses" element={<ExpensesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
