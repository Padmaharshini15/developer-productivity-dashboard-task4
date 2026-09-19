export default function ProgressBar({ value = 0, size = 'md', showLabel = true, color }) {
  const clampedValue = Math.min(100, Math.max(0, value));

  const heights = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  };

  const getColor = () => {
    if (color) return color;
    if (clampedValue >= 80) return 'bg-emerald-500';
    if (clampedValue >= 50) return 'bg-blue-500';
    if (clampedValue >= 25) return 'bg-amber-500';
    return 'bg-slate-400';
  };

  return (
    <div className="flex items-center gap-2" role="progressbar" aria-valuenow={clampedValue} aria-valuemin={0} aria-valuemax={100} aria-label={`Progress: ${clampedValue}%`}>
      <div className={`flex-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden ${heights[size]}`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${getColor()}`}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-medium text-slate-600 dark:text-slate-400 min-w-[36px] text-right">
          {clampedValue}%
        </span>
      )}
    </div>
  );
}
