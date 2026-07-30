// =========================================================
// Dharshini Boopalan — Portfolio JS
// =========================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Year in footer ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Typing animation ---------- */
  const roles = [
    'B.Sc Computer Science Student',
    'Python & AI Developer',
    'Streamlit App Builder',
    'Full-Stack Enthusiast'
  ];
  const typeTarget = document.getElementById('typeTarget');
  if (typeTarget) {
    let roleIndex = 0, charIndex = 0, deleting = false;
    const TYPE_SPEED = 65, DELETE_SPEED = 35, HOLD = 1400, GAP = 400;

    function tick() {
      const current = roles[roleIndex];
      if (!deleting) {
        charIndex++;
        typeTarget.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(tick, HOLD);
          return;
        }
        setTimeout(tick, TYPE_SPEED);
      } else {
        charIndex--;
        typeTarget.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          setTimeout(tick, GAP);
          return;
        }
        setTimeout(tick, DELETE_SPEED);
      }
    }
    tick();
  }

  /* ---------- Theme toggle (dark default, persisted) ---------- */
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const iconMoon = document.getElementById('themeIconMoon');
  const iconSun = document.getElementById('themeIconSun');

  function applyTheme(theme) {
    if (theme === 'light') {
      root.setAttribute('data-theme', 'light');
      iconMoon.style.display = 'none';
      iconSun.style.display = 'block';
    } else {
      root.removeAttribute('data-theme');
      iconMoon.style.display = 'block';
      iconSun.style.display = 'none';
    }
  }

  let savedTheme = 'dark';
  try { savedTheme = localStorage.getItem('db-portfolio-theme') || 'dark'; } catch (e) {}
  applyTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isLight = root.getAttribute('data-theme') === 'light';
      const next = isLight ? 'dark' : 'light';
      applyTheme(next);
      try { localStorage.setItem('db-portfolio-theme', next); } catch (e) {}
    });
  }

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen);
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Scroll reveal + skill bar fill ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const skillFills = document.querySelectorAll('.skill-bar-fill');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => observer.observe(el));

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        skillFills.forEach(fill => {
          fill.style.width = fill.getAttribute('data-width') + '%';
        });
        skillObserver.disconnect();
      }
    });
  }, { threshold: 0.3 });

  const skillSection = document.getElementById('skills');
  if (skillSection) skillObserver.observe(skillSection);

  /* ---------- Back to top ---------- */
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('visible', window.scrollY > 500);
    });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Sticky nav shadow on scroll ---------- */
  const nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.style.boxShadow = window.scrollY > 20
        ? '0 8px 30px rgba(0,0,0,0.35)'
        : 'var(--shadow-glow)';
    });
  }

  /* ---------- Contact form (client-side only) ---------- */
  const form = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.name.value.trim();
      formNote.textContent = `Thanks${name ? ', ' + name : ''}! This demo form doesn't send yet — please email dharshiniboopalan61@gmail.com directly.`;
      form.reset();
    });
  }

  /* ---------- Certificate lightbox ---------- */
  const lightbox = document.getElementById('certLightbox');
  const lightboxImg = document.getElementById('certLightboxImg');
  const lightboxTitle = document.getElementById('certLightboxTitle');
  const lightboxDownload = document.getElementById('certLightboxDownload');
  const certTriggers = document.querySelectorAll('[data-cert-src]');
  const closeEls = document.querySelectorAll('[data-cert-close]');
  let lastFocused = null;

  function openLightbox(src, title) {
    lastFocused = document.activeElement;
    lightboxImg.src = src;
    lightboxImg.alt = title;
    lightboxTitle.textContent = title;
    lightboxDownload.href = src;
    lightboxDownload.setAttribute('download', title.replace(/[^a-z0-9]+/gi, '-') + '.jpg');
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }

  certTriggers.forEach(el => {
    el.addEventListener('click', () => {
      const src = el.getAttribute('data-cert-src');
      const title = el.getAttribute('data-cert-title') || 'Certificate';
      openLightbox(src, title);
    });
  });

  closeEls.forEach(el => {
    el.addEventListener('click', closeLightbox);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) {
      closeLightbox();
    }
  });

});
