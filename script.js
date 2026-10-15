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
   STICKY NAV — throttled with requestAnimationFrame
   ========================================================= */
(function stickyNav() {
  const nav = document.getElementById('nav');
  let ticking = false;

  const update = () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
    ticking = false;
  };

  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(update);
      ticking = true;
    }
  };

  update();
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
   SMOOTH SCROLL (respects reduced motion)
   ========================================================= */
(function smoothAnchors() {
  const navHeight = 80;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (!id || id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top, behavior: prefersReduced ? 'auto' : 'smooth' });
    });
  });
})();

/* =========================================================
   ROLE TYPEWRITER (pauses when tab hidden — saves CPU)
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
  let timeoutId = null;

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
        timeoutId = setTimeout(tick, HOLD_TIME);
        return;
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
    timeoutId = setTimeout(tick, deleting ? DELETE_SPEED : TYPE_SPEED);
  }

  el.textContent = roles[0];
  timeoutId = setTimeout(tick, HOLD_TIME);

  // Pause when tab is hidden — saves CPU/battery
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      clearTimeout(timeoutId);
    } else {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(tick, 400);
    }
  });
})();

/* =========================================================
   SCROLL REVEAL
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
   CONTACT FORM (validation + WhatsApp)
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

  const validators = {
    name: (v) => (v.trim().length < 2 ? 'Veuillez entrer votre nom.' : ''),
    email: (v) => (!emailPattern.test(v.trim()) ? 'Veuillez entrer une adresse email valide.' : ''),
    subject: (v) => (v.trim().length < 3 ? 'Veuillez ajouter un sujet.' : ''),
    message: (v) => (v.trim().length < 10 ? 'Le message doit contenir au moins 10 caractères.' : '')
  };

  function setFieldState(key, message) {
    const { el, error } = fields[key];
    const wrapper = el.closest('.field');
    if (message) {
      wrapper.classList.add('invalid');
      error.textContent = message;
      el.setAttribute('aria-invalid', 'true');
    } else {
      wrapper.classList.remove('invalid');
      error.textContent = '';
      el.removeAttribute('aria-invalid');
    }
  }

  function validateField(key) {
    const message = validators[key](fields[key].el.value);
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

  const whatsappNumber = '212752565522';

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const allValid = Object.keys(fields)
      .map((key) => validateField(key))
      .every(Boolean);

    if (!allValid) {
      status.textContent = 'Veuillez corriger les champs en rouge.';
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
    status.textContent = 'Préparation du message WhatsApp…';
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
   MISC — year, back-to-top, CV download
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

  const resumeBtn = document.getElementById('resumeBtn');
  if (resumeBtn) {
    resumeBtn.addEventListener('click', (event) => {
      const href = resumeBtn.getAttribute('href');
      if (!href) return;

      event.preventDefault();

      const link = document.createElement('a');
      link.href = href;
      link.download = 'AZEDINE_RABAH_CV.pdf';
      link.target = '_blank';
      link.rel = 'noopener';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }
})();