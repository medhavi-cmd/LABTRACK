import React from 'react';

export const ContentCard = ({ children, className = '' }) => {
  return (
    <div className={`bg-[#131b2e] border border-[#222a3d] rounded-xl p-6 shadow-xl ${className}`}>
      {children}
    </div>
  );
};