'use strict';

const menuToggle = document.querySelector('.menu-toggle');
const primaryNav = document.querySelector('.primary-nav');
const navLinks = [...document.querySelectorAll('.nav-link')];

function closeMenu() {
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open navigation');
  primaryNav.classList.remove('open');
}

menuToggle.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
  primaryNav.classList.toggle('open', !isOpen);
});
navLinks.forEach((link) => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});
document.addEventListener('click', (event) => {
  if (primaryNav.classList.contains('open') && !primaryNav.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
});

const progressBar = document.getElementById('reading-progress-bar');
const backToTop = document.getElementById('back-to-top');
function updateScrollUI() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = `${scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0}%`;
  backToTop.classList.toggle('visible', window.scrollY > 650);
}
window.addEventListener('scroll', updateScrollUI, { passive: true });
window.addEventListener('resize', updateScrollUI);
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
updateScrollUI();

document.querySelectorAll('img[data-fallback]').forEach((image) => {
  image.addEventListener('error', () => {
    if (image.dataset.fallback && image.src !== new URL(image.dataset.fallback, document.baseURI).href) {
      image.src = image.dataset.fallback;
    }
  }, { once: true });
});

const observedSections = document.querySelectorAll('main section[id]');
if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const activeId = entry.target.id;
      navLinks.forEach((link) => {
        const active = link.getAttribute('href') === `#${activeId}`;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-25% 0px -65% 0px', threshold: 0 });
  observedSections.forEach((section) => sectionObserver.observe(section));
}

// The fixed 150-word survey summary is read-only; percentages are counted as single tokens.
const analysisText = document.getElementById('analysis-text');
const analysisCounter = document.getElementById('analysis-counter');
function countWords(text) {
  return (text.trim().match(/\d+(?:[.,]\d+)?%?|[\p{L}\p{N}]+(?:['’–-][\p{L}\p{N}]+)*/gu) || []).length;
}
analysisCounter.textContent = `${countWords(analysisText.value)} / 150 words`;

// This frontend-only form confirms locally; it does not send or store personal data.
document.getElementById('feedback-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const status = document.getElementById('feedback-status');
  status.textContent = 'Thank you for sharing your perspective. This demo does not send or store your response.';
  event.currentTarget.reset();
});
