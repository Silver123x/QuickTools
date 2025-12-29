function el(html){const d=document.createElement('div');d.innerHTML=html.trim();return d.firstChild;}
function loadImage(file){return new Promise((res,rej)=>{const fr=new FileReader();fr.onload=()=>{const img=new Image();img.onload=()=>res(img);img.onerror=rej;img.src=fr.result;};fr.onerror=rej;fr.readAsDataURL(file);});}
function transform(img,deg,flipH,flipV){
  const rad = deg*Math.PI/180;
  const sin = Math.abs(Math.sin(rad)), cos = Math.abs(Math.cos(rad));
  const W = Math.round(img.width*cos + img.height*sin);
  const H = Math.round(img.width*sin + img.height*cos);
  const c=document.createElement('canvas'); c.width=W; c.height=H;
  const ctx=c.getContext('2d');
  ctx.translate(W/2,H/2);
  ctx.scale(flipH?-1:1, flipV?-1:1);
  ctx.rotate(rad);
  ctx.drawImage(img,-img.width/2,-img.height/2);
  return c.toDataURL('image/png');
}
export function render(root){
  root.innerHTML = ''
    + '<div class="form-row"><input type="file" id="file" accept="image/*"></div>'
    + '<div class="row"><div class="form-row"><label>Rotation</label><select id="deg"><option>0</option><option>90</option><option>180</option><option>270</option></select></div>'
    + '<div class="form-row"><label><input id="fh" type="checkbox"> Flip Horizontal</label></div>'
    + '<div class="form-row"><label><input id="fv" type="checkbox"> Flip Vertical</label></div></div>'
    + '<div class="output"><div id="preview"></div><div id="actions" style="margin-top:12px;"></div></div>';
  const file=root.querySelector('#file'); const deg=root.querySelector('#deg'); const fh=root.querySelector('#fh'); const fv=root.querySelector('#fv'); const prev=root.querySelector('#preview'); const act=root.querySelector('#actions');
  let base=null;
  async function onFile(){ const f=file.files?.[0]; if(!f) return; base=await loadImage(f); draw(); }
  function draw(){
    if(!base) return;
    const url = transform(base, Number(deg.value), fh.checked, fv.checked);
    prev.innerHTML=''; const out=el('<img style="max-width:100%;border-radius:12px">'); out.src=url; prev.appendChild(out);
    act.innerHTML=''; const a=el('<a class="btn btn-primary">Download</a>'); a.href=url; a.download='transformed.png'; act.appendChild(a);
  }
  file.addEventListener('change', onFile);
  deg.addEventListener('change', draw);
  fh.addEventListener('change', draw);
  fv.addEventListener('change', draw);
}
