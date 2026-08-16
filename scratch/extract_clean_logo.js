const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

const inputPath = 'C:\\Users\\hsaqi\\.gemini\\antigravity-ide\\brain\\5d1268c4-e230-4fb1-9e0a-223184ac3cf4\\.user_uploaded\\media_1786892157634.png';
const data = fs.readFileSync(inputPath);

const png = PNG.sync.read(data);
console.log('Original image dimensions:', png.width, png.height);

// Find bounding box of dark logo pixels (r < 50, g < 50, b < 50, a > 100)
let minX = png.width, maxX = 0, minY = png.height, maxY = 0;

for (let y = 0; y < png.height; y++) {
  for (let x = 0; x < png.width; x++) {
    const idx = (png.width * y + x) << 2;
    const r = png.data[idx];
    const g = png.data[idx + 1];
    const b = png.data[idx + 2];
    const a = png.data[idx + 3];

    // Check if pixel is black (logo)
    if (r < 50 && g < 50 && b < 50 && a > 120) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
}

console.log(`Logo bounding box: x=[${minX}..${maxX}], y=[${minY}..${maxY}] (width=${maxX - minX + 1}, height=${maxY - minY + 1})`);

const cropWidth = maxX - minX + 1;
const cropHeight = maxY - minY + 1;

// Create clean transparent PNG
const cropped = new PNG({ width: cropWidth, height: cropHeight });

for (let cy = 0; cy < cropHeight; cy++) {
  for (let cx = 0; cx < cropWidth; cx++) {
    const origX = minX + cx;
    const origY = minY + cy;
    const origIdx = (png.width * origY + origX) << 2;
    const destIdx = (cropWidth * cy + cx) << 2;

    const r = png.data[origIdx];
    const g = png.data[origIdx + 1];
    const b = png.data[origIdx + 2];
    const a = png.data[origIdx + 3];

    if (r < 50 && g < 50 && b < 50 && a > 120) {
      // Solid black pixel with original anti-aliasing
      cropped.data[destIdx] = 0;
      cropped.data[destIdx + 1] = 0;
      cropped.data[destIdx + 2] = 0;
      cropped.data[destIdx + 3] = 255;
    } else {
      // 100% transparent
      cropped.data[destIdx] = 0;
      cropped.data[destIdx + 1] = 0;
      cropped.data[destIdx + 2] = 0;
      cropped.data[destIdx + 3] = 0;
    }
  }
}

const outPngPath = path.join(__dirname, '..', 'public', 'dev-logo.png');
fs.writeFileSync(outPngPath, PNG.sync.write(cropped));
console.log('Saved clean transparent cropped logo to:', outPngPath);
