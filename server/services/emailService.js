const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');

const options = {
  auth: {
    api_key: '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'
  },
};

const mailer = nodemailer.createTransport(sgTransport(options));

module.exports = {
  mailer,
};