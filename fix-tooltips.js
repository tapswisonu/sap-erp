const fs = require('fs');
const path = require('path');

const dirs = [
  path.join(__dirname, 'components/dashboard'),
  path.join(__dirname, 'components/dashboard/charts')
];

function fixDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      fixDir(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;

      // Fix double slash closing tags
      content = content.replace(/\/\/>/g, '/>');

      // Also fix `/>>` which might happen if it was a self closing tag but it matched >
      content = content.replace(/\/>>/g, '/>');

      // Fix `>/>` 
      content = content.replace(/>\/>/g, '/>');
      
      // Fix `<Tooltip wrapperStyle={{ zIndex: 100, pointerEvents: 'none', maxWidth: '90vw' }} content={<CustomTooltip />} />>` -> `<Tooltip wrapperStyle={{ zIndex: 100, pointerEvents: 'none', maxWidth: '90vw' }} content={<CustomTooltip />} />`
      content = content.replace(/<Tooltip([^>]*?)(\/?>)?\s*\/?>/g, (match, p1) => {
        // Just normalize any messed up Tooltips by brute force replacing the end
        // if it already has double endings
        return match; // We did this via string replace above anyway
      });

      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Fixed', fullPath);
      }
    }
  }
}

for (const dir of dirs) {
  fixDir(dir);
}
console.log('Done');
