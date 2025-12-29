function minifyJS(s){s=s.replace(/\/\*[\s\S]*?\*\//g,'').replace(/\/\/[^\n]*/g,'');s=s.replace(/\s+/g,' ');return s.trim();}
function minifyCSS(s){s=s.replace(/\/\*[\s\S]*?\*\//g,'');s=s.replace(/\s+/g,' ');s=s.replace(/\s*([{}:;,])\s*/g,'$1');return s.trim();}
function minifyHTML(s){s=s.replace(/<!--[\s\S]*?-->/g,'');s=s.replace(/\s+/g,' ');return s.trim();}
export function render(root){
  root.innerHTML = ''
    + '<div class="form-row"><label>Type</label><select id="type"><option value="js">JavaScript</option><option value="css">CSS</option><option value="html">HTML</option></select></div>'
    + '<div class="form-row"><label>Input</label><textarea id="in" rows="10"></textarea></div>'
    + '<div class="row"><button class="btn btn-secondary" id="run">Minify</button></div>'
    + '<div class="output"><label>Output</label><textarea id="out" rows="10"></textarea></div>';
  const type=root.querySelector('#type'); const input=root.querySelector('#in'); const out=root.querySelector('#out');
  function run(){
    const v=input.value||''; let r=v;
    if(type.value==='js') r=minifyJS(v);
    else if(type.value==='css') r=minifyCSS(v);
    else r=minifyHTML(v);
    out.value=r;
  }
  root.querySelector('#run').addEventListener('click', run);
}
