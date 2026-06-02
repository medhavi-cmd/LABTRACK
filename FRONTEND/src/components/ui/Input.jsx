import React, { useState } from 'react';

export const Input = ({ label, id, type, placeholder, value, onChange, icon: Icon }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="w-full flex flex-col gap-1.5 mb-4">
      <label 
        htmlFor={id} 
        className="font-mono text-[12px] font-semibold uppercase tracking-wider text-[#bbc9cd]"
      >
        {label}
      </label>
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 text-[#859397] pointer-events-none">
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
          className={`w-full h-11 bg-[#0b1326] text-[#dae2fd] placeholder-[#3c494c] font-sans text-sm rounded-md pl-11 pr-4 outline-none transition-all duration-200 border ${
            isFocused 
              ? 'border-[#22d3ee] shadow-[0_0_12px_rgba(34,211,238,0.2)]' 
              : 'border-[#3c494c] hover:border-[#859397]'
          }`}
        />
      </div>
    </div>
  );
};