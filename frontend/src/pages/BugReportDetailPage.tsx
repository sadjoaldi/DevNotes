/* eslint-disable @typescript-eslint/no-unused-vars */
import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Copy,
  Pencil,
  Star,
  Trash2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { bugReportsApi } from "../api/bugReports";
import ConfirmDialog from "../components/ConfirmDialog";
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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchBugReport = async () => {
      if (!id) return;
      try {
        const data = await bugReportsApi.getById(id);
        setBugReport(data);
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

  //handleCopySnippet
  const handleCopy = async () => {
    if (!bugReport?.snippet) return;
    try {
      await navigator.clipboard.writeText(bugReport.snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (_) {
      showToast("Impossible de copier le snippet.", "error");
    }
  };

  // handleDelete
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await bugReportsApi.delete(id!);
      showToast("Rapport supprimé.", "success");
      navigate("/");
    } catch (_) {
      showToast("Impossible de supprimer le rapport.", "error");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };
  // handleToggleFavorite
  const handleToggleFavorite = async () => {
    if (!id) return;
    setIsTogglingFavorite(true);
    try {
      const updated = await bugReportsApi.toggleFavorite(id);
      setBugReport(updated);
      showToast(
        updated.isFavorite ? "Ajouté aux favoris." : "Retiré des favoris.",
        "success",
      );
    } catch (_) {
      showToast("Impossible de modifier le favori.", "error");
    } finally {
      setIsTogglingFavorite(false);
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
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="max-w-3xl"
    >
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="text-white/40 hover:text-white gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleToggleFavorite}
            disabled={isTogglingFavorite}
            className={`gap-2 ${
              bugReport.isFavorite
                ? "border-yellow-500/30 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20"
                : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
            }`}
          >
            {isTogglingFavorite ? (
              <Spinner />
            ) : (
              <Star
                className={`w-4 h-4 ${bugReport.isFavorite ? "fill-yellow-400" : ""}`}
              />
            )}
            {bugReport.isFavorite ? "Favori" : "Favori"}
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate(`/bug-reports/${id}/edit`)}
            className="gap-2 border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white cursor-pointer"
          >
            <Pencil className="w-4 h-4" />
            Modifier
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowDeleteDialog(true)}
            className="gap-2 border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/50 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            Supprimer
          </Button>
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
        <div className="flex items-center gap-4">
          <p className="text-xs text-white/30">Modifié le {date}</p>
          {bugReport.duration && (
            <div className="flex items-center gap-1.5 text-xs text-white/30">
              <Clock className="w-3 h-3" />
              {bugReport.duration}
            </div>
          )}
        </div>
      </div>

      {/* Tags & Technologies */}
      {(bugReport.tags.length > 0 || bugReport.technologies.length > 0) && (
        <div className="flex flex-wrap gap-2 mb-8">
          {bugReport.tags.map((tag) => (
            <TagBadge key={tag.id} name={tag.name} />
          ))}
          {bugReport.tags.length > 0 && bugReport.technologies.length > 0 && (
            <span className="w-px h-4 bg-white/10 mx-1 self-center" />
          )}
          {bugReport.technologies.map((tech) => (
            <TechBadge key={tech.id} name={tech.name} />
          ))}
        </div>
      )}

      {/* Sections */}
      <div className="flex flex-col gap-4">
        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-white/8 bg-white/3 p-6"
        >
          <h2 className="text-xs font-semibold text-white/30 uppercase tracking-wider mb-3">
            📋 Description
          </h2>
          <p className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap">
            {bugReport.description}
          </p>
        </motion.div>

        {/* Cause */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl border border-orange-500/20 bg-orange-500/5 p-6"
        >
          <h2 className="text-xs font-semibold text-orange-400/60 uppercase tracking-wider mb-3">
            🔍 Cause
          </h2>
          <p className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap">
            {bugReport.cause}
          </p>
        </motion.div>

        {/* Solution */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6"
        >
          <h2 className="text-xs font-semibold text-emerald-400/60 uppercase tracking-wider mb-3">
            ✅ Solution
          </h2>
          <p className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap">
            {bugReport.solution}
          </p>
        </motion.div>

        {/* Snippet */}
        {bugReport.snippet && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="rounded-2xl border border-white/8 overflow-hidden"
          >
            <div className="px-5 py-3 border-b border-white/8 bg-white/3 flex items-center gap-2">
              <span className="text-xs font-semibold text-white/30 uppercase tracking-wider">
                💻 Snippet
              </span>
              <div className="ml-auto flex items-center gap-3">
                <button
                  onClick={handleCopy}
                  className="flex items-center cursor-pointer gap-1.5 text-xs text-white/30 hover:text-white/70 transition-colors"
                >
                  {copied ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copié !</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copier
                    </>
                  )}
                </button>
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-500/50" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500/50" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/50" />
                </div>
              </div>
            </div>
            <pre className="p-5 text-sm overflow-auto">
              <code ref={snippetRef} />
            </pre>
          </motion.div>
        )}
      </div>
      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Supprimer ce rapport ?"
        description="Cette action est irréversible. Le rapport sera définitivement supprimé."
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteDialog(false)}
        isLoading={isDeleting}
      />
    </motion.div>
  );
}
