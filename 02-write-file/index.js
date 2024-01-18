const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;

const newFile = fs.createWriteStream(path.join(__dirname, 'input.txt'));

stdout.write('Введите текст:\n');

stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') {
    process.exit();
  }
  newFile.write(data);
});

process.on('SIGINT', () => process.exit());
process.on('exit', () => stdout.write('Данные успешно записаны в файл input.txt'));