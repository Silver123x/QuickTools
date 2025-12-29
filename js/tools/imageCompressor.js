function el(html){const d=document.createElement('div');d.innerHTML=html.trim();return d.firstChild;}
function loadImage(file){return new Promise((res,rej)=>{const fr=new FileReader();fr.onload=()=>{const img=new Image();img.onload=()=>res({img,src:fr.result});img.onerror=rej;img.src=fr.result;};fr.onerror=rej;fr.readAsDataURL(file);});}
function toData(img,type,quality){const c=document.createElement('canvas');c.width=img.width;c.height=img.height;const ctx=c.getContext('2d');ctx.drawImage(img,0,0);return c.toDataURL(type,quality);}
function fmtBytes(n){return (n/1024).toFixed(1)+' KB';}
export function render(root){
  root.innerHTML = ''
    + '<div class="form-row"><input type="file" id="file" accept="image/*"></div>'
    + '<div class="row"><div class="form-row"><label>Quality</label><input id="quality" type="range" min="0.1" max="1" step="0.05" value="0.7"></div>'
    + '<div class="form-row"><label>Output Format</label><select id="format"><option value="same">Same as input</option><option value="image/jpeg">JPEG</option><option value="image/webp">WebP</option></select></div></div>'
    + '<div class="output"><div id="stats" class="pill"></div><div id="preview" style="margin-top:12px;"></div><div id="actions" style="margin-top:12px;"></div></div>';
  const file=root.querySelector('#file');
  const quality=root.querySelector('#quality');
  const format=root.querySelector('#format');
  const stats=root.querySelector('#stats');
  const prev=root.querySelector('#preview');
  const act=root.querySelector('#actions');
  async function compress(){
    const f=file.files?.[0]; if(!f) return;
    const {img,src} = await loadImage(f);
    const inputBytes = atob(src.split(',')[1]).length;
    let type = format.value==='same' ? (src.substring(5, src.indexOf(';'))) : format.value;
    const url = toData(img,type,Number(quality.value));
    const outputBytes = atob(url.split(',')[1]).length;
    stats.textContent = 'Input '+fmtBytes(inputBytes)+' • Output '+fmtBytes(outputBytes)+' • '+Math.round((1-outputBytes/inputBytes)*100)+'%';
    prev.innerHTML=''; const outImg=el('<img style="max-width:100%;border-radius:12px">'); outImg.src=url; prev.appendChild(outImg);
    const a=el('<a class="btn btn-primary">Download</a>'); a.href=url; const ext=(type.split('/')[1]); a.download='compressed.'+ext; act.innerHTML=''; act.appendChild(a);
  }
  file.addEventListener('change', compress);
  quality.addEventListener('input', compress);
  format.addEventListener('change', compress);
}
