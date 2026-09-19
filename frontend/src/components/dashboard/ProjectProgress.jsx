import { Link } from 'react-router-dom';
import { FolderKanban, ArrowRight } from 'lucide-react';
import ProgressBar from '../ui/ProgressBar';
import StatusBadge from '../ui/StatusBadge';
import EmptyState from '../common/EmptyState';

export default function ProjectProgress({ projects = [], tasks = [] }) {
  const enhancedProjects = projects.map(proj => {
    const projectTasks = tasks.filter(t => t.project_id === proj.id);
    const completedTasks = projectTasks.filter(t => t.status === 'COMPLETED').length;
    const taskCount = projectTasks.length;
    const progress = taskCount === 0 ? 0 : Math.round((completedTasks / taskCount) * 100);
    return {
      ...proj,
      progress,
      completedTaskCount: completedTasks,
      taskCount
    };
  });

  const displayProjects = enhancedProjects.slice(0, 4);

  if (projects.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-4">Project Progress</h3>
        <EmptyState
          icon={FolderKanban}
          title="No Active Projects"
          description="Create your first project to track progress here."
        />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Project Progress</h3>
        <Link
          to="/projects"
          className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
        >
          View All
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="space-y-4">
        {displayProjects.map(proj => (
          <div key={proj.id} className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate max-w-[200px]">
                {proj.name || proj.title}
              </span>
              <StatusBadge status={proj.status || 'ACTIVE'} />
            </div>

            <ProgressBar value={proj.progress} size="sm" />

            <div className="flex items-center justify-between mt-2 text-xs text-slate-500 dark:text-slate-400">
              <span>{proj.completedTaskCount} / {proj.taskCount} tasks completed</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
