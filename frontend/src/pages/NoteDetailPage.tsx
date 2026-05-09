import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { notesApi } from "../api/notes";
import TagBadge from "../components/TagBadge";
import { useToast } from "../context/ToastContext";
import type { Note } from "../types";

export default function NoteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [note, setNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchNote = async () => {
      if (!id) return;
      try {
        const data = await notesApi.getById(id);
        setNote(data);
      } catch (error) {
        showToast("Erreur lors du chargement de la note", "error");
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNote();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!id || !confirm("Supprimer cette note ?")) return;
    try {
      await notesApi.delete(id);
      showToast("Note supprimée avec succès.", "success");
      navigate("/");
    } catch (error) {
      showToast("Erreur lors de la suppression de la note", "error");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-white/30 text-sm">Chargement...</p>
      </div>
    );
  }

  if (!note) return null;

  const date = new Date(note.updatedAt).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="text-sm text-white/40 hover:text-white transition-colors"
          >
            ← Retour
          </button>
          <div className="flex gap-3">
            <button
              onClick={() => navigate(`/notes/${id}/edit`)}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/60 hover:bg-white/10 hover:text-white transition-all duration-200"
            >
              Modifier
            </button>
            <button
              onClick={handleDelete}
              className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-400 hover:bg-red-500/20 transition-all duration-200"
            >
              Supprimer
            </button>
          </div>
        </div>

        {/* Note */}
        <h1 className="text-3xl font-bold text-white">{note.title}</h1>
        <p className="mt-2 text-xs text-white/30">Modifié le {date}</p>

        {/* Tags */}
        {note.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {note.tags.map((tag) => (
              <TagBadge key={tag.id} name={tag.name} />
            ))}
          </div>
        )}

        {/* Content */}
        <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-6">
          <p className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap">
            {note.content}
          </p>
        </div>
      </div>
    </div>
  );
}
