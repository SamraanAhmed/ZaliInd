const fs = require('fs');
let c = fs.readFileSync('public/sample-pack.html', 'utf8');

// 1. Replace placeholder with actual image (search by partial class name to avoid encoding issues)
c = c.replace(/class="sp-hero-visual">\s*<span class="placeholder-banner">[^<]*<\/span>/,
  'class="sp-hero-visual"><img src="SiteData/sample.png" alt="Sample Pack" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:1;">');

// 2. Add z-index to overlay (now overlay comes right after)
c = c.replace(
  '<div class="sp-hero-visual-overlay">',
  '<div class="sp-hero-visual-overlay" style="z-index:2;">'
);

// 3. Remove Capability deck card (card 03 in the included-grid)
c = c.replace(
  /\s*<div class="inc-card">\s*<div class="inc-num"><span class="tri tri-sm"><\/span>\s*03<\/div>[\s\S]*?<\/div>\s*<\/div>\s*(<\/div>\s*<\/div>\s*<\/section>)/,
  '\n    </div>\n  </div>\n</section>'
);

fs.writeFileSync('public/sample-pack.html', c, 'utf8');
console.log('Done');
console.log('Placeholder remaining?', c.includes('placeholder-banner'));
console.log('Image present?', c.includes('sample.png'));
console.log('Capability deck remaining?', c.includes('<h4><em>Capability</em> deck</h4>'));
