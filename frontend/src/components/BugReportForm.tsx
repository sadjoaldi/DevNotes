import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";
import { useEffect, useRef, useState } from "react";
import type {
  Category,
  CreateBugReportInput,
  Severity,
  Status,
} from "../types";
import Select from "./Select";
import TagBadge from "./TagBadge";
import TechBadge from "./TechBadge";

type Props = {
  initialValues?: {
    title: string;
    description: string;
    cause: string;
    solution: string;
    snippet?: string;
    category?: Category;
    severity?: Severity;
    status?: Status;
    tags: string[];
    technologies: string[];
    duration?: string;
  };
  onSubmit: (input: CreateBugReportInput) => void;
  isLoading?: boolean;
};

const CATEGORY_OPTIONS = [
  { value: "UI", label: "🎨 UI" },
  { value: "FRONTEND", label: "🖥️ Frontend" },
  { value: "BACKEND", label: "⚙️ Backend" },
  { value: "DATABASE", label: "🗄️ Database" },
  { value: "API", label: "🔌 API" },
  { value: "PERFORMANCE", label: "⚡ Performance" },
  { value: "SECURITY", label: "🔒 Security" },
  { value: "AUTHENTICATION", label: "🔑 Authentication" },
  { value: "DEPLOYMENT", label: "🚀 Deployment" },
  { value: "DEVOPS", label: "🛠️ DevOps" },
  { value: "TESTING", label: "🧪 Testing" },
  { value: "OTHER", label: "📝 Other" },
] as const;

const SEVERITY_OPTIONS = [
  { value: "LOW", label: "🔵 Low" },
  { value: "MEDIUM", label: "🟡 Medium" },
  { value: "HIGH", label: "🟠 High" },
  { value: "CRITICAL", label: "🔴 Critical" },
] as const;

const STATUS_OPTIONS = [
  { value: "OPEN", label: "🟠 Ouvert" },
  { value: "RESOLVED", label: "🟢 Résolu" },
] as const;

