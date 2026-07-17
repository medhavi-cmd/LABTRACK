import React from 'react';

export const StepIndicator = ({ currentStep = 1 }) => {
  return (
    <div className="flex items-center gap-6 my-6 font-sans">
      {/* Step 1 */}
      <div className="flex items-center gap-2.5">
        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
          currentStep >= 1 ? 'bg-[#2563EB] text-white' : 'border border-slate-200 bg-slate-50 text-slate-400'
        }`}>
          1
        </div>
        <span className={`text-sm font-bold tracking-wide ${
          currentStep >= 1 ? 'text-[#2563EB]' : 'text-slate-400'
        }`}>
          Project Info
        </span>
      </div>

      <div className="w-12 h-[1px] bg-slate-200" />

      <div className="flex items-center gap-2.5">
        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
          currentStep >= 2 ? 'bg-[#2563EB] text-white' : 'border border-slate-200 bg-slate-50 text-slate-400'
        }`}>
          2
        </div>
        <span className={`text-sm font-bold tracking-wide ${
          currentStep >= 2 ? 'text-slate-900' : 'text-slate-400'
        }`}>
          Team Members
        </span>
      </div>

      <div className="w-12 h-[1px] bg-slate-200" />

      <div className="flex items-center gap-2.5">
        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
          currentStep >= 3 ? 'bg-[#2563EB] text-white' : 'border border-slate-200 bg-slate-50 text-slate-400'
        }`}>
          3
        </div>
        <span className={`text-sm font-bold tracking-wide ${
          currentStep >= 3 ? 'text-slate-900' : 'text-slate-400'
        }`}>
          Review Project Details
        </span>
      </div>
    </div>
  );
};