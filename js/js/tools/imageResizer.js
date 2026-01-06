function el(html){const d=document.createElement('div');d.innerHTML=html.trim();return d.firstChild;}
function loadImage(file){return new Promise((res,rej)=>{const fr=new FileReader();fr.onload=()=>{const img=new Image();img.onload=()=>res(img);img.onerror=rej;img.src=fr.result;};fr.onerror=rej;fr.readAsDataURL(file);});}
function resize(img,w,h){const c=document.createElement('canvas');c.width=w;c.height=h;const ctx=c.getContext('2d');ctx.imageSmoothingQuality='high';ctx.drawImage(img,0,0,w,h);return c.toDataURL('image/png');}
export function render(root){
  root.innerHTML = ''
    + '<div class="form-row"><input type="file" id="file" accept="image/*"></div>'
    + '<div class="row"><div class="form-row"><label>Width</label><input id="w" type="number" min="1"></div><div class="form-row"><label>Height</label><input id="h" type="number" min="1"></div></div>'
    + '<div class="row"><div class="form-row"><label><input id="lock" type="checkbox" checked> Keep aspect ratio</label></div><div class="form-row"><label>Scale (%)</label><input id="scale" type="number" min="1" value="100"></div></div>'
    + '<div class="output"><div id="info" class="pill"></div><div id="preview" style="margin-top:12px;"></div><div id="actions" style="margin-top:12px;"></div></div>';
  const file=root.querySelector('#file'); const w=root.querySelector('#w'); const h=root.querySelector('#h'); const lock=root.querySelector('#lock'); const scale=root.querySelector('#scale'); const info=root.querySelector('#info'); const prev=root.querySelector('#preview'); const act=root.querySelector('#actions');
  let base=null;
  async function onFile(){
    const f=file.files?.[0]; if(!f) return;
    base = await loadImage(f);
    w.value = base.width; h.value = base.height; info.textContent = 'Original '+base.width+'×'+base.height;
    draw();
  }
  function draw(){
    if(!base) return;
    let W = Number(w.value)||base.width; let H = Number(h.value)||base.height;
    const sc = Number(scale.value)||100;
    if(sc!==100){ W = Math.round(base.width*sc/100); H = Math.round(base.height*sc/100); w.value=W; h.value=H; }
    if(lock.checked){ const ratio = base.width/base.height; if(document.activeElement===w){ H = Math.round(W/ratio); h.value=H; } else if(document.activeElement===h){ W = Math.round(H*ratio); w.value=W; } }
    const url = resize(base,W,H);
    prev.innerHTML=''; const out=el('<img style="max-width:100%;border-radius:12px" loading="lazy">'); out.src=url; prev.appendChild(out);
    info.textContent = 'Output '+W+'×'+H;
    act.innerHTML=''; const a=el('<a class="btn btn-primary">Download</a>'); a.href=url; a.download='resized.png'; act.appendChild(a);
  }
  file.addEventListener('change', onFile);
  w.addEventListener('input', draw);
  h.addEventListener('input', draw);
  lock.addEventListener('change', draw);
  scale.addEventListener('input', draw);
}
