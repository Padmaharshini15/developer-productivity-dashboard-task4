import React, { useState, useEffect, useContext } from 'react';
import { User, Mail, Briefcase, Award, CheckSquare, FolderKanban, Code, Calendar } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { PageLoader } from '../components/ui/Skeletons';
import { getInitials } from '../utils/helpers';

export default function Profile() {
  const { user, updateUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'Developer',
  });
  
  const [stats, setStats] = useState({
    completedTasks: 0,
    activeProjects: 0,
    productivityScore: 0
  });

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const [projectsRes, tasksRes] = await Promise.all([
        api.get('/projects'),
        api.get('/tasks')
      ]);
      
      const projectsData = projectsRes.data;
      const tasksData = tasksRes.data;
      
      let completed = 0;
      tasksData.forEach(task => {
        if (task.status === 'COMPLETED') completed++;
      });
      
      const activeProjects = projectsData.filter(p => p.status !== 'COMPLETED').length;
      const totalScore = tasksData.length > 0 ? Math.round((completed / tasksData.length) * 100) : 0;
      
      setStats({
        completedTasks: completed,
        activeProjects,
        productivityScore: totalScore
      });
    } catch(err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <PageLoader />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const response = await api.put('/users/profile', formData);
      updateUser(response.data);
      setIsEditing(false);
    } catch(err) {
      alert(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
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
            {getInitials(user?.name || 'User')}
          </div>

          <h2 className="text-xl font-bold text-slate-900 dark:text-white">{user?.name || 'Developer User'}</h2>
          <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium mb-1">{user?.role || 'Developer'}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 justify-center mb-6">
            <Mail className="w-3.5 h-3.5" />
            {user?.email}
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
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full text-sm p-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors"
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          )}

          <div className="w-full mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 text-left">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Code className="w-4 h-4 text-indigo-500" />
              Technical Skills
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {['React', 'PostgreSQL', 'Tailwind CSS'].map(skill => (
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
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.productivityScore}/100</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <Calendar className="w-3.5 h-3.5" />
              <span>Joined recently</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
