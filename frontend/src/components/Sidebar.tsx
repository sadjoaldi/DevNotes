import { useLocation, useNavigate } from "react-router-dom";

const BugIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className="w-6 h-6"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 3c-1.5 0-3 .8-3 2.5V7H6.5a.5.5 0 0 0 0 1H9v1.5C7 10 5 11.5 5 14v1.5C3.5 16 3 17 3 18h18c0-1-.5-2-2-2V14c0-2.5-2-4-4-4.5V8h2.5a.5.5 0 0 0 0-1H15V5.5C15 3.8 13.5 3 12 3Z"
    />
    <path strokeLinecap="round" d="M9 14h6M9 17h6" />
    <path strokeLinecap="round" d="M5 13H3M21 13h-2M5 16H3M21 16h-2" />
  </svg>
);

const navItems = [
  {
    label: "Tous les rapports",
    path: "/bug-reports",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="w-4 h-4"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
        />
      </svg>
    ),
  },
  {
    label: "Favoris",
    path: "/bug-reports?isFavorite=true",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="w-4 h-4"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
        />
      </svg>
    ),
  },
];

const statusItems = [
  { label: "Ouverts", value: "OPEN", color: "bg-orange-400" },
  { label: "Résolus", value: "RESOLVED", color: "bg-emerald-400" },
];

const severityItems = [
  { label: "Critical", value: "CRITICAL", color: "bg-red-400" },
  { label: "High", value: "HIGH", color: "bg-orange-400" },
  { label: "Medium", value: "MEDIUM", color: "bg-yellow-400" },
  { label: "Low", value: "LOW", color: "bg-blue-400" },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path.split("?")[0];

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-gray-900 border-r border-white/5 flex flex-col px-4 py-6 z-40">
      {/* Logo */}
      <div
        className="flex items-center gap-3 mb-4 cursor-pointer"
        onClick={() => navigate("/bug-reports")}
      >
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-600 text-white">
          <BugIcon />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white leading-none">BugLog</h1>
          <p className="text-xs text-white/40 mt-0.5">Debug journal</p>
        </div>
      </div>

      {/* New report button */}
      <button
        onClick={() => navigate("/bug-reports/new")}
        className="w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-all duration-200 mb-6"
      >
        + Nouveau rapport
      </button>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 mb-6">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
              isActive(item.path)
                ? "bg-white/10 text-white font-medium"
                : "text-white/50 hover:bg-white/5 hover:text-white"
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

      {/* Divider */}
      <div className="border-t border-white/5 mb-6" />

      {/* Status filter */}
      <div className="mb-6">
        <p className="text-xs font-semibold text-white/30 uppercase tracking-wider mb-3 px-1">
          Statut
        </p>
        <div className="flex flex-col gap-1">
          {statusItems.map((item) => (
            <button
              key={item.value}
              onClick={() => navigate(`/bug-reports?status=${item.value}`)}
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-white/50 hover:bg-white/5 hover:text-white transition-all duration-200"
            >
              <span className={`w-2 h-2 rounded-full ${item.color}`} />
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Severity filter */}
      <div>
        <p className="text-xs font-semibold text-white/30 uppercase tracking-wider mb-3 px-1">
          Sévérité
        </p>
        <div className="flex flex-col gap-1">
          {severityItems.map((item) => (
            <button
              key={item.value}
              onClick={() => navigate(`/bug-reports?severity=${item.value}`)}
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-white/50 hover:bg-white/5 hover:text-white transition-all duration-200"
            >
              <span className={`w-2 h-2 rounded-full ${item.color}`} />
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
