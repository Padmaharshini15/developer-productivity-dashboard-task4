import { Link } from 'react-router-dom';
import { Calendar, Clock, AlertCircle, ArrowRight } from 'lucide-react';
import PriorityBadge from '../ui/PriorityBadge';
import StatusBadge from '../ui/StatusBadge';
import EmptyState from '../common/EmptyState';
import { getDaysUntilDue, getDeadlineUrgency } from '../../utils/helpers';

export default function UpcomingTasks({ tasks = [] }) {
  const pendingTasks = tasks
    .filter(t => t.status !== 'Completed')
    .sort((a, b) => new Date(a.dueDate || 0) - new Date(b.dueDate || 0))
    .slice(0, 5);

  const getUrgencyBadge = (dueDate) => {
    const urgency = getDeadlineUrgency(dueDate);
    const days = getDaysUntilDue(dueDate);

    if (urgency === 'overdue') {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 px-2 py-0.5 rounded-full border border-red-200 dark:border-red-800">
          <AlertCircle className="w-3 h-3" />
          {Math.abs(days)}d Overdue
        </span>
      );
    }
    if (urgency === 'today') {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
          <Clock className="w-3 h-3" />
          Due Today
        </span>
      );
    }
    if (urgency === 'soon') {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 dark:text-amber-400">
          <Clock className="w-3 h-3" />
          Due in {days}d
        </span>
      );
    }
    return (
      <span className="text-xs text-slate-500 dark:text-slate-400">
        Due {dueDate}
      </span>
    );
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          Upcoming & Overdue Tasks
        </h3>
        <Link
          to="/tasks"
          className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
        >
          View All
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {pendingTasks.length === 0 ? (
        <EmptyState
          title="All Caught Up!"
          description="No pending tasks with upcoming deadlines."
        />
      ) : (
        <div className="space-y-3">
          {pendingTasks.map(t => (
            <div
              key={t.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 gap-2"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                  {t.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <PriorityBadge priority={t.priority} />
                  <StatusBadge status={t.status} />
                </div>
              </div>
              <div className="flex-shrink-0">
                {getUrgencyBadge(t.dueDate)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
