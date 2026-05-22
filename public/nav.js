/* ============================================================
   nav.js  —  Dynamic navigation builder for ZALI Industries
   Reads ZALI_CATALOG from products-data.js (must be loaded first)
   ============================================================ */

window.optImg = function(src, w=800) {
  if (!src) return src;
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') return src;
  const decoded = decodeURIComponent(src);
  const abs = decoded.startsWith('/') ? decoded : '/' + decoded;
  const encodedAbs = abs.split('/').map(encodeURIComponent).join('/');
  return `/.netlify/images?url=${encodedAbs}&w=${w}&fm=webp`;
};

(function () {
  'use strict';

  // ── Current page detection ──────────────────────────────────
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  // ── Nav structure definition ────────────────────────────────
  // Maps category id → display label + anchor used in nav
  const CAT_META = {
    'casual-wear':  { label: 'Casual Wear',   anchor: '#casual' },
    'fightwear':    { label: 'Fightwear',      anchor: '#fightwear' },
    'sportswear':   { label: 'SportsWear',     anchor: '#sportswear' },
    'surfwear':     { label: 'SurfWear',       anchor: '#surfwear' },
    'team-sports':  { label: 'Team Sports',    anchor: '#team' },
  };

  // For Team Sports, group subcategories under their nav group
  const TEAM_NAV_GROUPS = [
    'Most Popular',
    'Field & Court',
    'Track, Cycling & Combat',
    'Specialty',
  ];

  // ── Helper ──────────────────────────────────────────────────
  function productUrl(prod) {
    return 'product-detail.html?id=' + encodeURIComponent(prod.id);
  }

  function productsPageUrl(catId) {
    const anchors = {
      'casual-wear': '#casual',
      'fightwear':   '#fightwear',
      'sportswear':  '#sportswear',
      'surfwear':    '#surfwear',
      'team-sports': '#team',
    };
    return 'products.html' + (anchors[catId] || '');
  }

  // ── Build dropdown HTML for each category ───────────────────
  function buildCatDropdown(cat) {
    if (cat.id === 'team-sports') {
      return buildTeamDropdown(cat);
    }

    // Group subcategories into columns (max 12 items per col)
    const subs = cat.subcategories;
    const colCount = Math.min(subs.length, 7);
    let html = `<div class="bb-cols bb-cols-${colCount}">`;

    subs.forEach(sub => {
      html += `<div class="bb-col">`;
      html += `<h4 class="bb-col-h">${sub.name}</h4>`;
      // Show up to 10 products per subcategory column
      sub.products.slice(0, 10).forEach(p => {
        html += `<a href="${productUrl(p)}" class="bb-col-link">${p.name}</a>`;
      });
      html += `</div>`;
    });

    html += `</div>`;
    return html;
  }

  function buildTeamDropdown(cat) {
    // Group subcategories by their nav group
    const grouped = {};
    TEAM_NAV_GROUPS.forEach(g => { grouped[g] = []; });

    cat.subcategories.forEach(sub => {
      const grp = sub.group || 'Specialty';
      if (!grouped[grp]) grouped[grp] = [];
      grouped[grp].push(sub);
    });

    const colCount = TEAM_NAV_GROUPS.filter(g => grouped[g] && grouped[g].length).length;
    let html = `<div class="bb-cols bb-cols-${colCount}">`;

    TEAM_NAV_GROUPS.forEach(grp => {
      const subs = grouped[grp];
      if (!subs || !subs.length) return;

      html += `<div class="bb-col">`;
      html += `<h4 class="bb-col-h">${grp}</h4>`;
      subs.forEach(sub => {
        html += `<a href="products.html#team-${sub.slug}" class="bb-col-link">${sub.name}</a>`;
      });
      html += `</div>`;
    });

    html += `</div>`;
    return html;
  }

  // ── Build full nav HTML ──────────────────────────────────────
  function buildNav() {
    if (!window.ZALI_CATALOG) {
      console.warn('nav.js: ZALI_CATALOG not loaded yet');
      return;
    }

    const navEl = document.querySelector('nav.bb-nav');
    if (!navEl) return;

    // Build category bar left section
    let catLinks = '';
    ZALI_CATALOG.categories.forEach(cat => {
      const meta = CAT_META[cat.id];
      if (!meta) return;
      catLinks += `
        <div class="bb-cat" data-cat="${cat.id}">
          <a href="products.html${CAT_META[cat.id].anchor}" class="bb-cat-link">${meta.label} <span class="bb-arr">▼</span></a>
          <div class="bb-dropdown" data-dropdown="${cat.id}">
            ${buildCatDropdown(cat)}
          </div>
        </div>`;
    });

    const newNav = `
      <div class="bb-nav-main">
        <a href="index.html" class="bb-nav-logo">
          <img src="logo.svg" alt="ZALI Industries">
        </a>
        <div class="bb-nav-right">
          <a href="contact.html" class="bb-nav-cta">Get a Quote →</a>
          <button class="bb-burger" aria-label="Open menu"><span></span><span></span><span></span></button>
        </div>
      </div>
      <div class="bb-nav-cats">
        <div class="bb-nav-cats-inner">
          <div class="bb-nav-cats-left">
            ${catLinks}
          </div>
          <div class="bb-nav-cats-right">
            <a href="fabrics.html" class="bb-cat-link bb-cat-simple">Fabrics</a>
            <a href="how-it-works.html" class="bb-cat-link bb-cat-simple">How It Works</a>
            <a href="about.html" class="bb-cat-link bb-cat-simple">About</a>
            <a href="contact.html" class="bb-cat-link bb-cat-simple">Contact</a>
          </div>
        </div>
      </div>`;

    navEl.innerHTML = newNav;
    initNavBehavior(navEl);
  }

  // ── Re-attach dropdown + burger behaviour ───────────────────
  function initNavBehavior(navEl) {
    // Dropdown hover
    navEl.querySelectorAll('.bb-cat').forEach(cat => {
      const dd = cat.querySelector('.bb-dropdown');
      if (!dd) return;
      cat.addEventListener('mouseenter', () => dd.classList.add('open'));
      cat.addEventListener('mouseleave', () => dd.classList.remove('open'));
    });

    // Burger / mobile menu
    const burger  = navEl.querySelector('.bb-burger');
    if (burger) {
      burger.addEventListener('click', () => {
        const drawer = document.getElementById('m-drawer');
        const overlay = document.getElementById('m-overlay');
        if (drawer) {
          const isOpen = drawer.classList.contains('open');
          if (isOpen) {
            drawer.classList.remove('open');
            if (overlay) overlay.classList.remove('open');
            burger.classList.remove('open');
            document.body.classList.remove('bb-md-locked');
          } else {
            drawer.classList.add('open');
            if (overlay) overlay.classList.add('open');
            burger.classList.add('open');
            document.body.classList.add('bb-md-locked');
          }
        }
      });
    }

    // Close dropdown on outside click
    document.addEventListener('click', e => {
      if (!navEl.contains(e.target)) {
        navEl.querySelectorAll('.bb-dropdown.open').forEach(d => d.classList.remove('open'));
      }
    });
  }

  // ── Init ─────────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildNav);
  } else {
    buildNav();
  }

  // ── Global Page Transition Loader ─────────────────────────────
  const loaderStyle = document.createElement('style');
  loaderStyle.innerHTML = `
    .zali-page-loader {
      position: fixed;
      inset: 0;
      background-color: var(--bg);
      z-index: 999999;
      display: flex;
      justify-content: center;
      align-items: center;
      opacity: 1;
      visibility: visible;
      transition: opacity 0.3s ease, visibility 0.3s ease;
    }
    .zali-page-loader.hidden {
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
    }
    .zali-loader-spinner {
      width: 40px;
      height: 40px;
      border: 3px solid var(--bg-line);
      border-top-color: var(--accent);
      border-radius: 50%;
      animation: zaliSpin 1s linear infinite;
    }
    @keyframes zaliSpin {
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(loaderStyle);

  const loader = document.createElement('div');
  loader.className = 'zali-page-loader hidden';
  loader.innerHTML = '<div class="zali-loader-spinner"></div>';
  document.body.appendChild(loader);

  // Hide loader when page loads or restores from bfcache
  window.addEventListener('pageshow', () => {
    loader.classList.add('hidden');
  });

  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;
    
    const href = link.getAttribute('href');
    if (!href) return;
    
    // Ignore external, new tab, mailto, tel, JS, or hash links
    if (
      link.target === '_blank' || 
      href.startsWith('mailto:') || 
      href.startsWith('tel:') || 
      href.startsWith('#') ||
      href.includes('javascript:')
    ) return;
    
    // Ignore hash navigation on the same page
    try {
      const linkUrl = new URL(link.href);
      const currentUrl = new URL(window.location.href);
      if (linkUrl.pathname === currentUrl.pathname && linkUrl.search === currentUrl.search) {
        return;
      }
    } catch(err) {}

    // Show loader and delay navigation
    e.preventDefault();
    loader.classList.remove('hidden');
    
    setTimeout(() => {
      window.location.href = link.href;
    }, 200);
  });

})();
