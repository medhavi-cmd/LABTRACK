const fs = require('fs');
const path = require('path');

const dir = 'c:\\Users\\Neha Sharma\\OneDrive\\Documents\\Projects\\thesis\\LABTRACK\\FRONTEND\\src\\pages\\LabStaff';

const replacements = [
  // Typography
  { search: /text-3xl font-bold mt-2/g, replace: 'ls-stat-value' },
  { search: /text-3xl font-bold/g, replace: 'ls-title-main' },
  { search: /text-xl font-semibold/g, replace: 'ls-title-card' },

  // Tables
  { search: /bg-white border border-slate-200 rounded-xl overflow-hidden/g, replace: 'ls-table-container' },
  { search: /p-5 border-b border-slate-200/g, replace: 'ls-table-header' },
  { search: /<thead className="bg-slate-50">/g, replace: '<thead>' },
  { search: /<th className="text-left px-6 py-4/g, replace: '<th className="ls-table-th' },
  { search: /<td className="px-6 py-4/g, replace: '<td className="ls-table-td' },
  { search: /border-t border-slate-200 hover:bg-slate-50/g, replace: 'ls-table-tr' },
  { search: /hover:bg-slate-900\/40/g, replace: 'hover:bg-slate-50' },

  // Inputs
  { search: /w-full bg-white border border-slate-200 rounded-lg pl-12 pr-4 py-3 outline-none focus:border-cyan-500/g, replace: 'ls-input ls-input-search' },
  { search: /w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2\.5 outline-none transition-colors focus:border-cyan-500/g, replace: 'ls-input' },

  // Progress bars
  { search: /bg-slate-800 rounded-full h-2/g, replace: 'bg-slate-100 rounded-full h-2' },

  // Stats Card Fixes
  { search: /ls-title-main text-green-600 mt-2/g, replace: 'ls-stat-value text-green-600' },
  { search: /ls-title-main text-orange-600 mt-2/g, replace: 'ls-stat-value text-orange-600' },
  { search: /ls-title-main text-red-600 mt-2/g, replace: 'ls-stat-value text-red-600' },
  { search: /ls-title-main text-amber-500/g, replace: 'ls-stat-value text-amber-500' },
  { search: /ls-title-main text-cyan-600/g, replace: 'ls-stat-value text-cyan-600' },

  // Modals
  { search: /fixed inset-0 bg-black\/60 flex items-center justify-center z-50 px-4 transition-opacity duration-200/g, replace: 'ls-modal-overlay' },
  { search: /fixed inset-0 bg-black\/60 flex items-center justify-center z-50 px-4/g, replace: 'ls-modal-overlay' },
  { search: /bg-white border border-slate-200 rounded-xl w-full (max-w-\w+) p-6 shadow-xl transition-transform duration-200 scale-100 max-h-\[90vh\] overflow-y-auto/g, replace: 'ls-modal-content $1' },
  { search: /bg-white border border-slate-200 rounded-xl w-full (max-w-\w+) p-6 shadow-xl max-h-\[90vh\] overflow-y-auto/g, replace: 'ls-modal-content $1' },
  { search: /flex items-center justify-between mb-5/g, replace: 'ls-modal-header' },
  { search: /text-slate-400 hover:text-slate-900 hover:bg-slate-100 p-1\.5 rounded-lg transition-colors/g, replace: 'ls-modal-close' },
  { search: /text-slate-400 hover:text-cyan-600 p-1\.5 rounded-lg transition-colors/g, replace: 'ls-icon-btn' },
];

fs.readdirSync(dir).forEach(file => {
  if (file.endsWith('.jsx')) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    replacements.forEach(({ search, replace }) => {
      content = content.replace(search, replace);
    });

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Processed Pass 2 for ${file}`);
  }
});
