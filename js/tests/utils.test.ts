import { clamp, formatBytes, isHex } from '../src/lib/utils';
test('clamp bounds', ()=>{
  expect(clamp(5,0,10)).toBe(5);
  expect(clamp(-1,0,10)).toBe(0);
  expect(clamp(99,0,10)).toBe(10);
});
test('formatBytes output', ()=>{
  expect(formatBytes(0)).toBe('0 KB');
  expect(formatBytes(1024)).toBe('1.0 KB');
});
test('isHex validator', ()=>{
  expect(isHex('#fff')).toBe(true);
  expect(isHex('2563eb')).toBe(true);
  expect(isHex('ggg')).toBe(false);
});
