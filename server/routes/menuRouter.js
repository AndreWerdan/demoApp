const { Router } = require('express');
const async = require('async');
const { getIndustriesForMenu } = require('../services/industryService');
const { getCompanyInfo } = require('../services/companyService');
const { fileMiddleware, saveFile, getFileUrlSync } = require('../services/fileService');

const menuRouter = Router();

menuRouter.get('/', (req, res, next) => {

  async.parallel({
    industries: (pCb) => {
      getIndustriesForMenu(pCb);
    },

    companyData: (pCb) => {
      getCompanyInfo((err, companyData) => {
        if (err) {
          return pCb(err);
        }

        return pCb(null, {
          logo: getFileUrlSync(companyData.logo) || '',
          url: companyData.url ||'',
        });
      });

    }
  }, (err, menuData) => {
    if (err) {
      return next(err);
    }

    const response = Object.assign(menuData.companyData, {
      industries: menuData.industries,
    });

    res.customResponseData = response;
    res.customResponseStatus = 200;

    return next();
  });
});

module.exports = {
  menuRouter,
};
