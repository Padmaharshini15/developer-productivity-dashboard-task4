import { Eye, Edit2, Trash2, Calendar, CheckSquare } from 'lucide-react';
import ProgressBar from '../ui/ProgressBar';
import StatusBadge from '../ui/StatusBadge';
import PriorityBadge from '../ui/PriorityBadge';
import { formatDate } from '../../utils/helpers';

export default function ProjectCard({ project, onView, onEdit, onDelete }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
            {project.name}
          </h3>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <StatusBadge status={project.status} />
            <PriorityBadge priority={project.priority} />
          </div>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4">
          {project.description}
        </p>

        <div className="space-y-3 mb-4">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
              <span>Overall Progress</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">{project.progress}%</span>
            </div>
            <ProgressBar value={project.progress} showLabel={false} size="sm" />
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <CheckSquare className="w-3.5 h-3.5 text-slate-400" />
            {project.completedTaskCount}/{project.taskCount} tasks
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            {formatDate(project.dueDate)}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onView(project)}
            className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            title="View Details"
            aria-label="View Project"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(project)}
            className="p-1.5 text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            title="Edit Project"
            aria-label="Edit Project"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(project)}
            className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            title="Delete Project"
            aria-label="Delete Project"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
