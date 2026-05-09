import type { Note } from "../types";
import TagBadge from "./TagBadge";

type NoteCardProps = {
  note: Note;
  onClick: (id: string) => void;
  onTagClick?: (tag: string) => void;
};

export default function NoteCard({ note, onClick, onTagClick }: NoteCardProps) {
  const preview =
    note.content.length > 120
      ? note.content.slice(0, 120) + "..."
      : note.content;

  const date = new Date(note.updatedAt).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div
      onClick={() => onClick(note.id)}
      className="cursor-pointer rounded-xl border border-while/10 bg-white/5 p-5 hover:border-white/20 hover:bg-white/10 transition-all duration-200"
    >
      <h2 className="text-lg font-semibold text-white truncate">
        {note.title}{" "}
      </h2>
      <p className="mt-2 text-sm text-white/50 leading-relaxed">{preview}</p>
      <div className="flex flex-wrap gap-2">
        {note.tags.map((tag) => (
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
        <span className="text-xs text-white/30">{date}</span>
      </div>
    </div>
  );
}
