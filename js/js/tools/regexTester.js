// Recreated Regex Tester with Web Worker isolation
export function render(root) {
  root.innerHTML = ''
    + '<div class="form-row"><label>Pattern</label><input id="pat" type="text" placeholder="e.g. \\b\\w+\\b" value="\\b\\w+\\b"></div>'
    + '<div class="row"><div class="form-row"><label>Flags</label><input id="flags" type="text" placeholder="g, i, m" value="g"></div></div>'
    + '<div class="form-row"><label>Text</label><textarea id="text" rows="8" placeholder="Enter text to test against..."></textarea></div>'
    + '<div class="row"><button class="btn btn-primary" id="run">Test Regex</button></div>'
    + '<div class="output"><div id="status" class="pill" style="opacity:0;margin-bottom:8px"></div><div id="out" style="max-height:300px;overflow:auto"></div></div>';

  const pat = root.querySelector('#pat');
  const flags = root.querySelector('#flags');
  const text = root.querySelector('#text');
  const out = root.querySelector('#out');
  const status = root.querySelector('#status');
  const runBtn = root.querySelector('#run');

  // Worker Code
  const workerCode = `
    self.onmessage = function(e) {
      const { pattern, flags, text } = e.data;
      try {
        // Validate flags
        if (/[^gimsuy]/.test(flags)) throw new Error('Invalid flags. Allowed: g, i, m, s, u, y');
        
        const re = new RegExp(pattern, flags);
        const start = performance.now();
        const matches = [];
        const isGlobal = flags.includes('g');
        
        if (isGlobal) {
          let match;
          // Prevent infinite loops with zero-width assertions (exec doesn't advance index automatically if match is empty string)
          let lastIndex = 0;
          
          while ((match = re.exec(text)) !== null) {
            if (performance.now() - start > 2000) throw new Error('Timeout: Execution took > 2s');
            if (matches.length > 5000) throw new Error('Limit reached: > 5000 matches');
            
            matches.push(match[0]);
            
            if (re.lastIndex === lastIndex) {
               re.lastIndex++; // Advance if zero-width match
            }
            lastIndex = re.lastIndex;
          }
        } else {
          const match = re.exec(text);
          if (match) matches.push(match[0]);
        }
        
        self.postMessage({ success: true, matches, time: performance.now() - start });
      } catch (err) {
        self.postMessage({ success: false, error: err.message });
      }
    };
  `;

  const blob = new Blob([workerCode], { type: 'application/javascript' });
  const workerUrl = URL.createObjectURL(blob);
  let worker = null;

  function run() {
    // Reset UI
    out.innerHTML = '';
    status.style.opacity = '1';
    status.textContent = 'Running...';
    status.className = 'pill';
    runBtn.disabled = true;

    // Terminate previous worker if running
    if (worker) worker.terminate();
    
    // Create new worker
    worker = new Worker(workerUrl);

    // Timeout safety for the worker itself (if it hangs completely)
    const safetyTimeout = setTimeout(() => {
        if(worker) worker.terminate();
        status.textContent = 'Error: Worker timed out';
        status.classList.add('error');
        runBtn.disabled = false;
    }, 3000);

    worker.onmessage = function(e) {
      clearTimeout(safetyTimeout);
      runBtn.disabled = false;
      const { success, matches, error, time } = e.data;

      if (success) {
        status.textContent = `Found ${matches.length} matches in ${time.toFixed(1)}ms`;
        status.classList.add('success');
        
        if (matches.length === 0) {
            out.innerHTML = '<span style="color:var(--muted)">No matches found.</span>';
        } else {
            // Escape HTML
            const html = matches.map(m => {
                const safe = m.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
                return `<span class="pill">${safe}</span>`;
            }).join(' ');
            out.innerHTML = html;
        }
      } else {
        status.textContent = 'Error: ' + error;
        status.classList.add('error');
      }
    };

    worker.onerror = function(e) {
        clearTimeout(safetyTimeout);
        runBtn.disabled = false;
        status.textContent = 'Worker Error';
        status.classList.add('error');
    };

    worker.postMessage({
      pattern: pat.value,
      flags: flags.value,
      text: text.value || ''
    });
  }

  runBtn.addEventListener('click', run);
}
