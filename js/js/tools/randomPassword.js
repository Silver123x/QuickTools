function randomInt(min,max){return Math.floor(Math.random()*(max-min+1))+min;}
function makePassword(len,opts){
  const lowers='abcdefghijklmnopqrstuvwxyz';
  const uppers='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const digits='0123456789';
  const symbols='!@#$%^&*()-_=+[]{};:,.<>?';
  let alphabet='';
  if(opts.lower) alphabet+=lowers;
  if(opts.upper) alphabet+=uppers;
  if(opts.digit) alphabet+=digits;
  if(opts.symbol) alphabet+=symbols;
  if(!alphabet) alphabet=lowers+uppers+digits;
  let out='';
  const arr=new Uint32Array(len);
  crypto.getRandomValues(arr);
  for(let i=0;i<len;i++){ out+=alphabet[arr[i]%alphabet.length]; }
  return out;
}
export function render(root){
  root.innerHTML = ''
    + '<div class="row"><div class="form-row"><label>Length</label><input id="len" type="number" min="4" value="12"></div>'
    + '<div class="form-row"><label><input id="lower" type="checkbox" checked> Lowercase</label></div>'
    + '<div class="form-row"><label><input id="upper" type="checkbox" checked> Uppercase</label></div>'
    + '<div class="form-row"><label><input id="digit" type="checkbox" checked> Digits</label></div>'
    + '<div class="form-row"><label><input id="symbol" type="checkbox"> Symbols</label></div></div>'
    + '<div class="row"><button class="btn btn-secondary" id="gen">Generate</button><button class="btn btn-secondary" id="rand">Random Number</button></div>'
    + '<div class="output"><div id="out" class="pill"></div></div>';
  const len=root.querySelector('#len'); const lower=root.querySelector('#lower'); const upper=root.querySelector('#upper'); const digit=root.querySelector('#digit'); const symbol=root.querySelector('#symbol'); const out=root.querySelector('#out');
  function gen(){ const l=Math.max(4,Number(len.value)||12); out.textContent=makePassword(l,{lower:lower.checked,upper:upper.checked,digit:digit.checked,symbol:symbol.checked}); }
  function rand(){ out.textContent=String(randomInt(1,1_000_000)); }
  root.querySelector('#gen').addEventListener('click', gen);
  root.querySelector('#rand').addEventListener('click', rand);
  gen();
}
