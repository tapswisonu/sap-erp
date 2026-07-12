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

      // Fix Drawer: Replace `bg-background` with solid colors
      content = content.replace(/className="fixed inset-y-0 right-0 z-50 w-full sm:w-\[450px\] bg-background/g, 'className="fixed inset-y-0 right-0 z-50 w-full sm:w-[450px] bg-white dark:bg-[#0a0a0a]');
      
      // Fix generic modal boxes that might be using bg-background
      // Look for relative/absolute/fixed positioning with bg-background that represents a card/modal
      content = content.replace(/bg-background rounded-2xl p-6/g, 'bg-white dark:bg-[#0a0a0a] rounded-2xl p-6');
      content = content.replace(/bg-background border/g, 'bg-white dark:bg-[#0a0a0a] border');
      
      // Also catch any stray bg-background/X in drawers
      content = content.replace(/bg-background\/[0-9]+/g, 'bg-white dark:bg-[#0a0a0a]');

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
