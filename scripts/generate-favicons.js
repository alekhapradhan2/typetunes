const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

function createIco(pngBuffers) {
  const count = pngBuffers.length;
  let header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // Type: 1 = ICO
  header.writeUInt16LE(count, 4); // Count

  let dirOffset = 6 + count * 16;
  let dirEntries = [];
  let currentOffset = dirOffset;

  for (const { size, buffer } of pngBuffers) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0); // Width
    entry.writeUInt8(size >= 256 ? 0 : size, 1); // Height
    entry.writeUInt8(0, 2); // Colors
    entry.writeUInt8(0, 3); // Reserved
    entry.writeUInt16LE(1, 4); // Color planes
    entry.writeUInt16LE(32, 6); // Bits per pixel
    entry.writeUInt32LE(buffer.length, 8); // Size
    entry.writeUInt32LE(currentOffset, 12); // Offset
    dirEntries.push(entry);
    currentOffset += buffer.length;
  }

  return Buffer.concat([header, ...dirEntries, ...pngBuffers.map(p => p.buffer)]);
}

async function run() {
  const svgPath = path.resolve(__dirname, '../src/app/icon.svg');
  const svgContent = fs.readFileSync(svgPath);

  console.log('Generating PNGs from SVG...');
  const png16 = await sharp(svgContent).resize(16, 16).png().toBuffer();
  const png32 = await sharp(svgContent).resize(32, 32).png().toBuffer();
  const png48 = await sharp(svgContent).resize(48, 48).png().toBuffer();
  const png64 = await sharp(svgContent).resize(64, 64).png().toBuffer();
  const png180 = await sharp(svgContent).resize(180, 180).png().toBuffer();
  const png192 = await sharp(svgContent).resize(192, 192).png().toBuffer();
  const png512 = await sharp(svgContent).resize(512, 512).png().toBuffer();

  const icoBuffer = createIco([
    { size: 16, buffer: png16 },
    { size: 32, buffer: png32 },
    { size: 48, buffer: png48 }
  ]);

  // Write all favicons and icons to both src/app/ and public/
  const targets = [
    { file: path.resolve(__dirname, '../src/app/favicon.ico'), buffer: icoBuffer },
    { file: path.resolve(__dirname, '../public/favicon.ico'), buffer: icoBuffer },
    { file: path.resolve(__dirname, '../public/favicon-16x16.png'), buffer: png16 },
    { file: path.resolve(__dirname, '../public/favicon-32x32.png'), buffer: png32 },
    { file: path.resolve(__dirname, '../public/favicon.png'), buffer: png32 },
    { file: path.resolve(__dirname, '../public/apple-touch-icon.png'), buffer: png180 },
    { file: path.resolve(__dirname, '../public/icon-192.png'), buffer: png192 },
    { file: path.resolve(__dirname, '../public/icon-512.png'), buffer: png512 },
  ];

  for (const { file, buffer } of targets) {
    fs.writeFileSync(file, buffer);
    console.log(`Wrote ${file} (${buffer.length} bytes)`);
  }

  console.log('Favicons generated successfully!');
}

run().catch(console.error);
