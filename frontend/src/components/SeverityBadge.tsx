import type { Severity } from "../types";

type Props = {
  severity: Severity;
};

const config: Record<Severity, { label: string; className: string }> = {
  LOW: {
    label: "Low",
    className: "bg-blue-500/20 border-blue-500/30 text-blue-300",
  },
  MEDIUM: {
    label: "Medium",
    className: "bg-yellow-500/20 border-yellow-500/30 text-yellow-300",
  },
  HIGH: {
    label: "High",
    className: "bg-orange-500/20 border-orange-500/30 text-orange-300",
  },
  CRITICAL: {
    label: "Critical",
    className: "bg-red-500/20 border-red-500/30 text-red-300",
  },
};

export default function SeverityBadge({ severity }: Props) {
  const { label, className } = config[severity];

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium border ${className}`}
    >
      {label}
    </span>
  );
}
