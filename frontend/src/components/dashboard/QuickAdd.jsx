import { useState } from 'react';
import { Plus, Zap } from 'lucide-react';
import api from '../../services/api';

export default function QuickAdd({ onTaskAdded, projects = [] }) {
  const [title, setTitle] = useState('');
  const [projectId, setProjectId] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [dueDate, setDueDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [creating, setCreating] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !projectId) return;

    setCreating(true);
    try {
      const payload = {
        title: title.trim(),
        status: 'TODO',
        priority: priority,
        due_date: dueDate || null,
        project_id: projectId || null
      };
      await api.post('/tasks', payload);
      
      setTitle('');
      if (onTaskAdded) {
        await onTaskAdded();
      }
    } catch (err) {
      alert('Failed to quick create task.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 dark:from-indigo-900 dark:to-slate-900 rounded-xl p-5 text-white shadow-md mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Zap className="w-5 h-5 text-amber-300" />
        <h3 className="text-base font-semibold">Quick Create Task</h3>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-4">
          <input
            type="text"
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-sm px-3.5 py-2 rounded-lg bg-white/10 dark:bg-slate-800/60 border border-white/20 dark:border-slate-700 text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-white/40"
          />
        </div>

        <div className="sm:col-span-3">
          <select
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className="w-full text-sm px-3.5 py-2 rounded-lg bg-white/10 dark:bg-slate-800/60 border border-white/20 dark:border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-white/40"
          >
            <option value="" disabled className="text-slate-900 dark:text-slate-100">Select Project...</option>
            {projects.map(p => (
              <option key={p.id} value={p.id} className="text-slate-900 dark:text-slate-100">
                {p.title || p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full text-sm px-3.5 py-2 rounded-lg bg-white/10 dark:bg-slate-800/60 border border-white/20 dark:border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-white/40"
          >
            <option value="LOW" className="text-slate-900 dark:text-slate-100">Low Priority</option>
            <option value="MEDIUM" className="text-slate-900 dark:text-slate-100">Medium Priority</option>
            <option value="HIGH" className="text-slate-900 dark:text-slate-100">High Priority</option>
          </select>
        </div>

        <div className="sm:col-span-3 flex gap-2">
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full text-sm px-3.5 py-2 rounded-lg bg-white/10 dark:bg-slate-800/60 border border-white/20 dark:border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-white/40"
          />
          <button
            type="submit"
            disabled={!title.trim() || !projectId || creating}
            className="px-4 py-2 bg-white text-indigo-700 dark:bg-indigo-500 dark:text-white rounded-lg font-medium text-sm hover:bg-indigo-50 dark:hover:bg-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
