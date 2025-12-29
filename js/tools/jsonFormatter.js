export function render(root){
  root.innerHTML = ''
    + '<div class="form-row"><label>JSON</label><textarea id="in" rows="10"></textarea></div>'
    + '<div class="row"><div class="form-row"><label>Indent</label><select id="indent"><option value="2">2</option><option value="4">4</option><option value="0">Minify</option></select></div>'
    + '<div class="form-row"><button class="btn btn-secondary" id="format">Format</button></div></div>'
    + '<div class="output"><div id="status" class="pill"></div><label>Output</label><textarea id="out" rows="10"></textarea></div>';
  const input=root.querySelector('#in'); const out=root.querySelector('#out'); const indent=root.querySelector('#indent'); const status=root.querySelector('#status'); const btn=root.querySelector('#format');
  function run(){
    try {
      const obj=JSON.parse(input.value);
      const space=Number(indent.value);
      out.value=JSON.stringify(obj,null,space===0?0:space);
      status.textContent='Valid JSON';
      status.classList.remove('error'); status.classList.add('success');
    } catch(e) {
      status.textContent='Invalid JSON';
      status.classList.remove('success'); status.classList.add('error');
      out.value='';
    }
  }
  btn.addEventListener('click', run);
}
