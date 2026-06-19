import React from 'react';
import { motion } from 'framer-motion';

export const RoleSelector = ({ label, icon: Icon, active, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex flex-col items-center justify-center flex-1 py-3 px-2 rounded-md border transition-all duration-200 group overflow-hidden ${
        active 
          ? 'border-[#22d3ee] bg-[#171f33]' 
          : 'border-[#3c494c] bg-[#0b1326]/50 hover:border-[#859397] hover:bg-[#131b2e]'
      }`}
    >
      {active && (
        <motion.div 
          layoutId="activeRoleGlow"
          className="absolute inset-0 bg-linear-to-b from-cyan-500/5 to-transparent pointer-events-none"
          initial={false}
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
      <Icon size={20} className={`mb-1.5 transition-colors ${active ? 'text-[#22d3ee]' : 'text-[#859397] group-hover:text-[#dae2fd]'}`} />
      <span className="font-mono text-[11px] font-bold tracking-wider uppercase text-center block">
        {label}
      </span>
    </button>
  );
};