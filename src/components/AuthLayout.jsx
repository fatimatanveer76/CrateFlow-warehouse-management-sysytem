export default function AuthLayout({ children, subtitle }) {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-925">
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-navy-950 p-12 lg:flex">
        <div className="absolute inset-0 opacity-[0.07]">
          <div className="barcode-strip h-full w-full text-white" />
        </div>
        <div className="relative flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500">
            <div className="barcode-strip h-4 w-4 text-navy-950" />
          </div>
          <span className="font-display text-xl font-bold text-white">CrateFlow</span>
        </div>

        <div className="relative max-w-md">
          <p className="font-display text-4xl font-bold leading-tight text-white">
            Run your warehouse like it's Prime Day, every day.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-navy-300">
            {subtitle ||
              'Track stock, suppliers, and orders in one place — built for teams that move fast and can\'t afford stockouts.'}
          </p>
        </div>

        <div className="relative flex items-center gap-6 text-xs font-mono uppercase tracking-widest text-navy-500">
          <span>SKU · Tracked</span>
          <span>·</span>
          <span>Stock · Synced</span>
          <span>·</span>
          <span>Orders · Live</span>
        </div>
      </div>

      <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
