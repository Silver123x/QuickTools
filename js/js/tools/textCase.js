function titleCase(s){return s.toLowerCase().split(/\s+/).map(w=>w.charAt(0).toUpperCase()+w.slice(1)).join(' ');}
export function render(root){
  root.innerHTML = ''
    + '<div class="form-row"><label>Input</label><textarea id="input" rows="6" placeholder="Enter text…"></textarea></div>'
    + '<div class="row"><button class="btn btn-secondary" id="upper">UPPERCASE</button><button class="btn btn-secondary" id="lower">lowercase</button><button class="btn btn-secondary" id="title">Title Case</button></div>'
    + '<div class="output"><label>Output</label><textarea id="output" rows="6"></textarea><div style="margin-top:8px"><button class="btn btn-secondary" id="copy">Copy</button><button class="btn btn-secondary" id="reset" style="margin-left:8px">Reset</button></div></div>';
  const input=root.querySelector('#input'); const out=root.querySelector('#output');
  function set(v){ out.value=v; }
  root.querySelector('#upper').addEventListener('click',()=>set(input.value.toUpperCase()));
  root.querySelector('#lower').addEventListener('click',()=>set(input.value.toLowerCase()));
  root.querySelector('#title').addEventListener('click',()=>set(titleCase(input.value)));
  root.querySelector('#copy').addEventListener('click', async ()=>{ try{ await navigator.clipboard.writeText(out.value||''); }catch(e){} });
  root.querySelector('#reset').addEventListener('click',()=>{ input.value=''; out.value=''; });
}
