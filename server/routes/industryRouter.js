const { Router } = require('express');
const {
  getIndustryFeaturedCompanies,
  updateIndustry,
  getIndustryById,
  createIndustryFeaturedCompany,
  removeIndustryFeaturedCompanyByTitle,
  updateIndustryFeaturedCompanyById,
} = require('../services/industryService');
const { fileMiddleware, saveFile, getFileUrlSync } = require('../services/fileService');
const { toScuarePng } = require('../services/imageService');
const async = require('async');

const industryUpdateFiles = fileMiddleware.fields([{
  name: 'banner',
  maxCount: 1,
}, {
  name: 'pdfUrl',
  maxCount: 1,
}]);
const featuredCompanyFiles = fileMiddleware.fields([{
  name: 'url',
  maxCount: 1,
}]);

const industryRouter = Router();
const featuredCompaniesRouter = Router({mergeParams: true});

industryRouter.use('/:industryId/featuredCompanies', featuredCompaniesRouter);

industryRouter.get('/:industryId', (req, res, next) => {
  const params = req.params || {};
  const industryId = params.industryId;

  getIndustryById(industryId, (err, data) => {
    if (err) {
      return next(err);
    }

    res.customResponseData = data;
    res.customResponseStatus = 200;

    return next();
  });
});

industryRouter.put('/:industryId', industryUpdateFiles, (req, res, next) => {
  const body = req.body || {};
  const params = req.params || {};
  const files = req.files || {};
  const banner = files.banner || [];
  const pdfUrl = files.pdfUrl || [];
  const bannerFile = banner[0];
  const uploadedPdfFile = pdfUrl[0];
  const industryId = params.industryId;

  let data = {
    id: industryId,
  };

  data = Object.assign(data, body);

  async.waterfall([

    (wCb) => {
      async.parallel([
        /*  decode and save image */
        (pCb) => {
          if (!bannerFile) {
            return pCb();
          }
          const file = bannerFile;

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

              data.banner = uploadedFileData.fileName;

              return pCb();
            });
          });
        },

        /*  save pdf file */
        (pCb) => {
          if (!uploadedPdfFile) {
            return pCb();
          }

          return saveFile({
            fileName: `${uploadedPdfFile.filename}.pdf`,
            filePath: uploadedPdfFile.path,
          }, (decodeErr, uploadedFileData) => {
            if (decodeErr) {
              return pCb(decodeErr);
            }

            data.pdfUrl = uploadedFileData.fileName;

            return pCb();
          });
        }
      ], (perror) => {
        return wCb(perror);
      });
    },

    (wCb) => {
      updateIndustry(data, (err, result) => {
        if (err) {
          return wCb(err);
        }

        return wCb();
      });
    },

    (wCb) => {
      getIndustryById(industryId, (err, industryData) => {
        if (err) {
          return wCb(err);
        }

        return wCb(null, industryData);
      });
    }
  ], (err, industryData) => {
    if (err) {
      return next(err);
    }

    res.customResponseData = industryData;
    res.customResponseStatus = 200;

    return next();
  });

});


featuredCompaniesRouter.get('/', (req, res, next) => {
  const { params } = req;
  const { industryId } = params;

  getIndustryFeaturedCompanies(industryId, (err, data) => {
    if (err) {
      return next(err);
    }

    res.customResponseData = data;
    res.customResponseStatus = 200;

    return next();
  });
});

featuredCompaniesRouter.post('/', featuredCompanyFiles, (req, res, next) => {
  const body = req.body || {};
  const params = req.params || {};
  const files = req.files || {};
  const industryId = params.industryId;
  const title = body.title;
  const url = files.url || [];
  const imageFile = url[0];

  const featuredCompanyData = {
    title,
    url: '',
  };

  async.waterfall([
    (wCb) => {
      if (!imageFile) {
        return wCb();
      }
      const file = imageFile;

      return toScuarePng({
        filePath: file.path,
        fileName: file.filename,
        fromExtension: file.originalname.split('.').pop(),
        toExtension: 'png',
        size: 100,
      }, (err, newFileData) => {
        if (err) {
          return wCb(err);
        }

        return saveFile(newFileData, (decodeErr, uploadedFileData) => {
          if (decodeErr) {
            return wCb(decodeErr);
          }

          featuredCompanyData.url = uploadedFileData.fileName;

          return wCb();
        });
      });
    },
    (wCb) => {
      createIndustryFeaturedCompany(industryId, featuredCompanyData, (err, data) => {
        if (err) {
          return wCb(err);
        }

        return wCb();
      });
    },
  ], (err) => {
    if (err) {
      return next(err);
    }

    res.customResponseData = {
      title: featuredCompanyData.title,
      url: getFileUrlSync(featuredCompanyData.url),
    };
    res.customResponseStatus = 201;

    return next();
  });
});

featuredCompaniesRouter.delete('/:title', (req, res, next) => {
  const params = req.params || {};
  const title = params.title || '';
  const industryId = params.industryId || '';

  removeIndustryFeaturedCompanyByTitle(industryId, title, (err) => {
    if (err) {
      return next(err);
    }

    res.customResponseData = {};
    res.customResponseStatus = 200;

    return next();
  });
});

featuredCompaniesRouter.put('/:title', featuredCompanyFiles, (req, res, next) => {
  const body = req.body || {};
  const params = req.params || {};
  const files = req.files || {};
  const industryId = params.industryId;
  const findTitle = params.title;
  const title = body.title;
  const url = files.url || [];
  const imageFile = url[0];

  const featuredCompanyData = {
    title,
  };

  async.waterfall([
    (wCb) => {
      if (!imageFile) {
        return wCb();
      }
      const file = imageFile;

      return toScuarePng({
        filePath: file.path,
        fileName: file.filename,
        fromExtension: file.originalname.split('.').pop(),
        toExtension: 'png',
        size: 100,
      }, (err, newFileData) => {
        if (err) {
          return wCb(err);
        }

        return saveFile(newFileData, (decodeErr, uploadedFileData) => {
          if (decodeErr) {
            return wCb(decodeErr);
          }

          featuredCompanyData.url = uploadedFileData.fileName;

          return wCb();
        });
      });
    },
    (wCb) => {
      updateIndustryFeaturedCompanyById(industryId, findTitle, featuredCompanyData, (err, data) => {
        if (err) {
          return wCb(err);
        }

        return wCb();
      });
    },
  ], (err) => {
    if (err) {
      return next(err);
    }

    res.customResponseData = {
      title: featuredCompanyData.title,
      url: getFileUrlSync(featuredCompanyData.url),
    };
    res.customResponseStatus = 200;

    return next();
  });
});

module.exports = {
  industryRouter,
};
