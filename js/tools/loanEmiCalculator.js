export function render(root){
  root.innerHTML = ''
    + '<div class="row"><div class="form-row"><label>Principal</label><input id="p" type="number" min="0" value="500000"></div>'
    + '<div class="form-row"><label>Annual Interest %</label><input id="r" type="number" min="0" step="0.01" value="8.5"></div>'
    + '<div class="form-row"><label>Tenure (months)</label><input id="n" type="number" min="1" value="60"></div></div>'
    + '<div class="row"><button class="btn btn-secondary" id="run">Calculate</button></div>'
    + '<div class="output"><div id="out" class="pill"></div></div>';
  const p=root.querySelector('#p'); const r=root.querySelector('#r'); const n=root.querySelector('#n'); const out=root.querySelector('#out');
  function calc(){
    const P=Number(p.value); const i=Number(r.value)/100/12; const N=Number(n.value);
    if(!P||!i||!N){ out.textContent='Enter values'; return; }
    const pow=Math.pow(1+i,N);
    const E=P*i*pow/(pow-1);
    const total=E*N;
    const interest=total-P;
    out.textContent='EMI '+E.toFixed(2)+' • Interest '+interest.toFixed(2)+' • Total '+total.toFixed(2);
  }
  root.querySelector('#run').addEventListener('click', calc);
}
