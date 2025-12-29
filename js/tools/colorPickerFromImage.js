function el(html){const d=document.createElement('div');d.innerHTML=html.trim();return d.firstChild;}
function loadImage(file){return new Promise((res,rej)=>{const fr=new FileReader();fr.onload=()=>{const img=new Image();img.onload=()=>res(img);img.onerror=rej;img.src=fr.result;};fr.onerror=rej;fr.readAsDataURL(file);});}
function rgbToHex(r,g,b){return '#'+[r,g,b].map(x=>x.toString(16).padStart(2,'0')).join('');}
export function render(root){
  root.innerHTML = ''
    + '<div class="form-row"><input type="file" id="file" accept="image/*"></div>'
    + '<div class="output"><canvas id="canvas" style="max-width:100%;border-radius:12px"></canvas><div id="vals" style="margin-top:12px"></div></div>';
  const file=root.querySelector('#file'); const canvas=root.querySelector('#canvas'); const vals=root.querySelector('#vals'); let img=null;
  async function onFile(){ const f=file.files?.[0]; if(!f) return; img=await loadImage(f); canvas.width=img.width; canvas.height=img.height; const ctx=canvas.getContext('2d'); ctx.drawImage(img,0,0); }
  function onPick(ev){ const rect=canvas.getBoundingClientRect(); const x=Math.floor((ev.clientX-rect.left)*canvas.width/rect.width); const y=Math.floor((ev.clientY-rect.top)*canvas.height/rect.height); const ctx=canvas.getContext('2d'); const d=ctx.getImageData(x,y,1,1).data; const hex=rgbToHex(d[0],d[1],d[2]); vals.innerHTML='HEX '+hex+' • RGB '+d[0]+','+d[1]+','+d[2]; }
  file.addEventListener('change', onFile);
  canvas.addEventListener('click', onPick);
}
