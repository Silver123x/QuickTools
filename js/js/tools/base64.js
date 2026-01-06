export function render(root){
  root.innerHTML = ''
    + '<div class="form-row"><label>Input</label><textarea id="in" rows="6"></textarea></div>'
    + '<div class="row"><button class="btn btn-secondary" id="enc">Encode</button><button class="btn btn-secondary" id="dec">Decode</button></div>'
    + '<div class="output"><label>Output</label><textarea id="out" rows="6"></textarea></div>';
  const input=root.querySelector('#in'); const out=root.querySelector('#out');
  root.querySelector('#enc').addEventListener('click',()=>{ out.value=btoa(unescape(encodeURIComponent(input.value||''))); });
  root.querySelector('#dec').addEventListener('click',()=>{ try{ out.value=decodeURIComponent(escape(atob(input.value||''))); }catch(e){ out.value=''; } });
}
