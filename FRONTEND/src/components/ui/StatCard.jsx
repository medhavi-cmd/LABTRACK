function StatCard({ title, value, change }) {
  return (
   <div className="bg-[#081122] border border-cyan-500/20 rounded-2xl p-5 hover:border-cyan-400/50 transition-all">
      <p className="text-slate-400 text-sm">{title}</p>

      <h2 className="text-3xl font-bold text-white mt-3">
        {value}
      </h2>

      <p className="text-cyan-400 text-sm mt-2">
        {change}
      </p>
    </div>
  );
}

export default StatCard;

