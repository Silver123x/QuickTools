function el(html){const d=document.createElement('div');d.innerHTML=html.trim();return d.firstChild;}
function loadImage(file){return new Promise((res,rej)=>{const fr=new FileReader();fr.onload=()=>{const img=new Image();img.onload=()=>res(img);img.onerror=rej;img.src=fr.result;};fr.onerror=rej;fr.readAsDataURL(file);});}
function toHex(r,g,b){return '#'+[r,g,b].map(x=>x.toString(16).padStart(2,'0')).join('');}
export function render(root){
  root.innerHTML = ''
    + '<div class="form-row"><input type="file" id="file" accept="image/*"></div>'
    + '<div class="output"><div id="preview" style="margin-bottom:12px"></div><div id="palette" style="display:flex;gap:12px;flex-wrap:wrap"></div></div>';
  const file=root.querySelector('#file'); const prev=root.querySelector('#preview'); const pal=root.querySelector('#palette');
  async function run(){
    const f=file.files?.[0]; if(!f) return; const img=await loadImage(f);
    const c=document.createElement('canvas'); c.width=img.width; c.height=img.height; const ctx=c.getContext('2d'); ctx.drawImage(img,0,0);
    prev.innerHTML=''; const im=el('<img style="max-width:100%;border-radius:12px">'); im.src=c.toDataURL(); prev.appendChild(im);
    const map=new Map(); const data=ctx.getImageData(0,0,c.width,c.height).data;
    for(let i=0;i<data.length;i+=4*200){ const r=data[i],g=data[i+1],b=data[i+2]; const kr=(r>>5)<<5,kg=(g>>5)<<5,kb=(b>>5)<<5; const key=kr+','+kg+','+kb; map.set(key,(map.get(key)||0)+1); }
    const top=[...map.entries()].sort((a,b)=>b[1]-a[1]).slice(0,5).map(([k])=>k.split(',').map(Number));
    pal.innerHTML='';
    top.forEach(([r,g,b])=>{ const hex=toHex(r,g,b); const sw=el('<div style="width:100px;height:60px;border-radius:10px;border:1px solid #e5e7eb"></div>'); sw.style.background=hex; const cap=el('<div style="font-size:12px;margin-top:6px;text-align:center"></div>'); cap.textContent=hex; const wrap=el('<div></div>'); wrap.appendChild(sw); wrap.appendChild(cap); pal.appendChild(wrap); });
  }
  file.addEventListener('change', run);
}
