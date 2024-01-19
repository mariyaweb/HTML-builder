const fs = require('fs');
const path = require('path');
const folderLink = path.join(__dirname, 'styles');
const bundleFolderLink = path.join(__dirname, 'project-dist');
const bundleCSS = path.join(bundleFolderLink, 'bundle.css');
const writableStream = fs.createWriteStream(bundleCSS);

fs.readdir(folderLink, { withFileTypes: true }, (err, list) => {
  list.forEach(item => {
    if (item.isFile()) {
      let pathItem = path.join(folderLink, item.name);
      let extnameItem = path.extname(pathItem);
      if (extnameItem === '.css') {
        const readableStream = fs.createReadStream(pathItem, 'utf-8');
        readableStream.pipe(writableStream);
      }
    }
  })
})
