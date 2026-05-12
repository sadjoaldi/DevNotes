import type { BugReport } from "../types";
import SeverityBadge from "./SeverityBadge";
import TagBadge from "./TagBadge";
import TechBadge from "./TechBadge";

type Props = {
  bugReport: BugReport;
  onClick: (id: string) => void;
  onTagClick?: (tag: string) => void;
  onTechClick?: (tech: string) => void;
};

const statusConfig = {
  OPEN: {
    label: "Ouvert",
    className: "bg-orange-500/20 border-orange-500/30 text-orange-300",
  },
  RESOLVED: {
    label: "Résolu",
    className: "bg-emerald-500/20 border-emerald-500/30 text-emerald-300",
  },
};

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

export default function BugReportCard({
  bugReport,
  onClick,
  onTagClick,
  onTechClick,
}: Props) {
  const preview =
    bugReport.description.length > 120
      ? bugReport.description.slice(0, 120) + "..."
      : bugReport.description;

  const date = new Date(bugReport.updatedAt).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const { label, className } = statusConfig[bugReport.status];

  return (
    <div
      onClick={() => onClick(bugReport.id)}
      className="group cursor-pointer rounded-2xl border border-white/8 bg-white/3 p-5 hover:border-indigo-500/30 hover:bg-white/6 transition-all duration-200"
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-lg shrink-0">
            {categoryConfig[bugReport.category] ?? "📝"}
          </span>
          <h2 className="text-base font-semibold text-white truncate group-hover:text-indigo-300 transition-colors">
            {bugReport.title}
          </h2>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {bugReport.isFavorite && (
            <span className="text-yellow-400 text-sm">★</span>
          )}
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium border ${className}`}
          >
            {label}
          </span>
          <SeverityBadge severity={bugReport.severity} />
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-white/50 leading-relaxed mb-4 text-left">
        {preview}
      </p>

      {/* Bottom row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-wrap pt-2 gap-3 items-center">
          {bugReport.tags.map((tag) => (
            <TagBadge
              key={tag.id}
              name={tag.name}
              onClick={
                onTagClick
                  ? (e: React.MouseEvent) => {
                      e.stopPropagation();
                      onTagClick(tag.name);
                    }
                  : undefined
              }
            />
          ))}
          {bugReport.technologies.map((tech) => (
            <TechBadge
              key={tech.id}
              name={tech.name}
              onClick={
                onTechClick
                  ? (e: React.MouseEvent) => {
                      e.stopPropagation();
                      onTechClick(tech.name);
                    }
                  : undefined
              }
            />
          ))}
        </div>
        <span className="text-xs text-white/25 shrink-0">{date}</span>
      </div>
    </div>
  );
}
