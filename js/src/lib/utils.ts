export function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}
export function formatBytes(n: number): string {
  if(!n) return '0 KB';
  return (n/1024).toFixed(1)+' KB';
}
export function isHex(s: string): boolean {
  const h=s.replace('#','').trim();
  return /^[0-9a-fA-F]{3,6}$/.test(h);
}
