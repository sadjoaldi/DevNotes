type Props = {
  name: string;
  onClick?: (e: React.MouseEvent) => void;
  active?: boolean;
};

export default function TagBadge({ name, onClick, active }: Props) {
  return (
    <span
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-xs font-medium border transition-all duration-200 ${
        onClick ? "cursor-pointer" : ""
      } ${
        active
          ? "bg-indigo-500/40 border-indigo-400/50 text-indigo-200"
          : "bg-indigo-500/20 border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/30"
      }`}
    >
      #{name}
    </span>
  );
}
