export function render(root){
  root.innerHTML = ''
    + '<div class="row"><button class="btn btn-secondary" id="gen">Generate UUID v4</button></div>'
    + '<div class="output"><div id="out" class="pill"></div></div>';
  const out=root.querySelector('#out');
  function gen(){ out.textContent=crypto.randomUUID(); }
  root.querySelector('#gen').addEventListener('click', gen);
  gen();
}
