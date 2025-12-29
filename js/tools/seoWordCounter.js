export function render(root){
  root.innerHTML = ''
    + '<div class="form-row"><label>Text</label><textarea id="text" rows="10"></textarea></div>'
    + '<div class="row"><button class="btn btn-secondary" id="run">Analyze</button></div>'
    + '<div class="output"><div id="out"></div></div>';
  const text=root.querySelector('#text'); const out=root.querySelector('#out');
  function analyze(){
    const v=text.value||''; const words=v.trim().split(/\s+/).filter(Boolean);
    const count=words.length; const chars=v.length;
    const sentences=(v.match(/[.!?]+/g)||[]).length;
    const avgLen=count? (chars/count).toFixed(2) : '0.00';
    const readingTime=count? Math.ceil(count/200) : 0; 
    out.innerHTML='Words '+count+' • Characters '+chars+' • Sentences '+sentences+' • Avg word length '+avgLen+' • Reading time ~'+readingTime+' min';
  }
  root.querySelector('#run').addEventListener('click', analyze);
}
