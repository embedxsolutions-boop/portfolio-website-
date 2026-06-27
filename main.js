/* ═══════════════════════════════════════════════════════════
   EmbedX Solutions — Project Portfolio (Light Theme)
   main.js
═══════════════════════════════════════════════════════════ */

'use strict';

/* ── 1. NAVBAR SCROLL BEHAVIOR ──────────────────────────── */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    updateActiveNavLink();
  }, { passive: true });

  function updateActiveNavLink() {
    const sections = ['hero', 'projects', 'stats', 'contact'];
    let current = 'hero';
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el && window.scrollY >= el.offsetTop - 200) current = id;
    });
    navLinks.forEach(link => {
      const href = link.getAttribute('href').replace('#', '');
      link.classList.toggle('active', href === current);
    });
  }
})();

/* ── 2. HAMBURGER MENU ──────────────────────────────────── */
(function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = mobileMenu.querySelectorAll('a');
  let isOpen = false;

  function toggleMenu(open) {
    isOpen = open;
    const spans = hamburger.querySelectorAll('span');
    if (open) {
      mobileMenu.style.display = 'block';
      requestAnimationFrame(() => mobileMenu.classList.add('open'));
      spans[0].style.transform = 'translateY(7px) rotate(45deg)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      mobileMenu.classList.remove('open');
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  }

  hamburger.addEventListener('click', () => toggleMenu(!isOpen));
  mobileLinks.forEach(link => link.addEventListener('click', () => toggleMenu(false)));
})();

/* ── 3. COUNTER ANIMATION ───────────────────────────────── */
(function initCounters() {
  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'), 10);
    if (!target) return;
    const duration = 1800;
    const start = performance.now();
    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const counters = document.querySelectorAll('[data-count]');
  const observed = new Set();
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !observed.has(entry.target)) {
        observed.add(entry.target);
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();

/* ── 4. SCROLL REVEAL ───────────────────────────────────── */
(function initReveal() {
  // Add reveal classes to cards and stat items
  document.querySelectorAll('.project-card').forEach((card, i) => {
    card.classList.add('reveal', `reveal-delay-${(i % 6) + 1}`);
  });
  document.querySelectorAll('.stat-item').forEach((item, i) => {
    item.classList.add('reveal', `reveal-delay-${(i % 6) + 1}`);
  });
  document.querySelectorAll('.contact-card').forEach((card, i) => {
    card.classList.add('reveal', `reveal-delay-${(i % 4) + 1}`);
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();

/* ── 5. PROJECT FILTER ──────────────────────────────────── */
(function initFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        const show = filter === 'all' || category === filter;
        card.classList.toggle('hidden', !show);
        if (show) {
          // Re-trigger animation
          card.style.animationName = 'none';
          requestAnimationFrame(() => { card.style.animationName = ''; });
        }
      });
    });
  });
})();

