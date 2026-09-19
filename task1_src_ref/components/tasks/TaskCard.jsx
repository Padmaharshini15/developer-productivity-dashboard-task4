import { Edit2, Trash2, Calendar, User, FolderKanban } from 'lucide-react';
import StatusBadge from '../ui/StatusBadge';
import PriorityBadge from '../ui/PriorityBadge';
import { TASK_STATUS } from '../../utils/constants';
import { formatDate, getDeadlineUrgency, getDaysUntilDue } from '../../utils/helpers';

export default function TaskCard({ task, projectName, onEdit, onDelete, onStatusChange }) {
  const urgency = getDeadlineUrgency(task.dueDate);
  const days = getDaysUntilDue(task.dueDate);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <h4 className={`text-sm font-semibold text-slate-900 dark:text-slate-100 ${
            task.status === 'Completed' ? 'line-through text-slate-400 dark:text-slate-500' : ''
          }`}>
            {task.title}
          </h4>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <PriorityBadge priority={task.priority} />
          </div>
        </div>

        {projectName && (
          <div className="flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-medium mb-3">
            <FolderKanban className="w-3.5 h-3.5" />
            {projectName}
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex flex-col gap-3">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span>{task.assignee || 'Unassigned'}</span>
          </div>

          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span className={urgency === 'overdue' && task.status !== 'Completed' ? 'text-red-500 font-bold' : ''}>
              {formatDate(task.dueDate)}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <select
            value={task.status}
            onChange={(e) => onStatusChange(task.id, e.target.value)}
            className="text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md px-2 py-1 font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {Object.values(TASK_STATUS).map(st => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(task)}
              className="p-1 text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
              title="Edit Task"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(task)}
              className="p-1 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
              title="Delete Task"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
