const fs = require('fs');
let c = fs.readFileSync('public/about.html', 'utf8');

// Find the sialkot-photo div and replace its entire inner content
const startMarker = '<div class="sialkot-photo" style="position: relative;">';
const endMarker = '</div>\n          </div>\n        </div>\n      </div>\n    </section>\n\n    <!-- VALUES -->';

const start = c.indexOf(startMarker);
const end = c.indexOf(endMarker, start);

if (start === -1 || end === -1) {
  // Try with \r\n
  const endMarkerRN = '</div>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </section>\r\n\r\n    <!-- VALUES -->';
  const endRN = c.indexOf(endMarkerRN, start);
  if (endRN === -1) {
    console.error('Could not find end marker');
    process.exit(1);
  }
  const replacement = `<div class="sialkot-photo" style="position: relative;">
            <img src="SiteData/Sialkpt.png" alt="Sialkot, Pakistan" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: 0;">
            <div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.95) 0%, transparent 40%); z-index: 1; pointer-events: none;"></div>
            <div style="position: absolute; inset: 0; padding: 28px; display: flex; flex-direction: column; justify-content: space-between; color: var(--bg); z-index: 2;">
              <span style="background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.18); padding: 7px 14px 7px 10px; font-family: var(--mono); font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; display: inline-flex; align-items: center; gap: 8px; align-self: flex-start;"><span class="tri tri-sm" style="margin-right:0"></span> The City</span>
              <div>
                <div style="font-family: var(--display); font-size: 24px; line-height: 1.15; font-weight: 400; max-width: 290px; letter-spacing: -0.01em;">
                  <em style="color: var(--accent); font-style: italic">Sialkot, Pakistan.</em><br>Where the world's gear gets made.
                </div>
              </div>
            </div>
            <div style="position: absolute; bottom: 0; right: 0; z-index: 3; width: 0; height: 0; border-left: 50px solid transparent; border-bottom: 50px solid var(--accent);"></div>
          </div>`;
  c = c.slice(0, start) + replacement + c.slice(endRN);
} else {
  const replacement = `<div class="sialkot-photo" style="position: relative;">
            <img src="SiteData/Sialkpt.png" alt="Sialkot, Pakistan" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: 0;">
            <div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.95) 0%, transparent 40%); z-index: 1; pointer-events: none;"></div>
            <div style="position: absolute; inset: 0; padding: 28px; display: flex; flex-direction: column; justify-content: space-between; color: var(--bg); z-index: 2;">
              <span style="background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.18); padding: 7px 14px 7px 10px; font-family: var(--mono); font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; display: inline-flex; align-items: center; gap: 8px; align-self: flex-start;"><span class="tri tri-sm" style="margin-right:0"></span> The City</span>
              <div>
                <div style="font-family: var(--display); font-size: 24px; line-height: 1.15; font-weight: 400; max-width: 290px; letter-spacing: -0.01em;">
                  <em style="color: var(--accent); font-style: italic">Sialkot, Pakistan.</em><br>Where the world's gear gets made.
                </div>
              </div>
            </div>
            <div style="position: absolute; bottom: 0; right: 0; z-index: 3; width: 0; height: 0; border-left: 50px solid transparent; border-bottom: 50px solid var(--accent);"></div>
          </div>`;
  c = c.slice(0, start) + replacement + c.slice(end);
}

fs.writeFileSync('public/about.html', c, 'utf8');
console.log('Done');
console.log('iframe remaining?', c.includes('maps.google.com'));
console.log('image present?', c.includes('Sialkpt.png'));
