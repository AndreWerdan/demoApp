const crypto = require('crypto');
const { UserModel } = require('../services/db');

function getUserByEmailPass(opts = {}, callback) {
  let { email, password } = opts;
  const shaSum = crypto.createHash('sha256');

  email = email.toString().toLowerCase().trim();
  password = password.toString();
  shaSum.update(password);

  UserModel.findOne({
    email,
    password: shaSum.digest('hex'),
  }).select({
    _id: 1,
  }).exec((err, userModel) => {
    if (err) {
      return callback(err);
    }

    return callback(null, userModel);
  });
}

function createUser(opts, callback) {
  let { email, password } = opts;
  const shaSum = crypto.createHash('sha256');

  email = email.toString().toLowerCase().trim();
  password = password.toString();
  shaSum.update(password);

  getUserByEmailPass({ email, password }, (err0, userModel) => {
    if (err0) {
      return callback(err0);
    }

    if (userModel) {
      return callback({
        message: 'user already exist',
        status: 402,
      });
    }

    return UserModel.create({
      email,
      password: shaSum.digest('hex'),
    }, (err1) => {
      if (err1) {
        callback(err1);
      }

      return callback();
    });
  });
}

module.exports = {
  getUserByEmailPass,
  createUser,
};
