import { useState, useEffect } from 'react';
import { BarChart3, PieChart, CheckCircle2, Clock, Award } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ProgressBar from '../components/ui/ProgressBar';
import StatCard from '../components/dashboard/StatCard';
import WeeklyProductivity from '../components/dashboard/WeeklyProductivity';
import { PageLoader } from '../components/ui/Skeletons';
import { calculateProductivityScore } from '../utils/helpers';

export default function Analytics() {
  const { stats, tasks, projects } = useApp();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <PageLoader />;

  const productivityScore = calculateProductivityScore(tasks, projects);

  const priorityBreakdown = {
    High: tasks.filter(t => t.priority === 'High').length,
    Medium: tasks.filter(t => t.priority === 'Medium').length,
    Low: tasks.filter(t => t.priority === 'Low').length,
  };

  const statusBreakdown = {
    Todo: tasks.filter(t => t.status === 'Todo').length,
    InProgress: tasks.filter(t => t.status === 'In Progress').length,
    Completed: tasks.filter(t => t.status === 'Completed').length,
  };

  const totalTasks = tasks.length || 1;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Analytics</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Detailed breakdown of tasks, completion velocity, and project stats derived from actual application data.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Tasks"
          value={stats.totalTasks}
          icon={BarChart3}
          color="indigo"
          subtext="All tracked tasks"
        />
        <StatCard
          title="Completed Tasks"
          value={stats.completedTasks}
          icon={CheckCircle2}
          color="emerald"
          subtext={`${stats.productivity}% completion rate`}
        />
        <StatCard
          title="Pending Tasks"
          value={stats.pendingTasks}
          icon={Clock}
          color="amber"
          subtext={`${stats.inProgressTasks} currently in progress`}
        />
        <StatCard
          title="Productivity Score"
          value={`${productivityScore}/100`}
          icon={Award}
          color="purple"
          subtext="Overall efficiency rating"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeeklyProductivity tasks={tasks} />

        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-4">
            <PieChart className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Task Status Breakdown
          </h3>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                <span>Completed</span>
                <span>{statusBreakdown.Completed} ({Math.round((statusBreakdown.Completed / totalTasks) * 100)}%)</span>
              </div>
              <ProgressBar value={Math.round((statusBreakdown.Completed / totalTasks) * 100)} showLabel={false} color="bg-emerald-500" />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                <span>In Progress</span>
                <span>{statusBreakdown.InProgress} ({Math.round((statusBreakdown.InProgress / totalTasks) * 100)}%)</span>
              </div>
              <ProgressBar value={Math.round((statusBreakdown.InProgress / totalTasks) * 100)} showLabel={false} color="bg-blue-500" />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                <span>Todo</span>
                <span>{statusBreakdown.Todo} ({Math.round((statusBreakdown.Todo / totalTasks) * 100)}%)</span>
              </div>
              <ProgressBar value={Math.round((statusBreakdown.Todo / totalTasks) * 100)} showLabel={false} color="bg-slate-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Task Priority Distribution
          </h3>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  High Priority
                </span>
                <span>{priorityBreakdown.High} tasks</span>
              </div>
              <ProgressBar value={Math.round((priorityBreakdown.High / totalTasks) * 100)} showLabel={false} color="bg-red-500" />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Medium Priority
                </span>
                <span>{priorityBreakdown.Medium} tasks</span>
              </div>
              <ProgressBar value={Math.round((priorityBreakdown.Medium / totalTasks) * 100)} showLabel={false} color="bg-amber-500" />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-slate-400" />
                  Low Priority
                </span>
                <span>{priorityBreakdown.Low} tasks</span>
              </div>
              <ProgressBar value={Math.round((priorityBreakdown.Low / totalTasks) * 100)} showLabel={false} color="bg-slate-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Project Completion Rates
          </h3>

          <div className="space-y-4">
            {projects.map(p => (
              <div key={p.id}>
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  <span className="truncate max-w-[200px]">{p.name}</span>
                  <span>{p.progress}% ({p.completedTaskCount}/{p.taskCount} tasks)</span>
                </div>
                <ProgressBar value={p.progress} showLabel={false} size="sm" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
