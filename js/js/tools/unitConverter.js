export function render(root){
  root.innerHTML = ''
    + '<div class="row"><div class="form-row"><label>Category</label><select id="cat"><option value="length">Length</option><option value="weight">Weight</option><option value="temperature">Temperature</option></select></div>'
    + '<div class="form-row"><label>From</label><input id="from" type="text" value="m"></div>'
    + '<div class="form-row"><label>To</label><input id="to" type="text" value="ft"></div></div>'
    + '<div class="row"><div class="form-row"><label>Value</label><input id="val" type="number" value="1"></div>'
    + '<div class="form-row"><button class="btn btn-secondary" id="run">Convert</button></div></div>'
    + '<div class="output"><div id="out" class="pill"></div></div>';
  const cat=root.querySelector('#cat'); const from=root.querySelector('#from'); const to=root.querySelector('#to'); const val=root.querySelector('#val'); const out=root.querySelector('#out');
  const units = {
    length: { m:1, km:1000, cm:0.01, mm:0.001, in:0.0254, ft:0.3048, yd:0.9144, mi:1609.344 },
    weight: { kg:1, g:0.001, mg:0.000001, lb:0.45359237, oz:0.028349523125 },
  };
  function conv(){
    const C=cat.value;
    if(C==='temperature'){
      const v=Number(val.value); const f=from.value.toLowerCase(); const t=to.value.toLowerCase();
      let K=null;
      if(f==='c') K=v+273.15; else if(f==='f') K=(v-32)*5/9+273.15; else if(f==='k') K=v; else { out.textContent='Use C/F/K'; return; }
      let res=null;
      if(t==='c') res=K-273.15; else if(t==='f') res=(K-273.15)*9/5+32; else if(t==='k') res=K; else { out.textContent='Use C/F/K'; return; }
      out.textContent=v+' '+f.toUpperCase()+' = '+res.toFixed(4)+' '+t.toUpperCase();
      return;
    }
    const map=units[C];
    const f=from.value.toLowerCase(); const t=to.value.toLowerCase();
    if(!(f in map) || !(t in map)){ out.textContent='Unsupported unit'; return; }
    const base=Number(val.value)*map[f];
    const res=base/map[t];
    out.textContent=val.value+' '+f+' = '+res.toFixed(6)+' '+t;
  }
  root.querySelector('#run').addEventListener('click', conv);
}
