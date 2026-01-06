import { qs, qsa, on } from './utils.js';
function filterCards() {
  const term = qs('#toolSearch')?.value?.toLowerCase()?.trim() || '';
  const cards = qsa('.grid .card');
  cards.forEach(c=>{
    const title = qs('.card-title', c)?.textContent?.toLowerCase() || '';
    const kw = c.getAttribute('data-keywords') || '';
    const match = !term || title.includes(term) || kw.toLowerCase().includes(term);
    c.style.display = match ? '' : 'none';
  });
}
export function initSearch() {
  const s=qs('#toolSearch');
  if(!s) return;
  on(s,'input',filterCards);
}
