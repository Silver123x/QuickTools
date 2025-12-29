export function render(root){
  root.innerHTML = ''
    + '<div class="form-row"><label>Input</label><textarea id="in" rows="8"></textarea></div>'
    + '<div class="row"><div class="form-row"><label>Mode</label><select id="mode"><option value="chars">By characters</option><option value="words">By words</option><option value="lines">By lines</option></select></div></div>'
    + '<div class="row"><button class="btn btn-secondary" id="run">Reverse</button></div>'
    + '<div class="output"><label>Output</label><textarea id="out" rows="8"></textarea></div>';
  const input=root.querySelector('#in'); const out=root.querySelector('#out'); const mode=root.querySelector('#mode'); const run=root.querySelector('#run');
  function process(){
    const v=input.value||'';
    let r='';
    if(mode.value==='chars'){ r=[...v].reverse().join(''); }
    else if(mode.value==='words'){ r=v.split(/\s+/).reverse().join(' '); }
    else { r=v.split(/\r?\n/).reverse().join('\n'); }
    out.value=r;
  }
  run.addEventListener('click', process);
}
