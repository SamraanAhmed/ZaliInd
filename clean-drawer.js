const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
const files = fs.readdirSync(publicDir).filter(f => f.endsWith('.html'));

let removedCount = 0;

for (const file of files) {
  const filePath = path.join(publicDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Find the start: <div class="bb-md-overlay" id="m-overlay"></div>
  const startStr = '<div class="bb-md-overlay" id="m-overlay"></div>';
  const endStr = '})();\n</script>';

  const startIndex = content.indexOf(startStr);
  if (startIndex !== -1) {
    const endIndex = content.indexOf(endStr, startIndex);
    if (endIndex !== -1) {
      const actualEnd = endIndex + endStr.length;
      content = content.substring(0, startIndex) + content.substring(actualEnd);
      fs.writeFileSync(filePath, content);
      removedCount++;
      console.log(`Cleaned ${file}`);
    } else {
      console.log(`Found start but not end in ${file}`);
    }
  } else {
    console.log(`No drawer found in ${file}`);
  }
}

console.log(`Removed hardcoded drawer from ${removedCount} files.`);
