const fs = require('fs');
const path = require('path');

const dir = 'c:\\Users\\Neha Sharma\\OneDrive\\Documents\\Projects\\thesis\\LABTRACK\\FRONTEND\\src\\pages\\LabStaff';

const replacements = [
  // Settings.jsx fixes
  { search: /bg-white border border-cyan-200 rounded-xl p-5/g, replace: 'ls-card' },
  { search: /divide-slate-800/g, replace: 'divide-slate-100' },
  { search: /bg-slate-700/g, replace: 'bg-slate-300' }, // For toggle switch off state
  { search: /text-slate-500/g, replace: 'ls-text-secondary' }, // Ensure all slate-500 uses class
  { search: /w-full bg-white border border-slate-200 rounded-lg px-4 py-2\.5 outline-none focus:border-cyan-500/g, replace: 'ls-input' },

  // General sweep for any missed backgrounds
  { search: /bg-\[\#020817\]/g, replace: 'bg-transparent' }, // If it sneaked in
  { search: /bg-slate-900\/40/g, replace: 'bg-slate-900/10' }, // Modals overlay
];

fs.readdirSync(dir).forEach(file => {
  if (file.endsWith('.jsx')) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    replacements.forEach(({ search, replace }) => {
      content = content.replace(search, replace);
    });

    fs.writeFileSync(filePath, content, 'utf8');
  }
});
console.log("Third pass complete");
