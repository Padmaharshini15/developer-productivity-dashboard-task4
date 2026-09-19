import { Edit2, Trash2, Calendar, User, FolderKanban } from 'lucide-react';
import StatusBadge from '../ui/StatusBadge';
import PriorityBadge from '../ui/PriorityBadge';
import { TASK_STATUS, TASK_PRIORITY } from '../../utils/constants';
import { formatDate, getDeadlineUrgency } from '../../utils/helpers';

export default function TaskTable({ tasks = [], projectsMap = {}, onEdit, onDelete, onStatusChange, onPriorityChange }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <th className="py-3.5 px-4">Task</th>
              <th className="py-3.5 px-4">Project</th>
              <th className="py-3.5 px-4">Assignee</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Priority</th>
              <th className="py-3.5 px-4">Due Date</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 text-sm">
            {tasks.map(task => {
              const urgency = getDeadlineUrgency(task.dueDate);
              const projectName = projectsMap[task.projectId]?.name || 'Unassigned';

              return (
                <tr key={task.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="py-3.5 px-4 font-medium text-slate-900 dark:text-slate-100">
                    <span className={task.status === 'Completed' ? 'line-through text-slate-400 dark:text-slate-500' : ''}>
                      {task.title}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 dark:text-indigo-400">
                      <FolderKanban className="w-3.5 h-3.5" />
                      {projectName}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                    <span className="inline-flex items-center gap-1.5 text-xs">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      {task.assignee || 'Padmaharshini A'}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <select
                      value={task.status}
                      onChange={(e) => onStatusChange(task.id, e.target.value)}
                      className="text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md px-2 py-1 font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                    >
                      {Object.values(TASK_STATUS).map(st => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </td>

                  <td className="py-3.5 px-4">
                    <select
                      value={task.priority}
                      onChange={(e) => onPriorityChange(task.id, e.target.value)}
                      className="text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md px-2 py-1 font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                    >
                      {Object.values(TASK_PRIORITY).map(pr => (
                        <option key={pr} value={pr}>{pr}</option>
                      ))}
                    </select>
                  </td>

                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 text-xs">
                    <span className={`inline-flex items-center gap-1 ${
                      urgency === 'overdue' && task.status !== 'Completed' ? 'text-red-600 dark:text-red-400 font-bold' : ''
                    }`}>
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {formatDate(task.dueDate)}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onEdit(task)}
                        className="p-1.5 text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                        title="Edit Task"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(task)}
                        className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                        title="Delete Task"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
