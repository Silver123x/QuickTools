function tokenize(s){return s.toLowerCase().match(/[a-z0-9]+(?:'[a-z0-9]+)?/g)||[];}
export function render(root){
  root.innerHTML = ''
    + '<div class="form-row"><label>Text</label><textarea id="text" rows="10"></textarea></div>'
    + '<div class="row"><div class="form-row"><label>Keyword</label><input id="kw" type="text" placeholder="optional"></div>'
    + '<div class="form-row"><button class="btn btn-secondary" id="run">Analyze</button></div></div>'
    + '<div class="output"><div id="out"></div></div>';
  const text=root.querySelector('#text'); const kw=root.querySelector('#kw'); const out=root.querySelector('#out');
  function analyze(){
    const tokens=tokenize(text.value||''); const total=tokens.length;
    const freq=new Map(); tokens.forEach(t=>freq.set(t,(freq.get(t)||0)+1));
    const rows=[...freq.entries()].sort((a,b)=>b[1]-a[1]).slice(0,10);
    const selected=(kw.value||'').toLowerCase();
    let html='Total words '+total+'<br>';
    if(selected){ const count=freq.get(selected)||0; const density=total? (count/total*100).toFixed(2) : '0.00'; html+='“'+selected+'” count '+count+' • density '+density+'%<br>'; }
    html+=rows.map(([w,c])=>'<span class="pill">'+w+': '+c+'</span>').join(' ');
    out.innerHTML=html;
  }
  root.querySelector('#run').addEventListener('click', analyze);
}
