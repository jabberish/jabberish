const { Router } = require('express');
const UserByWorkspace = require('../models/UserByWorkspace');
const ensureAuth = require('../middleware/ensure-auth');

module.exports = Router()
  .delete('/workspace/:id', ensureAuth, (req, res, next) => {
    UserByWorkspace
      .findOneAndDelete({ user: req.user._id, workspace: req.params.id })
      .then(rel => res.send(rel))
      .catch(next);
  });
