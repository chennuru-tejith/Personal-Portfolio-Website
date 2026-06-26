/* ============================================================
   Chennuru Tejith — Portfolio Website Script
   Pure vanilla JS · No dependencies
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------------
     1. TYPING EFFECT
     Target: .typed-text  |  Cursor: .cursor (CSS‑blinked)
  ---------------------------------------------------------- */
  const initTypingEffect = () => {
    const typedTextEl = document.querySelector('.typed-text');
    if (!typedTextEl) return;

    const words = [
      'Business Management Student',
      'Project Manager',
      'Financial Analyst',
      'Strategic Leader'
    ];

    const TYPE_SPEED   = 100;   // ms per character typed
    const DELETE_SPEED  = 50;   // ms per character deleted
    const PAUSE_AFTER   = 2000; // ms pause once a word is fully typed

    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const tick = () => {
      const currentWord = words[wordIndex];

      if (isDeleting) {
        // Remove one character
        charIndex--;
        typedTextEl.textContent = currentWord.substring(0, charIndex);

        if (charIndex === 0) {
          isDeleting = false;
          wordIndex = (wordIndex + 1) % words.length; // loop infinitely
          setTimeout(tick, TYPE_SPEED);
        } else {
          setTimeout(tick, DELETE_SPEED);
        }
      } else {
        // Add one character
        charIndex++;
        typedTextEl.textContent = currentWord.substring(0, charIndex);

        if (charIndex === currentWord.length) {
          // Full word typed — pause, then start deleting
          isDeleting = true;
          setTimeout(tick, PAUSE_AFTER);
        } else {
          setTimeout(tick, TYPE_SPEED);
        }
      }
    };

    tick();
  };


  /* ----------------------------------------------------------
     2. PARTICLE BACKGROUND
     Container: .particles-container
     50 floating circles, random size / opacity / speed
  ---------------------------------------------------------- */
  const initParticles = () => {
    const container = document.querySelector('.particles-container');
    if (!container) return;

    const PARTICLE_COUNT = 50;
    const COLORS = ['#4d9fff', '#00d4ff'];

    // Inject the keyframes once (avoids needing an external CSS rule)
    if (!document.getElementById('particle-keyframes')) {
      const style = document.createElement('style');
      style.id = 'particle-keyframes';
      style.textContent = `
        @keyframes particleFloat {
          0%   { transform: translateY(0) translateX(0); opacity: var(--p-opacity); }
          50%  { transform: translateY(-40vh) translateX(20px); opacity: calc(var(--p-opacity) * 0.6); }
          100% { transform: translateY(-80vh) translateX(-10px); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const particle = document.createElement('span');

      const size     = Math.random() * 4 + 2;                   // 2–6 px
      const opacity  = Math.random() * 0.4 + 0.1;               // 0.1–0.5
      const duration = Math.random() * 15 + 10;                  // 10–25 s
      const delay    = Math.random() * duration;                  // stagger starts
      const left     = Math.random() * 100;                       // 0–100 %
      const top      = Math.random() * 100;                       // 0–100 %
      const color    = COLORS[Math.floor(Math.random() * COLORS.length)];

      particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${left}%;
        top: ${top}%;
        background: ${color};
        border-radius: 50%;
        pointer-events: none;
        --p-opacity: ${opacity};
        opacity: ${opacity};
        animation: particleFloat ${duration}s ${delay}s linear infinite;
      `;

      container.appendChild(particle);
    }
  };


  /* ----------------------------------------------------------
     3. NAVBAR SCROLL EFFECT
     • Adds .scrolled to .navbar when page scrolled > 50 px
     • Highlights the nav link matching the section in view
  ---------------------------------------------------------- */
  const initNavbarScroll = () => {
    const navbar   = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    const sections = document.querySelectorAll('section[id]');

    if (!navbar) return;

    const onScroll = () => {
      // Toggle solid background
      navbar.classList.toggle('scrolled', window.scrollY > 50);

      // Determine active section
      let currentSection = '';
      const offset = 120; // account for fixed nav + some breathing room

      sections.forEach(section => {
        const sectionTop = section.offsetTop - offset;
        if (window.scrollY >= sectionTop) {
          currentSection = section.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.classList.toggle(
          'active',
          link.getAttribute('href') === `#${currentSection}`
        );
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load
  };


  /* ----------------------------------------------------------
     4. MOBILE MENU TOGGLE
     • .menu-toggle toggles .active on .nav-links
     • Close menu when any nav link is tapped
  ---------------------------------------------------------- */
  const initMobileMenu = () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks   = document.querySelector('.nav-links');

    if (!menuToggle || !navLinks) return;

    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      menuToggle.classList.toggle('active'); // hamburger → X animation
    });

    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
      });
    });
  };


  /* ----------------------------------------------------------
     5. SMOOTH SCROLLING
     Handles nav links + CTA buttons with # hrefs
     Offset: 80 px for fixed navbar
  ---------------------------------------------------------- */
  const initSmoothScroll = () => {
    const OFFSET = 80;

    const scrollTo = (e) => {
      const href = e.currentTarget.getAttribute('href');
      if (!href || !href.startsWith('#')) return;

      e.preventDefault();
      const target = document.querySelector(href);
      if (!target) return;

      const top = target.getBoundingClientRect().top + window.scrollY - OFFSET;
      window.scrollTo({ top, behavior: 'smooth' });
    };

    // Nav links
    document.querySelectorAll('.nav-links a[href^="#"]').forEach(link => {
      link.addEventListener('click', scrollTo);
    });

    // CTA buttons
    document.querySelectorAll('.btn-primary[href^="#"], .btn-secondary[href^="#"]').forEach(btn => {
      btn.addEventListener('click', scrollTo);
    });
  };


  /* ----------------------------------------------------------
     6. SCROLL REVEAL ANIMATION
     Elements with .reveal get .active when they enter the
     viewport (threshold 0.15). Stagger via .reveal-delay-N.
  ---------------------------------------------------------- */
  const initScrollReveal = () => {
    const revealElements = document.querySelectorAll('.reveal');
    if (!revealElements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target); // animate once
          }
        });
      },
      { threshold: 0.15 }
    );

    revealElements.forEach(el => observer.observe(el));
  };


  /* ----------------------------------------------------------
     7. SKILL BAR ANIMATION
     .skill-progress elements — set width from data-width
  ---------------------------------------------------------- */
  const initSkillBars = () => {
    const bars = document.querySelectorAll('.skill-progress');
    if (!bars.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const target = entry.target;
            const width  = target.getAttribute('data-width');
            if (width) {
              target.style.width = width;
            }
            observer.unobserve(target);
          }
        });
      },
      { threshold: 0.15 }
    );

    bars.forEach(bar => observer.observe(bar));
  };


  /* ----------------------------------------------------------
     8. COUNTER ANIMATION  (About stats)
     .stat-number elements animate 0 → data-target over ~2 s
  ---------------------------------------------------------- */
  const initCounters = () => {
    const counters = document.querySelectorAll('.stat-number');
    if (!counters.length) return;

    const DURATION = 2000; // ms

    const animateCounter = (el) => {
      const target = parseInt(el.getAttribute('data-target'), 10);
      if (isNaN(target)) return;

      const start     = performance.now();
      const initial   = 0;

      const step = (now) => {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / DURATION, 1);

        // Ease‑out cubic for a satisfying deceleration
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.floor(eased * (target - initial) + initial);

        el.textContent = value;

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target; // ensure exact final value
        }
      };

      requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    counters.forEach(counter => observer.observe(counter));
  };


  /* ----------------------------------------------------------
     9. CONTACT FORM — Toast Notification
     Prevent default, show a glassmorphic toast bottom‑right
  ---------------------------------------------------------- */
  const initContactForm = () => {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    // Inject toast styles once
    if (!document.getElementById('toast-styles')) {
      const style = document.createElement('style');
      style.id = 'toast-styles';
      style.textContent = `
        .toast {
          position: fixed;
          bottom: 30px;
          right: 30px;
          padding: 18px 28px;
          background: rgba(13, 25, 56, 0.75);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(77, 159, 255, 0.25);
          border-radius: 14px;
          color: #e0eaff;
          font-size: 0.95rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35);
          transform: translateX(120%);
          opacity: 0;
          transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1),
                      opacity 0.45s cubic-bezier(0.22, 1, 0.36, 1);
          z-index: 10000;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .toast.show {
          transform: translateX(0);
          opacity: 1;
        }
        .toast .toast-icon {
          font-size: 1.4rem;
          flex-shrink: 0;
        }
      `;
      document.head.appendChild(style);
    }

    const showToast = (message, icon = '✅') => {
      const toast = document.createElement('div');
      toast.className = 'toast';
      toast.innerHTML = `<span class="toast-icon">${icon}</span><span>${message}</span>`;
      document.body.appendChild(toast);

      // Trigger reflow before adding .show so transition fires
      requestAnimationFrame(() => {
        requestAnimationFrame(() => toast.classList.add('show'));
      });

      // Auto‑dismiss after 4 seconds
      setTimeout(() => {
        toast.classList.remove('show');
        toast.addEventListener('transitionend', () => toast.remove());
      }, 4000);
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Message sent successfully! I\'ll get back to you soon.');
      form.reset();
    });
  };


  /* ----------------------------------------------------------
     10. TILT EFFECT ON CARDS  (Premium hover interaction)
     Targets: .leadership-card, .achievement-card
     Max rotation: 5 deg on each axis
  ---------------------------------------------------------- */
  const initTiltEffect = () => {
    const cards = document.querySelectorAll('.leadership-card, .achievement-card');
    if (!cards.length) return;

    const MAX_TILT = 5; // degrees

    cards.forEach(card => {
      card.style.transition = 'transform 0.15s ease-out';
      card.style.willChange = 'transform';

      card.addEventListener('mousemove', (e) => {
        const rect   = card.getBoundingClientRect();
        const x      = e.clientX - rect.left;   // mouse X inside card
        const y      = e.clientY - rect.top;     // mouse Y inside card
        const halfW  = rect.width / 2;
        const halfH  = rect.height / 2;

        // Normalise to –1 … +1 from centre
        const rotateY = ((x - halfW) / halfW) * MAX_TILT;
        const rotateX = ((halfH - y) / halfH) * MAX_TILT;

        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)';
      });
    });
  };


  /* ----------------------------------------------------------
     11. INITIALISE EVERYTHING
  ---------------------------------------------------------- */
  initTypingEffect();
  initParticles();
  initNavbarScroll();
  initMobileMenu();
  initSmoothScroll();
  initScrollReveal();
  initSkillBars();
  initCounters();
  initContactForm();
  initTiltEffect();

  // Add 'loaded' class to body after a brief delay for entrance animations
  setTimeout(() => {
    document.body.classList.add('loaded');
  }, 100);

});
