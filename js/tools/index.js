const params = new URLSearchParams(location.search);
const id = params.get('id') || '';
const headerTitle = document.getElementById('toolTitle');
const headerSubtitle = document.getElementById('toolSubtitle');
const root = document.getElementById('toolRoot');

const registry = {
  'image-converter': { t: 'Image Converter', s: 'Convert images between PNG, JPEG, and WebP.', m: () => import('./imageConverter.js') },
  'image-compressor': { t: 'Image Compressor', s: 'Reduce image file size with quality control.', m: () => import('./imageCompressor.js') },
  'image-resizer': { t: 'Image Resizer', s: 'Resize images to exact dimensions or percentage.', m: () => import('./imageResizer.js') },
  'image-cropper': { t: 'Image Cropper', s: 'Crop an image to the desired area.', m: () => import('./imageCropper.js') },
  'image-rotate-flip': { t: 'Image Rotator & Flipper', s: 'Rotate and flip images.', m: () => import('./imageRotateFlip.js') },
  'image-ocr': { t: 'Image to Text (OCR)', s: 'Experimental: limited in-browser text extraction.', m: () => import('./imageOcr.js') },
  'scientific-calculator': { t: 'Scientific Calculator', s: 'Perform scientific calculations.', m: () => import('./scientificCalculator.js') },
  'age-calculator': { t: 'Age Calculator', s: 'Calculate age precisely.', m: () => import('./ageCalculator.js') },
  'bmi-calculator': { t: 'BMI Calculator', s: 'Calculate body mass index.', m: () => import('./bmiCalculator.js') },
  'loan-emi-calculator': { t: 'Loan EMI Calculator', s: 'Compute monthly repayments.', m: () => import('./loanEmiCalculator.js') },
  'gst-calculator': { t: 'GST Calculator', s: 'Compute GST for inclusive/exclusive amounts.', m: () => import('./gstCalculator.js') },
  'currency-converter': { t: 'Currency Converter', s: 'Convert amounts across currencies.', m: () => import('./currencyConverter.js') },
  'text-case-converter': { t: 'Text Case Converter', s: 'Switch cases in text.', m: () => import('./textCase.js') },
  'word-char-counter': { t: 'Word & Character Counter', s: 'Count words, characters, and lines.', m: () => import('./wordCharCounter.js') },
  'remove-duplicate-lines': { t: 'Remove Duplicate Lines', s: 'Keep unique lines only.', m: () => import('./removeDuplicates.js') },
  'text-sorter': { t: 'Text Sorter', s: 'Sort lines in text.', m: () => import('./textSorter.js') },
  'text-reverser': { t: 'Text Reverser', s: 'Reverse text.', m: () => import('./textReverser.js') },
  'text-encrypt-decrypt': { t: 'Text Encryptor & Decryptor', s: 'Encrypt and decrypt using AES-GCM.', m: () => import('./textEncryptDecrypt.js') },
  'minifier': { t: 'HTML/CSS/JS Minifier', s: 'Naive minification client-side.', m: () => import('./minifier.js') },
  'json-formatter-validator': { t: 'JSON Formatter & Validator', s: 'Validate and format JSON.', m: () => import('./jsonFormatter.js') },
  'base64-encoder-decoder': { t: 'Base64 Encoder & Decoder', s: 'Convert strings to and from Base64.', m: () => import('./base64.js') },
  'url-encoder-decoder': { t: 'URL Encoder & Decoder', s: 'Encode/decode URL components.', m: () => import('./urlEncodeDecode.js') },
  'color-picker-converter': { t: 'Color Picker & Converter', s: 'Pick colors and convert formats.', m: () => import('./colorPickerConverter.js') },
  'regex-tester': { t: 'Regex Tester', s: 'Test regular expressions on text.', m: () => import('./regexTester.js') },
  'color-picker-from-image': { t: 'Color Picker from Image', s: 'Pick colors from uploaded image.', m: () => import('./colorPickerFromImage.js') },
  'hex-to-rgb': { t: 'HEX to RGB Converter', s: 'Convert HEX to RGB and HSL.', m: () => import('./hexToRgb.js') },
  'gradient-generator': { t: 'Gradient Generator', s: 'Design CSS gradients.', m: () => import('./gradientGenerator.js') },
  'contrast-checker': { t: 'Contrast Checker', s: 'Check contrast ratios.', m: () => import('./contrastChecker.js') },
  'color-palette-generator': { t: 'Color Palette Generator', s: 'Generate palettes from image.', m: () => import('./colorPaletteGenerator.js') },
  'color-blindness-simulator': { t: 'Color Blindness Simulator', s: 'Simulate color vision types.', m: () => import('./colorBlindnessSimulator.js') },
  'keyword-density-checker': { t: 'Keyword Density Checker', s: 'Analyze keyword frequency.', m: () => import('./keywordDensity.js') },
  'meta-tag-analyzer': { t: 'Meta Tag Analyzer', s: 'Analyze meta tags from HTML.', m: () => import('./metaTagAnalyzer.js') },
  'seo-word-counter': { t: 'SEO Word Counter', s: 'Counts and readability hints.', m: () => import('./seoWordCounter.js') },
  'uuid-generator': { t: 'UUID Generator', s: 'Generate v4 UUIDs.', m: () => import('./uuidGenerator.js') },
  'unit-converter': { t: 'Unit Converter', s: 'Convert between common units.', m: () => import('./unitConverter.js') },
  'time-zone-converter': { t: 'Time Zone Converter', s: 'Convert times across zones.', m: () => import('./timeZoneConverter.js') },
  'random-password-generator': { t: 'Random Number & Password', s: 'Generate random values and passwords.', m: () => import('./randomPassword.js') },
  'barcode-generator': { t: 'Barcode Generator', s: 'Generate Code39 barcodes.', m: () => import('./barcodeGenerator.js') },
  'qr-code-generator-scanner': { t: 'QR Code Generator & Scanner', s: 'Experimental scanner using browser APIs.', m: () => import('./qrBarcode.js') },
  'lighting-height': { t: 'Lighting Height', s: 'Modern height control with preview.', m: () => import('./lightingHeight.js') },
  'pdf-to-word': { t: 'PDF to Word', s: 'Experimental client-side text extraction.', m: () => import('./pdfTools.js') },
  'word-to-pdf': { t: 'Word to PDF', s: 'Generate simple PDFs from text.', m: () => import('./pdfTools.js') },
  'pdf-compressor': { t: 'PDF Compressor', s: 'Experimental client-side compression.', m: () => import('./pdfTools.js') },
  'pdf-merge-split': { t: 'PDF Merger & Splitter', s: 'Experimental page operations.', m: () => import('./pdfTools.js') },
  'pdf-lock-unlock': { t: 'PDF Lock & Unlock', s: 'Experimental encryption operations.', m: () => import('./pdfTools.js') },
  'pdf-esign': { t: 'eSign PDF', s: 'Add signatures on PDF pages.', m: () => import('./pdfTools.js') }
};

async function boot() {
  const entry = registry[id];
  if(!entry) {
    headerTitle.textContent = 'Tool Not Found';
    headerSubtitle.textContent = 'Please return to the tools list.';
    root.innerHTML = '<a class="btn btn-secondary" href="../index.html#tools">Back to Tools</a>';
    return;
  }
  headerTitle.textContent = entry.t;
  headerSubtitle.textContent = entry.s;
  const mod = await entry.m();
  if(!mod || typeof mod.render!=='function') {
    root.textContent = 'Unable to load this tool.';
    return;
  }
  mod.render(root, { id, title: entry.t });
}

boot();
