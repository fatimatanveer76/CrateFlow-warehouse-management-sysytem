export default function StatCard({ icon: Icon, label, value, tone = 'default', hint }) {
  const tones = {
    default: 'bg-navy-700 text-white',
    amber: 'bg-amber-500 text-navy-950',
    green: 'bg-emerald-600 text-white',
    red: 'bg-red-600 text-white',
  };

  return (
    <div className="card flex items-center gap-4 p-4 sm:p-5">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${tones[tone]}`}>
        <Icon size={20} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {label}
        </p>
        <p className="truncate font-display text-xl font-bold text-navy-900 dark:text-white">
          {value}
        </p>
        {hint && <p className="mt-0.5 text-xs text-slate-400">{hint}</p>}
      </div>
    </div>
  );
}
