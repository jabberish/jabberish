const { Router } = require('express');
const Workspace = require('../models/Workspace');
const Channel = require('../models/Channel');
const UserByWorkspace = require('../models/UserByWorkspace');
const User = require('../models/User');
const ensureAuth = require('../middleware/ensure-auth');

module.exports = Router()
  .delete('/workspace/:id', ensureAuth, (req, res, next) => {
    UserByWorkspace
      .findOneAndDelete({ user: req.user._id, workspace: req.params.id })
      .then(rel => res.send(rel))
      .catch(next);
  });
