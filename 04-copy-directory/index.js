const fs = require('fs');
const path = require('path');
const folderLink = path.join(__dirname, 'files');
const copyFolderLink = path.join(__dirname, 'files-copy');

async function copyDir() {
  fs.mkdir(copyFolderLink, { recursive: true }, (err) => {

    fs.readdir(folderLink, { withFileTypes: true }, (err, list) => {
      list.forEach(item => {
        let srcItem = path.join(folderLink, item.name);
        let destItem = path.join(copyFolderLink, item.name);
        fs.copyFile(srcItem, destItem, (err) => {
          if (err) console.log(err);
        })
      })
    })
  })
}

copyDir();