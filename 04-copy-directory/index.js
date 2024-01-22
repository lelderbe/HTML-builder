const fs = require('fs/promises');
const path = require('path');

async function copyDir(sourceFolder, destFolder) {
  const src = path.resolve(__dirname, sourceFolder);
  const dest = path.resolve(src, '..', destFolder);

  await fs.rm(dest, { recursive: true, force: true });
  const files = await fs.readdir(src, {
    withFileTypes: true,
  });
  await fs.mkdir(dest);
  files.forEach(async (file) => {
    if (file.isFile()) {
      fs.copyFile(path.join(src, file.name), path.join(dest, file.name));
    } else {
      await fs.mkdir(path.join(dest, file.name));
      copyDir(path.join(src, file.name), path.join(dest, file.name));
    }
  });
}

copyDir('files', 'copy-files');
