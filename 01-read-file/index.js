const fs = require('fs');
const path = require('path');

const readableStream = fs.createReadStream(
  path.join(__dirname, 'text.txt'),
  'utf8',
);
readableStream.on('data', (chunk) => process.stdout.write(chunk));
