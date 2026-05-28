const fs = require('fs');
let c = fs.readFileSync('public/index.html', 'utf8');

const oldBlock = `    <div class="sec-head">
      <div class="left">
        <span class="sec-eyebrow"><span class="tri tri-sm"></span> 01 / Range</span>
        <h2 class="sec-h2">Apparel for every <em>lane.</em></h2>
        <p class="sec-desc">Eight categories. Every garment cut, sewn, sublimated, and finished in our Sialkot facility. Ready to be your label.</p>
      </div>
      <a href="products.html" class="sec-link">View All Products \u{2192}</a>
    </div>`;

const newBlock = `    <div class="sec-head" style="display:block;">
      <div class="left" style="max-width:760px;">
        <span class="sec-eyebrow"><span class="tri tri-sm"></span> 01 / Range</span>
        <h2 class="sec-h2">Apparel for every <em>lane.</em></h2>
        <p class="sec-desc">Eight categories. Every garment cut, sewn, sublimated, and finished in our Sialkot facility. Ready to be your label.</p>
      </div>
      <div style="display:flex; justify-content:flex-end; margin-top:12px;">
        <a href="products.html" class="sec-link">View All Products →</a>
      </div>
    </div>`;

if (c.includes(oldBlock)) {
  c = c.replace(oldBlock, newBlock);
  console.log('Replaced via exact match');
} else {
  // Fallback: regex
  c = c.replace(
    /(<div class="sec-head">)\s*(<div class="left">[\s\S]*?<\/div>)\s*(<a href="products\.html" class="sec-link">.*?<\/a>)\s*(<\/div>)/,
    `<div class="sec-head" style="display:block;">\n      $2\n      <div style="display:flex; justify-content:flex-end; margin-top:12px;">$3</div>\n    $4`
  );
  console.log('Replaced via regex');
}

fs.writeFileSync('public/index.html', c, 'utf8');
console.log('sec-link present?', c.includes('sec-link'));
