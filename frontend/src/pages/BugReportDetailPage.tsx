import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { bugReportsApi } from "../api/bugReports";
import SeverityBadge from "../components/SeverityBadge";
import TagBadge from "../components/TagBadge";
import TechBadge from "../components/TechBadge";
import { useToast } from "../context/ToastContext";
import type { BugReport } from "../types";

export default function BugReportDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [bugReport, setBugReport] = useState<BugReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { showToast } = useToast();
  const snippetRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const fetchBugReport = async () => {
      if (!id) return;
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

  useEffect(() => {
    if (bugReport?.snippet && snippetRef.current) {
      snippetRef.current.removeAttribute("data-highlighted");
      snippetRef.current.textContent = bugReport.snippet;
      hljs.highlightElement(snippetRef.current);
    }
  }, [bugReport]);

  const handleDelete = async () => {
    if (!id || !confirm("Supprimer ce rapport ?")) return;
    try {
      await bugReportsApi.delete(id);
      showToast("Rapport supprimé.", "success");
      navigate("/");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      showToast("Impossible de supprimer le rapport.", "error");
    }
  };

  const handleToggleFavorite = async () => {
    if (!id) return;
    try {
      const updated = await bugReportsApi.toggleFavorite(id);
      setBugReport(updated);
      showToast(
        updated.isFavorite ? "Ajouté aux favoris." : "Retiré des favoris.",
        "success",
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      showToast("Impossible de modifier le favori.", "error");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-white/30 text-sm">Chargement...</p>
      </div>
    );
  }

  if (!bugReport) return null;

  const date = new Date(bugReport.updatedAt).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="text-sm text-white/40 hover:text-white transition-colors"
          >
            ← Retour
          </button>
          <div className="flex gap-3">
            <button
              onClick={handleToggleFavorite}
              className={`rounded-xl border px-4 py-2 text-sm transition-all duration-200 ${
                bugReport.isFavorite
                  ? "border-yellow-500/30 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20"
                  : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              {bugReport.isFavorite ? "★ Favori" : "☆ Favori"}
            </button>
            <button
              onClick={() => navigate(`/bug-reports/${id}/edit`)}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/60 hover:bg-white/10 hover:text-white transition-all duration-200"
            >
              Modifier
            </button>
            <button
              onClick={handleDelete}
              className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-400 hover:bg-red-500/20 transition-all duration-200"
            >
              Supprimer
            </button>
          </div>
        </div>

        {/* Title & meta */}
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium border ${
              bugReport.status === "RESOLVED"
                ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-300"
                : "bg-orange-500/20 border-orange-500/30 text-orange-300"
            }`}
          >
            {bugReport.status === "RESOLVED" ? "Résolu" : "Ouvert"}
          </span>
          <SeverityBadge severity={bugReport.severity} />
          <span className="rounded-full px-2.5 py-0.5 text-xs font-medium border border-white/10 bg-white/5 text-white/50">
            {bugReport.category}
          </span>
        </div>

        <h1 className="text-3xl font-bold text-white">{bugReport.title}</h1>
        <p className="mt-2 text-xs text-white/30">Modifié le {date}</p>

        {/* Tags & Technologies */}
        <div className="mt-4 flex flex-wrap gap-2">
          {bugReport.tags.map((tag) => (
            <TagBadge key={tag.id} name={tag.name} />
          ))}
          {bugReport.technologies.map((tech) => (
            <TechBadge key={tech.id} name={tech.name} />
          ))}
        </div>

        {/* Sections */}
        <div className="mt-8 flex flex-col gap-5">
          {/* Description */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">
              Description
            </h2>
            <p className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap">
              {bugReport.description}
            </p>
          </div>

          {/* Cause */}
          <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-6">
            <h2 className="text-xs font-semibold text-orange-400/70 uppercase tracking-wider mb-3">
              Cause
            </h2>
            <p className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap">
              {bugReport.cause}
            </p>
          </div>

          {/* Solution */}
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-6">
            <h2 className="text-xs font-semibold text-emerald-400/70 uppercase tracking-wider mb-3">
              Solution
            </h2>
            <p className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap">
              {bugReport.solution}
            </p>
          </div>

          {/* Snippet */}
          {bugReport.snippet && (
            <div className="rounded-xl border border-white/10 overflow-hidden">
              <div className="px-4 py-2 border-b border-white/10 bg-white/5">
                <h2 className="text-xs font-semibold text-white/40 uppercase tracking-wider">
                  Snippet
                </h2>
              </div>
              <pre className="p-4 text-sm overflow-auto">
                <code ref={snippetRef} />
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
