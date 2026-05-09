import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-4">
      <p className="text-6xl font-bold text-white/10">404</p>
      <h1 className="text-xl font-semibold text-white">Page introuvable</h1>
      <p className="text-sm text-white/40">
        Cette page n'existe pas ou a été déplacée.
      </p>
      <button
        onClick={() => navigate("/notes")}
        className="mt-4 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-all duration-200"
      >
        Retour aux notes
      </button>
    </div>
  );
}
