const gm = require('gm').subClass({ imageMagick: true });
const async = require('async');
const fs = require('fs');
const path = require('path');

const tmpDirPath = path.join(__dirname, '..', 'tmp');

function toScuarePng(opts, callback) {
  const {
    filePath,
    fileName,
    toExtension,
    fromExtension,
    size,
  } = opts;
  const readStream = fs.createReadStream(filePath);
  const nameWithExtension = fromExtension ? `${fileName}.${fromExtension}` : fileName;
  const {name, ext} = path.parse(nameWithExtension);
  const newFileName = `${name}_e.${toExtension}`;
  const src = gm(readStream, nameWithExtension);

  src
    .resize(size, size, '^')
    .gravity('Center')
    .extent(size, size)
    .write(path.join(tmpDirPath, newFileName), (err, data) => {
      if (err) {
        fs.unlink(filePath, () => {});
        return callback(err);
      }

      fs.unlink(filePath, () => {});
      return callback(null, {
        fileName: newFileName,
        filePath: path.join(tmpDirPath, newFileName),
      });

    });

}

module.exports = {
  toScuarePng,
};
