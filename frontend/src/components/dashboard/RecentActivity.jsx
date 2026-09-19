import { Activity, CheckCircle2, PlusCircle, Edit3, Trash2, FolderPlus } from 'lucide-react';
import { formatRelativeTime } from '../../utils/helpers';
import EmptyState from '../common/EmptyState';

export default function RecentActivity({ activity = [] }) {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'task_completed':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'task_created':
        return <PlusCircle className="w-4 h-4 text-blue-500" />;
      case 'project_created':
        return <FolderPlus className="w-4 h-4 text-indigo-500" />;
      case 'task_deleted':
      case 'project_deleted':
        return <Trash2 className="w-4 h-4 text-red-500" />;
      default:
        return <Edit3 className="w-4 h-4 text-amber-500" />;
    }
  };

  const displayList = activity.slice(0, 5);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-4">
        <Activity className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
        Recent Activity
      </h3>

      {displayList.length === 0 ? (
        <EmptyState
          title="No Recent Activity"
          description="Your recent actions will appear here."
        />
      ) : (
        <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
          {displayList.map(item => (
            <div key={item.id} className="relative flex items-start gap-3 text-sm">
              <span className="absolute -left-6 top-0.5 p-0.5 bg-white dark:bg-slate-800 rounded-full">
                {getActivityIcon(item.type)}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-slate-900 dark:text-slate-200 text-xs sm:text-sm font-medium leading-snug">
                  {item.message}
                </p>
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  {formatRelativeTime(item.timestamp)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
