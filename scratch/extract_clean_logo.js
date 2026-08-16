const fs = require('fs');
const zlib = require('zlib');

function extractBlackLogo(inputPath, outputPath) {
  const file = fs.readFileSync(inputPath);
  let offset = 8, idatChunks = [], width, height, colorType;

  while (offset < file.length) {
    const len = file.readUInt32BE(offset);
    const type = file.toString('ascii', offset + 4, offset + 8);
    const data = file.slice(offset + 8, offset + 8 + len);
    if (type === 'IHDR') {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      colorType = data.readUInt8(9);
    } else if (type === 'IDAT') idatChunks.push(data);
    else if (type === 'IEND') break;
    offset += 12 + len;
  }

  const decomp = zlib.inflateSync(Buffer.concat(idatChunks));
  const bytesPerPixel = colorType === 6 ? 4 : 3;
  const scanlineLength = 1 + width * bytesPerPixel;

  let minX = width, minY = height, maxX = 0, maxY = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * scanlineLength + 1 + x * bytesPerPixel;
      const r = decomp[idx];
      const g = decomp[idx + 1];
      const b = decomp[idx + 2];
      
      // Black pixels of the logo are very dark (R < 35, G < 35, B < 35)
      if (r < 35 && g < 35 && b < 35) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  console.log(`DEV Logo bounding box: [${minX}, ${minY}] to [${maxX}, ${maxY}]`);
  const croppedWidth = maxX - minX + 1;
  const croppedHeight = maxY - minY + 1;
  console.log(`Extracted size: ${croppedWidth}x${croppedHeight}`);

  const croppedScanlines = Buffer.alloc(croppedHeight * (1 + croppedWidth * 4));
  for (let y = 0; y < croppedHeight; y++) {
    const origY = minY + y;
    const scanlineOffset = y * (1 + croppedWidth * 4);
    croppedScanlines[scanlineOffset] = 0;

    for (let x = 0; x < croppedWidth; x++) {
      const origX = minX + x;
      const srcIdx = origY * scanlineLength + 1 + origX * bytesPerPixel;
      const dstIdx = scanlineOffset + 1 + x * 4;

      const r = decomp[srcIdx];
      const g = decomp[srcIdx + 1];
      const b = decomp[srcIdx + 2];

      const isLogo = r < 40 && g < 40 && b < 40;

      if (isLogo) {
        croppedScanlines[dstIdx] = 0;
        croppedScanlines[dstIdx + 1] = 0;
        croppedScanlines[dstIdx + 2] = 0;
        croppedScanlines[dstIdx + 3] = 255;
      } else {
        croppedScanlines[dstIdx] = 0;
        croppedScanlines[dstIdx + 1] = 0;
        croppedScanlines[dstIdx + 2] = 0;
        croppedScanlines[dstIdx + 3] = 0;
      }
    }
  }

  const compressedIdat = zlib.deflateSync(croppedScanlines);

  const crcTable = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = (c & 1) ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    crcTable[i] = c;
  }

  function crc32(buf) {
    let crc = 0xffffffff;
    for (let i = 0; i < buf.length; i++) crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
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

  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(croppedWidth, 0);
  ihdrData.writeUInt32BE(croppedHeight, 4);
  ihdrData[8] = 8;
  ihdrData[9] = 6;
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
  console.log(`Saved transparent logo PNG to: ${outputPath} (${outPng.length} bytes)`);
}

extractBlackLogo('public/dev-logo.png', 'public/dev-logo.png');
