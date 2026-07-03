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
  const navLinks = document.querySelectorAll('.nav__link');
  const fadeElements = document.querySelectorAll('.fade-in');
  const modalTriggers = document.querySelectorAll('[data-modal]');

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
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    fadeElements.forEach(function (el) {
      observer.observe(el);
    });
  }

  function openModal(src, caption) {
    modalImage.src = src;
    modalImage.alt = caption;
    modalCaption.textContent = caption;
    imageModal.removeAttribute('hidden');
    document.body.classList.add('modal-open');
    modalClose.focus();
  }

  function closeModal() {
    imageModal.setAttribute('hidden', '');
    document.body.classList.remove('modal-open');
    modalImage.src = '';
    modalImage.alt = '';
    modalCaption.textContent = '';
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
    setTimeout(hideLoader, 600);
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
      openModal(src, caption);
    });
  });

  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', closeModal);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !imageModal.hasAttribute('hidden')) {
      closeModal();
    }
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 768) {
      closeMobileNav();
    }
  });
})();
