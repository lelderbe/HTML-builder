const fs = require('fs/promises');
const path = require('path');

async function mergeStyles() {
  const srcFolder = path.join(__dirname, 'styles');
  const destFolder = path.join(__dirname, 'project-dist');

  try {
    const files = await fs.readdir(srcFolder, {
      withFileTypes: true,
    });

    const promises = files
      .filter((file) => {
        if (!file.isFile()) {
          return false;
        }
        const ext = path.parse(file.name).ext;
        if (ext !== '.css') {
          return false;
        }
        return true;
      })
      .map((file) => {
        return fs.readFile(path.join(srcFolder, file.name), {
          encoding: 'utf8',
        });
      });
    const result = await Promise.all(promises);
    await fs.writeFile(path.join(destFolder, 'bundle.css'), result.join('\n'));
  } catch (err) {
    console.error('Error: cannot read styles folder');
    return;
  }
}

mergeStyles();
