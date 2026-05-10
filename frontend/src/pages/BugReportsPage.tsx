import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { bugReportsApi } from "../api/bugReports";
import BugReportCard from "../components/BugReportCard";
import SearchBar from "../components/SearchBar";
import { useToast } from "../context/ToastContext";
import type { BugReport, BugReportsFilter, Severity, Status } from "../types";

export default function BugReportsPage() {
  const [bugReports, setBugReports] = useState<BugReport[]>([]);
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const [filters, setFilters] = useState<BugReportsFilter>({});
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchBugReports = async () => {
      try {
        const data = await bugReportsApi.getAll(filters);
        setBugReports(data);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_) {
        showToast("Impossible de charger les rapports.", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBugReports();
  }, [filters]);

  const filtered = bugReports.filter((bug) => {
    const matchesSearch =
      bug.title.toLowerCase().includes(search.toLowerCase()) ||
      bug.description.toLowerCase().includes(search.toLowerCase()) ||
      bug.tags.some((t) => t.name.toLowerCase().includes(search.toLowerCase()));

    const matchesTag = selectedTag
      ? bug.tags.some((t) => t.name === selectedTag)
      : true;

    const matchesTech = selectedTech
      ? bug.technologies.some((t) => t.name === selectedTech)
      : true;

    return matchesSearch && matchesTag && matchesTech;
  });

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">BubDebug</h1>
            <p className="text-sm text-white/40 mt-1">
              Ta mémoire technique personnelle
            </p>
          </div>
          <button
            onClick={() => navigate("/bug-reports/new")}
            className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-all duration-200"
          >
            + Nouveau rapport
          </button>
        </div>

        {/* Filters */}
        <div className="mb-4 flex flex-wrap gap-2">
          {(["OPEN", "RESOLVED"] as Status[]).map((s) => (
            <button
              key={s}
              onClick={() =>
                setFilters((f) => ({
                  ...f,
                  status: f.status === s ? undefined : s,
                }))
              }
              className={`rounded-full px-3 py-1 text-xs font-medium border transition-all duration-200 ${
                filters.status === s
                  ? "bg-indigo-500/40 border-indigo-400/50 text-indigo-200"
                  : "border-white/10 bg-white/5 text-white/50 hover:bg-white/10"
              }`}
            >
              {s === "OPEN" ? "Ouvert" : "Résolu"}
            </button>
          ))}
          {(["LOW", "MEDIUM", "HIGH", "CRITICAL"] as Severity[]).map((s) => (
            <button
              key={s}
              onClick={() =>
                setFilters((f) => ({
                  ...f,
                  severity: f.severity === s ? undefined : s,
                }))
              }
              className={`rounded-full px-3 py-1 text-xs font-medium border transition-all duration-200 ${
                filters.severity === s
                  ? "bg-indigo-500/40 border-indigo-400/50 text-indigo-200"
                  : "border-white/10 bg-white/5 text-white/50 hover:bg-white/10"
              }`}
            >
              {s}
            </button>
          ))}
          <button
            onClick={() =>
              setFilters((f) => ({
                ...f,
                isFavorite: f.isFavorite ? undefined : true,
              }))
            }
            className={`rounded-full px-3 py-1 text-xs font-medium border transition-all duration-200 ${
              filters.isFavorite
                ? "bg-yellow-500/40 border-yellow-400/50 text-yellow-200"
                : "border-white/10 bg-white/5 text-white/50 hover:bg-white/10"
            }`}
          >
            ★ Favoris
          </button>
        </div>

        {/* Search */}
        <div className="mb-4">
          <SearchBar value={search} onChange={setSearch} />
        </div>

        {/* Active tag/tech filters */}
        {(selectedTag || selectedTech) && (
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="text-sm text-white/40">Filtré par :</span>
            {selectedTag && (
              <span
                onClick={() => setSelectedTag(null)}
                className="cursor-pointer rounded-full bg-indigo-500/40 border border-indigo-400/50 text-indigo-200 px-3 py-1 text-xs font-medium"
              >
                #{selectedTag} ✕
              </span>
            )}
            {selectedTech && (
              <span
                onClick={() => setSelectedTech(null)}
                className="cursor-pointer rounded-full bg-emerald-500/40 border border-emerald-400/50 text-emerald-200 px-3 py-1 text-xs font-medium"
              >
                {selectedTech} ✕
              </span>
            )}
          </div>
        )}

        {/* Bug reports */}
        {isLoading ? (
          <p className="text-center text-white/30 text-sm">Chargement...</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-white/30 text-sm">
            {search ||
            selectedTag ||
            selectedTech ||
            Object.keys(filters).length > 0
              ? "Aucun rapport trouvé."
              : "Aucun rapport pour le moment."}
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((bug) => (
              <BugReportCard
                key={bug.id}
                bugReport={bug}
                onClick={(id) => navigate(`/bug-reports/${id}`)}
                onTagClick={(tag) => setSelectedTag(tag)}
                onTechClick={(tech) => setSelectedTech(tech)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
