import React from 'react';

export const Button = ({ children, variant = 'primary', onClick, icon: Icon, className = '', type = 'button' }) => {
  const baseStyles = "w-full h-11 rounded-md font-sans text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.99]";
  
  const variants = {
    primary: "bg-[#22d3ee] text-[#00363e] hover:bg-[#8aebff] shadow-lg shadow-cyan-950/20",
    secondary: "bg-transparent border border-[#3c494c] text-[#dae2fd] hover:border-[#859397] hover:bg-[#171f33]",
    sso: "bg-[#222a3d] border border-[#3c494c] text-[#dae2fd] hover:bg-[#2d3449] hover:border-[#859397]"
  };

  return (
    <button type={type} onClick={onClick} className={`${baseStyles} ${variants[variant]} ${className}`}>
      {Icon && <Icon size={18} />}
      {children}
    </button>
  );
};