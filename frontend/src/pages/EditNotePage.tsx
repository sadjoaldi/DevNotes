import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { notesApi } from "../api/notes";
import NoteForm from "../components/NoteForm";
import type { CreateNoteInput, Note } from "../types";

export default function EditNotePage() {
  const { id } = useParams<{ id: string }>();
  const [note, setNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNote = async () => {
      if (!id) return;
      try {
        const data = await notesApi.getById(id);
        setNote(data);
      } catch (error) {
        console.error(error);
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNote();
  }, [id, navigate]);

  const handleSubmit = async (input: CreateNoteInput) => {
    if (!id) return;
    setIsSubmitting(true);
    try {
      await notesApi.update(id, input);
      navigate(`/notes/${id}`);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
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

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={() => navigate(`/notes/${id}`)}
            className="text-sm text-white/40 hover:text-white transition-colors"
          >
            ← Retour
          </button>
          <h1 className="text-lg font-semibold text-white">Modifier la note</h1>
        </div>

        <NoteForm
          initialValue={{
            title: note.title,
            content: note.content,
            tags: note.tags.map((t) => t.name),
          }}
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
        />
      </div>
    </div>
  );
}
