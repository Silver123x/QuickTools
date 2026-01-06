function el(html){const d=document.createElement('div');d.innerHTML=html.trim();return d.firstChild;}
function renderToWord(root){
  root.innerHTML=''
    + '<div class="form-row"><input type="file" id="file" accept="application/pdf"></div>'
    + '<div class="output"><div id="status" class="pill"></div><iframe id="frame" style="width:100%;height:360px;border:1px solid #e5e7eb;border-radius:8px;background:#fff"></iframe></div>';
  const file=root.querySelector('#file'); const status=root.querySelector('#status'); const frame=root.querySelector('#frame');
  file.addEventListener('change', async ()=>{
    const f=file.files?.[0]; if(!f) return;
    const url=URL.createObjectURL(f);
    frame.src=url;
    status.textContent='Open the preview and copy text manually (no external libs).';
  });
}
function renderWordToPdf(root){
  root.innerHTML=''
    + '<div class="form-row"><label>Content</label><textarea id="text" rows="10" placeholder="Type or paste content"></textarea></div>'
    + '<div class="row"><button class="btn btn-secondary" id="print">Print to PDF</button></div>'
    + '<div class="output"><div class="pill">Use browser “Save as PDF” in print dialog</div></div>';
  const text=root.querySelector('#text');
  root.querySelector('#print').addEventListener('click', ()=>{
    const w=window.open('','_blank','noopener,noreferrer');
    if(!w) return;
    w.document.write('<!doctype html><html><head><meta charset="utf-8"><title>Document</title><style>body{font-family:Inter,Arial,sans-serif;padding:32px;line-height:1.6}</style></head><body>'+text.value.replace(/\n/g,'<br>')+'</body></html>');
    w.document.close();
    w.focus();
    w.print();
  });
}
function renderUnavailable(root,msg){
  root.innerHTML = '<div class="output"><div class="pill">'+msg+'</div></div>';
}
export function render(root, ctx){
  const id=ctx?.id||'';
  if(id==='pdf-to-word') return renderToWord(root);
  if(id==='word-to-pdf') return renderWordToPdf(root);
  if(id==='pdf-esign') return renderUnavailable(root,'Add signatures in HTML then “Print to PDF”.');
  if(id==='pdf-compressor') return renderUnavailable(root,'Client-side PDF compression requires external libraries.');
  if(id==='pdf-merge-split') return renderUnavailable(root,'Merging/splitting PDFs requires external libraries.');
  if(id==='pdf-lock-unlock') return renderUnavailable(root,'Encrypting/decrypting PDFs requires external libraries.');
  renderUnavailable(root,'Unsupported operation.');
}
