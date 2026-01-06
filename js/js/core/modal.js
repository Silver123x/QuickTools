let overlay=null, content=null, closeBtn=null;
function ensure(){
  if(overlay) return;
  overlay=document.createElement('div');
  overlay.className='modal-overlay';
  overlay.setAttribute('role','dialog');
  overlay.setAttribute('aria-modal','true');
  content=document.createElement('div');
  content.className='modal-content';
  closeBtn=document.createElement('button');
  closeBtn.className='btn btn-secondary modal-close';
  closeBtn.setAttribute('aria-label','Close');
  closeBtn.textContent='Close';
  overlay.appendChild(content);
  overlay.appendChild(closeBtn);
  document.body.appendChild(overlay);
  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', (e)=>{ if(e.target===overlay) close(); });
}
export function open(html){
  ensure();
  content.innerHTML=html||'';
  overlay.classList.add('open');
  closeBtn.focus();
}
export function close(){
  if(!overlay) return;
  overlay.classList.remove('open');
}
