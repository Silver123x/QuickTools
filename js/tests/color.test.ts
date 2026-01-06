import { hexToRgb, rgbToHex, rgbToHsl, hslToRgb } from '../src/lib/color';
test('hexToRgb parses 3 and 6 digit hex', ()=>{
  expect(hexToRgb('#fff')).toEqual({r:255,g:255,b:255});
  expect(hexToRgb('#000')).toEqual({r:0,g:0,b:0});
  expect(hexToRgb('#2563eb')).toEqual({r:37,g:99,b:235});
});
test('rgbToHex converts rgb to hex', ()=>{
  expect(rgbToHex({r:255,g:255,b:255})).toBe('#ffffff');
  expect(rgbToHex({r:37,g:99,b:235})).toBe('#2563eb');
});
test('rgb<->hsl round trips', ()=>{
  const rgb = { r: 37, g: 99, b: 235 };
  const hsl = rgbToHsl(rgb);
  const rgb2 = hslToRgb(hsl);
  expect(Math.abs(rgb2.r - rgb.r)).toBeLessThanOrEqual(1);
  expect(Math.abs(rgb2.g - rgb.g)).toBeLessThanOrEqual(1);
  expect(Math.abs(rgb2.b - rgb.b)).toBeLessThanOrEqual(1);
});
