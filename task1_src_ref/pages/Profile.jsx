import { useState, useEffect } from 'react';
import { User, Mail, Briefcase, Award, CheckSquare, FolderKanban, Code, Calendar } from 'lucide-react';
import { useApp } from '../context/AppContext';
import RecentActivity from '../components/dashboard/RecentActivity';
import { PageLoader } from '../components/ui/Skeletons';
import { getInitials, calculateProductivityScore } from '../utils/helpers';

export default function Profile() {
  const { user, stats, tasks, projects, activity, updateUser } = useApp();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    role: user.role,
  });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <PageLoader />;

  const productivityScore = calculateProductivityScore(tasks, projects);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUser(formData);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">User Profile</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage developer credentials, personal skills, and review performance summary.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-md mb-4">
            {getInitials(user.name)}
          </div>

          <h2 className="text-xl font-bold text-slate-900 dark:text-white">{user.name}</h2>
          <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium mb-1">{user.role}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 justify-center mb-6">
            <Mail className="w-3.5 h-3.5" />
            {user.email}
          </p>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="w-full py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-sm font-semibold rounded-lg transition-colors"
          >
            {isEditing ? 'Cancel Edit' : 'Edit Profile'}
          </button>

          {isEditing && (
            <form onSubmit={handleSubmit} className="w-full text-left space-y-3 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full text-sm p-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full text-sm p-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Role</label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full text-sm p-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                Save Changes
              </button>
            </form>
          )}

          <div className="w-full mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 text-left">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Code className="w-4 h-4 text-indigo-500" />
              Technical Skills
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {user.skills.map(skill => (
                <span
                  key={skill}
                  className="px-2.5 py-1 text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-md"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Developer Productivity Summary
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-1">
                  <CheckSquare className="w-4 h-4" />
                  <span className="text-xs font-semibold">Completed Tasks</span>
                </div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.completedTasks}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-1">
                  <FolderKanban className="w-4 h-4" />
                  <span className="text-xs font-semibold">Active Projects</span>
                </div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.activeProjects}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 mb-1">
                  <Award className="w-4 h-4" />
                  <span className="text-xs font-semibold">Productivity Score</span>
                </div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{productivityScore}/100</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <Calendar className="w-3.5 h-3.5" />
              <span>Joined Innovation Hacks Internship on {user.joinedDate}</span>
            </div>
          </div>

          <RecentActivity activity={activity} />
        </div>
      </div>
    </div>
  );
}
