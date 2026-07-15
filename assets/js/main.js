// ---------------------------------------------------------------------------
// Opção Supermercado — pequenos aprimoramentos progressivos (sem dependências)
// ---------------------------------------------------------------------------

// Mobile nav toggle
function closeNav() {
  var nav = document.querySelector('.nav');
  var t = document.querySelector('.nav-toggle');
  if (nav) nav.classList.remove('open');
  if (t) t.classList.remove('open');
}
document.addEventListener('click', function (e) {
  var nav = document.querySelector('.nav');
  var toggle = e.target.closest('.nav-toggle');
  if (toggle) {
    nav.classList.toggle('open');
    toggle.classList.toggle('open');
  } else if (e.target.closest('.nav a')) {
    closeNav();
  } else if (!e.target.closest('.nav')) {
    if (nav && nav.classList.contains('open')) closeNav();
  }
});

// Header gains a shadow once the page is scrolled
var header = document.querySelector('.site-header');
function onScroll() {
  if (header) header.classList.toggle('scrolled', window.scrollY > 8);
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Reveal elements as they enter the viewport
var reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && reveals.length) {
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  reveals.forEach(function (el) { io.observe(el); });
} else {
  reveals.forEach(function (el) { el.classList.add('in'); });
}

// Current year in the footer
var yr = document.getElementById('year');
if (yr) yr.textContent = new Date().getFullYear();
