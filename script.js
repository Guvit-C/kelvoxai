/* ─────────────────────────────────────────
   KELVOX — Main Script
   ───────────────────────────────────────── */

// ── Nav scroll effect ──────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ── Mobile burger menu ─────────────────────
const burger = document.getElementById('navBurger');
const navLinks = document.getElementById('navLinks');

burger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('mobile-open');
  burger.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', open);
});

// Close mobile menu when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('mobile-open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', false);
  });
});

// ── Scroll-triggered fade-up ───────────────
const fadeEls = document.querySelectorAll('.fade-up');

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

fadeEls.forEach(el => fadeObserver.observe(el));

// ── Hero rotating text ─────────────────────
const phrases = [
  'replace your next 3 hires',
  'scale without headcount',
  'get back 40 hours a week',
];

const rotatingEl = document.getElementById('rotatingText');
let phraseIndex = 0;

function nextPhrase() {
  rotatingEl.classList.add('exiting');

  setTimeout(() => {
    phraseIndex = (phraseIndex + 1) % phrases.length;
    rotatingEl.textContent = phrases[phraseIndex];
    rotatingEl.classList.remove('exiting');
    rotatingEl.classList.add('entering');

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        rotatingEl.classList.remove('entering');
      });
    });
  }, 480);
}

setInterval(nextPhrase, 3200);

// ── Counter animation ──────────────────────
const counterEls = document.querySelectorAll('.metric__num[data-target]');
let countersStarted = false;

function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1600;
  const start = performance.now();

  function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

const metricsSection = document.querySelector('.hero__metrics');
if (metricsSection) {
  const counterObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !countersStarted) {
      countersStarted = true;
      setTimeout(() => {
        counterEls.forEach(el => animateCounter(el));
      }, 400);
    }
  }, { threshold: 0.5 });
  counterObserver.observe(metricsSection);
}

// ── FAQ accordion ──────────────────────────
const faqItems = document.querySelectorAll('.faq__item');

faqItems.forEach(item => {
  const btn = item.querySelector('.faq__question');
  const answer = item.querySelector('.faq__answer');

  btn.addEventListener('click', () => {
    const isOpen = btn.getAttribute('aria-expanded') === 'true';

    // Close all
    faqItems.forEach(i => {
      i.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
      i.querySelector('.faq__answer').classList.remove('open');
      i.classList.remove('open');
    });

    // Open clicked if it was closed
    if (!isOpen) {
      btn.setAttribute('aria-expanded', 'true');
      answer.classList.add('open');
      item.classList.add('open');
    }
  });
});

// ── Audit form submission ──────────────────
const auditForm = document.getElementById('auditForm');

auditForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = auditForm.querySelector('#name').value.trim();
  const email = auditForm.querySelector('#email').value.trim();
  const agency = auditForm.querySelector('#agency').value.trim();

  if (!name || !email || !agency) {
    // Shake fields that are empty
    [{ id: 'name', val: name }, { id: 'email', val: email }, { id: 'agency', val: agency }].forEach(({ id, val }) => {
      if (!val) {
        const el = document.getElementById(id);
        el.style.borderColor = '#ef4444';
        el.addEventListener('input', () => { el.style.borderColor = ''; }, { once: true });
      }
    });
    return;
  }

  // Simulate submission
  const formParent = auditForm.parentElement;
  auditForm.style.transition = 'opacity 0.3s';
  auditForm.style.opacity = '0';

  setTimeout(() => {
    auditForm.remove();

    const success = document.createElement('div');
    success.className = 'form-success fade-up';
    success.innerHTML = `
      <div class="form-success__icon">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path d="M6 14l6 6 10-12" stroke="#22c55e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <h3>You're booked in!</h3>
      <p>We'll reach out to <strong>${email}</strong> within 24 hours to confirm your free AI Audit.</p>
    `;
    formParent.appendChild(success);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => success.classList.add('visible'));
    });
  }, 300);
});

// ── Smooth anchor scroll (offset for fixed nav) ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10) || 72;
    const top = target.getBoundingClientRect().top + window.scrollY - navH - 16;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ── Trigger initial visible items ─────────────
// Items already in viewport on load
window.addEventListener('load', () => {
  fadeEls.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.9) {
      el.classList.add('visible');
    }
  });
});
