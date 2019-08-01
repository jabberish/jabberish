const User = require('../models/User');

module.exports = (req, res, next) => {
  const token = req.cookies.session;
  if(!token) {
    const err = new Error('No session cookie');
    err.status = 401;
    return next(err);
  }

  User
    .findByToken(token)
    .then(user => {
      if(!user) {
        const err = new Error('Invalid token');
        err.status = 401;
        return next(err);
      }

      req.user = user;
      next();
    })
    .catch(err => {
      err.status = 401;
      return next(err);
    });
};
