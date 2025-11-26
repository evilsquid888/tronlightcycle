const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, 'assets', 'images');
const expectedSizes = {
  'player-cycle.png': { width: 128, height: 128 },
  'ai-cycle-red.png': { width: 128, height: 128 },
  'ai-cycle-yellow.png': { width: 128, height: 128 },
  'ai-cycle-green.png': { width: 128, height: 128 },
  'ai-cycle-purple.png': { width: 128, height: 128 },
  'arena-bg.png': { width: 1920, height: 1080 },
  'explosion.png': { width: 512, height: 512 }
};

function readPNGDimensions(filePath) {
  const buffer = fs.readFileSync(filePath);

  // Check PNG signature
  const signature = buffer.toString('hex', 0, 8);
  if (signature !== '89504e470d0a1a0a') {
    return { error: 'Not a valid PNG file' };
  }

  // Read IHDR chunk (always at position 8)
  const width = buffer.readUInt32BE(16);
  const height = buffer.readUInt32BE(20);
  const bitDepth = buffer.readUInt8(24);
  const colorType = buffer.readUInt8(25);

  const colorTypes = {
    0: 'Grayscale',
    2: 'RGB',
    3: 'Indexed',
    4: 'Grayscale+Alpha',
    6: 'RGBA'
  };

  return {
    width,
    height,
    bitDepth,
    colorType: colorTypes[colorType] || `Unknown (${colorType})`,
    size: buffer.length
  };
}

console.log('=== Image Asset Sanity Check ===\n');

let allGood = true;

for (const [filename, expected] of Object.entries(expectedSizes)) {
  const filePath = path.join(imagesDir, filename);

  if (!fs.existsSync(filePath)) {
    console.log(`❌ ${filename}: MISSING`);
    allGood = false;
    continue;
  }

  const info = readPNGDimensions(filePath);

  if (info.error) {
    console.log(`❌ ${filename}: ${info.error}`);
    allGood = false;
    continue;
  }

  const sizeOK = info.width === expected.width && info.height === expected.height;
  const sizeStr = `${info.width}x${info.height}`;
  const expectedStr = `${expected.width}x${expected.height}`;
  const fileSize = (info.size / 1024 / 1024).toFixed(2);

  if (sizeOK) {
    console.log(`✅ ${filename}`);
    console.log(`   Size: ${sizeStr} (expected: ${expectedStr})`);
    console.log(`   Type: PNG ${info.colorType}, ${info.bitDepth}-bit`);
    console.log(`   File: ${fileSize} MB\n`);
  } else {
    console.log(`⚠️  ${filename}`);
    console.log(`   Size: ${sizeStr} (expected: ${expectedStr}) - SIZE MISMATCH`);
    console.log(`   Type: PNG ${info.colorType}, ${info.bitDepth}-bit`);
    console.log(`   File: ${fileSize} MB\n`);
    allGood = false;
  }
}

if (allGood) {
  console.log('✅ All images are valid and correctly sized!');
  process.exit(0);
} else {
  console.log('⚠️  Some images have issues - see above');
  process.exit(1);
}
