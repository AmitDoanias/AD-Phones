export default function DashboardLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-8 w-48 bg-slate-200 rounded mb-6" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 h-24" />
        ))}
      </div>
      <div className="bg-white rounded-xl border border-slate-200 h-48" />
    </div>
  );
}
