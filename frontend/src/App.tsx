import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import BugReportDetailPage from "./pages/BugReportDetailPage";
import BugReportsPage from "./pages/BugReportsPage";

import EditBugReportPage from "./pages/EditBurReportPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/bug-reports" replace />} />
        <Route
          path="/bug-reports"
          element={
            <Layout>
              <BugReportsPage />
            </Layout>
          }
        />
        <Route
          path="/bug-reports/new"
          element={
            <Layout>
              <EditBugReportPage />
            </Layout>
          }
        />
        <Route
          path="/bug-reports/:id"
          element={
            <Layout>
              <BugReportDetailPage />
            </Layout>
          }
        />
        <Route
          path="/bug-reports/:id/edit"
          element={
            <Layout>
              <EditBugReportPage />
            </Layout>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
