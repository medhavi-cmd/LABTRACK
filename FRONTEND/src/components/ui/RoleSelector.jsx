import React from 'react';
import { motion } from 'framer-motion';

export const RoleSelector = ({ label, icon: Icon, active, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex flex-col items-center justify-center flex-1 py-3 px-2 rounded-md border transition-all duration-200 group overflow-hidden shadow-sm ${
        active 
          ? 'border-[#2563EB] bg-[#2563EB]/10 text-[#2563EB]' 
          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 text-slate-500'
      }`}
    >
      {active && (
        <motion.div 
          layoutId="activeRoleGlow"
          className="absolute inset-0 bg-gradient-to-b from-cyan-600/5 to-transparent pointer-events-none"
          initial={false}
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
      <Icon 
        size={20} 
        className={`mb-1.5 transition-colors ${
          active ? 'text-cyan-600' : 'text-slate-400 group-hover:text-slate-600'
        }`} 
      />
      <span className={`font-mono text-[11px] font-bold tracking-wider uppercase text-center block ${
        active ? 'text-cyan-700' : 'text-slate-600'
      }`}>
        {label}
      </span>
    </button>
  );
};