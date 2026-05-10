import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { bugReportsApi } from "../api/bugReports";
import BugReportForm from "../components/BugReportForm";
import { useToast } from "../context/ToastContext";
import type { BugReport, CreateBugReportInput } from "../types";

export default function EditBugReportPage() {
  const { id } = useParams<{ id: string }>();
  const [bugReport, setBugReport] = useState<BugReport | null>(null);
  const [isLoading, setIsLoading] = useState(!!id);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    if (!id) return;

    const fetchBugReport = async () => {
      try {
        const data = await bugReportsApi.getById(id);
        setBugReport(data);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_) {
        showToast("Rapport introuvable.", "error");
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBugReport();
  }, [id, navigate]);

  const handleSubmit = async (input: CreateBugReportInput) => {
    setIsSubmitting(true);
    try {
      const isEditMode = !!id && !!bugReport;
      if (isEditMode) {
        await bugReportsApi.update(id, input);
        showToast("Rapport mis à jour.", "success");
        navigate(`/bug-reports/${id}`);
      } else {
        const created = await bugReportsApi.create(input);
        showToast("Rapport créé avec succès.", "success");
        navigate(`/bug-reports/${created.id}`);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      showToast("Une erreur est survenue.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-white/30 text-sm">Chargement...</p>
      </div>
    );
  }

  const isEditMode = !!id && !!bugReport;

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={() => navigate(isEditMode ? `/bug-reports/${id}` : "/")}
            className="text-sm text-white/40 hover:text-white transition-colors"
          >
            ← Retour
          </button>
          <h1 className="text-lg font-semibold text-white">
            {isEditMode ? "Modifier le rapport" : "Nouveau rapport"}
          </h1>
        </div>

        <BugReportForm
          initialValues={
            isEditMode
              ? {
                  title: bugReport.title,
                  description: bugReport.description,
                  cause: bugReport.cause,
                  solution: bugReport.solution,
                  snippet: bugReport.snippet,
                  category: bugReport.category,
                  severity: bugReport.severity,
                  status: bugReport.status,
                  tags: bugReport.tags.map((t) => t.name),
                  technologies: bugReport.technologies.map((t) => t.name),
                }
              : undefined
          }
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
        />
      </div>
    </div>
  );
}
