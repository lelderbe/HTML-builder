const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;

const writeableStream = fs.createWriteStream(
  path.join(__dirname, 'text.txt'),
  'utf8',
);

stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') {
    process.exit();
  }
  writeableStream.write(data);
});

stdout.write('Привет! Напиши что-нибудь и я сохраню это в файл:\n');

process.on('SIGINT', () => {
  process.exit();
});
process.on('exit', () => stdout.write('Goodbye!\n'));
