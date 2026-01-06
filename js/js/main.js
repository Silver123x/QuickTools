function qs(selector, root) { return (root || document).querySelector(selector); }
function qsa(selector, root) { return Array.from((root || document).querySelectorAll(selector)); }
function on(el, evt, fn) { el.addEventListener(evt, fn); }
function toggleNav() { const nav=qs('#nav'); nav.classList.toggle('open'); }
function setHeaderShadow() { const h=qs('#header'); if(!h) return; if(window.scrollY>4) h.classList.add('scrolled'); else h.classList.remove('scrolled'); }
function filterCards() {
  const term = qs('#toolSearch')?.value?.toLowerCase()?.trim() || '';
  const cards = qsa('.card');
  
  // Filter cards
  cards.forEach(c => {
    const title = qs('.card-title', c)?.textContent?.toLowerCase() || '';
    const desc = qs('.card-desc', c)?.textContent?.toLowerCase() || '';
    const kw = c.getAttribute('data-keywords') || '';
    const match = !term || title.includes(term) || desc.includes(term) || kw.toLowerCase().includes(term);
    c.style.display = match ? '' : 'none';
    
    // Animate entry (simple fade/slide for filtered items could be nice, but simple display toggle is fast)
    if(match) {
        c.classList.add('fade-in'); // We can add a CSS class for this if we want
    }
  });

  // Hide empty categories
  const categories = qsa('.tools-category');
  let visibleCategories = 0;
  categories.forEach(cat => {
    const visibleCards = qsa('.card', cat).filter(c => c.style.display !== 'none');
    if (visibleCards.length > 0) {
      cat.style.display = '';
      visibleCategories++;
    } else {
      cat.style.display = 'none';
    }
  });

  // Empty state handling
  let noRes = qs('#noResults');
  if (!noRes) {
    noRes = document.createElement('div');
    noRes.id = 'noResults';
    noRes.className = 'container';
    noRes.style.textAlign = 'center';
    noRes.style.padding = '80px 20px';
    noRes.style.display = 'none';
    noRes.innerHTML = `
      <div style="font-size:48px;margin-bottom:16px;opacity:0.5">🔍</div>
      <h3 style="font-size:20px;font-weight:600;margin:0 0 8px;color:var(--text)">No tools found</h3>
      <p style="color:var(--muted);margin:0">We couldn't find any tools matching "<b><span id='noResTerm'></span></b>".<br>Try searching for "pdf", "image", or "calculator".</p>
    `;
    const hero = qs('.hero');
    if(hero && hero.nextSibling) {
      hero.parentNode.insertBefore(noRes, hero.nextSibling);
    }
  }

  if (visibleCategories === 0 && term) {
    noRes.style.display = 'block';
    const termSpan = qs('#noResTerm', noRes);
    if(termSpan) termSpan.textContent = term;
  } else {
    if(noRes) noRes.style.display = 'none';
  }
}
function initSearch() {
  const s=qs('#toolSearch');
  const btn=qs('#navSearchBtn');
  
  if(s) {
    on(s,'input',filterCards);
  }
  
  if(btn && s) {
    on(btn, 'click', () => {
       s.scrollIntoView({ behavior: 'smooth', block: 'center' });
       setTimeout(() => s.focus(), 500);
    });
  }
}
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
function initHeader() {
  setHeaderShadow();
  on(window,'scroll',setHeaderShadow);
}
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
function registerSW() {
  if('serviceWorker' in navigator){
    navigator.serviceWorker.register('/js/sw.js').catch(()=>{});
  }
}
function initVitals(){
  try{
    const po = new PerformanceObserver((list)=>{
      list.getEntries().forEach((e)=>{
        // placeholder: send to analytics if available
        if(window.TW_ANALYTICS){ try{ window.TW_ANALYTICS('web-vitals', e.name, e.value); }catch(_e){} }
      });
    });
    po.observe({ type: 'largest-contentful-paint', buffered: true });
    po.observe({ type: 'layout-shift', buffered: true });
    po.observe({ type: 'first-input', buffered: true });
  }catch(e){}
}
function initToolLinks() {
  const links = qsa('a.btn');
  links.forEach(l => {
    // Only apply to tool links, not anchor jumps
    if(l.getAttribute('href')?.startsWith('tools/')) {
      on(l, 'click', () => {
        l.classList.add('btn-loading');
        const originalText = l.textContent;
        l.textContent = 'Loading...';
        // Fallback if navigation is cancelled or back button used
        setTimeout(() => {
            l.classList.remove('btn-loading');
            l.textContent = originalText;
        }, 3000); 
      });
    }
  });
}

document.addEventListener('DOMContentLoaded', ()=>{
  initHamburger();
  initHeader();
  initSearch();
  initContactForm();
  initTheme();
  registerSW();
  initVitals();
  initToolLinks();
});
