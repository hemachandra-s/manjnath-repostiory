// ===== Navbar scroll state =====
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) navbar.classList.add('solid');
  else navbar.classList.remove('solid');
});

// ===== Mobile nav toggle =====
const toggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
if (toggle) {
  toggle.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => navLinks.classList.remove('open'))
  );
}

// ===== Hero slideshow (Home page) =====
const slides = document.querySelectorAll('.hero-slide');
const captionEl = document.querySelector('.hero-caption');
if (slides.length) {
  let current = 0;
  const captions = Array.from(slides).map(s => s.dataset.caption || '');
  slides[0].classList.add('active');
  if (captionEl) captionEl.textContent = captions[0];

  setInterval(() => {
    slides[current].classList.remove('active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('active');
    if (captionEl) captionEl.textContent = captions[current];
  }, 5000);
}

// ===== Scroll reveal for cards/sections =====
const revealEls = document.querySelectorAll('.glass-card, .gallery-item, .service-main-card');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = 1;
      entry.target.style.transform = 'translateY(0)';
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealEls.forEach(el => {
  el.style.opacity = 0;
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity .6s ease, transform .6s ease';
  revealObserver.observe(el);
});
