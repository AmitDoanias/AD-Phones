export default function RepairsLoading() {
  return (
    <div className="animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="h-8 w-40 bg-slate-200 rounded" />
        <div className="flex gap-2">
          <div className="h-8 w-24 bg-slate-200 rounded" />
          <div className="h-8 w-24 bg-slate-200 rounded" />
          <div className="h-8 w-28 bg-slate-200 rounded" />
        </div>
      </div>

      {/* Repair types chips */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
        <div className="h-3 w-32 bg-slate-200 rounded mb-3" />
        <div className="flex gap-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-6 w-20 bg-slate-100 rounded-full" />
          ))}
        </div>
      </div>

      {/* Brand cards */}
      <div className="grid gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="h-11 bg-slate-700 px-5 py-3" />
            <div className="divide-y divide-slate-100">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="px-5 py-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="h-4 w-32 bg-slate-200 rounded" />
                    <div className="h-7 w-20 bg-slate-100 rounded" />
                  </div>
                  <div className="flex gap-2">
                    {[...Array(3)].map((_, k) => (
                      <div key={k} className="h-6 w-24 bg-blue-50 rounded-full" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
