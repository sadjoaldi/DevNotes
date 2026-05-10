import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import BugReportDetailPage from "./pages/BugReportDetailPage";
import BugReportsPage from "./pages/BugReportsPage";
import EditBugReportPage from "./pages/EditBurReportPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/bug-reports" replace />} />
        <Route path="/bug-reports" element={<BugReportsPage />} />
        <Route path="/bug-reports/new" element={<EditBugReportPage />} />
        <Route path="/bug-reports/:id" element={<BugReportDetailPage />} />
        <Route path="/bug-reports/:id/edit" element={<EditBugReportPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
