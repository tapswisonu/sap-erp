const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'data');
const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));

const schemaMap = {};

for (const file of files) {
  try {
    const content = fs.readFileSync(path.join(dataDir, file), 'utf8');
    const data = JSON.parse(content);
    if (Array.isArray(data) && data.length > 0) {
      const sample = data[0];
      const types = {};
      for (const [key, value] of Object.entries(sample)) {
        types[key] = typeof value;
      }
      schemaMap[file] = types;
    }
  } catch (e) {
    console.error(`Error reading ${file}`);
  }
}

console.log(JSON.stringify(schemaMap, null, 2));