/* ── 6. LIGHTBOX ────────────────────────────────────────── */
(function initLightbox() {
  const lightbox   = document.getElementById('lightbox');
  const mediaEl    = document.getElementById('lightbox-media');
  const titleEl    = document.getElementById('lightbox-title');
  const descEl     = document.getElementById('lightbox-desc');
  const dotsEl     = document.getElementById('lightbox-dots');
  const closeBtn   = document.getElementById('lightbox-close');
  const prevBtn    = document.getElementById('lightbox-prev');
  const nextBtn    = document.getElementById('lightbox-next');

  const projects = {
    akvaratan: {
      title: 'AKVARATAN — Intelligent Water Management',
      desc: 'Deployed for Tata Power. Real-time tank level monitoring with pump control via mobile app.',
      media: [
        { type: 'img',   src: 'assets/akvaratan/akvaratan-device.jpg', alt: 'AKVARATAN Device' },
        { type: 'img',   src: 'assets/akvaratan/akvaratan-app.jpg',    alt: 'AKVARATAN Mobile App' },
      ]
    },
    pmc: {
      title: 'PMC Robot — Breaker 2FA Verification',
      desc: 'Safety-critical IoT robot that physically verifies breaker status to prevent SCADA-related accidents.',
      media: [
        { type: 'img',   src: 'assets/pmc-robot/pmc-robot.jpg', alt: 'PMC Robot' },
      ]
    },
    bvm: {
      title: 'BVM System — Battery Voltage Monitor',
      desc: 'Per-cell voltage monitoring and SOC calculation for industrial forklift batteries.',
      media: [
        { type: 'img',   src: 'assets/bvm/bvm-device.jpg', alt: 'BVM IoT Device' },
        { type: 'img',   src: 'assets/bvm/bvm-app.jpg',    alt: 'BVM Dashboard App' },
      ]
    },
    energy: {
      title: 'Smart Energy Meter Gateway',
      desc: 'Cybersecure SCADA gateway with Modbus TCP and fiber optic transmission over 1,000+ km.',
      media: [
        { type: 'img',   src: 'assets/smart-energy-meter/energy-meter.jpg', alt: 'Smart Energy Meter' },
      ]
    },
    smartzly: {
      title: 'Smartzly — Industrial IoT Control',
      desc: 'Control industrial appliances globally via SmartLife app. Hardened IP-rated enclosure.',
      media: [
        { type: 'img',   src: 'assets/smartzly/smartzly-device.jpg',  alt: 'Smartzly Device' },
        { type: 'img',   src: 'assets/smartzly/smartzly-device2.jpg', alt: 'Smartzly Close-up' },
      ]
    },
    '3d': {
      title: '3D Printed Products',
      desc: 'Professional FDM printing for prototypes, enclosures, and custom decorative products.',
      media: [
        { type: 'img',   src: 'assets/3d-prints/moon-lamp.jpg',     alt: '3D Printed Moon Lamp' },
        { type: 'img',   src: 'assets/3d-prints/mushroom-lamp.jpg', alt: '3D Printed Mushroom Lamp' },
      ]
    },
    kekda: {
      title: 'Kekda Hexapod Robot',
      desc: 'Fully 3D-printed 6-legged hexapod robot with 12 servos and real-time IK control.',
      media: [
        { type: 'img',   src: 'assets/kekda/kekda-robot.jpg',   alt: 'Kekda Hexapod Robot' },
        { type: 'video', src: 'assets/kekda/kekda-demo1.mp4',   alt: 'Kekda Demo 1' },
        { type: 'video', src: 'assets/kekda/kekda-demo2.mp4',   alt: 'Kekda Demo 2' },
      ]
    }
  };

  let currentProject = null;
  let currentIndex   = 0;

  function openLightbox(key) {
    currentProject = projects[key];
    if (!currentProject) return;
    currentIndex = 0;
    render();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    mediaEl.querySelectorAll('video').forEach(v => v.pause());
    currentProject = null;
  }

  function render() {
    if (!currentProject) return;
    const items = currentProject.media;
    const item  = items[currentIndex];

    titleEl.textContent = currentProject.title;
    descEl.textContent  = currentProject.desc;

    mediaEl.innerHTML = '';
    if (item.type === 'img') {
      const img = document.createElement('img');
      img.src = item.src;
      img.alt = item.alt;
      mediaEl.appendChild(img);
    } else {
      const video = document.createElement('video');
      video.src      = item.src;
      video.controls = true;
      video.autoplay = true;
      video.loop     = true;
      mediaEl.appendChild(video);
    }

    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === items.length - 1;

    dotsEl.innerHTML = '';
    items.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className   = 'lightbox-dot' + (i === currentIndex ? ' active' : '');
      dot.setAttribute('aria-label', `Go to item ${i + 1}`);
      dot.addEventListener('click', () => { currentIndex = i; render(); });
      dotsEl.appendChild(dot);
    });
  }

  // Attach open triggers to expand buttons
  document.querySelectorAll('.btn-lightbox').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      openLightbox(btn.getAttribute('data-project'));
    });
  });

  // Click on card media also opens lightbox
  document.querySelectorAll('.project-card').forEach(card => {
    const btn = card.querySelector('.btn-lightbox');
    if (!btn) return;
    const media = card.querySelector('.card-media');
    media.style.cursor = 'pointer';
    media.addEventListener('click', () => openLightbox(btn.getAttribute('data-project')));
  });

  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

  prevBtn.addEventListener('click', () => { if (currentIndex > 0) { currentIndex--; render(); } });
  nextBtn.addEventListener('click', () => {
    if (currentProject && currentIndex < currentProject.media.length - 1) { currentIndex++; render(); }
  });

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   prevBtn.click();
    if (e.key === 'ArrowRight')  nextBtn.click();
  });
})();

/* ── 7. SMOOTH SCROLL FOR ANCHOR LINKS ──────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href   = a.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ── 8. IMAGE ERROR FALLBACK ────────────────────────────── */
document.querySelectorAll('img').forEach(img => {
  img.addEventListener('error', () => {
    img.style.background = '#f0f4ff';
    img.removeAttribute('src');
  });
});

/* ── 9. SUBTLE CARD TILT (desktop only) ─────────────────── */
(function initTilt() {
  if (window.matchMedia('(hover: none)').matches) return;
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `translateY(-6px) rotateX(${-y * 3}deg) rotateY(${x * 3}deg)`;
      card.style.transformStyle = 'preserve-3d';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transformStyle = '';
    });
  });
})();
