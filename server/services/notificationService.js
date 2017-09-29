const { mailer } = require('./emailService');
const { logger } = require('./loggerService');
const { ADMIN_EMAIL } = require('../config');

function sendNewLeadNotification(leadData) {
  const fields = Object.keys(leadData);

  const textVariant = fields.reduce((result, key) => {
    return `${result}\r\n${key}:     ${leadData[key]}`;
  }, '');

  mailer.sendMail({
    to: [ADMIN_EMAIL],
    from: ADMIN_EMAIL,
    subject: 'New lead',
    text: textVariant,
  }, (err) => {
    if (err) {
      return logger.error(err);
    }

    return logger.info('Email about new lead sent');
  });
}

module.exports = {
  sendNewLeadNotification,
};
