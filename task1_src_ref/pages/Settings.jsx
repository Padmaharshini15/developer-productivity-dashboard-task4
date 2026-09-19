import { useState, useEffect } from 'react';
import { Moon, Sun, Bell, Layout, CheckSquare, Save } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { PageLoader } from '../components/ui/Skeletons';

export default function Settings() {
  const { settings, updateSettings } = useApp();
  const { theme, toggleTheme } = useTheme();
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    notifications: settings.notifications,
    dashboardCompact: settings.dashboardCompact,
    showCompletedTasks: settings.showCompletedTasks,
    defaultTaskView: settings.defaultTaskView,
    defaultProjectView: settings.defaultProjectView,
  });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <PageLoader />;

  const handleSave = (e) => {
    e.preventDefault();
    updateSettings(formData);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Customize theme preferences, dashboard layout, and notifications.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-4">
            {theme === 'dark' ? <Moon className="w-5 h-5 text-indigo-500" /> : <Sun className="w-5 h-5 text-amber-500" />}
            Appearance & Theme
          </h3>

          <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-700/60">
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Theme Mode</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Toggle between Light Mode and Dark Mode styling</p>
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-900 dark:text-slate-100 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
              Currently {theme === 'dark' ? 'Dark' : 'Light'}
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-indigo-500" />
            Notifications
          </h3>

          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Enable Toast Notifications</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Show alert popups when tasks or projects are added/edited/deleted</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.notifications}
                onChange={(e) => setFormData({ ...formData, notifications: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-indigo-600"></div>
            </label>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-2">
            <Layout className="w-5 h-5 text-indigo-500" />
            Dashboard & View Preferences
          </h3>

          <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-700/60">
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Compact Dashboard View</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Reduce spacing and padding on stats cards</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.dashboardCompact}
                onChange={(e) => setFormData({ ...formData, dashboardCompact: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-700/60">
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Show Completed Tasks by Default</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Include completed tasks in standard task lists</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.showCompletedTasks}
                onChange={(e) => setFormData({ ...formData, showCompletedTasks: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Default Task View Mode</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Choose preferred default view format</p>
            </div>
            <select
              value={formData.defaultTaskView}
              onChange={(e) => setFormData({ ...formData, defaultTaskView: e.target.value })}
              className="text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100"
            >
              <option value="table">Table View</option>
              <option value="grid">Grid View</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm transition-colors shadow-sm"
          >
            <Save className="w-4 h-4" />
            Save Preferences
          </button>
        </div>
      </form>
    </div>
  );
}
