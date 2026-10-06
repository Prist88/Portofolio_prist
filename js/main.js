/* ============================================================
   main.js — versi simple, foto diganti via JS
   ============================================================ */

/* ---------------- 1. Tahun footer ---------------- */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ---------------- 2. Path foto per tema ---------------- */
const PHOTOS = {
  dark:  'assets/profile-dark.jpg',
  light: 'assets/profile-light.jpg'
};

function applyPhotos(theme) {
  const src = PHOTOS[theme] || PHOTOS.dark;

  const brand = document.getElementById('brandPhoto');
  const hero  = document.getElementById('heroPhoto');

  if (brand) brand.src = src;
  if (hero)  hero.src  = src;

  // Animasi pulse
  [brand, hero].forEach(el => {
    if (!el) return;
    el.classList.remove('avatar-pulse');
    void el.offsetWidth;
    el.classList.add('avatar-pulse');
    setTimeout(() => el.classList.remove('avatar-pulse'), 500);
  });
}

/* ---------------- 3. Tema ---------------- */
(function initTheme() {
  const root = document.documentElement;
  const saved = localStorage.getItem('theme');

  let theme;
  if (saved === 'light' || saved === 'dark') {
    theme = saved;
  } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
    theme = 'light';
  } else {
    theme = 'dark';
  }

  root.setAttribute('data-theme', theme);
  // Ganti foto setelah DOM siap
  document.addEventListener('DOMContentLoaded', () => applyPhotos(theme));
  // fallback kalau DOM sudah siap
  if (document.readyState !== 'loading') applyPhotos(theme);

  const toggle = document.querySelector('.theme-toggle');
  toggle?.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    applyPhotos(next);

    toggle.animate(
      [{ transform: 'scale(1)' },
       { transform: 'scale(0.85) rotate(20deg)' },
       { transform: 'scale(1)' }],
      { duration: 320, easing: 'ease-out' }
    );
  });
})();

/* ---------------- 4. Mobile menu ---------------- */
const menuBtn  = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');

menuBtn?.addEventListener('click', () => {
  menuBtn.classList.toggle('open');
  navLinks.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', navLinks.classList.contains('open'));
});

navLinks?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    menuBtn?.classList.remove('open');
    navLinks?.classList.remove('open');
  });
});

document.addEventListener('click', (e) => {
  if (!navLinks?.classList.contains('open')) return;
  if (navLinks.contains(e.target)) return;
  if (menuBtn?.contains(e.target)) return;
  menuBtn?.classList.remove('open');
  navLinks.classList.remove('open');
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 720) {
    menuBtn?.classList.remove('open');
    navLinks?.classList.remove('open');
  }
});

/* ---------------- 5. Reveal on scroll ---------------- */
const revealIO = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (!e.isIntersecting) return;
    e.target.style.transitionDelay = `${(i % 4) * 60}ms`;
    e.target.classList.add('in');
    revealIO.unobserve(e.target);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealIO.observe(el));

/* ---------------- 6. Cursor glow ---------------- */
const glow = document.querySelector('.cursor-glow');
if (glow && window.matchMedia('(pointer: fine)').matches) {
  let x = 0, y = 0, tx = 0, ty = 0;
  window.addEventListener('mousemove', (e) => {
    tx = e.clientX; ty = e.clientY;
    glow.classList.add('active');
  });
  (function tick() {
    x += (tx - x) * 0.12;
    y += (ty - y) * 0.12;
    glow.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
    requestAnimationFrame(tick);
  })();
}

/* ---------------- 7. Glass spotlight ---------------- */
document.querySelectorAll('.glass').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', ((e.clientX - r.left) / r.width  * 100) + '%');
    card.style.setProperty('--my', ((e.clientY - r.top)  / r.height * 100) + '%');
  });
});

/* ---------------- 8. Tilt ---------------- */
document.querySelectorAll('.tilt').forEach(card => {
  const strength = 6;
  card.addEventListener('mousemove', (e) => {
    if (card.classList.contains('reveal') && !card.classList.contains('in')) return;
    const r  = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width  - 0.5;
    const py = (e.clientY - r.top)  / r.height - 0.5;
    card.style.transform =
      `perspective(900px) rotateX(${(-py * strength).toFixed(2)}deg) ` +
      `rotateY(${(px * strength).toFixed(2)}deg)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

/* ---------------- 9. Nav auto-hide ---------------- */
const nav = document.querySelector('.nav');
let lastY = 0;
window.addEventListener('scroll', () => {
  if (!nav) return;
  const y = window.scrollY;
  const goingDown = y > lastY && y > 200;
  const menuOpen  = navLinks?.classList.contains('open');
  if (!menuOpen) {
    nav.style.transform = goingDown
      ? 'translateX(-50%) translateY(-120%)'
      : 'translateX(-50%) translateY(0)';
  }
  lastY = y;
}, { passive: true });

/* ---------------- 10. Active nav link ---------------- */
const sections = [...document.querySelectorAll('section[id]')];
const linkMap  = {};
document.querySelectorAll('.nav-links a[href^="#"]').forEach(a => {
  linkMap[a.getAttribute('href').slice(1)] = a;
});
const spyIO = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
    const link = linkMap[e.target.id];
    if (link) link.classList.add('active');
  });
}, { rootMargin: '-40% 0px -55% 0px' });
sections.forEach(s => spyIO.observe(s));