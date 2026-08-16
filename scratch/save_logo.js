const fs = require('fs');
const path = require('path');

// Read the png file
const pngPath = 'C:\\Users\\hsaqi\\.gemini\\antigravity-ide\\brain\\5d1268c4-e230-4fb1-9e0a-223184ac3cf4\\.user_uploaded\\media_1786892157634.png';
const buffer = fs.readFileSync(pngPath);

// Save to public/brand-logo.png or public/dev-logo.png for crystal clear 1:1 display
const destPublic = path.join(__dirname, '..', 'public', 'dev-logo.png');
fs.writeFileSync(destPublic, buffer);
console.log('Saved image to public/dev-logo.png:', fs.statSync(destPublic).size);
