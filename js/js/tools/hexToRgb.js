function hexToRgb(hex){hex=hex.replace('#','');if(hex.length===3)hex=hex.split('').map(c=>c+c).join('');const n=parseInt(hex,16);return {r:(n>>16)&255,g:(n>>8)&255,b:n&255};}
function rgbToHsl(r,g,b){r/=255;g/=255;b/=255;const max=Math.max(r,g,b),min=Math.min(r,g,b);let h=0,s=0,l=(max+min)/2;if(max!==min){const d=max-min;s=l>0.5? d/(2-max-min):d/(max+min);switch(max){case r:h=(g-b)/d+(g<b?6:0);break;case g:h=(b-r)/d+2;break;case b:h=(r-g)/d+4;break;}h/=6;}return {h:Math.round(h*360),s:Math.round(s*100),l:Math.round(l*100)};}
export function render(root){
  root.innerHTML = ''
    + '<div class="form-row"><label>HEX</label><input id="hex" type="text" placeholder="#2563eb" value="#2563eb"></div>'
    + '<div class="output"><div id="swatch" style="width:100%;height:56px;border-radius:12px"></div><div id="vals" style="margin-top:12px"></div></div>';
  const hex=root.querySelector('#hex'); const swatch=root.querySelector('#swatch'); const vals=root.querySelector('#vals');
  function update(){
    const v=hex.value||'';
    if(!/^#?[0-9a-fA-F]{3,6}$/.test(v)){ swatch.style.background=''; vals.textContent=''; return; }
    const rgb=hexToRgb(v);
    const hsl=rgbToHsl(rgb.r,rgb.g,rgb.b);
    swatch.style.background=v.startsWith('#')?v:'#'+v;
    vals.innerHTML='RGB '+rgb.r+','+rgb.g+','+rgb.b+' • HSL '+hsl.h+','+hsl.s+'%,'+hsl.l+'%';
  }
  hex.addEventListener('input', update);
  update();
}
