const { waterfall } = require('async');
const { CompanyModel } = require('../services/db');
const { toScuarePng } = require('../services/imageService');

function getCompanyInfo(callback) {
  const aggregateQuery = [
    {
      $match: {
        main: true,
      },
    },
    {
      $lookup: {
        from: 'industries',
        localField: 'main',
        foreignField: 'main',
        as: 'industries',
      },
    },
    {
      $unwind: {
        path: '$industries',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        name: 1,
        info: 1,
        logo: 1,
        introduction: 1,
        url: 1,
        banner: 1,
        image: 1,
        industries: {
          id: '$industries._id',
          name: '$industries.name',
        },
      },
    },
    {
      $group: {
        _id: '$_id',
        name: { $first: '$name' },
        info: { $first: '$info' },
        logo: { $first: '$logo' },
        introduction: { $first: '$introduction' },
        url: { $first: '$url' },
        banner: { $first: '$banner' },
        image: { $first: '$image' },
        industries: { $push: '$industries' },
      },
    },
  ];

  CompanyModel.aggregate(aggregateQuery, (err, companyData) => {
    if (err) {
      return callback(err);
    }

    if (!companyData) {
      return callback({
        message: 'company not found',
        status: 404,
      });
    }

    return callback(null, companyData[0]);
  });
}

function editCompanyInfo(request, callback) {
  const { body } = request;
  const { name, info, introduction, url, banner, logo, image } = body;

  waterfall([

    // check if company exist
    function (cb) {
      CompanyModel.findOne({ main: true }, (err, companyModel) => {
        if (err) {
          return cb(err);
        }

        if (!companyModel) {
          return cb({
            message: 'company not found',
            status: 404,
          });
        }

        return cb(null, companyModel);
      });
    },

    // save company data
    function (companyModel, cb) {
      if (name) {
        companyModel.name = name;
      }

      if (info) {
        companyModel.info = info;
      }

      if (introduction) {
        companyModel.introduction = introduction;
      }

      if (url) {
        companyModel.url = url;
      }

      if (banner) {
        companyModel.banner = banner;
      }

      if (image) {
        companyModel.image = image;
      }

      if (logo) {
        companyModel.logo = logo;
      }

      companyModel.save((err) => {
        if (err) {
          return cb(err);
        }

        return cb(null, companyModel);
      });
    },
  ], (err, companyData) => {
    if (err) {
      return callback(err);
    }

    return callback(null, companyData);
  });
}

function createCompany(options, callback) {
  return CompanyModel.create(options, (err) => {
    if (err) {
      callback(err);
    }

    return callback();
  });
}

module.exports = {
  getCompanyInfo,
  createCompany,
  editCompanyInfo,
};
