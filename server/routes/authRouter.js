const { Router } = require('express');
const { getUserByEmailPass } = require('../services/userService');
const { setSessionAsAdminSession, destroySession, userIsAdmin } = require('../services/sessionService');

const authRouter = Router();

authRouter.post('/signIn', (req, res, next) => {
  const { email, password } = req.body;

  getUserByEmailPass({ email, password }, (err, userData) => {
    if (err) {
      return next(err);
    }

    if (!userData) {
      return next({
        message: 'bad email or password',
        status: 401,
      });
    }

    setSessionAsAdminSession(req);
    res.customResponseData = {};
    res.customResponseStatus = 200;

    return next();
  });
});
authRouter.get('/signOut', (req, res, next) => {
  destroySession(req, (err) => {
    if (err) {
      return next(err);
    }

    res.customResponseData = {};
    res.customResponseStatus = 200;

    return next();
  });
});
authRouter.get('/checkAuth', (req, res, next) => {
  const isAdmin = userIsAdmin(req);

  if (isAdmin) {
    res.customResponseData = {};
    res.customResponseStatus = 200;
  } else {
    res.customResponseData = {};
    res.customResponseStatus = 401;
  }

  return next();
});

authRouter.get('/session', (req, res, next) => {
  res.status(200).send({ session: req.session })
});

module.exports = {
  authRouter,
};
