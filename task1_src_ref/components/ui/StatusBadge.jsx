const STATUS_STYLES = {
  'Todo': 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
  'In Progress': 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
  'Completed': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300',
  'Active': 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
  'On Hold': 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
};

export default function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[status] || 'bg-gray-100 text-gray-700'}`}
      role="status"
      aria-label={`Status: ${status}`}
    >
      {status}
    </span>
  );
}
