function sanitizeExpr(s){s=s.toLowerCase();s=s.replace(/pi/g,'Math.PI').replace(/\be\b/g,'Math.E').replace(/\bsin\(/g,'Math.sin(').replace(/\bcos\(/g,'Math.cos(').replace(/\btan\(/g,'Math.tan(').replace(/\bsqrt\(/g,'Math.sqrt(').replace(/\blog\(/g,'Math.log(').replace(/\bpow\(/g,'Math.pow(');if(!/^[\d\s\.\+\-\*\/\%\(\)a-z\.]*$/i.test(s)) return '';return s;}
export function render(root){
  root.innerHTML = ''
    + '<div class="form-row"><label>Expression</label><input id="expr" type="text" placeholder="e.g. sin(0.5)+pow(2,3)"></div>'
    + '<div class="row"><button class="btn btn-secondary" id="calc">Calculate</button></div>'
    + '<div class="output"><div id="out" class="pill"></div></div>';
  const expr=root.querySelector('#expr'); const out=root.querySelector('#out'); const btn=root.querySelector('#calc');
  function run(){ const s=sanitizeExpr(expr.value||''); if(!s){ out.textContent='Invalid expression'; return; } try{ const r=Function('return ('+s+')')(); out.textContent=String(r); }catch(e){ out.textContent='Error'; } }
  btn.addEventListener('click', run);
}
