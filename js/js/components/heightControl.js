export function mountHeightControl(root, opts = {}) {
  const min = Number(opts.min ?? 0);
  const max = Number(opts.max ?? 100);
  const step = Number(opts.step ?? 1);
  const unit = String(opts.unit ?? 'cm');
  const val = Number(opts.value ?? Math.round((min + max) / 2));
  const wrap = document.createElement('div');
  wrap.className = 'height-control';
  wrap.setAttribute('role','group');
  wrap.setAttribute('aria-label','Lighting height');
  wrap.innerHTML =
    '<div class="hc-header">' +
      '<div class="hc-title">Height</div>' +
      '<div class="hc-value" aria-live="polite" id="hcValue"></div>' +
    '</div>' +
    '<div class="hc-row">' +
      '<button class="btn btn-secondary hc-btn" id="dec" aria-label="Decrease height">−</button>' +
      '<input class="hc-slider" id="range" type="range" min="'+min+'" max="'+max+'" step="'+step+'" value="'+val+'" aria-valuemin="'+min+'" aria-valuemax="'+max+'" aria-valuenow="'+val+'" aria-label="Height slider">' +
      '<button class="btn btn-secondary hc-btn" id="inc" aria-label="Increase height">+</button>' +
    '</div>' +
    '<div class="hc-row">' +
      '<div class="form-row"><label for="hcNum">Value</label><input class="hc-num" id="hcNum" type="number" min="'+min+'" max="'+max+'" step="'+step+'" value="'+val+'"></div>' +
      '<div class="form-row"><label for="hcUnit">Unit</label><select class="hc-unit" id="hcUnit"><option'+(unit==='cm'?' selected':'')+'>cm</option><option'+(unit==='m'?' selected':'')+'>m</option><option'+(unit==='px'?' selected':'')+'>px</option></select></div>' +
    '</div>' +
    '<div class="hc-preview" id="hcPreview"><div class="hc-box">Light</div></div>';
  root.appendChild(wrap);
  const range = wrap.querySelector('#range');
  const dec = wrap.querySelector('#dec');
  const inc = wrap.querySelector('#inc');
  const num = wrap.querySelector('#hcNum');
  const unitSel = wrap.querySelector('#hcUnit');
  const display = wrap.querySelector('#hcValue');
  const preview = wrap.querySelector('#hcPreview');
  const box = wrap.querySelector('.hc-box');
  let current = val;
  let currentUnit = unit;
  function format(v,u){
    if(u==='m') return (v/100).toFixed(2)+' m';
    if(u==='cm') return Math.round(v)+' cm';
    if(u==='px') return Math.round(v)+' px';
    return String(v)+' '+u;
  }
  function updateShadow(v){
    const offset = Math.round(v/5);
    box.style.boxShadow = '0 '+offset+'px '+Math.max(12, offset*2)+'px rgba(0,0,0,0.20)';
    box.style.transform = 'translateY('+Math.min(20, Math.round(v/10))+'px)';
  }
  function bump(){
    display.classList.remove('bump');
    void display.offsetWidth;
    display.classList.add('bump');
  }
  function sync(from){
    const v = Math.max(min, Math.min(max, Number(range.value)));
    current = v;
    num.value = String(v);
    range.value = String(v);
    range.setAttribute('aria-valuenow', String(v));
    display.textContent = format(v, currentUnit);
    updateShadow(v);
    bump();
    wrap.dispatchEvent(new CustomEvent('heightchange', { detail: { value: v, unit: currentUnit, source: from } }));
  }
  dec.addEventListener('click', ()=>{ range.value = String(Math.max(min, current - step)); sync('dec'); });
  inc.addEventListener('click', ()=>{ range.value = String(Math.min(max, current + step)); sync('inc'); });
  range.addEventListener('input', ()=> sync('range'));
  num.addEventListener('input', ()=>{ range.value = String(Number(num.value)||current); sync('num'); });
  unitSel.addEventListener('change', ()=>{ currentUnit = unitSel.value; sync('unit'); });
  wrap.addEventListener('keydown', (e)=>{
    if(e.key==='ArrowLeft'){ e.preventDefault(); dec.click(); }
    if(e.key==='ArrowRight'){ e.preventDefault(); inc.click(); }
  });
  sync('init');
  return {
    getValue(){ return { value: current, unit: currentUnit }; },
    onChange(fn){ wrap.addEventListener('heightchange', (e)=>fn(e.detail)); }
  };
}
