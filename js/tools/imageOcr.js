function el(html){const d=document.createElement('div');d.innerHTML=html.trim();return d.firstChild;}
function loadImage(file){return new Promise((res,rej)=>{const fr=new FileReader();fr.onload=()=>{const img=new Image();img.onload=()=>res({img,src:fr.result});img.onerror=rej;img.src=fr.result;};fr.onerror=rej;fr.readAsDataURL(file);});}
export function render(root){
  root.innerHTML = ''
    + '<div class="form-row"><input type="file" id="file" accept="image/*"></div>'
    + '<div class="output"><div id="status" class="pill"></div><div id="preview" style="margin-top:12px;"></div><textarea id="text" rows="8" style="margin-top:12px;width:100%;"></textarea></div>';
  const file=root.querySelector('#file'); const status=root.querySelector('#status'); const prev=root.querySelector('#preview'); const out=root.querySelector('#text');
  async function run(){
    const f=file.files?.[0]; if(!f) return;
    const {img,src} = await loadImage(f);
    prev.innerHTML=''; const i=el('<img style="max-width:100%;border-radius:12px">'); i.src=src; prev.appendChild(i);
    const ok = 'TextDetector' in window;
    if(!ok){ status.textContent='Unavailable: requires experimental TextDetector API.'; out.value=''; return; }
    try {
      const det = new window.TextDetector();
      const res = await det.detect(img);
      out.value = res.map(r=>r.rawValue||'').join('\n');
      status.textContent='Detected '+res.length+' items';
    } catch(e) {
      status.textContent='Detection failed in this browser';
      out.value='';
    }
  }
  file.addEventListener('change', run);
}
