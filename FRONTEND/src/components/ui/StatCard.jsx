function StatCard({ title, value, change }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-slate-300 shadow-sm transition-all">
      <p className="text-slate-500 text-sm font-medium">{title}</p>

      <h2 className="text-3xl font-bold text-slate-900 mt-3">
        {value}
      </h2>

      <p className="text-cyan-600 text-sm font-semibold mt-2">
        {change}
      </p>
    </div>
  );
}

export default StatCard;