export default function BugReportForm({
  initialValues,
  onSubmit,
  isLoading,
}: Props) {
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [description, setDescription] = useState(
    initialValues?.description ?? "",
  );
  const [cause, setCause] = useState(initialValues?.cause ?? "");
  const [solution, setSolution] = useState(initialValues?.solution ?? "");
  const [snippet, setSnippet] = useState(initialValues?.snippet ?? "");
  const [category, setCategory] = useState<Category>(
    initialValues?.category ?? "OTHER",
  );
  const [severity, setSeverity] = useState<Severity>(
    initialValues?.severity ?? "MEDIUM",
  );
  const [status, setStatus] = useState<Status>(initialValues?.status ?? "OPEN");
  const [tags, setTags] = useState<string[]>(initialValues?.tags ?? []);
  const [technologies, setTechnologies] = useState<string[]>(
    initialValues?.technologies ?? [],
  );
  const [tagInput, setTagInput] = useState("");
  const [techInput, setTechInput] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const snippetRef = useRef<HTMLElement>(null);
  const [duration, setDuration] = useState(initialValues?.duration ?? " ");

  useEffect(() => {
    if (showPreview && snippetRef.current && snippet) {
      snippetRef.current.removeAttribute("data-highlighted");
      snippetRef.current.textContent = snippet;
      hljs.highlightElement(snippetRef.current);
    }
  }, [showPreview, snippet]);

  const handleAddTag = () => {
    const newTags = tagInput
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t && !tags.includes(t));
    if (newTags.length > 0) setTags([...tags, ...newTags]);
    setTagInput("");
  };

  const handleAddTech = () => {
    const newTechs = techInput
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t && !technologies.includes(t));
    if (newTechs.length > 0) setTechnologies([...technologies, ...newTechs]);
    setTechInput("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !title.trim() ||
      !description.trim() ||
      !cause.trim() ||
      !solution.trim()
    )
      return;
    onSubmit({
      title,
      description,
      cause,
      solution,
      snippet: snippet || undefined,
      category,
      severity,
      status,
      tags,
      technologies,
      duration,
    });
  };

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all duration-200";
  const labelClass = "text-sm  font-medium text-white/60";
  const sectionClass = "flex flex-col gap-2";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Title */}
      <div className={sectionClass}>
        <label className={labelClass}>
          Titre <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ex: TypeError: Cannot read properties of undefined"
          className={inputClass}
        />
      </div>

      {/* Description */}
      <div className={sectionClass}>
        <label className={labelClass}>
          Description <span className="text-red-400">*</span>
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Décris le comportement observé..."
          rows={3}
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* Cause */}
      <div className={sectionClass}>
        <label className={labelClass}>
          Cause <span className="text-red-400">*</span>
        </label>
        <textarea
          value={cause}
          onChange={(e) => setCause(e.target.value)}
          placeholder="Quelle était la cause racine ?"
          rows={3}
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* Solution */}
      <div className={sectionClass}>
        <label className={labelClass}>
          Solution <span className="text-red-400">*</span>
        </label>
        <textarea
          value={solution}
          onChange={(e) => setSolution(e.target.value)}
          placeholder="Comment l'as-tu résolu ?"
          rows={3}
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* Duration */}
      <div className={sectionClass}>
        <label className={labelClass}>Durée de résolution</label>
        <input
          type="text"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          placeholder="Ex: 2h30, 45min, 3 jours..."
          className={inputClass}
        />
      </div>

      {/* Snippet */}
      <div className={sectionClass}>
        <div className="flex items-center justify-between">
          <label className={labelClass}>Snippet</label>
          {snippet && (
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              {showPreview ? "✎ Éditer" : "👁 Prévisualiser"}
            </button>
          )}
        </div>
        {showPreview && snippet ? (
          <div className="rounded-xl overflow-auto border border-white/10">
            <pre className="p-4 text-sm">
              <code ref={snippetRef} />
            </pre>
          </div>
        ) : (
          <textarea
            value={snippet}
            onChange={(e) => setSnippet(e.target.value)}
            placeholder="Colle ton snippet de code ici..."
            rows={5}
            className={`${inputClass} resize-none font-mono`}
          />
        )}
      </div>

      {/* Category / Severity / Status */}
      <div className="grid grid-cols-3 gap-4">
        <Select
          label="Catégorie"
          value={category}
          onChange={setCategory}
          options={
            CATEGORY_OPTIONS as unknown as { value: Category; label: string }[]
          }
        />
        <Select
          label="Sévérité"
          value={severity}
          onChange={setSeverity}
          options={
            SEVERITY_OPTIONS as unknown as { value: Severity; label: string }[]
          }
        />
        <Select
          label="Statut"
          value={status}
          onChange={setStatus}
          options={
            STATUS_OPTIONS as unknown as { value: Status; label: string }[]
          }
        />
      </div>

      {/* Tags */}
      <div className={sectionClass}>
        <label className={labelClass}>Tags</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddTag();
              }
            }}
            placeholder="Ajouter un tag..."
            className={inputClass}
          />
          <button
            type="button"
            onClick={handleAddTag}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/60 hover:bg-white/10 hover:text-white transition-all duration-200 shrink-0"
          >
            Ajouter
          </button>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-1">
            {tags.map((tag) => (
              <div key={tag} className="flex items-center gap-1">
                <TagBadge name={tag} />
                <button
                  type="button"
                  onClick={() => setTags(tags.filter((t) => t !== tag))}
                  className="text-white/30 hover:text-white/70 transition-colors text-xs"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Technologies */}
      <div className={sectionClass}>
        <label className={labelClass}>Technologies</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddTech();
              }
            }}
            placeholder="Ajouter une techno..."
            className={inputClass}
          />
          <button
            type="button"
            onClick={handleAddTech}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/60 hover:bg-white/10 hover:text-white transition-all duration-200 shrink-0"
          >
            Ajouter
          </button>
        </div>
        {technologies.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-1">
            {technologies.map((tech) => (
              <div key={tech} className="flex items-center gap-1">
                <TechBadge name={tech} />
                <button
                  type="button"
                  onClick={() =>
                    setTechnologies(technologies.filter((t) => t !== tech))
                  }
                  className="text-white/30 hover:text-white/70 transition-colors text-xs"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={
          isLoading ||
          !title.trim() ||
          !description.trim() ||
          !cause.trim() ||
          !solution.trim()
        }
        className="mt-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
      >
        {isLoading
          ? "Enregistrement..."
          : initialValues
            ? "Mettre à jour"
            : "Créer le rapport"}
      </button>
    </form>
  );
}
