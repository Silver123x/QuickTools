export function qs(selector, root) { return (root || document).querySelector(selector); }
export function qsa(selector, root) { return Array.from((root || document).querySelectorAll(selector)); }
export function on(el, evt, fn) { el.addEventListener(evt, fn); }
export async function copyText(text) {
  try { await navigator.clipboard.writeText(text || ''); return true; } catch(e) { return false; }
}
export function formatBytes(n){ if(!n) return '0 KB'; return (n/1024).toFixed(1)+' KB'; }
