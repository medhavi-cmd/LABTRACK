import React from 'react';

export const StepIndicator = ({ currentStep = 1 }) => {
  return (
    <div className="flex items-center gap-6 my-6 font-sans">
      {/* Step 1 */}
      <div className="flex items-center gap-2.5">
        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
          currentStep >= 1 ? 'bg-[#22d3ee] text-[#00363e]' : 'border border-[#3c494c] text-[#bbc9cd]'
        }`}>
          1
        </div>
        <span className={`text-sm font-semibold tracking-wide ${
          currentStep >= 1 ? 'text-[#22d3ee]' : 'text-[#859397]'
        }`}>
          Project Info
        </span>
      </div>

      {/* Divider */}
      <div className="w-12 h-[1px] bg-[#3c494c]" />

      {/* Step 2 */}
      <div className="flex items-center gap-2.5">
        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
          currentStep >= 2 ? 'bg-[#22d3ee] text-[#00363e]' : 'border border-[#3c494c] text-[#859397]'
        }`}>
          2
        </div>
        <span className={`text-sm font-semibold tracking-wide ${
          currentStep >= 2 ? 'text-[#dae2fd]' : 'text-[#859397]'
        }`}>
          Team Members
        </span>
      </div>

      {/* Divider */}
      <div className="w-12 h-[1px] bg-[#3c494c]" />

      {/* Step 3 */}
      <div className="flex items-center gap-2.5">
        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
          currentStep >= 3 ? 'bg-[#22d3ee] text-[#00363e]' : 'border border-[#3c494c] text-[#859397]'
        }`}>
          3
        </div>
        <span className={`text-sm font-semibold tracking-wide ${
          currentStep >= 3 ? 'text-[#dae2fd]' : 'text-[#859397]'
        }`}>
          Review Project Details
        </span>
      </div>
    </div>
  );
};