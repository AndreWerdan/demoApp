const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {FILE_SERVER_URL_BASE} = require('../config');

const publicDirPath = path.join(__dirname, '..', 'public');
const tmpDirPath = path.join(__dirname, '..', 'tmp');
const fileMiddleware = multer({
  dest: tmpDirPath,
});

function getFileUrlSync(fileToken = '') {
  if (!fileToken) {
    return '';
  }

  return `http://${FILE_SERVER_URL_BASE}/files/${fileToken.toLowerCase()}`;
}

function getFileUrl(fileToken = '', callback) {
  callback(null, getFileUrlSync(fileToken));
}

function saveFile(opts = {}, callback) {
  const { filePath, fileName } = opts;
  const newFilePath = path.join(publicDirPath, fileName);

  fs.rename(filePath, newFilePath, (err) => {
    if (err) {
      /*  TODO:implement handler if time is available */
      fs.unlink(filePath, function () {});
      return callback(err);
    }

    return callback(null, {
      fileName,
      publicUrl: getFileUrlSync(fileName),
    });
  });

}

function saveMulterFile(multerFileObject, callback) {
  const origFilePath = multerFileObject.path;
  const origFileLocalName = multerFileObject.filename || '';
  const origFileName = multerFileObject.originalname || '';
  const origExtension = origFileName.split('.').pop() || '';
  const fileToken = `${origFileLocalName.toLowerCase()}.${origExtension.toLowerCase()}`;
  const newFilePath = path.join(publicDirPath, fileToken);

  fs.rename(origFilePath, newFilePath, (err) => {
    if (err) {
      return callback(err);
    }

    return callback(null, fileToken);
  });
}

module.exports = {
  fileMiddleware,
  saveMulterFile,
  saveFile,
  getFileUrl,
  getFileUrlSync,
};
