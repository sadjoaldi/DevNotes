type Props = {
  name: string;
  onClick?: () => void;
  active?: boolean;
};

export default function TechBadge({ name, onClick, active }: Props) {
  return (
    <span
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-xs font-medium border transition-all duration-200 ${
        onClick ? "cursor-pointer" : ""
      } ${
        active
          ? "bg-emerald-500/40 border-emerald-400/50 text-emerald-200"
          : "bg-emerald-500/20 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/30"
      }`}
    >
      {name}
    </span>
  );
}
