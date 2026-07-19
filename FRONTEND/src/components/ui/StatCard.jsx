function StatCard({ title, value, change }) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 hover:border-[#D1D5DB] shadow-sm transition-all">
      <p className="text-[#6B7280] text-sm font-medium">{title}</p>

      <h2 className="text-3xl font-bold text-[#111827] mt-3">
        {value}
      </h2>

      <p className="text-[#2563EB] text-sm font-semibold mt-2">
        {change}
      </p>
    </div>
  );
}

export default StatCard;