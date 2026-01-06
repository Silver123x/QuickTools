
/*
 * Color Converter & Picker
 * Recreated to support bidirectional editing (RGB/HSL/Hex) and validation.
 */

// --- Conversion Helpers ---

function hexToRgb(hex) {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }
  if (!/^[0-9A-Fa-f]{6}$/.test(hex)) return null;
  const n = parseInt(hex, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => {
    const hex = Math.max(0, Math.min(255, Math.round(x))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToRgb(h, s, l) {
  h /= 360; s /= 100; l /= 100;
  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

// --- UI Renderer ---

export function render(root) {
  root.innerHTML = `
    <style>
      .cc-container { display: flex; flex-direction: column; gap: 24px; max-width: 600px; margin: 0 auto; }
      .cc-swatch-row { display: flex; align-items: center; gap: 16px; }
      .cc-swatch { 
        width: 80px; height: 80px; border-radius: 12px; 
        border: 2px solid var(--border-color); 
        box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
        flex-shrink: 0;
      }
      .cc-picker-label {
        display: flex; align-items: center; gap: 8px; cursor: pointer;
        padding: 8px 16px; background: var(--surface-2); border-radius: 8px;
        font-weight: 500; transition: background 0.2s;
      }
      .cc-picker-label:hover { background: var(--surface-3); }
      .cc-picker-input { visibility: hidden; width: 0; height: 0; position: absolute; }
      
      .cc-section { display: grid; grid-template-columns: 60px 1fr; gap: 12px; align-items: center; }
      .cc-label { font-weight: 600; color: var(--text-secondary); }
      .cc-inputs { display: flex; gap: 8px; }
      .cc-input-group { flex: 1; position: relative; }
      .cc-input { 
        width: 100%; padding: 8px 12px; border-radius: 6px; 
        border: 1px solid var(--border-color); background: var(--surface-1);
        color: var(--text-primary); font-family: monospace; font-size: 14px;
      }
      .cc-input:focus { outline: 2px solid var(--primary); border-color: transparent; }
      .cc-sub-label { 
        position: absolute; right: 8px; top: 50%; transform: translateY(-50%);
        font-size: 10px; color: var(--text-tertiary); pointer-events: none;
      }
      
      .cc-toast {
        position: fixed; bottom: 24px; right: 24px;
        background: var(--surface-3); color: var(--text-primary);
        padding: 8px 16px; border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        opacity: 0; transform: translateY(10px); transition: 0.3s; pointer-events: none;
      }
      .cc-toast.show { opacity: 1; transform: translateY(0); }
    </style>

    <div class="cc-container">
      <div class="cc-swatch-row">
        <div id="swatch" class="cc-swatch"></div>
        <label class="cc-picker-label">
          <input id="picker" type="color" class="cc-picker-input">
          <span>Click to Pick Color</span>
        </label>
      </div>

      <div class="cc-section">
        <div class="cc-label">HEX</div>
        <div class="cc-input-group">
          <input id="hex-input" class="cc-input" type="text" maxlength="7" spellcheck="false">
        </div>
      </div>

      <div class="cc-section">
        <div class="cc-label">RGB</div>
        <div class="cc-inputs">
          <div class="cc-input-group">
            <input id="r-input" class="cc-input" type="number" min="0" max="255">
            <span class="cc-sub-label">R</span>
          </div>
          <div class="cc-input-group">
            <input id="g-input" class="cc-input" type="number" min="0" max="255">
            <span class="cc-sub-label">G</span>
          </div>
          <div class="cc-input-group">
            <input id="b-input" class="cc-input" type="number" min="0" max="255">
            <span class="cc-sub-label">B</span>
          </div>
        </div>
      </div>

      <div class="cc-section">
        <div class="cc-label">HSL</div>
        <div class="cc-inputs">
          <div class="cc-input-group">
            <input id="h-input" class="cc-input" type="number" min="0" max="360">
            <span class="cc-sub-label">H</span>
          </div>
          <div class="cc-input-group">
            <input id="s-input" class="cc-input" type="number" min="0" max="100">
            <span class="cc-sub-label">S</span>
          </div>
          <div class="cc-input-group">
            <input id="l-input" class="cc-input" type="number" min="0" max="100">
            <span class="cc-sub-label">L</span>
          </div>
        </div>
      </div>
    </div>
    <div id="toast" class="cc-toast">Copied!</div>
  `;

  // Elements
  const els = {
    swatch: root.querySelector('#swatch'),
    picker: root.querySelector('#picker'),
    hex: root.querySelector('#hex-input'),
    r: root.querySelector('#r-input'),
    g: root.querySelector('#g-input'),
    b: root.querySelector('#b-input'),
    h: root.querySelector('#h-input'),
    s: root.querySelector('#s-input'),
    l: root.querySelector('#l-input'),
    toast: root.querySelector('#toast')
  };

  // State
  let state = { r: 37, g: 99, b: 235 }; // Default Blue

  // Update UI from State
  function updateUI(skipElement = null) {
    const { r, g, b } = state;
    const hex = rgbToHex(r, g, b);
    const hsl = rgbToHsl(r, g, b);

    // Update visual
    els.swatch.style.backgroundColor = `rgb(${r},${g},${b})`;
    
    // Update inputs if they are not the source of the event
    if (skipElement !== els.picker) els.picker.value = hex;
    if (skipElement !== els.hex) els.hex.value = hex;
    
    if (skipElement !== els.r) els.r.value = r;
    if (skipElement !== els.g) els.g.value = g;
    if (skipElement !== els.b) els.b.value = b;

    if (skipElement !== els.h) els.h.value = hsl.h;
    if (skipElement !== els.s) els.s.value = hsl.s;
    if (skipElement !== els.l) els.l.value = hsl.l;
  }

  // Event Handlers
  
  // Picker
  els.picker.addEventListener('input', (e) => {
    const rgb = hexToRgb(e.target.value);
    if (rgb) {
      state = rgb;
      updateUI(e.target);
    }
  });

  // Hex
  els.hex.addEventListener('input', (e) => {
    let val = e.target.value;
    if (!val.startsWith('#') && /^[0-9A-Fa-f]/.test(val)) {
       // Optional: auto-add # if missing, but let's just handle validation
    }
    const rgb = hexToRgb(val.startsWith('#') ? val : '#' + val);
    if (rgb) {
      state = rgb;
      updateUI(e.target);
    }
  });

  // RGB
  function handleRgbInput(e) {
    const r = parseInt(els.r.value) || 0;
    const g = parseInt(els.g.value) || 0;
    const b = parseInt(els.b.value) || 0;
    state = { 
      r: Math.min(255, Math.max(0, r)), 
      g: Math.min(255, Math.max(0, g)), 
      b: Math.min(255, Math.max(0, b)) 
    };
    // Don't skip the input itself completely, but maybe clamp?
    // For smoother typing, we usually don't update the active input value unless valid/complete.
    // Here we'll just update others.
    updateUI(e.target); 
  }
  [els.r, els.g, els.b].forEach(el => el.addEventListener('input', handleRgbInput));

  // HSL
  function handleHslInput(e) {
    const h = parseInt(els.h.value) || 0;
    const s = parseInt(els.s.value) || 0;
    const l = parseInt(els.l.value) || 0;
    state = hslToRgb(
      Math.min(360, Math.max(0, h)), 
      Math.min(100, Math.max(0, s)), 
      Math.min(100, Math.max(0, l))
    );
    updateUI(e.target);
  }
  [els.h, els.s, els.l].forEach(el => el.addEventListener('input', handleHslInput));

  // Initialize
  updateUI();
}
