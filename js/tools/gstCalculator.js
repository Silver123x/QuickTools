export function render(root){
  root.innerHTML = ''
    + '<div class="row"><div class="form-row"><label>Amount</label><input id="amt" type="number" min="0" value="1000"></div>'
    + '<div class="form-row"><label>GST %</label><input id="rate" type="number" min="0" step="0.1" value="18"></div>'
    + '<div class="form-row"><label>Mode</label><select id="mode"><option value="exclusive">Exclusive</option><option value="inclusive">Inclusive</option></select></div></div>'
    + '<div class="row"><button class="btn btn-secondary" id="run">Compute</button></div>'
    + '<div class="output"><div id="out" class="pill"></div></div>';
  const amt=root.querySelector('#amt'); const rate=root.querySelector('#rate'); const mode=root.querySelector('#mode'); const out=root.querySelector('#out');
  function calc(){
    const A=Number(amt.value); const R=Number(rate.value)/100;
    if(!(A>=0) || !(R>=0)){ out.textContent='Enter values'; return; }
    if(mode.value==='exclusive'){
      const gst=A*R; const total=A+gst;
      out.textContent='GST '+gst.toFixed(2)+' • Total '+total.toFixed(2);
    } else {
      const base=A/(1+R); const gst=A-base;
      out.textContent='Base '+base.toFixed(2)+' • GST '+gst.toFixed(2);
    }
  }
  root.querySelector('#run').addEventListener('click', calc);
}
