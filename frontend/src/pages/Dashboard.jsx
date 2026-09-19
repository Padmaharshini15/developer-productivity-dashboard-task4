import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import StatCard from '../components/dashboard/StatCard';
import ProjectProgress from '../components/dashboard/ProjectProgress';
import WeeklyProductivity from '../components/dashboard/WeeklyProductivity';
import RecentActivity from '../components/dashboard/RecentActivity';
import UpcomingTasks from '../components/dashboard/UpcomingTasks';
import QuickAdd from '../components/dashboard/QuickAdd';
import { SkeletonCard } from '../components/ui/Skeletons';
import { FolderKanban, CheckSquare, Zap, Plus, Award, AlertTriangle, Sparkles, BrainCircuit, Activity, Clock, Lightbulb, ArrowRight, RotateCcw, Target, CheckCircle2 } from 'lucide-react';

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    completedTasks: 0,
    productivityScore: 0,
    pendingTasks: 0,
    totalTasks: 0
  });

  const [projectsList, setProjectsList] = useState([]);
  const [tasksList, setTasksList] = useState([]);
  
  // AI Assistant State
  const [aiData, setAiData] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [projectsRes, tasksRes] = await Promise.all([
        api.get('/projects'),
        api.get('/tasks')
      ]);

      const projects = projectsRes.data.map(p => ({
        ...p,
        name: p.title
      }));
      const tasks = tasksRes.data;
      
      setProjectsList(projects);
      setTasksList(tasks);

      let todo = 0;
      let inProgress = 0;
      let completed = 0;

      tasks.forEach(task => {
        if (task.status === 'COMPLETED') completed++;
        else if (task.status === 'IN_PROGRESS') inProgress++;
        else todo++;
      });

      const activeProjects = projects.filter(p => p.status !== 'COMPLETED').length;
      const totalScore = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;

      setStats({
        totalProjects: projects.length,
        activeProjects: activeProjects,
        completedTasks: completed,
        productivityScore: totalScore,
        pendingTasks: todo + inProgress,
        totalTasks: tasks.length
      });
    } catch (err) {
      setError('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  const analyzeTasks = () => {
    setAnalyzing(true);
    setTimeout(() => {
      const pendingTasks = tasksList.filter(t => t.status !== 'COMPLETED');
      if (pendingTasks.length === 0) {
        setAiData({
          noTasks: true,
          message: "Great job! You have no pending tasks. It might be a good time to review your projects or plan new ones."
        });
      } else {
        const highPriorityCount = pendingTasks.filter(t => t.priority === 'HIGH').length;
        const overdueCount = pendingTasks.filter(t => t.due_date && new Date(t.due_date) < new Date()).length;
        
        let focusScore = 100 - (overdueCount * 15) - (highPriorityCount * 5);
        if (focusScore < 10) focusScore = 10;
        if (focusScore > 100) focusScore = 100;

        const sortedTasks = [...pendingTasks].sort((a, b) => {
          const aOverdue = a.due_date && new Date(a.due_date) < new Date();
          const bOverdue = b.due_date && new Date(b.due_date) < new Date();
          if (aOverdue && !bOverdue) return -1;
          if (bOverdue && !aOverdue) return 1;
          if (a.priority === 'HIGH' && b.priority !== 'HIGH') return -1;
          if (b.priority === 'HIGH' && a.priority !== 'HIGH') return 1;
          return 0;
        });

        const topTask = sortedTasks[0];
        
        let topReason = "";
        if (topTask.due_date && new Date(topTask.due_date) < new Date()) {
          topReason = "This task is overdue and requires immediate attention.";
        } else if (topTask.priority === 'HIGH') {
          topReason = "High priority task that will maximize your impact today.";
        } else {
          topReason = "Next logical step in your pending queue.";
        }

        const recommendations = sortedTasks.slice(1, 4).map(t => {
          let reason = "";
          if (t.due_date && new Date(t.due_date) < new Date()) reason = "Overdue";
          else if (t.priority === 'HIGH') reason = "High Priority";
          else reason = "Pending";
          return { ...t, reason };
        });

        setAiData({
          noTasks: false,
          focusScore,
          topTask,
          topReason,
          recommendations
        });
      }
      setAnalyzing(false);
    }, 1500);
  };

  const highPriorityOverdueCount = tasksList.filter(t =>
    t.priority === 'HIGH' &&
    t.status !== 'COMPLETED' &&
    t.due_date &&
    new Date(t.due_date) < new Date()
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

  if (error) {
    return <div className="p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>;
  }

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Welcome back, {user?.name || user?.email}! 👋
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Here is your developer productivity overview for today. You have <span className="font-semibold text-slate-700 dark:text-slate-200">{stats.pendingTasks} pending tasks</span> across {stats.activeProjects} active projects.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/tasks"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <Plus className="w-4 h-4" />
            New Task
          </Link>
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 rounded-xl font-semibold text-sm transition-colors shadow-sm"
          >
            <FolderKanban className="w-4 h-4" />
            New Project
          </Link>
        </div>
      </div>

      {/* Alert */}
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

      {/* Quick Add */}
      <QuickAdd onTaskAdded={fetchDashboardData} projects={projectsList} />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Projects"
          value={stats.totalProjects}
          icon={FolderKanban}
          color="indigo"
          subtext={`${stats.activeProjects} active projects`}
        />
        <StatCard
          title="Active Projects"
          value={stats.activeProjects}
          icon={Zap}
          color="blue"
          subtext={`${stats.totalProjects > 0 ? Math.round((stats.activeProjects / stats.totalProjects) * 100) : 0}% of total`}
        />
        <StatCard
          title="Completed Tasks"
          value={stats.completedTasks}
          icon={CheckSquare}
          color="emerald"
          trend="up"
          trendValue={`${stats.productivityScore}% rate`}
          subtext={`${stats.completedTasks} of ${stats.totalTasks} tasks done`}
        />
        <StatCard
          title="Productivity Score"
          value={`${stats.productivityScore}/100`}
          icon={Award}
          color="purple"
          subtext="Based on completion rate"
        />
      </div>

      {/* AI Focus Coach */}
      <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl p-6 shadow-xl relative overflow-hidden border border-indigo-500/20">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <BrainCircuit className="w-48 h-48 text-indigo-400" />
        </div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>

        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-indigo-500/20 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="bg-indigo-500/20 p-1.5 rounded-lg border border-indigo-500/30">
                  <Sparkles className="w-5 h-5 text-indigo-300" />
                </div>
                <h2 className="font-bold text-xl text-white tracking-tight">AI Focus Coach</h2>
              </div>
              <p className="text-indigo-200/80 text-sm">Smart recommendations based on your current tasks</p>
            </div>
            
            {aiData && !aiData.noTasks && (
               <div className="flex items-center gap-3 bg-black/20 px-4 py-2 rounded-xl border border-white/5">
                 <div className="text-right">
                   <div className="text-xs text-indigo-200/70 font-medium uppercase tracking-wider">Focus Score</div>
                   <div className="text-2xl font-bold text-white leading-none mt-0.5">{aiData.focusScore}<span className="text-sm text-indigo-400 font-normal">/100</span></div>
                 </div>
                 <div className="h-10 w-10 rounded-full border-2 border-indigo-400/30 flex items-center justify-center bg-indigo-500/10">
                   <Activity className="w-5 h-5 text-indigo-300" />
                 </div>
               </div>
            )}
          </div>
          
          {!aiData ? (
            <div className="py-8 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 border border-white/10 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                <BrainCircuit className="w-8 h-8 text-indigo-300" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Ready to optimize your workflow?</h3>
              <p className="text-indigo-200/70 text-sm max-w-md mx-auto mb-6">
                Let AI analyze your current workload, task priorities, and deadlines to suggest the best next steps for maximum impact.
              </p>
              <button 
                onClick={analyzeTasks} 
                className="group relative inline-flex items-center gap-2 px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-sm font-semibold transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_25px_rgba(99,102,241,0.5)] disabled:opacity-50 overflow-hidden"
                disabled={analyzing}
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                <span className="relative flex items-center gap-2">
                  {analyzing ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  {analyzing ? 'Analyzing workload...' : 'Analyze My Workload'}
                </span>
              </button>
            </div>
          ) : aiData.noTasks ? (
            <div className="py-6">
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6 text-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-white mb-2">You're all caught up!</h3>
                <p className="text-emerald-200/70 text-sm">{aiData.message}</p>
                <button 
                  onClick={analyzeTasks} 
                  className="mt-6 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm font-medium transition-colors border border-white/10 disabled:opacity-50"
                  disabled={analyzing}
                >
                  {analyzing ? 'Analyzing...' : 'Re-analyze Tasks'}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Top Recommendation */}
              <div className="flex-1 bg-white/5 border border-white/10 rounded-xl p-5 flex flex-col hover:bg-white/[0.07] transition-colors relative group">
                <div className="absolute top-0 right-0 px-3 py-1 bg-indigo-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-bl-lg rounded-tr-xl">
                  Top Priority
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-3 pr-20 group-hover:text-indigo-200 transition-colors">{aiData.topTask.title}</h3>
                  
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${aiData.topTask.priority === 'HIGH' ? 'bg-red-500/20 text-red-300 border border-red-500/20' : 'bg-amber-500/20 text-amber-300 border border-amber-500/20'}`}>
                      {aiData.topTask.priority}
                    </span>
                    <span className="px-2 py-1 rounded text-xs font-medium bg-white/10 text-white/80 border border-white/5">
                      {aiData.topTask.status.replace('_', ' ')}
                    </span>
                    {aiData.topTask.due_date && (
                      <span className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${new Date(aiData.topTask.due_date) < new Date() ? 'bg-red-500/20 text-red-300 border border-red-500/20' : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/20'}`}>
                        <Clock className="w-3 h-3" />
                        {new Date(aiData.topTask.due_date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  
                  <div className="bg-black/20 rounded-lg p-3 border border-white/5 flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-amber-300 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider block mb-1">Why this task?</span>
                      <p className="text-sm text-indigo-100/80">{aiData.topReason}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-5 flex items-center gap-3 pt-5 border-t border-white/10">
                  <button 
                    onClick={async () => {
                       if(aiData.topTask.status !== 'IN_PROGRESS') {
                          try {
                            await api.put(`/tasks/${aiData.topTask.id}`, { status: 'IN_PROGRESS' });
                            fetchDashboardData();
                          } catch(e) {}
                       }
                    }}
                    className="flex-1 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm font-semibold transition-all text-center flex items-center justify-center gap-2"
                  >
                    Start Focus Task <ArrowRight className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={analyzeTasks} 
                    className="p-2.5 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors border border-white/10"
                    title="Re-analyze"
                    disabled={analyzing}
                  >
                    <RotateCcw className={`w-4 h-4 ${analyzing ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>
              
              {/* Other Recommendations */}
              {aiData.recommendations.length > 0 && (
                <div className="flex-1 lg:max-w-xs flex flex-col gap-3">
                  <h4 className="text-sm font-semibold text-indigo-200 flex items-center gap-2 mb-1">
                    <Target className="w-4 h-4" /> Up Next
                  </h4>
                  {aiData.recommendations.map(task => (
                    <div key={task.id} className="bg-white/5 border border-white/5 hover:border-indigo-500/30 rounded-xl p-3 transition-colors group cursor-default">
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <h5 className="text-sm font-medium text-white line-clamp-1 group-hover:text-indigo-300 transition-colors">{task.title}</h5>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className={`w-2 h-2 rounded-full ${task.priority === 'HIGH' ? 'bg-red-400' : 'bg-amber-400'}`}></span>
                        <span className="text-indigo-200/60">{task.reason}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Progress & Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProjectProgress projects={projectsList} tasks={tasksList} />
        <WeeklyProductivity tasks={tasksList} />
      </div>

      {/* Activity & Upcoming */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UpcomingTasks tasks={tasksList} />
        <RecentActivity activity={[]} />
      </div>

    </div>
  );
}
