const { Router } = require('express');
const Workspace = require('../models/Workspace');
const UserByWorkspace = require('../models/UserByWorkspace');
const ensureAuth = require('../middleware/ensure-auth');

module.exports = Router()
  .post('/', ensureAuth, (req, res, next) => {
    const { name } = req.body;

    Workspace
      .create({ name, owner: req.user._id })
      .then(workspace => {
        return UserByWorkspace.create({ 
          userId: req.user._id,
          workspaceId: workspace._id
        });
      })
      .then(rel => res.send(rel))
      .catch(next);
  })
  .get('/owner', ensureAuth, (req, res, next) => {
    Workspace
      .find({ owner: req.user._id })
      .then(workspaces => res.send(workspaces))
      .catch(next);
  });
