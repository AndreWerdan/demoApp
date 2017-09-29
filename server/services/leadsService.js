const async = require('async');
const mongoose = require('mongoose');

const ObjectId = mongoose.Types.ObjectId;
const { LeadsModel } = require('../services/db');
const { sendNewLeadNotification } = require('../services/notificationService');
const { getAllIndustries } = require('../services/industryService');

const emailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

function addReport(report, type, mathObj) {
  report.forEach((industry) => {
    if (!industry.value) {
      return;
    }

    if (!mathObj.$or) {
      mathObj.$or = [];
    }

    mathObj.$or.push({
      'reports.industryId': new ObjectId(industry.id),
      [`reports.${type}`]: industry.value === 'true',
    });

    //mathObj.industryId = new ObjectId(industry.id);
    //mathObj[type] = industry.value === 'true';
  });
}

function getLeads(options, callback) {
  //let { c: count = 25, p: page = 1, s: sort = {}, f: filter = {} } = options;
  const page = options.p || 1;
  const count = options.c || 25;
  let sort = options.s || {};
  const filter = options.f || {};
  const filterKeys = Object.keys(filter);
  let matchObject = {};
  let quickSortMatch = [];
  let aggregateQuery = [];
  let fields = ['company', 'email', 'name', 'title', 'jobPosition'];
  let incomingFields = [];
  let dropdownFilter = {};
  let matchArr;
  let groupStage;
  let reportSortOrder;

  const REPORT_FIELD_NAMES = ['companyReport', 'industryReport', 'downloadReport'];
  const sortKeys = Object.keys(sort);

  let reportId = sort.id || '';
  const reportKey = REPORT_FIELD_NAMES.reduce((result, reportKeyName) => {
    if (result) {
      return result;
    }

    if (sortKeys.indexOf(reportKeyName) !== -1) {
      return reportKeyName;
    }

    return result;
  }, '');

  if (reportKey && reportId) {
    reportSortOrder = sort[reportKey];
    sort = {
      "sortReportKey": reportSortOrder,
    };
    sort.sortReportType = reportSortOrder;
  } else {
    reportId = '000000000000000000000000';
  }

  if (!sortKeys.length) {
    sort = {
      createdAt: -1,
    }
  }

  fields.forEach((key) => {
    if (filterKeys.indexOf(key) === -1 || !filter[key]) {
      return;
    }

    incomingFields.push(key);
    matchObject[key] = { $regex: new RegExp(`.*${filter[key]}.*`, 'ig') };
  });

  if (filter.dateFrom && filter.dateTo) {
    matchObject.$and = [
      { createdAt: { $gte: new Date(filter.dateFrom) } },
      { createdAt: { $lte: new Date(filter.dateTo) } },
    ];
  }

  if (filter.downloadReport && filter.downloadReport[0]) {
    addReport(filter.downloadReport, 'downloadReport', dropdownFilter);
  }

  if (filter.industryReport && filter.industryReport[0]) {
    addReport(filter.industryReport, 'industryReport', dropdownFilter);
  }

  if (filter.companyReport && filter.companyReport[0]) {
    addReport(filter.companyReport, 'companyReport', dropdownFilter);
  }

  /*if (sort.id) {
    if (!matchObject.$or) {
      matchObject.$or = [];
    }

    matchObject.$or.push({
      industryId: new ObjectId(sort.id),
    });

    delete sort.id;
  }*/

  aggregateQuery.push({
    $match: matchObject,
  });

  if (filter.quickSearch) {
    matchArr = incomingFields.length && fields.length >= incomingFields.length ? incomingFields : fields;

    matchArr.forEach((field) => {
      quickSortMatch.push({
        [field]: { $regex: new RegExp(`.*${filter.quickSearch}.*`, 'ig') },
      });
    });

    aggregateQuery.push({
      $match: {
        $or: quickSortMatch,
      },
    });
  }

  groupStage = [{
    $sort: {
      createdAt: -1,
    },
  }, {
    $project: {
      sortReportKey: {
        $cond: [{ $eq: ['$industryId', ObjectId(reportId)] }, true, false],
      },
      sortReportType: `${reportKey ? '$' + reportKey : 0}`,
      email: 1,
      company: 1,
      name: 1,
      industryId: 1,
      jobPosition: 1,
      createdAt: 1,
      companyReport: 1,
      industryReport: 1,
      downloadReport: 1,
    }
  }, {
    $group: {
      _id: '$email',
      email: {
        $first: '$email',
      },
      company: {
        $first: '$company',
      },
      name: {
        $first: '$name',
      },
      jobPosition: {
        $first: '$jobPosition',
      },
      createdAt: {
        $max: '$createdAt',
      },
      sortReportKey: {
        $max: "$sortReportKey",
      },
      sortReportType: {
        $max: {
          $cond: [
            {
              $eq: ["$sortReportKey", true]
            },
            "$sortReportType",
            false
          ]},
      },
      reports: {
        $push: {
          industryId: '$industryId',
          companyReport: '$companyReport',
          industryReport: '$industryReport',
          downloadReport: '$downloadReport',
        },
      },
    },
  }];

  aggregateQuery.push(...groupStage);
  Object.keys(dropdownFilter).length && aggregateQuery.push({
    $match: dropdownFilter,
  });

  aggregateQuery.push({
    $sort: sort,
  }, {
    $skip: (page - 1) * count,
  }, {
    $limit: count,
  });

  async.parallel({
    data(cb) {
      LeadsModel.aggregate(aggregateQuery, (err, leads) => {
        if (err) {
          return cb(err);
        }

        return cb(null, leads);
      });
    },
    total(cb) {
      let totalAggregation = [{
        $match: matchObject,
      }];

      if (filter.quickSearch) {
        totalAggregation.push({
          $match: {
            $or: quickSortMatch,
          },
        });
      }

      totalAggregation.push(...groupStage);

      LeadsModel.aggregate(totalAggregation, (err, leads) => {
        if (err) {
          return cb(err);
        }

        return cb(null, leads.length);
      });
    },
  }, (err, data) => {
    if (err) {
      return callback(err);
    }

    return callback(null, data);
  });
}

