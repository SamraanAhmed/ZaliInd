const fs = require('fs');
let c = fs.readFileSync('public/sample-pack.html', 'utf8');

// 1. Update grid column count
c = c.replace('.included-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }', '.included-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 18px; }');

// 2. Replace placeholder with image
c = c.replace('<span class="placeholder-banner">PLACEHOLDER - Sample Pack Photo</span>', '<img src="SiteData/sample.png" alt="Sample Pack" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: 1;">');
c = c.replace('<div class="sp-hero-visual-overlay">', '<div class="sp-hero-visual-overlay" style="z-index: 2;">');

// 3. Remove "Capability deck" card
const blockStart = c.indexOf('<div class="inc-card">\\n        <div class="inc-num"><span class="tri tri-sm"></span> 03</div>');
if (blockStart !== -1) {
    const blockEnd = c.indexOf('</div>\\n    </div>\\n  </div>\\n</section>', blockStart);
    if (blockEnd !== -1) {
        c = c.slice(0, blockStart) + c.slice(blockEnd);
    }
} else {
    // try with \\r\\n
    const blockStartRN = c.indexOf('<div class="inc-card">\\r\\n        <div class="inc-num"><span class="tri tri-sm"></span> 03</div>');
    if (blockStartRN !== -1) {
        const blockEndRN = c.indexOf('</div>\\r\\n    </div>\\r\\n  </div>\\r\\n</section>', blockStartRN);
        if (blockEndRN !== -1) {
            c = c.slice(0, blockStartRN) + c.slice(blockEndRN);
        }
    }
}

fs.writeFileSync('public/sample-pack.html', c, 'utf8');
console.log('Done');
