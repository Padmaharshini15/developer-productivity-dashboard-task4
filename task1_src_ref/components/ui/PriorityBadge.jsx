const PRIORITY_STYLES = {
  'Low': 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
  'Medium': 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
  'High': 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
};

const PRIORITY_DOTS = {
  'Low': 'bg-slate-400',
  'Medium': 'bg-amber-500',
  'High': 'bg-red-500',
};

export default function PriorityBadge({ priority }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${PRIORITY_STYLES[priority] || 'bg-gray-100 text-gray-700'}`}
      aria-label={`Priority: ${priority}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${PRIORITY_DOTS[priority] || 'bg-gray-400'}`} />
      {priority}
    </span>
  );
}
