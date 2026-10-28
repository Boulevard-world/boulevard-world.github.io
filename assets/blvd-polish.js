(() => {
  const ready = (fn) => (document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', fn) : fn());

  ready(() => {
    // Mark major content blocks for scroll reveal without removing anything
    const roots = [
      ...document.querySelectorAll('main > section, main section, main > div > section'),
      ...document.querySelectorAll('main .dossier > div, main .border.border-line, main .portrait, main blockquote, footer'),
    ];
    const seen = new Set();
    for (const el of roots) {
      if (!el || seen.has(el) || el.closest('header')) continue;
      // skip tiny chrome
      if ((el.textContent || '').trim().length < 2 && !el.querySelector('img,canvas')) continue;
      seen.add(el);
      el.classList.add('blvd-reveal');
    }

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) {
      document.querySelectorAll('.blvd-reveal').forEach((el) => el.classList.add('blvd-in'));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('blvd-in');
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );
    document.querySelectorAll('.blvd-reveal').forEach((el) => io.observe(el));
    // Guarantee everything is 'in' shortly (above-fold + slow devices)
    setTimeout(() => document.querySelectorAll('.blvd-reveal').forEach((el) => el.classList.add('blvd-in')), 1200);

    // Soft header elevation on scroll
    const header = document.querySelector('header.sticky, header.no-print');
    if (header) {
      const onScroll = () => {
        header.style.boxShadow =
          window.scrollY > 8
            ? '0 12px 36px -18px rgba(0,0,0,0.9), 0 0 0 1px rgba(195,62,111,0.12)'
            : '';
      };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
    }
  });

  // Re-apply after client navigations (TanStack Start)
  const reapply = () => setTimeout(() => {
    document.querySelectorAll('main section, main .border.border-line, main .portrait, footer').forEach((el) => {
      if (!el.classList.contains('blvd-reveal')) {
        el.classList.add('blvd-reveal', 'blvd-in');
      }
    });
  }, 50);
  window.addEventListener('popstate', reapply);
  const _push = history.pushState;
  history.pushState = function () {
    const r = _push.apply(this, arguments);
    reapply();
    return r;
  };
})();
