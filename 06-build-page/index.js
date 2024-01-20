const fs = require('fs');
const path = require('path');
const folderDist = path.join(__dirname, 'project-dist');
const folderCss = path.join(__dirname, 'styles');
const bundleHtml = path.join(folderDist, 'index.html');
const bundleCss = path.join(folderDist, 'style.css');
const bundleAssets = path.join(folderDist, 'assets');
const folderСomponents = path.join(__dirname, 'components');
const templateLink = path.join(__dirname, 'template.html');
const writableStreamCss = fs.createWriteStream(bundleCss);
const writableStreamHtml = fs.createWriteStream(bundleHtml);


//Create folder project-dist
fs.mkdir(folderDist, { recursive: true }, (err) => {
  createBundleHtml()
  createBundleCss();
})

//Create bundle html
const readableStreamHtml = fs.createReadStream(templateLink);

async function createBundleHtml() {
  readableStreamHtml.on('data', (code) => {
    let templateHtml = code.toString();
    let newHtml;
    fs.readdir(folderСomponents, { withFileTypes: true }, (err, list) => {
      list.forEach((item, index) => {
        if (item.isFile()) {
          let pathItem = path.join(folderСomponents, item.name);
          let extnameItem = path.extname(pathItem);

          if (extnameItem === '.html') {
            let itemName = path.parse(pathItem).name;
            const readableStreamComponents = fs.createReadStream(pathItem);
            readableStreamComponents.on('data', (code) => {
              let tempCode = code.toString();
              if (index === 0) {
                newHtml = templateHtml.replaceAll(`{{${itemName}}}`, tempCode);
              } else {
                newHtml = newHtml.replaceAll(`{{${itemName}}}`, tempCode);
                if (index === list.length - 1) {
                  writableStreamHtml.write(newHtml);
                }
              }
            });
          }
        }
      });
    });
  });
}

//Create bundle styles
async function createBundleCss() {
  fs.readdir(folderCss, { withFileTypes: true }, (err, list) => {
    list.forEach(item => {
      if (item.isFile()) {
        let pathItem = path.join(folderCss, item.name);
        let extnameItem = path.extname(pathItem);
        if (extnameItem === '.css') {
          const readableStreamCss = fs.createReadStream(pathItem, 'utf-8');
          readableStreamCss.pipe(writableStreamCss);
        }
      }
    })
  })
}
