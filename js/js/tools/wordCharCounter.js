export function render(root){
  root.innerHTML = ''
    + '<div class="form-row"><label>Text</label><textarea id="text" rows="10"></textarea></div>'
    + '<div class="output"><div id="stats" class="pill"></div></div>';
  const t=root.querySelector('#text'); const s=root.querySelector('#stats');
  function update(){
    const v=t.value;
    const lines=v? v.split(/\r?\n/).length : 0;
    const words=v? v.trim().split(/\s+/).filter(Boolean).length : 0;
    const chars=v.length;
    s.textContent='Words '+words+' • Chars '+chars+' • Lines '+lines;
  }
  t.addEventListener('input', update);
  update();
}
