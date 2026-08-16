const fs = require('fs');
const zlib = require('zlib');

// Simple PNG decoder and encoder in pure Node (no npm dependencies needed)
function processPng(inputPath, outputPath) {
  const file = fs.readFileSync(inputPath);
  
  // Verify PNG signature
  if (file.toString('hex', 0, 8) !== '89504e470d0a1a0a') {
    console.error('Not a valid PNG');
    return;
  }

  let offset = 8;
  let width, height, bitDepth, colorType;
  let idatChunks = [];

  while (offset < file.length) {
    const length = file.readUInt32BE(offset);
    const type = file.toString('ascii', offset + 4, offset + 8);
    const data = file.slice(offset + 8, offset + 8 + length);
    
    if (type === 'IHDR') {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      bitDepth = data.readUInt8(8);
      colorType = data.readUInt8(9);
      console.log(`IHDR: ${width}x${height}, bitDepth: ${bitDepth}, colorType: ${colorType}`);
    } else if (type === 'IDAT') {
      idatChunks.push(data);
    } else if (type === 'IEND') {
      break;
    }
    
    offset += 12 + length;
  }

  const compressed = Buffer.concat(idatChunks);
  const decompressed = zlib.inflateSync(compressed);
  
  // Color type 6 = RGBA (4 bytes per pixel), color type 2 = RGB (3 bytes per pixel)
  const bytesPerPixel = colorType === 6 ? 4 : colorType === 2 ? 3 : 4;
  const scanlineLength = 1 + width * bytesPerPixel;
  
  const rawRgba = Buffer.alloc(width * height * 4);
  
  for (let y = 0; y < height; y++) {
    const filter = decompressed[y * scanlineLength];
    for (let x = 0; x < width; x++) {
      const srcIdx = y * scanlineLength + 1 + x * bytesPerPixel;
      const r = decompressed[srcIdx];
      const g = decompressed[srcIdx + 1];
      const b = decompressed[srcIdx + 2];
      
      const dstIdx = (y * width + x) * 4;
      
      // Check if pixel is black (the logo) or background (checkerboard grey > 35)
      const isBlack = r < 35 && g < 35 && b < 35;
      
      if (isBlack) {
        rawRgba[dstIdx] = 0;     // R
        rawRgba[dstIdx + 1] = 0; // G
        rawRgba[dstIdx + 2] = 0; // B
        rawRgba[dstIdx + 3] = 255; // Alpha opaque
      } else {
        rawRgba[dstIdx] = 0;
        rawRgba[dstIdx + 1] = 0;
        rawRgba[dstIdx + 2] = 0;
        rawRgba[dstIdx + 3] = 0; // Alpha fully transparent
      }
    }
  }

  // Find bounding box of non-transparent pixels to crop tight
  let minX = width, minY = height, maxX = 0, maxY = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      if (rawRgba[idx + 3] > 0) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  // Add 4px padding
  minX = Math.max(0, minX - 4);
  minY = Math.max(0, minY - 4);
  maxX = Math.min(width - 1, maxX + 4);
  maxY = Math.min(height - 1, maxY + 4);

  const croppedWidth = maxX - minX + 1;
  const croppedHeight = maxY - minY + 1;

  console.log(`Cropped bounding box: ${croppedWidth}x${croppedHeight} (from [${minX},${minY}] to [${maxX},${maxY}])`);

  // Build cropped uncompressed scanlines (filter 0)
  const croppedScanlines = Buffer.alloc(croppedHeight * (1 + croppedWidth * 4));
  for (let y = 0; y < croppedHeight; y++) {
    const origY = minY + y;
    const scanlineOffset = y * (1 + croppedWidth * 4);
    croppedScanlines[scanlineOffset] = 0; // Filter None
    
    for (let x = 0; x < croppedWidth; x++) {
      const origX = minX + x;
      const srcIdx = (origY * width + origX) * 4;
      const dstIdx = scanlineOffset + 1 + x * 4;
      
      croppedScanlines[dstIdx] = rawRgba[srcIdx];
      croppedScanlines[dstIdx + 1] = rawRgba[srcIdx + 1];
      croppedScanlines[dstIdx + 2] = rawRgba[srcIdx + 2];
      croppedScanlines[dstIdx + 3] = rawRgba[srcIdx + 3];
    }
  }

  // Compress IDAT
  const compressedIdat = zlib.deflateSync(croppedScanlines);

  // CRC32 table
  const crcTable = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    crcTable[i] = c;
  }

  function crc32(buf) {
    let crc = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
    }
    return (crc ^ 0xffffffff) >>> 0;
  }

  function makeChunk(type, data) {
    const lenBuf = Buffer.alloc(4);
    lenBuf.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const crcVal = crc32(Buffer.concat([typeBuf, data]));
    const crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE(crcVal, 0);
    return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
  }

  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(croppedWidth, 0);
  ihdrData.writeUInt32BE(croppedHeight, 4);
  ihdrData[8] = 8; // 8 bit depth
  ihdrData[9] = 6; // RGBA color type
  ihdrData[10] = 0;
  ihdrData[11] = 0;
  ihdrData[12] = 0;

  const outPng = Buffer.concat([
    Buffer.from('89504e470d0a1a0a', 'hex'),
    makeChunk('IHDR', ihdrData),
    makeChunk('IDAT', compressedIdat),
    makeChunk('IEND', Buffer.alloc(0))
  ]);

  fs.writeFileSync(outputPath, outPng);
  console.log(`Saved clean transparent logo to: ${outputPath} (${outPng.length} bytes)`);
}

processPng('public/dev-logo.png', 'public/dev-logo-clean.png');
