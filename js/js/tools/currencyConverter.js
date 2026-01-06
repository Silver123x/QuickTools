export function render(root){
  root.innerHTML = ''
    + '<div class="row"><div class="form-row"><label>Amount</label><input id="amt" type="number" min="0" value="100"></div>'
    + '<div class="form-row"><label>From</label><input id="from" type="text" value="USD"></div>'
    + '<div class="form-row"><label>To</label><input id="to" type="text" value="INR"></div></div>'
    + '<div class="row"><div class="form-row"><label>Rate</label><input id="rate" type="number" min="0" step="0.0001" placeholder="Manual rate"></div>'
    + '<div class="form-row"><button class="btn btn-secondary" id="fetch">Fetch Rate</button></div>'
    + '<div class="form-row"><button class="btn btn-secondary" id="run">Convert</button></div></div>'
    + '<div class="output"><div id="status" class="pill"></div><div id="out" style="margin-top:8px"></div></div>';
  const amt=root.querySelector('#amt'); const from=root.querySelector('#from'); const to=root.querySelector('#to'); const rate=root.querySelector('#rate'); const status=root.querySelector('#status'); const out=root.querySelector('#out');
  async function fetchRate(){
    status.textContent='Fetching…';
    try{
      const url='https://api.exchangerate.host/latest?base='+encodeURIComponent(from.value||'USD')+'&symbols='+encodeURIComponent(to.value||'INR');
      const r=await fetch(url); const j=await r.json(); const val=j.rates?.[to.value.toUpperCase()]||0;
      if(val){ rate.value=String(val); status.textContent='Rate '+val.toFixed(4); status.classList.add('success'); } else { status.textContent='Unavailable'; status.classList.add('error'); }
    }catch(e){ status.textContent='Network error'; status.classList.add('error'); }
  }
  function convert(){
    const A=Number(amt.value); const R=Number(rate.value);
    if(!A||!R){ out.textContent='Enter amount and rate'; return; }
    const res=A*R;
    out.textContent=A+' '+from.value.toUpperCase()+' = '+res.toFixed(2)+' '+to.value.toUpperCase();
  }
  root.querySelector('#fetch').addEventListener('click', fetchRate);
  root.querySelector('#run').addEventListener('click', convert);
}
