import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import EditNotePage from "./pages/EditNotePage";
import NoteDetailPage from "./pages/NoteDetailPage";
import NoteFoundPage from "./pages/NoteFoundPage";
import NotesPage from "./pages/NotesPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/notes" replace />} />
        <Route path="/notes" element={<NotesPage />} />
        <Route path="/notes/new" element={<EditNotePage />} />
        <Route path="/notes/:id" element={<NoteDetailPage />} />
        <Route path="/notes/:id/edit" element={<EditNotePage />} />
        <Route path="*" element={<NoteFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