function getLeadByIndustryIdAndEmail(industryId, email, callback) {
  const normalizedEmail = (email || '').trim().toLowerCase();
  const iMailIsValid = emailRegExp.test(normalizedEmail);

  if (!iMailIsValid) {
    callback({
      message: 'bad email',
      status: 400,
    });
  }

  LeadsModel.findOne({
    industryId: ObjectId(industryId),
    email: normalizedEmail,
  }, callback);
}

function getLeadsByEmail(email, callback) {
  const normalizedEmail = (email || '').trim().toLowerCase();

  LeadsModel.find({
    email: normalizedEmail,
  }, callback);
}

function createLead(data, callback) {
  const { company, name, email, jobPosition, industryId, downloadReport, industryReport, companyReport } = data;

  const normalizedEmail = (email || '').trim().toLowerCase();
  const iMailIsValid = emailRegExp.test(normalizedEmail);

  LeadsModel.create({
    company,
    name,
    email: normalizedEmail,
    jobPosition,
    industryId: ObjectId(industryId),
    downloadReport: !!downloadReport,
    industryReport: !!industryReport,
    companyReport: !!companyReport,
  }, (err) => {
    if (err) {
      return callback(err);
    }

    return callback();
  });

}

function updateLeadByIndustryIdAndEmail(industryId, email, data, callback) {
  const { company, name, jobPosition, downloadReport, industryReport, companyReport } = data;
  const normalizedEmail = (email || '').trim().toLowerCase();
  const updateObject = {
    company,
    name,
    jobPosition,
    createdAt: new Date(),
  };

  if (downloadReport) {
    updateObject.downloadReport = true;
  }

  if (industryReport) {
    updateObject.industryReport = true;
  }

  if (companyReport) {
    updateObject.companyReport = true;
  }

  LeadsModel.update({
    industryId: ObjectId(industryId),
    email: normalizedEmail,
  }, updateObject, (err) => {
    callback(err);
  });
}

function createOrUpdateLead(industryId, data, callback) {
  const { email } = data;
  const normalizedEmail = (email || '').trim().toLowerCase();
  const iMailIsValid = emailRegExp.test(normalizedEmail);

  data.email = normalizedEmail;
  data.createdAt = Date.now();

  async.waterfall([
    (wCb) => {
      getLeadByIndustryIdAndEmail(industryId, normalizedEmail, (err, leadModel) => {
        if (err) {
          return wCb(err);
        }

        return wCb(null, leadModel);
      })
    },

    (leadModel, wCb) => {
      if (!leadModel) {
        return createLead(Object.assign(data, { industryId: industryId }), (err) => {
          wCb(err);
        });
      }

      return updateLeadByIndustryIdAndEmail(industryId, normalizedEmail, data, (err) => {
        wCb(err);
      });

    },

  ], (err) => {
    if (!err) {
      sendNewLeadNotification({
        company: data.company,
        name: data.name,
        email: normalizedEmail,
        jobPosition: data.jobPosition,
        industryId,
        downloadReport: !!data.downloadReport,
        industryReport: !!data.industryReport,
        companyReport: !!data.companyReport,
      });
    }

    return callback(err);
  });
}

function createOrUpdateLeadAndCreateMissing(industryId, data, callback) {
  const { email } = data;
  const normalizedEmail = (email || '').trim().toLowerCase();

  async.waterfall([
    (wCb) => {
      async.parallel({
        leads: (pCb) => {
          getLeadsByEmail(normalizedEmail, pCb);
        },

        industries: (pCb) => {
          getAllIndustries(pCb);
        },
      }, wCb);
    },

    (existLeadsData, wCb) => {
      const {leads, industries} = existLeadsData;
      const industriesWithReports = leads.reduce((result, lead) => {
        const leadIndustryId = lead.industryId.toJSON();
        result.push(leadIndustryId);

        return result;
      }, []);

      const industriesWithoutReport = industries.reduce((result, industry) => {
        const id = industry._id.toJSON();

        if (industriesWithReports.indexOf(id) === -1 && id !== industryId) {
          result.push(id);
        }

        return result;
      }, []);

      async.parallel({
        createOrUpdate: (pCb) => {
          const updateLead = industriesWithReports.indexOf(industryId) !== -1;

          if (!updateLead) {
            return createLead(Object.assign(data, {industryId}), pCb);
          }

          return updateLeadByIndustryIdAndEmail(industryId, normalizedEmail, data, pCb);
        },

        createFirstIndustryLeadsWithFalse: (pCb) => {
          async.each(industriesWithoutReport, (id, eCb) => {
            const newData = Object.assign(data, {
              industryId: id,
              downloadReport: false,
              industryReport: false,
              companyReport: false,
            });

            return createLead(newData, eCb);
          }, pCb);
        },
      }, (err) => {
        return wCb(err);
      });
    },
  ], (err) => {
    if (!err) {
      sendNewLeadNotification({
        company: data.company,
        name: data.name,
        email: normalizedEmail,
        jobPosition: data.jobPosition,
        industryId,
        downloadReport: !!data.downloadReport,
        industryReport: !!data.industryReport,
        companyReport: !!data.companyReport,
      });
    }

    return callback(err);
  });
}

module.exports = {
  getLeads,
  createOrUpdateLead,
  createOrUpdateLeadAndCreateMissing,
};
