const crypto = require('crypto');
const async = require('async');
const mongoose = require('mongoose');
const { IndustryModel, FeaturedCompanyModel } = require('../services/db');
const { getFileUrlSync } = require('../services/fileService');

// checked
function mapFeturedCompany(featuredItem) {
  return {
    id: featuredItem._id,
    title: featuredItem.title || '',
    url: getFileUrlSync(featuredItem.url) || '',
  };
}

function mapIndustryData(industryItem) {
  const featuredCompanies = (industryItem.featuredCompanies || []).map(mapFeturedCompany);

  return {
    id: industryItem._id,
    name: industryItem.name,
    banner: getFileUrlSync(industryItem.banner) || '',
    pdfUrl: getFileUrlSync(industryItem.pdfUrl) || '',
    featuredCompanies: { total: featuredCompanies.length, data: featuredCompanies },
  };
}

function getIndustryById(id, callback) {

  IndustryModel.aggregate([
    {
      $match: {
        _id: mongoose.Types.ObjectId(id),
      },
    },

    {
      $lookup: {
        from: 'featuredCompanies',
        localField: '_id',
        foreignField: 'industryId',
        as: 'featuredCompanies'
      },
    },

    {
      $project: {
        name: 1,
        banner: 1,
        pdfUrl: 1,
        featuredCompanies: 1,
      },
    },
  ], (aggError, industry = []) => {
    if (aggError) {
      return callback(aggError);
    }

    if (!industry.length) {
      return callback({
        message: 'bad industry',
        status: 400,
      });
    }

    const industryItem = industry[0];
    const mappedData = mapIndustryData(industryItem);

    return callback(null, mappedData);
  });

}

function getAllIndustries(callback) {
  IndustryModel.find({}, callback);
}

function getIndustriesForMenu(callback) {
  IndustryModel
    .find({})
    .exec((err, industriesModels) => {
      if (err) {
        return callback(err);
      }

      const industriesData = industriesModels.map((item) => {
        return {
          id: item.id,
          name: item.name
        };
      });

      return callback(null, industriesData);
    });
}

function createIndustry(opts = {}, callback) {
  const {
    name = '',
    banner = '',
    pdfUrl = '',
  } = opts;

  if (!name) {
    return callback({
      message: 'name is required',
      status: 400,
    });
  }

  return IndustryModel.create({
    name,
    banner,
    pdfUrl,
  }, (err) => {
    if (err) {
      return callback(err);
    }

    return callback();
  });
}

function updateIndustry(opts = {}, callback) {
  const { id, name, banner, pdfUrl } = opts;
  const updateObject = {};

  if (pdfUrl !== undefined) {
    updateObject.pdfUrl = pdfUrl;
  }

  if (banner !== undefined) {
    updateObject.banner = banner;
  }

  if (!id) {
    return callback({
      message: 'bad industry id',
      status: 400,
    });
  }

  return IndustryModel.update({ _id: id }, {
    banner,
    pdfUrl,
  }, (err) => {
    if (err) {
      return callback(err);
    }

    return callback();
  });
}

function getIndustryFeaturedCompanies(industryId, callback) {
  FeaturedCompanyModel
    .find({
      industryId,
    }, {
      _id: 1,
      title: 1,
      url: 1,
    }, (err, featuredCompanies) => {
      if (err) {
        return callback(err);
      }

      const mappedData = featuredCompanies.map(mapFeturedCompany);

      return callback(null, mappedData);
    });
}

function removeIndustryFeaturedCompanyByTitle(industryId, title, callback) {
  FeaturedCompanyModel.remove({
    industryId: mongoose.Types.ObjectId(industryId),
    title,
  }, (err, result) => {
    if (err) {
      return callback(err);
    }

    return callback();
  });
}

function createIndustryFeaturedCompany(industryId, data, callback) {

  FeaturedCompanyModel
    .create({
      industryId: mongoose.Types.ObjectId(industryId),
      title: data.title,
      url: data.url,
    }, (err) => {
      if (err) {
        return callback(err);
      }

      return callback();
    });
}

function updateIndustryFeaturedCompanyById(industryId, title, data, callback) {
  const updateObject = Object.assign({}, data);

  FeaturedCompanyModel
    .update({
      industryId: mongoose.Types.ObjectId(industryId),
      title,
    }, updateObject, (err) => {
      if (err) {
        return callback(err);
      }

      return callback();
    });
}

// unchecked

module.exports = {
  getIndustriesForMenu,
  createIndustry,
  getIndustryById,
  updateIndustry,
  getIndustryFeaturedCompanies,
  createIndustryFeaturedCompany,
  removeIndustryFeaturedCompanyByTitle,
  updateIndustryFeaturedCompanyById,
  getAllIndustries,
};
