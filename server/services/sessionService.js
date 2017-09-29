const Session = require('express-session');

const sessionMiddleware = Session({
  secret: 'my super hyper secret salt',
  saveUninitialized: false,
  rolling: true,
  resave: false,
});

function isAdminMiddleware(req, res, next) {
  const { isAdmin } = req.session;

  if (!isAdmin) {
    return next({
      message: 'sign in as admin',
      status: 401,
    });
  }

  return next();
}

function setSessionAsAdminSession(req) {
  req.session.isAdmin = true;
}

function destroySession(req, callback) {
  req.session.destroy((err) => {
    if (err) {
      return callback(err);
    }

    return callback();
  });
}

function userIsAdmin(req) {
  const { isAdmin } = req.session;

  return !!isAdmin;
}

module.exports = {
  sessionMiddleware,
  isAdminMiddleware,
  setSessionAsAdminSession,
  userIsAdmin,
  destroySession,
};
