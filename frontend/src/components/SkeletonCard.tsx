import { motion } from "framer-motion";

export default function SkeletonCard() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-2xl border border-white/8 bg-white/3 p-5"
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-2 flex-1">
          <div className="w-7 h-7 rounded-lg bg-white/5 animate-pulse shrink-0" />
          <div className="h-4 bg-white/5 animate-pulse rounded-lg flex-1 max-w-xs" />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="h-5 w-16 bg-white/5 animate-pulse rounded-full" />
          <div className="h-5 w-14 bg-white/5 animate-pulse rounded-full" />
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2 mb-4">
        <div className="h-3 bg-white/5 animate-pulse rounded-lg w-full" />
        <div className="h-3 bg-white/5 animate-pulse rounded-lg w-3/4" />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <div className="h-5 w-16 bg-white/5 animate-pulse rounded-full" />
          <div className="h-5 w-20 bg-white/5 animate-pulse rounded-full" />
        </div>
        <div className="h-3 w-20 bg-white/5 animate-pulse rounded-lg" />
      </div>
    </motion.div>
  );
}
