function patternFor(ch){
  const map={
    '0':'101001101101', '1':'110100101011', '2':'101100101011', '3':'110110010101',
    '4':'101001101011', '5':'110100110101', '6':'101100110101', '7':'101001011011',
    '8':'110100101101', '9':'101100101101', 'A':'110101001011','B':'101101001011','C':'110110100101',
    'D':'101011001011','E':'110101100101','F':'101101100101','G':'101010011011','H':'110101001101',
    'I':'101101001101','J':'101011001101','K':'110101010011','L':'101101010011','M':'110110101001',
    'N':'101011010011','O':'110101101001','P':'101101101001','Q':'101010110011','R':'110101011001',
    'S':'101101011001','T':'101011011001','U':'110010101011','V':'100110101011','W':'110011010101',
    'X':'100101101011','Y':'110010110101','Z':'100110110101','-':'100101011011','.' :'110010101101',
    ' ':'100110101101','*':'100101101101','$':'100100100101','/':'100100101001','+':'100101001001','%':'101001001001'
  };
  return map[ch]||null;
}
export function render(root){
  root.innerHTML = ''
    + '<div class="form-row"><label>Code39 Text (A-Z, 0-9, - . $ / + % space)</label><input id="txt" type="text" value="TOOLS-WONDER"></div>'
    + '<div class="row"><div class="form-row"><label>Width</label><input id="w" type="number" value="2"></div>'
    + '<div class="form-row"><label>Height</label><input id="h" type="number" value="80"></div></div>'
    + '<div class="output"><canvas id="cv" style="width:100%;max-width:600px;border:1px solid #e5e7eb;border-radius:8px;background:#fff"></canvas></div>';
  const txt=root.querySelector('#txt'); const w=root.querySelector('#w'); const h=root.querySelector('#h'); const cv=root.querySelector('#cv');
  function draw(){
    const text=('*'+(txt.value||'').toUpperCase().replace(/[^A-Z0-9\-\.\$\/\+\% ]/g,'')+'*');
    const unit=Number(w.value)||2; const height=Number(h.value)||80;
    const patterns=[];
    for(const ch of text){ const p=patternFor(ch); if(!p){ continue; } patterns.push(p+'0'); } // narrow space after each char
    const seq=patterns.join('');
    const width=seq.length*unit;
    cv.width=width; cv.height=height;
    const ctx=cv.getContext('2d'); ctx.fillStyle='#000'; ctx.clearRect(0,0,width,height);
    let x=0;
    for(const bit of seq){ if(bit==='1'){ ctx.fillRect(x,0,unit,height); } x+=unit; }
  }
  txt.addEventListener('input', draw);
  w.addEventListener('input', draw);
  h.addEventListener('input', draw);
  draw();
}
