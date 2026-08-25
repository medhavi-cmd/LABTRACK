import React from "react";

export const PageContainer = ({ children }) => (
  <div className="min-h-screen bg-[#F8FAFC] p-8 text-[#4B5563]">
    <div className="mx-auto max-w-7xl">
      {children}
    </div>
  </div>
);

export const PageHeader = ({ pretitle, title, subtitle, children }) => (
  <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div>
      {pretitle && (
        <p className="mb-2 font-mono text-xs uppercase tracking-[0.18em] text-[#2563EB]">
          {pretitle}
        </p>
      )}
      <h1 className="text-3xl font-bold text-[#111827]">{title}</h1>
      {subtitle && <p className="mt-2 text-[#4B5563]">{subtitle}</p>}
    </div>
    {children && <div className="flex items-center gap-3">{children}</div>}
  </div>
);

export const SectionCard = ({ children, className = "" }) => (
  <div className={`rounded-xl border border-slate-200 bg-white p-6 shadow-sm ${className}`}>
    {children}
  </div>
);

export const StatsCard = ({ label, value, icon: Icon, description, valueColor = "text-[#111827]" }) => (
  <div className="group relative rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex flex-col justify-between min-h-[160px]">
    <div className="flex items-start justify-between gap-4">
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[#6B7280] mb-2">
          {label}
        </h3>
        <p className={`text-4xl font-bold ${valueColor}`}>{value}</p>
      </div>
      {Icon && (
        <div className="rounded-lg bg-[#F8FAFC] p-3 text-[#6B7280] transition-colors group-hover:bg-[#EFF6FF] group-hover:text-[#2563EB]">
          <Icon className="h-6 w-6" />
        </div>
      )}
    </div>
    {description && (
      <p className="mt-4 text-xs font-medium text-[#6B7280]">
        {description}
      </p>
    )}
  </div>
);

export const SearchBar = ({ value, onChange, placeholder = "Search..." }) => {
  const { FiSearch } = require("react-icons/fi");
  return (
    <div className="relative mb-6">
      <FiSearch className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-3 outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all text-sm text-[#111827]"
      />
    </div>
  );
};

export const TableContainer = ({ title, children, action }) => (
  <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
    {(title || action) && (
      <div className="border-b border-slate-200 px-6 py-5 flex items-center justify-between bg-white">
        <h2 className="text-lg font-bold text-[#111827]">{title}</h2>
        {action && <div>{action}</div>}
      </div>
    )}
    <div className="overflow-x-auto">
      {children}
    </div>
  </div>
);

export const Table = ({ children }) => (
  <table className="w-full text-left border-collapse">
    {children}
  </table>
);

export const TableHead = ({ children }) => (
  <thead className="bg-[#F8FAFC] border-b border-slate-200">
    <tr className="text-[#6B7280] text-xs font-semibold uppercase tracking-wider">
      {children}
    </tr>
  </thead>
);

export const Th = ({ children, className = "" }) => (
  <th className={`px-6 py-4 ${className}`}>{children}</th>
);

export const TableBody = ({ children }) => (
  <tbody className="divide-y divide-slate-200">
    {children}
  </tbody>
);

export const Tr = ({ children, className = "" }) => (
  <tr className={`hover:bg-slate-50 transition-colors ${className}`}>
    {children}
  </tr>
);

export const Td = ({ children, className = "" }) => (
  <td className={`px-6 py-4 text-sm text-[#4B5563] ${className}`}>
    {children}
  </td>
);
