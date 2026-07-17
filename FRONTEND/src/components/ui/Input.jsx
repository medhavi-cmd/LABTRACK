import React, { useState } from 'react';

export const Input = ({ label, id, type, placeholder, value, onChange, icon: Icon }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="w-full flex flex-col gap-1.5 mb-4 text-slate-600">
      <label 
        htmlFor={id} 
        className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500"
      >
        {label}
      </label>
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 text-slate-400 pointer-events-none">
            <Icon size={18} />
          </div>
        )}
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full h-11 bg-white text-slate-900 placeholder-slate-400 font-sans text-sm rounded-md pl-11 pr-4 outline-none transition-all duration-200 border shadow-sm ${
            isFocused 
              ? 'border-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.15)]' 
              : 'border-slate-200 hover:border-slate-300'
          }`}
        />
      </div>
    </div>
  );
};