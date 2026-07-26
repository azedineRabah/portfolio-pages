/* =========================================================
   THEME TOGGLE (persists via localStorage)
   ========================================================= */
(function initTheme() {
  const root = document.documentElement;
  const toggle = document.getElementById('themeToggle');
  const stored = localStorage.getItem('av-theme');
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  const initial = stored || (prefersLight ? 'light' : 'dark');

  if (initial === 'light') {
    root.setAttribute('data-theme', 'light');
    toggle.setAttribute('aria-pressed', 'true');
  }

  toggle.addEventListener('click', () => {
    const isLight = root.getAttribute('data-theme') === 'light';
    if (isLight) {
      root.removeAttribute('data-theme');
      localStorage.setItem('av-theme', 'dark');
      toggle.setAttribute('aria-pressed', 'false');
    } else {
      root.setAttribute('data-theme', 'light');
      localStorage.setItem('av-theme', 'light');
      toggle.setAttribute('aria-pressed', 'true');
    }
  });
})();

/* =========================================================
   STICKY NAV BACKGROUND ON SCROLL
   ========================================================= */
(function stickyNav() {
  const nav = document.getElementById('nav');
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* =========================================================
   MOBILE MENU
   ========================================================= */
(function mobileMenu() {
  const nav = document.getElementById('nav');
  const btn = document.getElementById('menuToggle');
  const links = document.querySelectorAll('#navLinks a');

  btn.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('menu-open');
    btn.setAttribute('aria-expanded', String(isOpen));
  });

  links.forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('menu-open');
      btn.setAttribute('aria-expanded', 'false');
    });
  });
})();

/* =========================================================
   SMOOTH SCROLL FOR ANCHOR LINKS (with sticky-nav offset)
   ========================================================= */
(function smoothAnchors() {
  const navHeight = 80;
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* =========================================================
   ROLE TYPEWRITER
   ========================================================= */
(function typewriter() {
  const el = document.getElementById('roleText');
  if (!el) return;

  const roles = [
    'Full-Stack Developer',
    'Web Developer',
    'Mobile App Developer',
    'Front-End Developer',
    'Back-End Developer',
    'UI/UX Designer'
  ];

  let roleIndex = 0;
  let charIndex = roles[0].length;
  let deleting = false;

  const TYPE_SPEED = 55;
  const DELETE_SPEED = 32;
  const HOLD_TIME = 1800;

  function tick() {
    const current = roles[roleIndex];

    if (!deleting) {
      charIndex++;
      if (charIndex > current.length) {
        charIndex = current.length;
        deleting = true;
        return setTimeout(tick, HOLD_TIME);
      }
    } else {
      charIndex--;
      if (charIndex < 0) {
        charIndex = 0;
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }

    el.textContent = current.slice(0, charIndex);
    setTimeout(tick, deleting ? DELETE_SPEED : TYPE_SPEED);
  }

  el.textContent = roles[0];
  setTimeout(tick, HOLD_TIME);
})();

/* =========================================================
   SCROLL REVEAL (IntersectionObserver)
   ========================================================= */
(function scrollReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || items.length === 0) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  items.forEach((el) => observer.observe(el));
})();

/* =========================================================
   CONTACT FORM VALIDATION
   ========================================================= */
(function contactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const status = document.getElementById('formStatus');
  const submitBtn = document.getElementById('submitBtn');

  const fields = {
    name: { el: document.getElementById('name'), error: document.getElementById('nameError') },
    email: { el: document.getElementById('email'), error: document.getElementById('emailError') },
    subject: { el: document.getElementById('subject'), error: document.getElementById('subjectError') },
    message: { el: document.getElementById('message'), error: document.getElementById('messageError') }
  };

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validators() {
    return {
      name: (v) => (v.trim().length < 2 ? 'Please enter your name.' : ''),
      email: (v) => (!emailPattern.test(v.trim()) ? 'Please enter a valid email address.' : ''),
      subject: (v) => (v.trim().length < 3 ? 'Please add a short subject.' : ''),
      message: (v) => (v.trim().length < 10 ? 'Message should be at least 10 characters.' : '')
    };
  }

  function setFieldState(key, message) {
    const { el, error } = fields[key];
    const wrapper = el.closest('.field');
    if (message) {
      wrapper.classList.add('invalid');
      error.textContent = message;
    } else {
      wrapper.classList.remove('invalid');
      error.textContent = '';
    }
  }

  function validateField(key) {
    const rule = validators()[key];
    const message = rule(fields[key].el.value);
    setFieldState(key, message);
    return !message;
  }

  Object.keys(fields).forEach((key) => {
    fields[key].el.addEventListener('blur', () => validateField(key));
    fields[key].el.addEventListener('input', () => {
      if (fields[key].el.closest('.field').classList.contains('invalid')) {
        validateField(key);
      }
    });
  });

  const whatsappNumber = '212752565522'; // Remplace par ton numéro WhatsApp complet sans le signe +

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const results = Object.keys(fields).map((key) => validateField(key));
    const allValid = results.every(Boolean);

    if (!allValid) {
      status.textContent = 'Please fix the highlighted fields.';
      status.style.color = '#C1554A';
      return;
    }

    const name = fields.name.el.value.trim();
    const email = fields.email.el.value.trim();
    const subject = fields.subject.el.value.trim() || 'Demande depuis le portfolio';
    const message = fields.message.el.value.trim();

    const text = [
      `Nom: ${name}`,
      `Email: ${email}`,
      `Sujet: ${subject}`,
      '',
      message
    ].join('\n');

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;

    submitBtn.textContent = 'Ouverture WhatsApp…';
    submitBtn.disabled = true;
    status.textContent = 'Préparation du message WhatsApp...';
    status.style.color = '';

    window.location.href = whatsappUrl;

    setTimeout(() => {
      submitBtn.textContent = 'Envoyer le message';
      submitBtn.disabled = false;
      form.reset();
      Object.keys(fields).forEach((key) => setFieldState(key, ''));
      status.textContent = 'Votre message est prêt dans WhatsApp.';
    }, 800);
  });
})();

/* =========================================================
   BACK TO TOP + FOOTER YEAR
   ========================================================= */
(function misc() {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
})();
