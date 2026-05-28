const fs = require('fs');
let c = fs.readFileSync('public/index.html', 'utf8');

// Each entry: [old sec-link line, section name]
const replacements = [
  {
    old: `      <a href="products.html" class="sec-link">All Products \u2192</a>\n    </div>\n    <div class="feat-grid"`,
    new: `      <div style="display:flex; justify-content:flex-end; margin-top:12px;">\n        <a href="products.html" class="sec-link">All Products \u2192</a>\n      </div>\n    </div>\n    <div class="feat-grid"`,
    label: 'Featured Products'
  },
  {
    old: `      <a href="print-methods.html" class="sec-link">All Methods \u2192</a>\n    </div>\n\n    <!-- BIGGER VISUAL CARDS`,
    new: `      <div style="display:flex; justify-content:flex-end; margin-top:12px;">\n        <a href="print-methods.html" class="sec-link">All Methods \u2192</a>\n      </div>\n    </div>\n\n    <!-- BIGGER VISUAL CARDS`,
    label: 'Print Methods'
  },
  {
    old: `      <a href="fabrics.html" class="sec-link">All Fabrics \u2192</a>\n    </div>\n    <div class="fab-grid"`,
    new: `      <div style="display:flex; justify-content:flex-end; margin-top:12px;">\n        <a href="fabrics.html" class="sec-link">All Fabrics \u2192</a>\n      </div>\n    </div>\n    <div class="fab-grid"`,
    label: 'Fabrics'
  }
];

// Also fix the sec-head display:grid for these sections
// Replace plain <div class="sec-head"> that contain these links with display:block version
// We do this by fixing the specific sec-head divs

for (const r of replacements) {
  if (c.includes(r.old)) {
    c = c.replace(r.old, r.new);
    console.log(`✓ ${r.label}: replaced via exact match`);
  } else {
    console.log(`✗ ${r.label}: exact match not found, trying regex...`);
  }
}

// Now fix the sec-head containers to use display:block
// For Featured Products section
c = c.replace(
  /(<div class="sec-head">)\s*(<div class="left">[\s\S]*?<\/div>)\s*(<div style="display:flex; justify-content:flex-end; margin-top:12px;">\s*<a href="products\.html" class="sec-link">All Products)/,
  `<div class="sec-head" style="display:block;">\n      $2\n      $3`
);

// For Print Methods section
c = c.replace(
  /(<div class="sec-head">)\s*(<div class="left">[\s\S]*?<\/div>)\s*(<div style="display:flex; justify-content:flex-end; margin-top:12px;">\s*<a href="print-methods\.html" class="sec-link">)/,
  `<div class="sec-head" style="display:block;">\n      $2\n      $3`
);

// For Fabrics section
c = c.replace(
  /(<div class="sec-head">)\s*(<div class="left">[\s\S]*?<\/div>)\s*(<div style="display:flex; justify-content:flex-end; margin-top:12px;">\s*<a href="fabrics\.html" class="sec-link">)/,
  `<div class="sec-head" style="display:block;">\n      $2\n      $3`
);

fs.writeFileSync('public/index.html', c, 'utf8');
console.log('\nAll done.');
