(() => {
  const ready = (fn) => (document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', fn) : fn());

  ready(() => {

  // Fixed WhatsApp FAB on every route
  const ensureFab = () => {
    if (document.getElementById('blvd-wa-fab')) return;
    const host = (location.hostname || '').toLowerCase();
    const href = host.includes('boulevard-world')
      ? 'https://wa.me/966543333994'
      : 'https://wa.me/966544902266';
    const a = document.createElement('a');
    a.id = 'blvd-wa-fab';
    a.className = 'blvd-wa-fab';
    a.href = href;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.setAttribute('aria-label', 'تواصل عبر واتساب');
    a.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><path fill="#fff" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>';
    document.body.appendChild(a); // must be direct child of body for position:fixed
  };
  ensureFab();
  // Keep FAB after SPA navigations
  const _fabPush = history.pushState;
  history.pushState = function () {
    const r = _fabPush.apply(this, arguments);
    setTimeout(ensureFab, 30);
    return r;
  };
  window.addEventListener('popstate', () => setTimeout(ensureFab, 30));

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
      if (el.classList.contains('blvd-hero-spain') || el.closest('.blvd-hero-spain')) continue;
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
      let __blvdScrollRaf = 0;
      const onScroll = () => {
        if (__blvdScrollRaf) return;
        __blvdScrollRaf = requestAnimationFrame(() => {
          __blvdScrollRaf = 0;
          header.style.boxShadow =
            window.scrollY > 8
              ? '0 12px 36px -18px rgba(0,0,0,0.9), 0 0 0 1px rgba(195,62,111,0.12)'
              : '';
        });
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

(function(){
  var TITLE='أسبانيا', SUB='منطقة أسبانيا';
  var __blvdHeroBusy=false;
  var __blvdHeroRaf=0;
  var __blvdHeroMo=null;
  var __blvdHeroDone=false;
  function build(){
    var wrap=document.createElement('div');
    wrap.className='blvd-hero-spain';
    wrap.setAttribute('data-blvd-hero','1');
    wrap.setAttribute('data-react-exempt','1');
    wrap.style.cssText='opacity:1;visibility:visible;background:#1f1f22;color:#fff;position:relative;z-index:5;padding:0.85rem 1rem;border-radius:0.75rem;';
    var t=document.createElement('p');
    t.className='blvd-hero-spain-title';
    t.textContent=TITLE;
    t.style.cssText='opacity:1;visibility:visible;color:#ffffff;-webkit-text-fill-color:#ffffff;font-weight:800;margin:0;';
    var s=document.createElement('p');
    s.className='blvd-hero-spain-sub';
    s.textContent=SUB;
    s.style.cssText='opacity:1;visibility:visible;color:#e9e9e9;-webkit-text-fill-color:#e9e9e9;font-weight:700;margin:0.35rem 0 0;';
    wrap.appendChild(t); wrap.appendChild(s);
    return wrap;
  }
  function paint(el){
    if(!el) return;
    if(el.style.opacity!=='1') el.style.opacity='1';
    if(el.style.visibility!=='visible') el.style.visibility='visible';
    if(el.style.background!=='#1f1f22'){ el.style.background='#1f1f22'; el.style.backgroundColor='#1f1f22'; }
    if(el.style.color!=='#ffffff' && el.style.color!=='rgb(255, 255, 255)') el.style.color='#ffffff';
    el.classList.remove('blvd-reveal');
    var tt=el.querySelector('.blvd-hero-spain-title');
    var ss=el.querySelector('.blvd-hero-spain-sub');
    if(tt){
      if(tt.textContent!==TITLE) tt.textContent=TITLE;
      tt.style.opacity='1'; tt.style.visibility='visible';
      tt.style.color='#ffffff'; tt.style.webkitTextFillColor='#ffffff';
    }
    if(ss){
      if(ss.textContent!==SUB) ss.textContent=SUB;
      ss.style.opacity='1'; ss.style.visibility='visible';
      ss.style.color='#e9e9e9'; ss.style.webkitTextFillColor='#e9e9e9';
    }
  }
  function ensure(){
    if(__blvdHeroBusy || __blvdHeroDone) return;
    __blvdHeroBusy=true;
    try{
      if(__blvdHeroMo){ try{ __blvdHeroMo.disconnect(); }catch(e){} }
      var existing=document.querySelector('.blvd-hero-spain');
      if(existing){
        paint(existing);
        __blvdHeroDone=true;
        if(__blvdHeroMo){ try{ __blvdHeroMo.disconnect(); __blvdHeroMo=null; }catch(e){} }
        return;
      }
      var main=document.querySelector('main#top, main');
      if(!main) return;
      // Prefer insert OUTSIDE React-managed first child when possible: after main's first section kicker
      var kicker=null;
      var nodes=main.querySelectorAll('p');
      for(var i=0;i<nodes.length;i++){
        if((nodes[i].textContent||'').indexOf('موسم الرياض')!==-1){ kicker=nodes[i]; break; }
      }
      var wrap=build();
      if(kicker && kicker.parentNode){
        kicker.parentNode.insertBefore(wrap, kicker);
      } else {
        var col=main.querySelector('[class*="col-span-7"]') || main.querySelector('section > div');
        if(col) col.insertBefore(wrap, col.firstChild);
        else return;
      }
      __blvdHeroDone=true;
      if(__blvdHeroMo){ try{ __blvdHeroMo.disconnect(); __blvdHeroMo=null; }catch(e){} }
    }catch(e){}
    finally{
      __blvdHeroBusy=false;
      // Only re-observe if not done yet (main not ready)
      if(!__blvdHeroDone && __blvdHeroMo){
        try{ __blvdHeroMo.observe(document.documentElement,{childList:true,subtree:true}); }catch(e){}
      }
    }
  }
  function schedule(){
    if(__blvdHeroRaf || __blvdHeroDone) return;
    __blvdHeroRaf=requestAnimationFrame(function(){
      __blvdHeroRaf=0;
      ensure();
    });
  }
  // AFTER hydration: wait for window load, then two rAFs + short timeout
  function startAfterHydration(){
    requestAnimationFrame(function(){
      requestAnimationFrame(function(){
        setTimeout(schedule, 0);
        setTimeout(schedule, 200);
        setTimeout(schedule, 800);
        setTimeout(schedule, 2000);
      });
    });
    try{
      __blvdHeroMo=new MutationObserver(function(){ if(!__blvdHeroDone) schedule(); });
      // Delay observing until after hydrate window
      setTimeout(function(){
        if(__blvdHeroDone || !__blvdHeroMo) return;
        try{ __blvdHeroMo.observe(document.documentElement,{childList:true,subtree:true}); }catch(e){}
      }, 600);
      setTimeout(function(){ try{ if(__blvdHeroMo){ __blvdHeroMo.disconnect(); __blvdHeroMo=null; } }catch(e){} }, 6000);
    }catch(e){}
  }
  if(document.readyState==='complete') startAfterHydration();
  else window.addEventListener('load', startAfterHydration);
})();
