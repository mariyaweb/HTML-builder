const fs = require('fs');
const path = require('path');
const folderDist = path.join(__dirname, 'project-dist');
const folderCss = path.join(__dirname, 'styles');
const folderAssets = path.join(__dirname, 'assets');
const bundleHtml = path.join(folderDist, 'index.html');
const bundleCss = path.join(folderDist, 'style.css');
const bundleAssets = path.join(folderDist, 'assets');
const folderСomponents = path.join(__dirname, 'components');
const templateLink = path.join(__dirname, 'template.html');
const writableStreamCss = fs.createWriteStream(bundleCss);
const writableStreamHtml = fs.createWriteStream(bundleHtml);


//Create folder project-dist
fs.mkdir(folderDist, { recursive: true }, (err) => {
  createBundleHtml();
  createBundleCss();
  copyDir(folderAssets);
})

//Create bundle html
const readableStreamHtml = fs.createReadStream(templateLink);

async function createBundleHtml() {
  readableStreamHtml.on('data', (code) => {
    let templateHtml = code.toString();

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
              if (index < list.length) {
                templateHtml = templateHtml.replaceAll(`{{${itemName}}}`, tempCode);
                if (index === list.length - 1) {
                  writableStreamHtml.write(templateHtml);
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

//Create copy assets folder
async function copyDir(folderLink) {
  fs.mkdir(bundleAssets, { recursive: true }, (err) => {

    fs.readdir(folderLink, { withFileTypes: true }, (err, list) => {

      list.forEach(item => {
        let pathItem = path.join(folderLink, item.name);

        if (item.isDirectory()) {
          let bundleFolder = path.join(bundleAssets, item.name);

          fs.mkdir(bundleFolder, { recursive: true }, (err) => {
            if (err) console.log(err)
          });

          copyDir(pathItem);
        } else if (item.isFile()) {
          let relativePathItem = path.relative(folderAssets, pathItem);
          let destItem = path.join(bundleAssets, relativePathItem);

          fs.copyFile(pathItem, destItem, (err) => {
            if (err) console.log(err);
          });
        }
      });
    });
  });
}