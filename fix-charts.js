const fs = require('fs');
const path = require('path');

const dirs = [
  path.join(__dirname, 'app/dashboard'),
  path.join(__dirname, 'components/dashboard')
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

      // Fix Grid
      content = content.replace(/stroke="rgba\(255,255,255,0\.05\)"/g, 'stroke="var(--chart-grid)"');
      content = content.replace(/stroke="rgba\(255,255,255,0\.04\)"/g, 'stroke="var(--chart-grid)"');
      
      // Fix Axes
      content = content.replace(/stroke="rgba\(255,255,255,0\.4\)"/g, 'stroke="var(--chart-axis)"');
      content = content.replace(/stroke="rgba\(255,255,255,0\.3\)"/g, 'stroke="var(--chart-axis)"');
      content = content.replace(/stroke="rgba\(255,255,255,0\.2\)"/g, 'stroke="var(--chart-axis)"');
      
      // Fix Fills in ticks
      content = content.replace(/fill: "rgba\(255,255,255,0\.4\)"/g, 'fill: "var(--chart-text)"');
      content = content.replace(/fill: "rgba\(255,255,255,0\.3\)"/g, 'fill: "var(--chart-text)"');
      
      // Fix Tooltips (they might have hardcoded dark backgrounds which look bad in light mode)
      // Tooltips usually have contentStyle={{ backgroundColor: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }}
      content = content.replace(/contentStyle={{[^}]+}}/g, 'contentStyle={{ backgroundColor: "var(--tooltip-bg)", border: "1px solid var(--tooltip-border)", borderRadius: "12px", color: "var(--tooltip-text)" }}');
      content = content.replace(/labelStyle={{[^}]+}}/g, 'labelStyle={{ color: "var(--tooltip-label)", fontSize: "12px", marginBottom: "4px" }}');

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
