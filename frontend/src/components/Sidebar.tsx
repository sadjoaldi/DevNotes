import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { Bug, Circle, List, Plus, Star, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

type Props = {
  isOpen?: boolean;
  onClose?: () => void;
};

const navItems = [
  { label: "Tous les rapports", path: "/bug-reports", icon: List },
  { label: "Favoris", path: "/bug-reports?isFavorite=true", icon: Star },
];

const statusItems = [
  { label: "Ouverts", value: "OPEN", color: "text-orange-400" },
  { label: "Résolus", value: "RESOLVED", color: "text-emerald-400" },
];

const severityItems = [
  { label: "Critical", value: "CRITICAL", color: "text-red-400" },
  { label: "High", value: "HIGH", color: "text-orange-400" },
  { label: "Medium", value: "MEDIUM", color: "text-yellow-400" },
  { label: "Low", value: "LOW", color: "text-blue-400" },
];

export default function Sidebar({ isOpen, onClose }: Props) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) =>
    location.pathname + location.search === path ||
    location.pathname === path.split("?")[0];

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose?.();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full px-4 py-6 overflow-y-auto">
      {/* Logo */}
      <div className="flex items-center justify-between mb-8">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => handleNavigate("/bug-reports")}
        >
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-600 text-white">
            <Bug className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white leading-none">
              BugLog
            </h1>
            <p className="text-xs text-white/40 mt-0.5">Debug journal</p>
          </div>
        </div>
        {/* Close button mobile */}
        <button
          onClick={onClose}
          className="lg:hidden p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-all"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* New report button */}
      <Button
        onClick={() => handleNavigate("/bug-reports/new")}
        className="w-full mb-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl"
      >
        <Plus className="w-4 h-4 mr-2" />
        Nouveau rapport
      </Button>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 mb-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => handleNavigate(item.path)}
              className={`flex items-center gap-3 px-3 py-2.5 text-xs rounded-xl lg:text-sm transition-all duration-200 ${
                isActive(item.path)
                  ? "bg-white/10 text-white font-medium"
                  : "text-white/50 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </button>
          );
        })}
      </nav>

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
              onClick={() =>
                handleNavigate(`/bug-reports?status=${item.value}`)
              }
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs lg:text-sm text-white/50 hover:bg-white/5 hover:text-white transition-all duration-200"
            >
              <Circle className={`w-2 h-2 fill-current ${item.color}`} />
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
              onClick={() =>
                handleNavigate(`/bug-reports?severity=${item.value}`)
              }
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs lg:text-sm text-white/50 hover:bg-white/5 hover:text-white transition-all duration-200"
            >
              <Circle className={`w-2 h-2 fill-current ${item.color}`} />
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed top-0 left-0 h-screen w-64 bg-gray-900 border-r border-white/5 flex-col z-40">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.25, type: "spring", bounce: 0.1 }}
            className="fixed top-0 left-0 h-screen w-64 bg-gray-900 border-r border-white/5 flex flex-col z-40 lg:hidden"
          >
            {sidebarContent}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
