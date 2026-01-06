export function render(root){
  root.innerHTML = ''
    + '<div class="row"><div class="form-row"><label>Height (cm)</label><input id="h" type="number" min="1" value="170"></div>'
    + '<div class="form-row"><label>Weight (kg)</label><input id="w" type="number" min="1" value="70"></div></div>'
    + '<div class="row"><button class="btn btn-secondary" id="run">Calculate</button></div>'
    + '<div class="output"><div id="out" class="pill"></div></div>';
  const h=root.querySelector('#h'); const w=root.querySelector('#w'); const out=root.querySelector('#out');
  function calc(){
    const height=Number(h.value)/100; const weight=Number(w.value);
    if(!height||!weight){ out.textContent='Enter values'; return; }
    const bmi=weight/(height*height);
    let cat='Normal'; if(bmi<18.5) cat='Underweight'; else if(bmi>=25 && bmi<30) cat='Overweight'; else if(bmi>=30) cat='Obese';
    out.textContent='BMI '+bmi.toFixed(1)+' • '+cat;
  }
  root.querySelector('#run').addEventListener('click', calc);
}
