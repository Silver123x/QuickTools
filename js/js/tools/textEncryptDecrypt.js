function bufToBase64(b){return btoa(String.fromCharCode(...new Uint8Array(b)));}
function base64ToBuf(s){const bin=atob(s);const len=bin.length;const arr=new Uint8Array(len);for(let i=0;i<len;i++)arr[i]=bin.charCodeAt(i);return arr.buffer;}
async function deriveKey(password,salt){
  const enc=new TextEncoder();
  const keyMaterial=await crypto.subtle.importKey('raw',enc.encode(password),{name:'PBKDF2'},false,['deriveKey']);
  return crypto.subtle.deriveKey({name:'PBKDF2',salt,iterations:100000,hash:'SHA-256'},keyMaterial,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);
}
export function render(root){
  root.innerHTML = ''
    + '<div class="form-row"><label>Text</label><textarea id="text" rows="8"></textarea></div>'
    + '<div class="row"><div class="form-row"><label>Password</label><input id="pwd" type="password"></div></div>'
    + '<div class="row"><button class="btn btn-secondary" id="enc">Encrypt</button><button class="btn btn-secondary" id="dec">Decrypt</button></div>'
    + '<div class="output"><label>Result</label><textarea id="out" rows="8"></textarea></div>';
  const text=root.querySelector('#text'); const pwd=root.querySelector('#pwd'); const out=root.querySelector('#out'); const encBtn=root.querySelector('#enc'); const decBtn=root.querySelector('#dec');
  encBtn.addEventListener('click', async ()=>{
    const t=text.value||''; const p=pwd.value||''; if(!p){ out.value=''; return; }
    const iv=crypto.getRandomValues(new Uint8Array(12)); const salt=crypto.getRandomValues(new Uint8Array(16));
    const key=await deriveKey(p,salt);
    const ct=await crypto.subtle.encrypt({name:'AES-GCM',iv},key,new TextEncoder().encode(t));
    const payload={ iv:bufToBase64(iv.buffer), salt:bufToBase64(salt.buffer), ct:bufToBase64(ct) };
    out.value=JSON.stringify(payload);
  });
  decBtn.addEventListener('click', async ()=>{
    const p=pwd.value||''; if(!p){ out.value=''; return; }
    let obj=null; try{ obj=JSON.parse(out.value||'{}'); }catch(e){ out.value=''; return; }
    const iv=base64ToBuf(obj.iv||''); const salt=base64ToBuf(obj.salt||''); const ct=base64ToBuf(obj.ct||'');
    const key=await deriveKey(p,new Uint8Array(salt).buffer);
    try{
      const pt=await crypto.subtle.decrypt({name:'AES-GCM',iv:new Uint8Array(iv)},key,new Uint8Array(ct));
      out.value=new TextDecoder().decode(pt);
    } catch(e) {
      out.value='';
    }
  });
}
