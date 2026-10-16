(function () {
  'use strict';

  var nav = document.getElementById('nav');
  var toggle = document.getElementById('nav-toggle');
  var links = document.querySelectorAll('#nav-links a');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Nav background once the page scrolls
  function onScroll() {
    nav.dataset.scrolled = String(window.scrollY > 10);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Mobile menu
  function setOpen(open) {
    nav.dataset.open = String(open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  toggle.addEventListener('click', function () {
    setOpen(nav.dataset.open !== 'true');
  });
  links.forEach(function (link) {
    link.addEventListener('click', function () { setOpen(false); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setOpen(false);
  });

  document.getElementById('year').textContent = new Date().getFullYear();

  // Tabs (problem → solution). They advance on their own, with a progress
  // bar under the active tab, until the visitor clicks or uses the keyboard.
  var TAB_INTERVAL = 6000;
  document.querySelectorAll('[data-tabs]').forEach(function (root) {
    var tablist = root.querySelector('[role="tablist"]');
    var tabs = Array.prototype.slice.call(root.querySelectorAll('[role="tab"]'));
    var current = 0;
    var autoplay = !reduceMotion && 'IntersectionObserver' in window && 'animate' in Element.prototype;
    var anim = null;
    var visible = false;

    function select(tab, focus) {
      current = tabs.indexOf(tab);
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        t.dataset.active = String(on);
        document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
      });
      if (focus) tab.focus();
      // Keep the active tab in view in the horizontally scrolling list (mobile)
      // without moving the page itself.
      tablist.scrollTo({ left: tab.offsetLeft - tablist.offsetLeft - 16, behavior: 'smooth' });
    }

    function sync() {
      if (!anim) return;
      if (visible) anim.play(); else anim.pause();
    }

    function run() {
      if (!autoplay) return;
      if (anim) anim.cancel();
      anim = tabs[current].querySelector('[data-progress]').animate(
        [{ scale: '0 1' }, { scale: '1 1' }],
        { duration: TAB_INTERVAL, easing: 'linear' }
      );
      anim.onfinish = function () {
        select(tabs[(current + 1) % tabs.length]);
        run();
      };
      sync();
    }

    function stop() {
      autoplay = false;
      if (anim) anim.cancel();
      anim = null;
    }

    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { stop(); select(tab); });
      tab.addEventListener('keydown', function (e) {
        var step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
        if (!step) return;
        e.preventDefault();
        stop();
        select(tabs[(i + step + tabs.length) % tabs.length], true);
      });
    });
    tablist.addEventListener('touchstart', stop, { passive: true });

    if (!autoplay) return;

    // Pause while the section is off screen.
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      if (visible && !anim && autoplay) run(); else sync();
    }, { threshold: 0.35 }).observe(root);
  });

  if (!('IntersectionObserver' in window)) return;

  // Reveal on scroll
  if (!reduceMotion) {
    var hidden = ['opacity-0', 'translate-y-6'];
    var revealer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.remove.apply(entry.target.classList, hidden);
        revealer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('[data-reveal]').forEach(function (el) {
      var siblings = el.parentElement.querySelectorAll(':scope > [data-reveal]');
      var index = Array.prototype.indexOf.call(siblings, el);
      el.classList.add.apply(el.classList, hidden.concat(['transition', 'duration-700', 'ease-out']));
      el.style.transitionDelay = (siblings.length > 2 ? index * 80 : 0) + 'ms';
      revealer.observe(el);
    });
  }

  // Highlight the nav link for the section in view
  var spy = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      links.forEach(function (link) {
        if (link.hasAttribute('data-cta')) return;
        var on = link.getAttribute('href') === '#' + entry.target.id;
        link.classList.toggle('text-ink', on);
        link.classList.toggle('text-black/55', !on);
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  document.querySelectorAll('main section[id]').forEach(function (s) { spy.observe(s); });
})();
