import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FolderKanban, CheckSquare, Clock, Zap, Plus, Award, AlertTriangle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import StatCard from '../components/dashboard/StatCard';
import ProjectProgress from '../components/dashboard/ProjectProgress';
import WeeklyProductivity from '../components/dashboard/WeeklyProductivity';
import RecentActivity from '../components/dashboard/RecentActivity';
import UpcomingTasks from '../components/dashboard/UpcomingTasks';
import QuickAdd from '../components/dashboard/QuickAdd';
import TaskModal from '../components/tasks/TaskModal';
import ProjectModal from '../components/projects/ProjectModal';
import { SkeletonCard } from '../components/ui/Skeletons';
import { calculateProductivityScore } from '../utils/helpers';

export default function Dashboard() {
  const { stats, projects, tasks, activity, user, addTask, addProject } = useApp();
  const [loading, setLoading] = useState(true);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const productivityScore = calculateProductivityScore(tasks, projects);

  const highPriorityOverdueCount = tasks.filter(t =>
    t.priority === 'High' &&
    t.status !== 'Completed' &&
    t.dueDate &&
    new Date(t.dueDate) < new Date()
  ).length;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Welcome back, {user.name}! 👋
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Here is your developer productivity overview for today. You have <span className="font-semibold text-slate-700 dark:text-slate-200">{stats.pendingTasks} pending tasks</span> across {stats.activeProjects} active projects.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsTaskModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <Plus className="w-4 h-4" />
            New Task
          </button>
          <button
            onClick={() => setIsProjectModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 rounded-xl font-semibold text-sm transition-colors shadow-sm"
          >
            <FolderKanban className="w-4 h-4" />
            New Project
          </button>
        </div>
      </div>

      {highPriorityOverdueCount > 0 && (
        <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/80 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <div>
              <p className="text-sm font-semibold text-red-900 dark:text-red-200">
                High Priority Attention Needed
              </p>
              <p className="text-xs text-red-700 dark:text-red-300">
                You have {highPriorityOverdueCount} high-priority overdue task{highPriorityOverdueCount > 1 ? 's' : ''} requiring immediate action.
              </p>
            </div>
          </div>
          <Link
            to="/tasks"
            className="text-xs font-bold text-red-700 dark:text-red-300 hover:underline flex-shrink-0"
          >
            Review Tasks &rarr;
          </Link>
        </div>
      )}

      <QuickAdd />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Projects"
          value={stats.totalProjects}
          icon={FolderKanban}
          color="indigo"
          subtext={`${stats.activeProjects} active, ${stats.completedProjects} completed`}
        />
        <StatCard
          title="Active Projects"
          value={stats.activeProjects}
          icon={Zap}
          color="blue"
          subtext={`${Math.round((stats.activeProjects / (stats.totalProjects || 1)) * 100)}% of total projects`}
        />
        <StatCard
          title="Completed Tasks"
          value={stats.completedTasks}
          icon={CheckSquare}
          color="emerald"
          trend="up"
          trendValue={`${stats.productivity}% rate`}
          subtext={`${stats.completedTasks} of ${stats.totalTasks} tasks done`}
        />
        <StatCard
          title="Productivity Score"
          value={`${productivityScore}/100`}
          icon={Award}
          color="purple"
          subtext="Derived from task completion & timeliness"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProjectProgress projects={projects} />
        <WeeklyProductivity tasks={tasks} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UpcomingTasks tasks={tasks} />
        <RecentActivity activity={activity} />
      </div>

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSubmit={addTask}
        projects={projects}
        user={user}
      />

      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onSubmit={addProject}
      />
    </div>
  );
}
