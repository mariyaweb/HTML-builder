const fs = require('fs');
const path = require('path');
const folderLink = path.join(__dirname, 'secret-folder');

fs.readdir(folderLink, { withFileTypes: true }, (err, list) => {
  list.forEach(item => {
    if (item.isFile()) {
      let pathItem = path.join(folderLink, item.name);

      fs.stat(pathItem, (err, stat) => {
        let nameItem = (item.name).split('.')[0];
        let extnameItem = path.extname(pathItem).split('.')[1];
        let sizeItem = stat.size;
        console.log(`${nameItem} - ${extnameItem} - ${sizeItem} bytes`);
      })
    }
  })
})


