const { Router } = require('express');
const User = require('../models/User');

module.exports = Router()
  .post('/signup', (req, res, next) => {
    const {
      username,
      password,
      profileImage
    } = req.body;

    User
      .create({ username, password, profileImage })
      .then(user => {
        res.cookie('session', user.authToken(), {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000
        });
        res.send(user);
      })
      .catch(next);
  })
  .post('/signin', (req, res, next) => {
    const {
      username,
      password
    } = req.body;
    User
      .findOne({ username })
      .then(user => {
        if(!user) {
          const err = new Error('Invalid username/password');
          err.status = 401;
          return next(err);
        }

        if(user.compare(password)) {
          res.cookie('session', user.authToken(), {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
          });
          res.send(user);
        } else {
          const err = new Error('Invalid username/password');
          err.status = 401;
          return next(err);
        }
      });
  });
