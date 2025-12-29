export function render(root){
  root.innerHTML = ''
    + '<div class="form-row"><label>Pattern</label><input id="pat" type="text" placeholder="e.g. \\b\\w+\\b"></div>'
    + '<div class="row"><div class="form-row"><label>Flags</label><input id="flags" type="text" placeholder="g, i, m"></div></div>'
    + '<div class="form-row"><label>Text</label><textarea id="text" rows="8"></textarea></div>'
    + '<div class="row"><button class="btn btn-secondary" id="run">Test</button></div>'
    + '<div class="output"><div id="out"></div></div>';
  const pat=root.querySelector('#pat'); const flags=root.querySelector('#flags'); const text=root.querySelector('#text'); const out=root.querySelector('#out');
  function run(){
    let re=null; try{ re=new RegExp(pat.value, flags.value); }catch(e){ out.textContent='Invalid pattern'; return; }
    const v=text.value||''; const m=v.match(re);
    if(!m){ out.textContent='No matches'; return; }
    out.innerHTML = 'Matches: '+m.length+'<br>'+m.map(x=>'<span class="pill">'+x+'</span>').join(' ');
  }
  root.querySelector('#run').addEventListener('click', run);
}
