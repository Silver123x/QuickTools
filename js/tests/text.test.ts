import { levenshtein, jaccardSimilarity, stableComparator } from '../src/lib/text';
test('levenshtein distance basic', ()=>{
  expect(levenshtein('kitten','sitting')).toBe(3);
  expect(levenshtein('abc','abc')).toBe(0);
});
test('jaccard similarity tokens', ()=>{
  expect(jaccardSimilarity('hello world','hello dear world')).toBeCloseTo(2/3, 5);
  expect(jaccardSimilarity('','')).toBe(1);
});
test('stable comparator numeric and case-insensitive', ()=>{
  expect(stableComparator('10','2',true,false)).toBeGreaterThan(0);
  expect(stableComparator('a','B',false,false)).toBeLessThan(0);
});
