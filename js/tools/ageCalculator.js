export function render(root){
  root.innerHTML = ''
    + '<div class="form-row"><label>Date of Birth</label><input id="dob" type="date"></div>'
    + '<div class="row"><button class="btn btn-secondary" id="run">Calculate</button></div>'
    + '<div class="output"><div id="out" class="pill"></div></div>';
  const dob=root.querySelector('#dob'); const out=root.querySelector('#out');
  function calc(){
    const v=dob.value; if(!v){ out.textContent='Enter date'; return; }
    const birth=new Date(v); const now=new Date();
    let years=now.getFullYear()-birth.getFullYear();
    let months=now.getMonth()-birth.getMonth();
    let days=now.getDate()-birth.getDate();
    if(days<0){ const prevMonth=new Date(now.getFullYear(),now.getMonth(),0).getDate(); days+=prevMonth; months--; }
    if(months<0){ months+=12; years--; }
    out.textContent=years+' years • '+months+' months • '+days+' days';
  }
  root.querySelector('#run').addEventListener('click', calc);
}
