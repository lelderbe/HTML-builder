const fs = require('fs/promises');
const path = require('path');

async function listFiles(folder) {
  const targetFolder = path.join(__dirname, folder);

  try {
    const files = await fs.readdir(targetFolder, {
      withFileTypes: true,
    });
    files.forEach(async (file) => {
      if (file.isFile()) {
        const stat = await fs.stat(path.join(targetFolder, file.name));
        const name = path.parse(file.name).name;
        const ext = path.parse(file.name).ext;
        const size = stat.size;
        console.log(`${name} - ${ext ? ext.slice(1) : ext} - ${size}`);
      }
    });
  } catch (err) {
    return;
  }
}

listFiles('secret-folder');
