function el(html){const d=document.createElement('div');d.innerHTML=html.trim();return d.firstChild;}
function loadImage(file){return new Promise((res,rej)=>{const fr=new FileReader();fr.onload=()=>{const img=new Image();img.onload=()=>res(img);img.onerror=rej;img.src=fr.result;};fr.onerror=rej;fr.readAsDataURL(file);});}
const matrices = {
  normal: [1,0,0, 0,1,0, 0,0,1],
  protanopia: [0.56667,0.43333,0, 0.55833,0.44167,0, 0,0.24167,0.75833],
  deuteranopia: [0.625,0.375,0, 0.7,0.3,0, 0,0.3,0.7],
  tritanopia: [0.95,0.05,0, 0,0.43333,0.56667, 0,0.475,0.525]
};
function applyMatrix(img,key){
  const c=document.createElement('canvas'); c.width=img.width; c.height=img.height; const ctx=c.getContext('2d'); ctx.drawImage(img,0,0); const data=ctx.getImageData(0,0,c.width,c.height);
  const m=matrices[key]||matrices.normal;
  for(let i=0;i<data.data.length;i+=4){
    const r=data.data[i], g=data.data[i+1], b=data.data[i+2];
    const nr = r*m[0] + g*m[1] + b*m[2];
    const ng = r*m[3] + g*m[4] + b*m[5];
    const nb = r*m[6] + g*m[7] + b*m[8];
    data.data[i]=Math.min(255,Math.max(0,Math.round(nr)));
    data.data[i+1]=Math.min(255,Math.max(0,Math.round(ng)));
    data.data[i+2]=Math.min(255,Math.max(0,Math.round(nb)));
  }
  ctx.putImageData(data,0,0);
  return c.toDataURL();
}
export function render(root){
  root.innerHTML = ''
    + '<div class="form-row"><input type="file" id="file" accept="image/*"></div>'
    + '<div class="row"><div class="form-row"><label>Type</label><select id="type"><option value="normal">Normal</option><option value="protanopia">Protanopia</option><option value="deuteranopia">Deuteranopia</option><option value="tritanopia">Tritanopia</option></select></div></div>'
    + '<div class="output"><div id="preview"></div></div>';
  const file=root.querySelector('#file'); const type=root.querySelector('#type'); const prev=root.querySelector('#preview'); let img=null;
  async function onFile(){ const f=file.files?.[0]; if(!f) return; img=await loadImage(f); draw(); }
  function draw(){ if(!img) return; const url=applyMatrix(img,type.value); prev.innerHTML=''; const elImg=el('<img style="max-width:100%;border-radius:12px">'); elImg.src=url; prev.appendChild(elImg); }
  file.addEventListener('change', onFile);
  type.addEventListener('change', draw);
}
