
(function(){
  var btn=document.querySelector('[data-ev-menu]');
  var panel=document.querySelector('[data-ev-panel]');
  if(btn&&panel){
    btn.addEventListener('click',function(){
      var open=panel.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', open?'true':'false');
    });
  }
})();
