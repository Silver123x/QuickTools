import { qs, qsa, on } from './utils.js';
import { initSearch } from './search.js';
function toggleNav() { const nav=qs('#nav'); if(!nav) return; nav.classList.toggle('open'); }
function setHeaderShadow() { const h=qs('#header'); if(!h) return; if(window.scrollY>4) h.classList.add('scrolled'); else h.classList.remove('scrolled'); }
function initContactForm() {
  const form = qs('#contactForm');
  if(!form) return;
  function setError(id,msg){ const el=qsa('.error',form).find(e=>e.getAttribute('data-for')===id); if(el) el.textContent=msg||''; }
  function validate() {
    let ok=true;
    const name=qs('#name',form).value.trim();
    const email=qs('#email',form).value.trim();
    const message=qs('#message',form).value.trim();
    setError('name',''); setError('email',''); setError('message','');
    if(!name) { setError('name','Please enter your name'); ok=false; }
    if(!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('email','Please enter a valid email'); ok=false; }
    if(!message) { setError('message','Please enter a message'); ok=false; }
    return ok;
  }
  on(form,'submit',e=>{
    e.preventDefault();
    const ok=validate();
    const status=qs('#contactStatus');
    if(!ok) { status.textContent=''; return; }
    const payload={ name:qs('#name',form).value.trim(), email:qs('#email',form).value.trim(), message:qs('#message',form).value.trim(), ts:Date.now() };
    const k='tools-wonder-messages';
    const list=JSON.parse(localStorage.getItem(k)||'[]');
    list.push(payload);
    localStorage.setItem(k,JSON.stringify(list));
    form.reset();
    status.textContent='Message saved locally.';
    status.classList.add('success');
  });
}
function initHamburger() {
  const h=qs('#hamburger');
  if(!h) return;
  on(h,'click',toggleNav);
}
function initHeader() { setHeaderShadow(); on(window,'scroll',setHeaderShadow); }
function initTheme() {
  const btn=qs('#themeToggle');
  const key='tw-theme';
  const saved=localStorage.getItem(key);
  if(saved==='dark') document.documentElement.classList.add('dark');
  if(btn){
    btn.textContent = document.documentElement.classList.contains('dark') ? 'Light' : 'Dark';
    on(btn,'click',()=>{
      const dark=document.documentElement.classList.toggle('dark');
      localStorage.setItem(key, dark?'dark':'light');
      btn.textContent = dark ? 'Light' : 'Dark';
    });
  }
}
function registerSW() { if('serviceWorker' in navigator){ navigator.serviceWorker.register('/js/sw.js').catch(()=>{}); } }
function initVitals(){
  try{
    const po = new PerformanceObserver((list)=>{
      list.getEntries().forEach((e)=>{
        if(window.TW_ANALYTICS){ try{ window.TW_ANALYTICS('web-vitals', e.name, e.value); }catch(_e){} }
      });
    });
    po.observe({ type: 'largest-contentful-paint', buffered: true });
    po.observe({ type: 'layout-shift', buffered: true });
    po.observe({ type: 'first-input', buffered: true });
  }catch(e){}
}
export function initApp(){
  initHamburger();
  initHeader();
  initSearch();
  initContactForm();
  initTheme();
  registerSW();
  initVitals();
}
document.addEventListener('DOMContentLoaded', initApp);
