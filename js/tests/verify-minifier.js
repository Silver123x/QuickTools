
import { minifyJS, minifyCSS, minifyHTML } from '../js/tools/minifier.js';
import assert from 'assert';

console.log('Verifying Minifier...');

try {
  // Test 1: JS Comments
  const jsInput = `
    // Line comment
    var a = 1; /* Block 
    comment */
    var b = 2;
  `;
  const jsOutput = minifyJS(jsInput);
  assert(jsOutput.includes('var a=1;'), 'Should keep code');
  assert(!jsOutput.includes('Line comment'), 'Should remove line comments');
  assert(!jsOutput.includes('Block'), 'Should remove block comments');
  console.log('✓ JS Comments passed');

  // Test 2: JS Strings
  const strInput = `var s = "keep // comment";`;
  const strOutput = minifyJS(strInput);
  if (strOutput !== 'var s="keep // comment";') {
    console.log('Expected: var s="keep // comment";');
    console.log('Actual:   ' + strOutput);
  }
  assert.strictEqual(strOutput, 'var s="keep // comment";', 'Should preserve strings');
  console.log('✓ JS Strings passed');

  // Test 3: JS Regex vs Division
  const regexInput = `return /abc/;`;
  assert.strictEqual(minifyJS(regexInput), 'return /abc/;', 'Should identify regex after return');
  
  const divInput = `var a=10;return a/2;`;
  assert.strictEqual(minifyJS(divInput), 'var a=10;return a/2;', 'Should identify division after variable');
  console.log('✓ JS Regex/Division passed');

  // Test 4: CSS
  const cssInput = `body { color: red; }`;
  assert.strictEqual(minifyCSS(cssInput), 'body{color:red;}', 'CSS minification failed');
  console.log('✓ CSS passed');

  // Test 5: HTML
  const htmlInput = `<div>  Text  </div>`;
  assert.strictEqual(minifyHTML(htmlInput), '<div> Text </div>', 'HTML minification failed');
  console.log('✓ HTML passed');

  console.log('All tests passed!');
} catch (err) {
  console.error('Test failed:', err.message);
  process.exit(1);
}
