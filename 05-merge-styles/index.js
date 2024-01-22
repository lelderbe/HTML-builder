const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');

const writeableStream = fs.createWriteStream(
  path.join(__dirname, 'project-dist', 'bundle.css'),
  'utf8',
);

async function makeBundle() {
  const targetFolder = path.join(__dirname, 'styles');

  try {
    const files = await fsPromises.readdir(targetFolder, {
      withFileTypes: true,
    });
    files.forEach(async (file) => {
      if (file.isFile()) {
        const ext = path.parse(file.name).ext;
        if (ext === '.css') {
          const readableStream = fs.createReadStream(
            path.join(__dirname, 'styles', file.name),
            'utf8',
          );
          readableStream.on('data', (chunk) => writeableStream.write(chunk));
        }
      }
    });
  } catch (err) {
    return;
  }
}

makeBundle();
