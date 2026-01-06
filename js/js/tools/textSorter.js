export function render(root){
  root.innerHTML = ''
    + '<div class="form-row"><label>Input</label><textarea id="in" rows="8"></textarea></div>'
    + '<div class="row"><div class="form-row"><label>Order</label><select id="order"><option value="asc">Ascending</option><option value="desc">Descending</option></select></div>'
    + '<div class="form-row"><label><input id="numeric" type="checkbox"> Numeric sort</label></div>'
    + '<div class="form-row"><label><input id="case" type="checkbox"> Case sensitive</label></div>'
    + '<div class="form-row"><label><input id="ignoreEmpty" type="checkbox" checked> Ignore empty lines</label></div></div>'
    + '<div class="row"><button class="btn btn-secondary" id="run">Sort</button></div>'
    + '<div class="output"><label>Output</label><textarea id="out" rows="8"></textarea></div>';
  const input=root.querySelector('#in'); const out=root.querySelector('#out'); const order=root.querySelector('#order'); const numeric=root.querySelector('#numeric'); const caseS=root.querySelector('#case'); const ignoreEmpty=root.querySelector('#ignoreEmpty'); const run=root.querySelector('#run');
  function cmp(a,b){
    let aa=a, bb=b;
    if(!caseS.checked){ aa=aa.toLowerCase(); bb=bb.toLowerCase(); }
    if(numeric.checked){
      const na=Number(aa), nb=Number(bb);
      if(!Number.isNaN(na) && !Number.isNaN(nb)) {
        if(na<nb) return -1;
        if(na>nb) return 1;
        return 0;
      }
    }
    const r=aa.localeCompare(bb);
    return r;
  }
  function process(){
    const raw=(input.value||'').split(/\r?\n/);
    const lines = ignoreEmpty.checked ? raw.filter(l=>l.trim().length>0) : raw.slice();
    const indexed=lines.map((v,i)=>({v,i}));
    indexed.sort((x,y)=>{ const r=cmp(x.v,y.v); return r!==0 ? r : x.i - y.i; });
    const sorted=indexed.map(x=>x.v);
    if(order.value==='desc') sorted.reverse();
    out.value=sorted.join('\n');
  }
  run.addEventListener('click', process);
}
