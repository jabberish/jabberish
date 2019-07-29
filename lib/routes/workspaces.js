const { Router } = require('express');
const Workspace = require('../models/Workspace');
const ensureAuth = require('../middleware/ensure-auth');

module.exports = Router()
  .post('/', ensureAuth, (req, res, next) => {
    const { name } = req.body;

    Workspace
      .create({ name, owner: req.user._id })
      .then(workspace => res.send(workspace))
      .catch(next);
  })
  .get('/', ensureAuth, (req, res, next) => {
    Workspace
      .find()
      .then(workspaces => res.send(workspaces))
      .catch(next);
  });
