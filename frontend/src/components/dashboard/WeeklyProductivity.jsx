import { BarChart3 } from 'lucide-react';
import { getWeeklyProductivity } from '../../utils/helpers';

export default function WeeklyProductivity({ tasks = [] }) {
  const weeklyData = getWeeklyProductivity(tasks);
  const maxVal = Math.max(...weeklyData.map(d => d.completed), 1);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Weekly Productivity
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Tasks completed past 7 days</p>
        </div>
      </div>

      <div className="h-44 flex items-end justify-between gap-2 pt-4 px-2">
        {weeklyData.map((d, idx) => {
          const heightPercent = Math.round((d.completed / maxVal) * 100);
          return (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
                {d.completed}
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-900 rounded-t-md h-32 flex items-end p-1">
                <div
                  className="w-full bg-indigo-600 dark:bg-indigo-500 rounded-t-sm transition-all duration-500 hover:bg-indigo-700 dark:hover:bg-indigo-400"
                  style={{ height: `${Math.max(heightPercent, d.completed > 0 ? 10 : 4)}%` }}
                />
              </div>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {d.day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
