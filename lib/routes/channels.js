const { Router } = require('express');
const Workspace = require('../models/Workspace');
const Channel = require('../models/Channel');
const UserByWorkspace = require('../models/UserByWorkspace');
const User = require('../models/User');
const ensureAuth = require('../middleware/ensure-auth');

module.exports = Router()
  .post('/', ensureAuth, (req, res, next) => { 
    const { name, workspace } = req.body;
    UserByWorkspace
      .findOne({ user: req.user.id, workspace })
      .then(rel => {
        if(!rel) {
          const err = new Error('You must be a member of a workspace to add a channel');
          err.status = 403;
          return next(err);
        }

        return Channel.create({ name, workspace });
      })
      .then(channel => res.send(channel))
      .catch(next);
  });  
