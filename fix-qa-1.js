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

      // 1. Zod Validation improvements
      content = content.replace(/z\.string\(\)\.min\(/g, 'z.string().trim().regex(/^[^<>{}$]*$/, "Invalid characters").min(');
      
      // 2. React Query keepPreviousData
      if (content.includes('useQuery({') && !content.includes('keepPreviousData')) {
        // Add keepPreviousData to imports
        if (content.includes('@tanstack/react-query')) {
          content = content.replace(/import {([^}]+)} from "@tanstack\/react-query";/, (match, p1) => {
            if (!p1.includes('keepPreviousData')) {
              return `import {${p1}, keepPreviousData } from "@tanstack/react-query";`;
            }
            return match;
          });
        }
        
        // Add placeholderData to useQuery
        content = content.replace(/(useQuery\({[\s\S]*?queryFn: [^,]+,)([\s\S]*?}\));/g, '$1\n    placeholderData: keepPreviousData,$2;');
      }

      // 3. Descriptive Toasts
      content = content.replace(/toast\.success\("Record added"\)/g, 'toast.success("Successfully created new record", { description: "The data has been saved to the database." })');
      content = content.replace(/toast\.success\("Record updated"\)/g, 'toast.success("Successfully updated record", { description: "Changes have been applied successfully." })');
      content = content.replace(/toast\.success\("Record deleted"\)/g, 'toast.success("Successfully deleted record", { description: "The record has been permanently removed." })');

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
