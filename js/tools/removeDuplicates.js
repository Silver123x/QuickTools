export function render(root){
  root.innerHTML = ''
    + '<div class="form-row"><label>Input</label><textarea id="in" rows="8"></textarea></div>'
    + '<div class="row"><div class="form-row"><label><input id="case" type="checkbox"> Case sensitive</label></div>'
    + '<div class="form-row"><label><input id="trim" type="checkbox" checked> Trim lines</label></div></div>'
    + '<div class="row"><button class="btn btn-secondary" id="run">Remove Duplicates</button></div>'
    + '<div class="output"><label>Output</label><textarea id="out" rows="8"></textarea></div>';
  const input=root.querySelector('#in'); const out=root.querySelector('#out'); const caseS=root.querySelector('#case'); const trim=root.querySelector('#trim'); const run=root.querySelector('#run');
  function process(){
    const lines=(input.value||'').split(/\r?\n/);
    const seen=new Set(); const res=[];
    for(let ln of lines){
      if(trim.checked) ln=ln.trim();
      const key=caseS.checked? ln : ln.toLowerCase();
      if(!seen.has(key)){ seen.add(key); res.push(ln); }
    }
    out.value=res.join('\n');
  }
  run.addEventListener('click', process);
}
