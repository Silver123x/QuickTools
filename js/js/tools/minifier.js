
// State-machine based minifier to safely handle strings and comments
// This is a robust recreation to replace the previous unsafe regex approach.

export function minifyJS(source) {
  let output = '';
  let i = 0;
  const len = source.length;
  let state = 'CODE'; // CODE, STR_SQ, STR_DQ, STR_TPL, REGEX, BLOCK_COMMENT, LINE_COMMENT
  
  // Heuristic to detect if '/' is likely a regex start
  // Based on previous non-whitespace character
  function isRegexStart(lastChar) {
    if (!lastChar) return true; // Start of file
    // If last char was an operator or opener, next / is likely regex
    return /[=(,[{:;!&|?+\-*/%^<>~]/.test(lastChar) || 
           ['return','case','throw','else','new','typeof','void','delete'].includes(lastWord());
  }
  
  // Helper to find the last significant word/char (simplified)
  function lastWord() {
    let j = output.length - 1;
    while (j >= 0 && /\s/.test(output[j])) j--;
    let word = '';
    while (j >= 0 && /[a-zA-Z0-9_$]/.test(output[j])) {
      word = output[j] + word;
      j--;
    }
    return word;
  }

  let lastSignificantChar = '';
  let pendingSpace = false;

  const safeOps = new Set(['{', '}', '(', ')', '[', ']', ';', ',', ':', '=', '?', '!', '<', '>', '&', '|', '^', '%', '*', '/']);

  while (i < len) {
    const char = source[i];
    const next = source[i+1];

    if (state === 'CODE') {
      if (char === "'" || char === '"' || char === '`') {
        if (pendingSpace) {
           const last = output[output.length - 1];
           const lastIsSafeOp = safeOps.has(last);
           if (!lastIsSafeOp) output += ' '; 
           pendingSpace = false; 
        }
        state = char === "'" ? 'STR_SQ' : (char === '"' ? 'STR_DQ' : 'STR_TPL');
        output += char;
        lastSignificantChar = char;
      } else if (char === '/') {
        if (next === '/') {
          state = 'LINE_COMMENT';
          i++;
        } else if (next === '*') {
          state = 'BLOCK_COMMENT';
          i++;
        } else {
          // Division or Regex?
          if (isRegexStart(lastSignificantChar)) {
             if (pendingSpace) { output += ' '; pendingSpace = false; } // Space before regex often good style, but not strictly required unless division
             state = 'REGEX';
             output += char;
             lastSignificantChar = char;
          } else {
             // Division operator
             // Drop pending space if safe
             if (pendingSpace) {
                // If last char was safe op, we don't need space.
                // If this is '/', we don't need space.
                // Division needs check: `return /` vs `num /`
                pendingSpace = false; 
             }
             output += char;
             lastSignificantChar = char;
          }
        }
      } else if (/\s/.test(char)) {
        // Just mark pending space, don't output yet
        if (output.length > 0) {
           pendingSpace = true;
        }
      } else {
        // Regular char
        const isSafeOp = safeOps.has(char);
        
        if (pendingSpace) {
          // Decide if we really need this space
          let needSpace = true;
          const last = output[output.length - 1];
          const lastIsSafeOp = safeOps.has(last);
          
          if (isSafeOp || lastIsSafeOp) {
             needSpace = false;
          }
          // Special case: keywords need space before alphanumeric
          // But our `last` check handles chars.
          // If last was 'n' (return) and char is 'a', we add space.
          
          if (needSpace) output += ' ';
          pendingSpace = false;
        }
        
        output += char;
        lastSignificantChar = char;
      }
    } else if (state === 'STR_SQ') {
      output += char;
      if (char === "'" && source[i-1] !== '\\') {
        state = 'CODE';
        lastSignificantChar = "'";
      }
    } else if (state === 'STR_DQ') {
      output += char;
      if (char === '"' && source[i-1] !== '\\') {
        state = 'CODE';
        lastSignificantChar = '"';
      }
    } else if (state === 'STR_TPL') {
      output += char;
      if (char === '`' && source[i-1] !== '\\') {
        state = 'CODE';
        lastSignificantChar = '`';
      }
    } else if (state === 'REGEX') {
      output += char;
      if (char === '/' && source[i-1] !== '\\') {
        state = 'CODE';
        lastSignificantChar = '/';
      }
    } else if (state === 'LINE_COMMENT') {
      if (char === '\n') {
        state = 'CODE';
        // pendingSpace = true; // Newline acts as space
        // Safer to insert '\n' or space?
        // We'll insert space via pendingSpace
        pendingSpace = true;
      }
    } else if (state === 'BLOCK_COMMENT') {
      if (char === '*' && next === '/') {
        state = 'CODE';
        i++;
        pendingSpace = true;
      }
    }
    i++;
  }
  
  return output.trim();
}

export function minifyCSS(source) {
  let output = '';
  let i = 0;
  const len = source.length;
  let state = 'CODE'; // CODE, STR_SQ, STR_DQ, COMMENT
  let pendingSpace = false;
  const safeOps = new Set(['{', '}', ':', ';', ',', '>', '<', '!', '(', ')']);
  
  while (i < len) {
    const char = source[i];
    const next = source[i+1];

    if (state === 'CODE') {
      if (char === "'") { 
         if (pendingSpace) { output += ' '; pendingSpace = false; }
         state = 'STR_SQ'; output += char; 
      }
      else if (char === '"') { 
         if (pendingSpace) { output += ' '; pendingSpace = false; }
         state = 'STR_DQ'; output += char; 
      }
      else if (char === '/' && next === '*') { state = 'COMMENT'; i++; }
      else if (/\s/.test(char)) {
        if (output.length > 0) pendingSpace = true;
      } else {
        if (pendingSpace) {
            const last = output[output.length - 1];
            const isSafeOp = safeOps.has(char);
            const lastIsSafeOp = safeOps.has(last);
            if (!isSafeOp && !lastIsSafeOp) output += ' ';
            pendingSpace = false;
        }
        output += char;
      }
    } else if (state === 'STR_SQ') {
      output += char;
      if (char === "'" && source[i-1] !== '\\') state = 'CODE';
    } else if (state === 'STR_DQ') {
      output += char;
      if (char === '"' && source[i-1] !== '\\') state = 'CODE';
    } else if (state === 'COMMENT') {
      if (char === '*' && next === '/') { 
         state = 'CODE'; 
         i++; 
         pendingSpace = true; // treat comment as space
      }
    }
    i++;
  }
  return output.trim();
}

export function minifyHTML(source) {
  // Simple HTML minifier: remove comments, collapse whitespace
  // Respects <pre>, <script>, <style> tags would require a complex parser.
  // We will do a safe whitespace collapse.
  
  // 1. Remove comments
  let s = source.replace(/<!--[\s\S]*?-->/g, '');
  
  // 2. Collapse whitespace between tags
  s = s.replace(/>\s+</g, '><');
  
  // 3. Collapse whitespace in text nodes (naive)
  s = s.replace(/\s{2,}/g, ' ');
  
  return s.trim();
}

export function render(root){
  root.innerHTML = ''
    + '<div class="category-header"><p><strong>Note:</strong> This is a client-side safe minifier. For production builds, use tools like Terser or cssnano.</p></div>'
    + '<div class="form-row"><label>Type</label><select id="type"><option value="js">JavaScript</option><option value="css">CSS</option><option value="html">HTML</option></select></div>'
    + '<div class="form-row"><label>Input Code</label><textarea id="in" rows="12" placeholder="Paste your code here..."></textarea></div>'
    + '<div class="row"><button class="btn btn-primary" id="run">Minify Code</button></div>'
    + '<div class="output"><div class="row" style="margin-bottom:8px;justify-content:space-between"><label>Output</label><span id="stats" class="pill" style="opacity:0"></span></div><textarea id="out" rows="12" readonly></textarea></div>';
    
  const type = root.querySelector('#type');
  const input = root.querySelector('#in');
  const out = root.querySelector('#out');
  const stats = root.querySelector('#stats');
  
  function run(){
    const v = input.value || '';
    if (!v.trim()) return;
    
    let r = v;
    const t0 = performance.now();
    
    try {
      if (type.value === 'js') r = minifyJS(v);
      else if (type.value === 'css') r = minifyCSS(v);
      else r = minifyHTML(v);
      
      const t1 = performance.now();
      const saved = (1 - (r.length / v.length)) * 100;
      
      out.value = r;
      stats.style.opacity = '1';
      stats.textContent = `Saved ${saved.toFixed(1)}% • ${(t1-t0).toFixed(1)}ms`;
      stats.classList.remove('error');
    } catch (e) {
      out.value = 'Error during minification: ' + e.message;
      stats.style.opacity = '1';
      stats.textContent = 'Error';
      stats.classList.add('error');
    }
  }
  
  root.querySelector('#run').addEventListener('click', run);
}
