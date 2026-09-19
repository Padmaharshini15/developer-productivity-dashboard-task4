import { X, Calendar, CheckSquare, Clock } from 'lucide-react';
import StatusBadge from '../ui/StatusBadge';
import PriorityBadge from '../ui/PriorityBadge';
import ProgressBar from '../ui/ProgressBar';
import TaskCard from '../tasks/TaskCard';
import { formatDate } from '../../utils/helpers';

export default function ProjectDetails({ project, tasks = [], isOpen, onClose, onEditTask, onDeleteTask, onStatusChange }) {
  if (!isOpen || !project) return null;

  const projectTasks = tasks.filter(t => t.projectId === project.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col animate-in">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <StatusBadge status={project.status} />
              <PriorityBadge priority={project.priority} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {project.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Description
            </h4>
            <p className="text-sm text-slate-700 dark:text-slate-300">
              {project.description}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-indigo-500" />
              <div>
                <p className="text-xs text-slate-400">Due Date</p>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{formatDate(project.dueDate)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <CheckSquare className="w-4 h-4 text-emerald-500" />
              <div>
                <p className="text-xs text-slate-400">Tasks Completed</p>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{project.completedTaskCount} / {project.taskCount}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-amber-500" />
              <div>
                <p className="text-xs text-slate-400">Progress</p>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{project.progress}%</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Progress Bar
            </h4>
            <ProgressBar value={project.progress} size="md" />
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">
              Project Tasks ({projectTasks.length})
            </h4>
            {projectTasks.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400 italic">No tasks associated with this project yet.</p>
            ) : (
              <div className="space-y-3">
                {projectTasks.map(t => (
                  <TaskCard
                    key={t.id}
                    task={t}
                    projectName={project.name}
                    onEdit={onEditTask}
                    onDelete={onDeleteTask}
                    onStatusChange={onStatusChange}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
