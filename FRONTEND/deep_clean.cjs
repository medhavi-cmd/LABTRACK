const fs = require('fs');
const path = require('path');

const dir = 'c:\\Users\\Neha Sharma\\OneDrive\\Documents\\Projects\\thesis\\LABTRACK\\FRONTEND\\src\\pages\\LabStaff';

const replacements = [
  { search: /bg-\[\#0f172a\]/g, replace: 'bg-white' },
  { search: /bg-\[\#111827\]/g, replace: 'bg-slate-50' },
  { search: /bg-\[\#0b1730\]/g, replace: 'bg-white' },
  { search: /text-white/g, replace: 'text-slate-900' },
  { search: /text-slate-200/g, replace: 'text-slate-600' },
  { search: /text-slate-300/g, replace: 'text-slate-600' },
  { search: /text-slate-400/g, replace: 'ls-text-secondary' },
  { search: /border-slate-800/g, replace: 'border-slate-200' },
  { search: /border-slate-700/g, replace: 'border-slate-200' },
  { search: /hover:bg-slate-800/g, replace: 'hover:bg-slate-100' },
  { search: /hover:bg-slate-700/g, replace: 'hover:bg-slate-100' },
  { search: /bg-slate-800/g, replace: 'bg-slate-100' }, // Be careful with buttons! They were mostly fixed.
  { search: /border-green-[0-9]{3}\/\d+/g, replace: 'border-green-200' },
  { search: /border-red-[0-9]{3}\/\d+/g, replace: 'border-red-200' },
  { search: /border-cyan-[0-9]{3}\/\d+/g, replace: 'border-cyan-200' },
  { search: /bg-red-[0-9]{3}\/\d+/g, replace: 'bg-red-50' },
  // "text-slate-900" is light mode, but sometimes we want ls-title-main or ls-text-primary
];

fs.readdirSync(dir).forEach(file => {
  if (file.endsWith('.jsx')) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    replacements.forEach(({ search, replace }) => {
      content = content.replace(search, replace);
    });

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Deep cleaned ${file}`);
  }
});
