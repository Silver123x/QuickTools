export function render(root){
  root.innerHTML = ''
    + '<div class="row"><div class="form-row"><label>Date & Time</label><input id="dt" type="datetime-local"></div>'
    + '<div class="form-row"><label>From TZ</label><input id="from" type="text" value="UTC"></div>'
    + '<div class="form-row"><label>To TZ</label><input id="to" type="text" value="Asia/Kolkata"></div></div>'
    + '<div class="row"><button class="btn btn-secondary" id="run">Convert</button></div>'
    + '<div class="output"><div id="out" class="pill"></div></div>';
  const dt=root.querySelector('#dt'); const from=root.querySelector('#from'); const to=root.querySelector('#to'); const out=root.querySelector('#out');
  function convert(){
    const v=dt.value; if(!v){ out.textContent='Enter date'; return; }
    const d=new Date(v);
    try{
      const fmt=new Intl.DateTimeFormat('en-US',{ timeZone: to.value, year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit', second:'2-digit' });
      const s=fmt.format(d);
      out.textContent=s+' ('+to.value+')';
    }catch(e){ out.textContent='Invalid timezone'; }
  }
  root.querySelector('#run').addEventListener('click', convert);
}
