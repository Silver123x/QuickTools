function parseHex(h){h=h.replace('#','');if(h.length===3)h=h.split('').map(c=>c+c).join('');const n=parseInt(h,16);return [(n>>16)&255,(n>>8)&255,n&255];}
function rel(c){c=c/255;return c<=0.03928? c/12.92 : Math.pow((c+0.055)/1.055,2.4);}
function ratio(h1,h2){const [r1,g1,b1]=parseHex(h1),[r2,g2,b2]=parseHex(h2);const L1=0.2126*rel(r1)+0.7152*rel(g1)+0.0722*rel(b1);const L2=0.2126*rel(r2)+0.7152*rel(g2)+0.0722*rel(b2);const a=Math.max(L1,L2)+0.05;const b=Math.min(L1,L2)+0.05;return (a/b);}
export function render(root){
  root.innerHTML = ''
    + '<div class="row"><div class="form-row"><label>Foreground</label><input id="fg" type="color" value="#0b1b2b"></div>'
    + '<div class="form-row"><label>Background</label><input id="bg" type="color" value="#ffffff"></div></div>'
    + '<div class="output"><div id="prev" style="width:100%;height:100px;border-radius:12px;display:flex;align-items:center;justify-content:center">Sample Text</div><div id="res" style="margin-top:12px"></div></div>';
  const fg=root.querySelector('#fg'); const bg=root.querySelector('#bg'); const prev=root.querySelector('#prev'); const res=root.querySelector('#res');
  function update(){
    prev.style.color=fg.value; prev.style.background=bg.value;
    const r=ratio(fg.value,bg.value); const rr=r.toFixed(2);
    const passAA=r>=4.5; const passAAA=r>=7;
    res.innerHTML='Contrast '+rr+':1 • '+(passAA?'AA pass':'AA fail')+' • '+(passAAA?'AAA pass':'AAA fail');
  }
  fg.addEventListener('input', update);
  bg.addEventListener('input', update);
  update();
}
