const fs = require('fs');
const path = require('path');

const dir = 'c:\\Users\\Neha Sharma\\OneDrive\\Documents\\Projects\\thesis\\LABTRACK\\FRONTEND\\src\\pages\\LabStaff';

const replacements = [
  { search: /className="text-white"/g, replace: 'className=""' },
  { search: /text-3xl font-bold/g, replace: 'ls-title-main' }, // be careful
  { search: /bg-\[\#0f172a\] border border-slate-800 rounded-xl p-5/g, replace: 'ls-stat-card' },
  { search: /bg-\[\#0f172a\] border border-slate-800 rounded-xl/g, replace: 'ls-card' },
  { search: /bg-\[\#0f172a\] border border-slate-800/g, replace: 'bg-white border border-slate-200' },
  { search: /bg-\[\#111827\]/g, replace: 'bg-slate-50' },
  { search: /border-slate-800/g, replace: 'border-slate-200' },
  { search: /hover:bg-slate-900\/40/g, replace: 'hover:bg-slate-50' },
  { search: /hover:bg-slate-800/g, replace: 'hover:bg-slate-100' },
  { search: /hover:text-white/g, replace: 'hover:text-slate-900' },
  { search: /text-slate-300/g, replace: 'text-slate-600' },
  { search: /text-slate-400/g, replace: 'ls-text-secondary' },
  { search: /text-cyan-400/g, replace: 'text-cyan-600' },
  { search: /text-red-400/g, replace: 'text-red-600' },
  { search: /text-green-400/g, replace: 'text-green-600' },
  { search: /text-yellow-400/g, replace: 'text-amber-500' },
  { search: /text-amber-400/g, replace: 'text-amber-600' },
  { search: /text-orange-400/g, replace: 'text-orange-600' },
  { search: /bg-slate-800 hover:bg-slate-700/g, replace: 'ls-btn-secondary' },
  { search: /bg-cyan-500 hover:bg-cyan-600/g, replace: 'ls-btn-primary' },
  { search: /bg-cyan-600 hover:bg-cyan-700/g, replace: 'ls-btn-primary' },
  { search: /bg-red-500 hover:bg-red-600/g, replace: 'ls-btn-danger' },
  { search: /bg-green-500\/10/g, replace: 'bg-green-50' },
  { search: /border-green-500\/30/g, replace: 'border-green-200' },
  { search: /bg-yellow-500\/10/g, replace: 'bg-amber-50' },
  { search: /border-yellow-500\/30/g, replace: 'border-amber-200' },
  { search: /bg-red-500\/10/g, replace: 'bg-red-50' },
  { search: /border-red-500\/30/g, replace: 'border-red-200' },
  { search: /bg-amber-500\/10/g, replace: 'bg-amber-50' },
  { search: /border-amber-500\/30/g, replace: 'border-amber-200' },
  { search: /bg-orange-500\/10/g, replace: 'bg-orange-50' },
  { search: /border-orange-500\/30/g, replace: 'border-orange-200' },
  { search: /bg-cyan-500\/10/g, replace: 'bg-cyan-50' },
  { search: /border-cyan-500\/30/g, replace: 'border-cyan-200' },
  { search: /bg-slate-500\/10/g, replace: 'bg-slate-100' },
  { search: /border-slate-500\/30/g, replace: 'border-slate-200' },
  { search: /text-white/g, replace: 'text-slate-900' },
];

fs.readdirSync(dir).forEach(file => {
  if (file.endsWith('.jsx')) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Only apply if we haven't manually rewritten it yet, except Dashboard which we did but it's fine.
    // wait, I rewrote Dashboard and ComponentDemand. 
    // I should rewrite them using the node script as well to be consistent.

    replacements.forEach(({ search, replace }) => {
      content = content.replace(search, replace);
    });

    // Fix some specific things that might have broken
    content = content.replace(/ls-title-main mt-2/g, 'text-3xl font-bold mt-2'); // stat values

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Processed ${file}`);
  }
});
