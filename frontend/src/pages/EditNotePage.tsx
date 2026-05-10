import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { notesApi } from "../api/bugReports";
import NoteForm from "../components/NoteForm";
import { useToast } from "../context/ToastContext";
import type { CreateNoteInput, Note } from "../types";

export default function EditNotePage() {
  const { id } = useParams<{ id: string }>();
  const [note, setNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchNote = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-white/30 text-sm">Chargement...</p>
      </div>
    );
  }

  const handleSubmit = async (input: CreateNoteInput) => {
    setIsSubmitting(true);
    try {
      if (isEditMode) {
        await notesApi.update(id, input);
        showToast("Note mise à jour avec succès.", "success");
        navigate(`/notes/${id}`);
      } else {
        const note = await notesApi.create(input);
        showToast("Note créée avec succès.", "success");
        navigate(`/notes/${note.id}`);
      }
    } catch (error) {
      showToast("Erreur lors de la création de la note", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEditMode = !!id && !!note;

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={() => navigate(isEditMode ? `/notes/${id}` : "/notes")}
            className="text-sm text-white/40 hover:text-white transition-colors"
          >
            ← Retour
          </button>
          <h1 className="text-lg font-semibold text-white">
            {isEditMode ? "Modifier la note" : "Nouvelle note"}
          </h1>
        </div>

        <NoteForm
          initialValue={
            isEditMode
              ? {
                  title: note.title,
                  content: note.content,
                  tags: note.tags.map((t) => t.name),
                }
              : undefined
          }
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
        />
      </div>
    </div>
  );
}
