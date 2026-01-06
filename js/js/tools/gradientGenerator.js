export function render(root){
  root.innerHTML = ''
    + '<div class="row"><div class="form-row"><label>Color 1</label><input id="c1" type="color" value="#2563eb"></div>'
    + '<div class="form-row"><label>Color 2</label><input id="c2" type="color" value="#60a5fa"></div>'
    + '<div class="form-row"><label>Angle</label><input id="ang" type="range" min="0" max="360" value="90"></div></div>'
    + '<div class="output"><div id="prev" style="width:100%;height:160px;border-radius:12px"></div><div id="css" style="margin-top:12px"></div></div>';
  const c1=root.querySelector('#c1'); const c2=root.querySelector('#c2'); const ang=root.querySelector('#ang'); const prev=root.querySelector('#prev'); const css=root.querySelector('#css');
  function update(){
    const g='linear-gradient('+ang.value+'deg,'+c1.value+','+c2.value+')';
    prev.style.background=g;
    css.textContent='background: '+g+';';
  }
  c1.addEventListener('input', update);
  c2.addEventListener('input', update);
  ang.addEventListener('input', update);
  update();
}
