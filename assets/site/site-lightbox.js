(function(){
  var items=[];
  var i=0;
  var lb=null, imgEl=null, capEl=null;
  var touchX=0, touchY=0;

  function absUrl(u){
    if(!u) return '';
    try{ return new URL(u, location.href).href; }catch(e){ return u; }
  }

  function fullSrc(el){
    if(!el) return '';
    var a=el.closest && el.closest('a[data-bw-lb]');
    if(a && a.getAttribute('href')) return absUrl(a.getAttribute('href'));
    var ss=el.getAttribute('srcset');
    if(ss){
      var best='', bestW=0;
      ss.split(',').forEach(function(part){
        var bits=part.trim().split(/\s+/);
        var u=bits[0]; var w=parseInt((bits[1]||'0').replace('w',''),10)||0;
        if(w>=bestW){bestW=w;best=u;}
      });
      if(best) return absUrl(best);
    }
    return absUrl(el.currentSrc || el.getAttribute('src') || '');
  }

  function isSkip(el){
    if(!el || el.tagName!=='IMG') return true;
    if(el.closest('#blvd-wa-fab,.bw-site-lightbox,nav,.ev-nav-panel')) return true;
    // header chrome only (logos); keep figure imgs even if nested oddly
    if(el.closest('header.sticky') && !el.closest('figure,main')) return true;
    if(el.closest('.ev-header') && !el.closest('figure,main,.bw-page')) return true;
    var src=(el.getAttribute('src')||'');
    if(/favicon|icon-180|apple-touch|\/__grok\//i.test(src)) return true;
    var w=el.naturalWidth||el.width||parseInt(el.getAttribute('width'),10)||0;
    var h=el.naturalHeight||el.height||parseInt(el.getAttribute('height'),10)||0;
    if(w && h && w<=48 && h<=48) return true;
    return false;
  }

  function collect(){
    items=[];
    var seen={};
    function add(src, alt, cap){
      src=absUrl(src);
      if(!src || seen[src]) return;
      seen[src]=1;
      items.push({src:src, alt:alt||'', cap:cap||alt||''});
    }
    document.querySelectorAll('a[data-bw-lb]').forEach(function(a){
      add(a.getAttribute('href'), a.getAttribute('data-alt')||'', a.getAttribute('data-cap')||'');
    });
    document.querySelectorAll('img').forEach(function(el){
      if(isSkip(el)) return;
      el.classList.add('bw-lb-able');
      var btn=el.closest('button');
      if(btn) btn.classList.add('bw-lb-able');
      add(fullSrc(el), el.getAttribute('alt')||'', el.getAttribute('alt')||'');
    });
  }

  function ensure(){
    if(lb) return;
    lb=document.createElement('div');
    lb.className='bw-site-lightbox';
    lb.id='bw-site-lightbox';
    lb.setAttribute('role','dialog');
    lb.setAttribute('aria-modal','true');
    lb.setAttribute('aria-label','معاينة الصورة');
    lb.innerHTML='<button type="button" class="bw-site-lightbox-close" data-lb-close aria-label="إغلاق">×</button>'+
      '<button type="button" class="bw-site-lightbox-nav prev" data-lb-prev aria-label="السابق">›</button>'+
      '<img alt="">'+
      '<button type="button" class="bw-site-lightbox-nav next" data-lb-next aria-label="التالي">‹</button>'+
      '<p class="bw-site-lightbox-cap" data-lb-cap></p>';
    document.body.appendChild(lb);
    imgEl=lb.querySelector('img');
    capEl=lb.querySelector('[data-lb-cap]');
    lb.querySelector('[data-lb-close]').addEventListener('click', close);
    lb.querySelector('[data-lb-prev]').addEventListener('click', function(e){ e.stopPropagation(); openAt(i-1); });
    lb.querySelector('[data-lb-next]').addEventListener('click', function(e){ e.stopPropagation(); openAt(i+1); });
    lb.addEventListener('click', function(e){ if(e.target===lb) close(); });
    lb.addEventListener('touchstart', function(e){
      if(!e.changedTouches||!e.changedTouches[0]) return;
      touchX=e.changedTouches[0].clientX; touchY=e.changedTouches[0].clientY;
    },{passive:true});
    lb.addEventListener('touchend', function(e){
      if(!e.changedTouches||!e.changedTouches[0]) return;
      var dx=e.changedTouches[0].clientX-touchX;
      var dy=e.changedTouches[0].clientY-touchY;
      if(Math.abs(dx)<40 || Math.abs(dx)<Math.abs(dy)) return;
      if(dx>0) openAt(i-1); else openAt(i+1);
    },{passive:true});
  }

  function openAt(n){
    if(!items.length) return;
    ensure();
    i=(n+items.length)%items.length;
    var it=items[i];
    imgEl.src=it.src;
    imgEl.alt=it.alt;
    if(capEl) capEl.textContent=it.cap||'';
    lb.classList.add('is-open');
    document.documentElement.classList.add('bw-lb-open');
  }
  function close(){
    if(!lb) return;
    lb.classList.remove('is-open');
    document.documentElement.classList.remove('bw-lb-open');
    imgEl.removeAttribute('src');
  }

  function indexForSrc(src){
    src=absUrl(src);
    for(var k=0;k<items.length;k++) if(items[k].src===src) return k;
    return 0;
  }

  function onActivate(e){
    if(e.defaultPrevented) return;
    if(e.button!=null && e.button!==0) return;
    var t=e.target;
    if(!t || !t.closest) return;
    if(t.closest('.bw-site-lightbox')) return;

    var a=t.closest('a[data-bw-lb]');
    if(a){
      e.preventDefault();
      e.stopPropagation();
      collect();
      openAt(indexForSrc(a.getAttribute('href')));
      return;
    }

    var img=t.tagName==='IMG'?t:null;
    if(!img){
      var btn=t.closest('button');
      if(btn) img=btn.querySelector('img');
    }
    if(!img || isSkip(img)) return;
    // Ignore station markers / controls that are not content photos
    if(img.closest('button') && img.closest('button').getAttribute('aria-label') &&
       !img.classList.contains('board-frame') && !img.closest('#boards')) {
      // allow board buttons; skip map pin buttons that somehow have imgs
    }
    e.preventDefault();
    e.stopPropagation();
    collect();
    openAt(indexForSrc(fullSrc(img)));
  }

  document.addEventListener('click', onActivate, true);
  document.addEventListener('keydown', function(e){
    if(!lb || !lb.classList.contains('is-open')) return;
    if(e.key==='Escape'){ e.preventDefault(); close(); }
    if(e.key==='ArrowLeft'){ e.preventDefault(); openAt(i-1); }
    if(e.key==='ArrowRight'){ e.preventDefault(); openAt(i+1); }
  });

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', collect);
  else collect();
})();
