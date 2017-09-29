const { Router } = require('express');
const { getCompanyInfo, editCompanyInfo } = require('../services/companyService');
const { getFileUrlSync } = require('../services/fileService');
const { fileMiddleware, saveFile } = require('../services/fileService');
const { toScuarePng } = require('../services/imageService');
const async = require('async');

const companyUpdateFiles = fileMiddleware.fields([{
  name: 'banner',
  maxCount: 1,
}, {
  name: 'image',
  maxCount: 1,
},{
  name: 'logo',
  maxCount: 1,
}]);

const homeRouter = Router();

homeRouter.get('/', (req, res, next) => {
  getCompanyInfo((err, companyData) => {
    if (err) {
      return next(err);
    }

    if (!companyData) {
      return next({
        message: 'no company info',
        status: 400,
      });
    }

    companyData.logo = getFileUrlSync(companyData.logo);
    companyData.banner = getFileUrlSync(companyData.banner);
    companyData.image = getFileUrlSync(companyData.image);

    res.customResponseData = companyData;
    res.customResponseStatus = 200;

    return next();
  });
});

homeRouter.put('/', companyUpdateFiles, (req, res, next) => {
  const { files, body } = req;
  const { logo = [], banner = [], image = [] } = files;
  const logoFile = logo[0];
  const bannerFile = banner[0];
  const imageFile = image[0];

  async.parallel({
    logo: (pCb) => {
      if (!logoFile) {
        return pCb();
      }
      const file = logoFile;

      return toScuarePng({
        filePath: file.path,
        fileName: file.filename,
        fromExtension: file.originalname.split('.').pop(),
        toExtension: 'png',
        size: 100,
      }, (err, newFileData) => {
        if (err) {
          return pCb(err);
        }

        return saveFile(newFileData, (decodeErr, uploadedFileData) => {
          if (decodeErr) {
            return pCb(decodeErr);
          }

          body.logo = uploadedFileData.fileName;

          return pCb();
        });
      });
    },
    image: (pCb) => {
      if (!imageFile) {
        return pCb();
      }
      const file = imageFile;

      return toScuarePng({
        filePath: file.path,
        fileName: file.filename,
        fromExtension: file.originalname.split('.').pop(),
        toExtension: 'png',
        size: 500,
      }, (err, newFileData) => {
        if (err) {
          return pCb(err);
        }

        return saveFile(newFileData, (decodeErr, uploadedFileData) => {
          if (decodeErr) {
            return pCb(decodeErr);
          }

          body.image = uploadedFileData.fileName;

          return pCb();
        });
      });
    },
    banner: (pCb) => {
      if (!bannerFile) {
        return pCb();
      }
      const file = bannerFile;

      return toScuarePng({
        filePath: file.path,
        fileName: file.filename,
        fromExtension: file.originalname.split('.').pop(),
        toExtension: 'png',
        size: 500,
      }, (err, newFileData) => {
        if (err) {
          return pCb(err);
        }

        return saveFile(newFileData, (decodeErr, uploadedFileData) => {
          if (decodeErr) {
            return pCb(decodeErr);
          }

          body.banner = uploadedFileData.fileName;

          return pCb();
        });
      });
    }
  }, (err, fileData) => {
    if (err) {
      //return next(err);
    }

    editCompanyInfo({
      body,
    }, (editError, companyData) => {
      if (editError) {
        return next(editError);
      }

      companyData.logo = getFileUrlSync(companyData.logo);
      companyData.banner = getFileUrlSync(companyData.banner);
      companyData.image = getFileUrlSync(companyData.image);

      res.customResponseData = companyData;
      res.customResponseStatus = 200;

      return next();
    });
  });

});

module.exports = {
  homeRouter,
};


