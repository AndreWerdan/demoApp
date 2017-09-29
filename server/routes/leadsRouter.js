const { Router } = require('express');
const { getLeads, createOrUpdateLead, createOrUpdateLeadAndCreateMissing } = require('../services/leadsService');

const leadsRouter = Router();

leadsRouter.get('/', (req, res, next) => {
  const { originalUrl } = req;
  let query = originalUrl.split('?')[1] || '';

  try {
    query = JSON.parse(decodeURIComponent(query));
  } catch (err) {
    query = {};
  }

  getLeads(query, (err, data) => {
    if (err) {
      return next(err);
    }

    res.customResponseData = data;
    res.customResponseStatus = 200;

    return next();
  });
});

leadsRouter.post('/:industryId', (req, res, next) => {
  const body = req.body;
  const params = req.params;
  const industryId = params.industryId;

  createOrUpdateLeadAndCreateMissing(industryId, body, (err, result) => {
    if (err) {
      return next(err);
    }

    res.customResponseData = result;
    res.customResponseStatus = 201;

    return next();
  });
});

module.exports = {
  leadsRouter,
};
