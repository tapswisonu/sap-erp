const fs = require('fs');
const path = require('path');

const dirs = [
  path.join(__dirname, 'app/dashboard'),
  path.join(__dirname, 'components')
];

function processDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;

      // Fix overlays
      content = content.replace(/bg-background\/80 backdrop-blur-sm/g, 'bg-black/40 backdrop-blur-sm');
      content = content.replace(/bg-background\/80 backdrop-blur/g, 'bg-black/40 backdrop-blur-sm');
      
      // Fix drawer/modal headers and footers that were explicitly transparent white
      content = content.replace(/bg-white\/5(?! border)/g, 'bg-gray-50 dark:bg-white/5');
      content = content.replace(/bg-white\/10(?! border)/g, 'bg-gray-100 dark:bg-white/10');
      
      // Fix borders
      content = content.replace(/border-white\/10/g, 'border-gray-200 dark:border-white/10');
      content = content.replace(/border-white\/5/g, 'border-gray-200 dark:border-white/5');
      
      // Fix text visibility for light theme (cyan)
      content = content.replace(/text-cyan-400(?! dark:)/g, 'text-cyan-600 dark:text-cyan-400');
      
      // Any remaining bg-white/X that wasn't caught
      content = content.replace(/bg-gray-50 dark:bg-gray-50 dark:bg-white\/5/g, 'bg-gray-50 dark:bg-white/5'); // fix double replacements
      content = content.replace(/bg-gray-100 dark:bg-gray-100 dark:bg-white\/10/g, 'bg-gray-100 dark:bg-white/10'); 
      content = content.replace(/border-gray-200 dark:border-gray-200 dark:border-white\/10/g, 'border-gray-200 dark:border-white/10');

      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Fixed', fullPath);
      }
    }
  }
}

for (const dir of dirs) {
  processDir(dir);
}
console.log('Done');
