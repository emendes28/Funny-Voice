const sharp = require('sharp');
const fs = require('fs');
const input = require('../info-image-to-resize.json');

console.log(process.argv)

for(const { resolution, fileNameWithExtensionAndLocation }  of input.resolutions) {
    const [ width, height ]  = resolution.split('x');
    sharp(input.fileNameWithExtensionAndLocation)
    .resize(Number.parseInt(width),Number.parseInt(height))
    .toBuffer()
    .then( data => { fs.writeFileSync(fileNameWithExtensionAndLocation, data) })
    .catch( err => { console.log(err) });
}