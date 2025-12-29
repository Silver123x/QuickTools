function el(html){const d=document.createElement('div');d.innerHTML=html.trim();return d.firstChild;}
function loadImage(file){return new Promise((res,rej)=>{const fr=new FileReader();fr.onload=()=>{const img=new Image();img.onload=()=>res(img);img.onerror=rej;img.src=fr.result;};fr.onerror=rej;fr.readAsDataURL(file);});}
function crop(img,x,y,w,h){const c=document.createElement('canvas');c.width=w;c.height=h;const ctx=c.getContext('2d');ctx.imageSmoothingQuality='high';ctx.drawImage(img,x,y,w,h,0,0,w,h);return c.toDataURL('image/png');}
export function render(root){
  root.innerHTML = ''
    + '<div class="form-row"><input type="file" id="file" accept="image/*"></div>'
    + '<div class="row"><div class="form-row"><label>X</label><input id="x" type="number" min="0" value="0"></div><div class="form-row"><label>Y</label><input id="y" type="number" min="0" value="0"></div></div>'
    + '<div class="row"><div class="form-row"><label>Width</label><input id="w" type="number" min="1" value="100"></div><div class="form-row"><label>Height</label><input id="h" type="number" min="1" value="100"></div></div>'
    + '<div class="output"><div id="info" class="pill"></div><div id="preview" style="margin-top:12px;"></div><div id="actions" style="margin-top:12px;"></div></div>';
  const file=root.querySelector('#file'); const x=root.querySelector('#x'); const y=root.querySelector('#y'); const w=root.querySelector('#w'); const h=root.querySelector('#h'); const info=root.querySelector('#info'); const prev=root.querySelector('#preview'); const act=root.querySelector('#actions');
  let base=null;
  async function onFile(){ const f=file.files?.[0]; if(!f) return; base=await loadImage(f); info.textContent='Image '+base.width+'×'+base.height; draw(); }
  function draw(){
    if(!base) return;
    let X=Number(x.value)||0; let Y=Number(y.value)||0; let W=Number(w.value)||100; let H=Number(h.value)||100;
    X=Math.max(0,Math.min(base.width-1,X)); Y=Math.max(0,Math.min(base.height-1,Y));
    W=Math.max(1,Math.min(base.width-X,W)); H=Math.max(1,Math.min(base.height-Y,H));
    const url=crop(base,X,Y,W,H);
    prev.innerHTML=''; const out=el('<img style="max-width:100%;border-radius:12px">'); out.src=url; prev.appendChild(out);
    info.textContent='Crop '+W+'×'+H+' at '+X+','+Y;
    act.innerHTML=''; const a=el('<a class="btn btn-primary">Download</a>'); a.href=url; a.download='cropped.png'; act.appendChild(a);
  }
  file.addEventListener('change', onFile);
  x.addEventListener('input', draw);
  y.addEventListener('input', draw);
  w.addEventListener('input', draw);
  h.addEventListener('input', draw);
}
