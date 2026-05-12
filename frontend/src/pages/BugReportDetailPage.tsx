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

const categoryConfig: Record<string, string> = {
  UI: "🎨",
  BACKEND: "⚙️",
  DATABASE: "🗄️",
  API: "🔌",
  PERFORMANCE: "⚡",
  SECURITY: "🔒",
  OTHER: "📝",
  FRONTEND: "🖥️",
  AUTHENTICATION: "🔑",
  DEPLOYMENT: "🚀",
  DEVOPS: "🛠️",
  TESTING: "🧪",
};

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
      <div className="flex items-center justify-center py-20">
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
    <div className="max-w-6xl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Retour
        </button>
        <div className="flex gap-2">
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
            ✎ Modifier
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
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-2xl">
            {categoryConfig[bugReport.category] ?? "📝"}
          </span>
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
          <span className="rounded-full px-2.5 py-0.5 text-xs font-medium border border-white/10 bg-white/5 text-white/40">
            {bugReport.category}
          </span>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">
          {bugReport.title}
        </h1>
        <p className="text-xs text-white/30">Modifié le {date}</p>
      </div>

      {/* Tags & Technologies */}
      {(bugReport.tags.length > 0 || bugReport.technologies.length > 0) && (
        <div className="flex flex-wrap gap-2 mb-6">
          {bugReport.tags.map((tag) => (
            <TagBadge key={tag.id} name={tag.name} />
          ))}
          {bugReport.technologies.map((tech) => (
            <TechBadge key={tech.id} name={tech.name} />
          ))}
        </div>
      )}

      {/* Sections */}
      <div className="flex flex-col gap-4">
        {/* Description */}
        <div className="rounded-2xl border border-white/8 bg-white/3 p-6">
          <h2 className="text-xs font-semibold text-white/30 uppercase tracking-wider mb-3">
            📋 Description
          </h2>
          <p className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap">
            {bugReport.description}
          </p>
        </div>

        {/* Cause */}
        <div className="rounded-2xl border border-orange-500/20 bg-orange-500/5 p-6">
          <h2 className="text-xs font-semibold text-orange-400/60 uppercase tracking-wider mb-3">
            🔍 Cause
          </h2>
          <p className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap">
            {bugReport.cause}
          </p>
        </div>

        {/* Solution */}
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
          <h2 className="text-xs font-semibold text-emerald-400/60 uppercase tracking-wider mb-3">
            ✅ Solution
          </h2>
          <p className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap">
            {bugReport.solution}
          </p>
        </div>

        {/* Snippet */}
        {bugReport.snippet && (
          <div className="rounded-2xl border border-white/8 overflow-hidden">
            <div className="px-5 py-3 border-b border-white/8 bg-white/3 flex items-center gap-2">
              <span className="text-xs font-semibold text-white/30 uppercase tracking-wider">
                💻 Snippet
              </span>
              <div className="ml-auto flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500/50" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/50" />
              </div>
            </div>
            <pre className="p-5 text-sm overflow-auto">
              <code ref={snippetRef} />
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
