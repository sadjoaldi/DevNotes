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

export default function BugReportCard({
  bugReport,
  onClick,
  onTagClick,
  onTechClick,
}: Props) {
  const preview =
    bugReport.description.length > 100
      ? bugReport.description.slice(0, 100) + "..."
      : bugReport.description;

  const date = new Date(bugReport.updatedAt).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div
      onClick={() => onClick(bugReport.id)}
      className="cursor-pointer rounded-xl border border-white/10 bg-white/5 p-5 hover:border-white/20 hover:bg-white/10 transition-all duration-200"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-base font-semibold text-white truncate">
          {bugReport.title}
        </h2>
        <div className="flex items-center gap-2 shrink-0">
          {bugReport.isFavorite && (
            <span className="text-yellow-400 text-sm">★</span>
          )}
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
        </div>
      </div>

      {/* Description */}
      <p className="mt-2 text-sm text-white/50 leading-relaxed">{preview}</p>

      {/* Footer */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
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
        <span className="text-xs text-white/30">{date}</span>
      </div>
    </div>
  );
}
