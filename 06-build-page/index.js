const fs = require('fs/promises');
const path = require('path');

const distFolder = path.join(__dirname, 'project-dist');

async function mergeStyles() {
  const srcFolder = path.join(__dirname, 'styles');

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

    await fs.writeFile(path.join(distFolder, 'style.css'), result.join('\n'));
  } catch (err) {
    console.error('Error: cannot read styles folder');
    return;
  }
}

async function copyDir(sourceFolder, destFolder) {
  const src = path.resolve(__dirname, sourceFolder);
  const dest = path.resolve(src, '..', destFolder);

  const files = await fs.readdir(src, {
    withFileTypes: true,
  });
  try {
    await fs.mkdir(dest);
  } catch (err) {}
  files.forEach(async (file) => {
    if (file.isFile()) {
      fs.copyFile(path.join(src, file.name), path.join(dest, file.name));
    } else {
      await fs.mkdir(path.join(dest, file.name));
      copyDir(path.join(src, file.name), path.join(dest, file.name));
    }
  });
}

async function makeTemplate() {
  let template = '';
  try {
    template = await fs.readFile(path.join(__dirname, 'template.html'), {
      encoding: 'utf8',
    });
  } catch (err) {
    console.error('Error: file template.html not found!');
    return;
  }

  const regexp = /({{.*?}})/gm;
  const match = template.match(regexp);

  const templatesFolder = path.join(__dirname, 'components');
  const promises = match.map((item) => {
    return fs.readFile(
      path.join(templatesFolder, `${item.slice(2, -2)}.html`),
      { encoding: 'utf8' },
    );
  });

  const result = await Promise.allSettled(promises);

  match.forEach((item, index) => {
    let tagContent = result[index].value;
    if (result[index].status !== 'fulfilled') {
      console.log(`Error: template file for tag ${item} not found`);
      tagContent = item;
    }
    template = template.replace(item, tagContent);
  });

  await fs.writeFile(path.join(distFolder, 'index.html'), template);
}

async function makeBundle() {
  await fs.rm(distFolder, { recursive: true, force: true });
  await fs.mkdir(distFolder);
  await makeTemplate();
  await mergeStyles();
  await copyDir('assets', path.join(distFolder, 'assets'));
}

makeBundle();
