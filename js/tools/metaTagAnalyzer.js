export function render(root){
  root.innerHTML = ''
    + '<div class="form-row"><label>HTML</label><textarea id="html" rows="10" placeholder="Paste full HTML"></textarea></div>'
    + '<div class="row"><button class="btn btn-secondary" id="run">Analyze</button></div>'
    + '<div class="output"><div id="out"></div></div>';
  const html=root.querySelector('#html'); const out=root.querySelector('#out');
  function analyze(){
    const doc=new DOMParser().parseFromString(html.value||'', 'text/html');
    const metas=Array.from(doc.querySelectorAll('meta'));
    if(!metas.length){ out.textContent='No meta tags found'; return; }
    const items=metas.map(m=>{
      const name=m.getAttribute('name')||m.getAttribute('property')||m.getAttribute('charset')||'meta';
      const content=m.getAttribute('content')||'';
      return '<div class="pill">'+name+': '+content+'</div>';
    }).join(' ');
    out.innerHTML=items;
  }
  root.querySelector('#run').addEventListener('click', analyze);
}
