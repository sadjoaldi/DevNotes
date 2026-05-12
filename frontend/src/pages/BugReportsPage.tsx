import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { bugReportsApi } from "../api/bugReports";
import BugReportCard from "../components/BugReportCard";
import SearchBar from "../components/SearchBar";
import { useToast } from "../context/ToastContext";
import type { BugReport, BugReportsFilter } from "../types";

export default function BugReportsPage() {
  const [bugReports, setBugReports] = useState<BugReport[]>([]);
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();

  const filters: BugReportsFilter = {
    status:
      (searchParams.get("status") as BugReportsFilter["status"]) || undefined,
    severity:
      (searchParams.get("severity") as BugReportsFilter["severity"]) ||
      undefined,
    isFavorite: searchParams.get("isFavorite") === "true" ? true : undefined,
  };

  useEffect(() => {
    const fetchBugReports = async () => {
      setIsLoading(true);
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
  }, [searchParams]);

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

  const getPageTitle = () => {
    if (filters.isFavorite) return "Favoris";
    if (filters.status === "OPEN") return "Rapports ouverts";
    if (filters.status === "RESOLVED") return "Rapports résolus";
    if (filters.severity) return `Sévérité : ${filters.severity}`;
    return "Tous les rapports";
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">{getPageTitle()}</h2>
          <p className="text-sm text-white/40 mt-1">
            {filtered.length} rapport{filtered.length > 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
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
        <div className="flex items-center justify-center py-20">
          <p className="text-white/30 text-sm">Chargement...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <p className="text-4xl">🐛</p>
          <p className="text-white/30 text-sm">
            {search || selectedTag || selectedTech
              ? "Aucun rapport trouvé."
              : "Aucun rapport pour le moment."}
          </p>
          <button
            onClick={() => navigate("/bug-reports/new")}
            className="mt-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-all duration-200"
          >
            + Créer un rapport
          </button>
        </div>
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
  );
}
