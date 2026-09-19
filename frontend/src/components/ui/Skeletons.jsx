export function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 animate-pulse" aria-hidden="true">
      <div className="flex items-center justify-between mb-4">
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
        <div className="h-6 w-16 bg-slate-200 dark:bg-slate-700 rounded-full" />
      </div>
      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full mb-2" />
      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/3 mb-4" />
      <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full w-full mb-3" />
      <div className="flex justify-between">
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/4" />
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/4" />
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5 }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-pulse" aria-hidden="true">
      <div className="border-b border-slate-200 dark:border-slate-700 p-4">
        <div className="flex gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-3 bg-slate-200 dark:bg-slate-700 rounded flex-1" />
          ))}
        </div>
      </div>
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="border-b border-slate-100 dark:border-slate-700/50 p-4 last:border-0">
          <div className="flex gap-4">
            {[...Array(5)].map((_, j) => (
              <div key={j} className="h-3 bg-slate-200 dark:bg-slate-700 rounded flex-1" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]" role="status" aria-label="Loading page">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-2 border-slate-200 dark:border-slate-700 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin" />
        <p className="text-sm text-slate-500 dark:text-slate-400">Loading...</p>
      </div>
    </div>
  );
}
