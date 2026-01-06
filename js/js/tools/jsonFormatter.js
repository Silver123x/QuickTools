// Enhanced JSON Formatter with error highlighting and context
export function render(root) {
  root.innerHTML = ''
    + '<div class="form-row"><label>JSON Input</label><textarea id="in" rows="12" placeholder="Paste JSON here..."></textarea></div>'
    + '<div class="row"><div class="form-row"><label>Indent</label><select id="indent"><option value="2">2 Spaces</option><option value="4">4 Spaces</option><option value="tab">Tab</option><option value="0">Minify</option></select></div>'
    + '<div class="form-row"><button class="btn btn-primary" id="format">Format / Validate</button></div></div>'
    + '<div class="output"><div class="row" style="justify-content:space-between;margin-bottom:8px"><label>Output</label><span id="status" class="pill" style="opacity:0"></span></div><textarea id="out" rows="12" readonly></textarea><div style="margin-top:8px"><button class="btn btn-secondary" id="copy">Copy to Clipboard</button></div></div>';
    
  const input = root.querySelector('#in');
  const out = root.querySelector('#out');
  const indent = root.querySelector('#indent');
  const status = root.querySelector('#status');
  const btn = root.querySelector('#format');

  function getErrorContext(json, position) {
    if (position === -1) return '';
    const start = Math.max(0, position - 20);
    const end = Math.min(json.length, position + 20);
    let snippet = json.substring(start, end);
    // Escape for HTML
    snippet = snippet.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    // Highlight the specific character
    const errorCharIndex = position - start;
    const char = snippet[errorCharIndex] || 'EOF';
    const before = snippet.substring(0, errorCharIndex);
    const after = snippet.substring(errorCharIndex + 1);
    return `...${before}<b style="color:red;text-decoration:underline">${char}</b>${after}...`;
  }

  function run() {
    const raw = input.value;
    if (!raw.trim()) return;

    try {
      const obj = JSON.parse(raw);
      let space = Number(indent.value);
      if (isNaN(space) && indent.value === 'tab') space = '\t';
      
      out.value = JSON.stringify(obj, null, space === 0 ? undefined : space);
      status.textContent = 'Valid JSON';
      status.style.opacity = '1';
      status.classList.remove('error');
      status.classList.add('success');
      out.style.borderColor = 'var(--brand)';
    } catch (e) {
      status.innerHTML = 'Invalid JSON';
      status.style.opacity = '1';
      status.classList.remove('success');
      status.classList.add('error');
      out.style.borderColor = '#b91c1c';
      
      // Try to parse position from error message (V8/Chrome format)
      // "Unexpected token x in JSON at position 123"
      const match = e.message.match(/at position (\d+)/);
      if (match) {
        const pos = parseInt(match[1], 10);
        const context = getErrorContext(raw, pos);
        
        // Find line number
        const lines = raw.substring(0, pos).split('\n');
        const line = lines.length;
        const col = lines[lines.length - 1].length + 1;
        
        out.value = `Error: ${e.message}\n\nLocation: Line ${line}, Column ${col}\n\nContext:\n${raw.substring(Math.max(0, pos-30), Math.min(raw.length, pos+30))}\n                               ^\n`;
        
        // Also update status with HTML context if possible
        status.innerHTML = `Error at Line ${line}: ${context}`;
      } else {
        out.value = e.message;
      }
    }
  }

  btn.addEventListener('click', run);
  
  root.querySelector('#copy').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(out.value || '');
      const original = root.querySelector('#copy').textContent;
      root.querySelector('#copy').textContent = 'Copied!';
      setTimeout(() => root.querySelector('#copy').textContent = original, 2000);
    } catch (e) {}
  });
}
