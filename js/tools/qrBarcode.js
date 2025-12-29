export function render(root){
  root.innerHTML = ''
    + '<div class="row"><div class="form-row"><label>Camera Scanner (experimental)</label><button class="btn btn-secondary" id="scan">Start Scan</button></div></div>'
    + '<div class="output"><video id="video" playsinline style="width:100%;max-width:600px;border-radius:12px"></video><div id="out" class="pill" style="margin-top:8px"></div></div>';
  const video=root.querySelector('#video'); const out=root.querySelector('#out');
  async function startScan(){
    if(!('BarcodeDetector' in window)){ out.textContent='BarcodeDetector not supported'; return; }
    try{
      const stream=await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      video.srcObject=stream; await video.play();
      const det=new window.BarcodeDetector({ formats: ['qr_code','code_128','code_39','ean_13'] });
      async function tick(){
        if(video.readyState>=2){
          try{
            const res=await det.detect(video);
            if(res&&res.length){ out.textContent=res[0].rawValue; }
          }catch(e){}
        }
        requestAnimationFrame(tick);
      }
      tick();
    }catch(e){ out.textContent='Camera unavailable'; }
  }
  root.querySelector('#scan').addEventListener('click', startScan);
}
