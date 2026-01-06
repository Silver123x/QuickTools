export type RGB = { r: number; g: number; b: number };
export type HSL = { h: number; s: number; l: number };
export function hexToRgb(hex: string): RGB {
  let h = hex.replace('#','').trim();
  if(!/^[0-9a-fA-F]{3,6}$/.test(h)) throw new Error('Invalid hex');
  if(h.length===3) h = h.split('').map(c=>c+c).join('');
  const n = parseInt(h,16);
  return { r:(n>>16)&255, g:(n>>8)&255, b:n&255 };
}
export function rgbToHex({r,g,b}: RGB): string {
  [r,g,b].forEach(v=>{ if(v<0||v>255||!Number.isFinite(v)) throw new Error('Invalid rgb'); });
  return '#'+[r,g,b].map(x=>Math.round(x).toString(16).padStart(2,'0')).join('');
}
export function rgbToHsl({r,g,b}: RGB): HSL {
  r/=255; g/=255; b/=255;
  const max=Math.max(r,g,b), min=Math.min(r,g,b);
  let h=0, s=0, l=(max+min)/2;
  if(max!==min){
    const d=max-min;
    s=l>0.5? d/(2-max-min) : d/(max+min);
    switch(max){
      case r: h=(g-b)/d+(g<b?6:0); break;
      case g: h=(b-r)/d+2; break;
      default: h=(r-g)/d+4; break;
    }
    h/=6;
  }
  return { h: Math.round(h*360), s: Math.round(s*100), l: Math.round(l*100) };
}
export function hslToRgb({h,s,l}: HSL): RGB {
  h = ((h%360)+360)%360;
  s/=100; l/=100;
  if(s===0){
    const v=Math.round(l*255);
    return { r:v,g:v,b:v };
  }
  const q = l<0.5 ? l*(1+s) : l+s-l*s;
  const p = 2*l - q;
  const hk=h/360;
  function hue2rgb(t:number): number {
    if(t<0) t+=1;
    if(t>1) t-=1;
    if(t<1/6) return p+(q-p)*6*t;
    if(t<1/2) return q;
    if(t<2/3) return p+(q-p)*(2/3 - t)*6;
    return p;
  }
  const r=hue2rgb(hk+1/3), g=hue2rgb(hk), b=hue2rgb(hk-1/3);
  return { r: Math.round(r*255), g: Math.round(g*255), b: Math.round(b*255) };
}
