(function () {
  'use strict';

  const THEME_KEY = 'hci-portfolio-theme';

  const loader = document.getElementById('loader');
  const header = document.getElementById('header');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const themeToggle = document.getElementById('themeToggle');
  const backToTop = document.getElementById('backToTop');
  const imageModal = document.getElementById('imageModal');
  const modalOverlay = document.getElementById('modalOverlay');
  const modalClose = document.getElementById('modalClose');
  const modalImage = document.getElementById('modalImage');
  const modalCaption = document.getElementById('modalCaption');
  const pdfModal = document.getElementById('pdfModal');
  const pdfOverlay = document.getElementById('pdfOverlay');
  const pdfClose = document.getElementById('pdfClose');
  const pdfFrame = document.getElementById('pdfFrame');
  const pdfTitle = document.getElementById('pdfTitle');
  const pdfOpenLink = document.getElementById('pdfOpenLink');
  const navLinks = document.querySelectorAll('.nav__link');
  const fadeElements = document.querySelectorAll('.fade-in');
  const modalTriggers = document.querySelectorAll('[data-modal]');
  const pdfTriggers = document.querySelectorAll('[data-pdf]');

  function initTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = saved || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem(THEME_KEY, next);
  }

  function hideLoader() {
    if (!loader) return;
    loader.classList.add('hidden');
    loader.setAttribute('aria-hidden', 'true');
  }

  function toggleMobileNav() {
    const isOpen = navMenu.classList.toggle('open');
    navToggle.classList.toggle('active', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  }

  function closeMobileNav() {
    navMenu.classList.remove('open');
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  function handleScroll() {
    const scrollY = window.scrollY;

    header.classList.toggle('scrolled', scrollY > 20);
    backToTop.classList.toggle('visible', scrollY > 400);

    const sections = document.querySelectorAll('section[id]');
    let currentSection = '';

    sections.forEach(function (section) {
      const top = section.offsetTop - header.offsetHeight - 40;
      const height = section.offsetHeight;
      if (scrollY >= top && scrollY < top + height) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(function (link) {
      const href = link.getAttribute('href');
      link.classList.toggle('active', href === '#' + currentSection);
    });
  }

  function initFadeIn() {
    if (!('IntersectionObserver' in window)) {
      fadeElements.forEach(function (el) {
        el.classList.add('visible');
      });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    );

    fadeElements.forEach(function (el) {
      observer.observe(el);
    });
  }

  function lockBody() {
    document.body.classList.add('modal-open');
  }

  function unlockBody() {
    document.body.classList.remove('modal-open');
  }

  function openImageModal(src, caption) {
    modalImage.src = src;
    modalImage.alt = caption;
    modalCaption.textContent = caption;
    imageModal.removeAttribute('hidden');
    lockBody();
    modalClose.focus();
  }

  function closeImageModal() {
    imageModal.setAttribute('hidden', '');
    modalImage.src = '';
    modalImage.alt = '';
    modalCaption.textContent = '';
    if (pdfModal.hasAttribute('hidden')) {
      unlockBody();
    }
  }

  function openPdfModal(src, caption) {
    const encoded = encodeURI(src);
    pdfFrame.src = encoded;
    pdfTitle.textContent = caption;
    pdfOpenLink.href = encoded;
    pdfModal.removeAttribute('hidden');
    lockBody();
    pdfClose.focus();
  }

  function closePdfModal() {
    pdfModal.setAttribute('hidden', '');
    pdfFrame.src = '';
    pdfTitle.textContent = '';
    pdfOpenLink.href = '#';
    if (imageModal.hasAttribute('hidden')) {
      unlockBody();
    }
  }

  function handleAnchorClick(e) {
    const href = this.getAttribute('href');
    if (!href || !href.startsWith('#')) return;

    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();
    closeMobileNav();

    const offset = header.offsetHeight;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({ top: top, behavior: 'smooth' });
  }

  initTheme();

  window.addEventListener('load', function () {
    setTimeout(hideLoader, 500);
  });

  themeToggle.addEventListener('click', toggleTheme);
  navToggle.addEventListener('click', toggleMobileNav);
  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  initFadeIn();

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', handleAnchorClick);
  });

  modalTriggers.forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      const src = this.getAttribute('data-modal');
      const caption = this.getAttribute('data-caption') || '';
      openImageModal(src, caption);
    });
  });

  pdfTriggers.forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      const src = this.getAttribute('data-pdf');
      const caption = this.getAttribute('data-caption') || 'Document';
      openPdfModal(src, caption);
    });
  });

  modalClose.addEventListener('click', closeImageModal);
  modalOverlay.addEventListener('click', closeImageModal);
  pdfClose.addEventListener('click', closePdfModal);
  pdfOverlay.addEventListener('click', closePdfModal);

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (!imageModal.hasAttribute('hidden')) closeImageModal();
    if (!pdfModal.hasAttribute('hidden')) closePdfModal();
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 768) {
      closeMobileNav();
    }
  });
})();
