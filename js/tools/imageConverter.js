function el(html){const d=document.createElement('div');d.innerHTML=html.trim();return d.firstChild;}
function loadImage(file){return new Promise((res,rej)=>{const fr=new FileReader();fr.onload=()=>{const img=new Image();img.onload=()=>res(img);img.onerror=rej;img.src=fr.result;};fr.onerror=rej;fr.readAsDataURL(file);});}
function toData(img,type,quality){const c=document.createElement('canvas');c.width=img.width;c.height=img.height;const ctx=c.getContext('2d');ctx.drawImage(img,0,0);return c.toDataURL(type,quality);}
export function render(root){
  root.innerHTML = ''
    + '<div class="form-row"><input type="file" id="file" accept="image/*"></div>'
    + '<div class="row"><div class="form-row"><label>Format</label><select id="format"><option value="image/png">PNG</option><option value="image/jpeg">JPEG</option><option value="image/webp">WebP</option></select></div>'
    + '<div class="form-row"><label>Quality</label><input id="quality" type="range" min="0.1" max="1" step="0.05" value="0.8"></div></div>'
    + '<div class="output"><div id="preview"></div><div id="actions" style="margin-top:12px;"></div></div>';
  const file=root.querySelector('#file');
  const format=root.querySelector('#format');
  const quality=root.querySelector('#quality');
  const prev=root.querySelector('#preview');
  const act=root.querySelector('#actions');
  async function convert(){
    const f=file.files?.[0]; if(!f) return;
    const img = await loadImage(f);
    const type = format.value;
    const q = Number(quality.value);
    const url = toData(img,type,q);
    prev.innerHTML = '';
    const outImg = el('<img style="max-width:100%;border-radius:12px">'); outImg.src=url; prev.appendChild(outImg);
    const a = el('<a class="btn btn-primary">Download</a>');
    a.href = url;
    const ext = type.split('/')[1];
    a.download = 'converted.'+ext;
    act.innerHTML = '';
    act.appendChild(a);
  }
  file.addEventListener('change', convert);
  format.addEventListener('change', convert);
  quality.addEventListener('input', convert);
}
