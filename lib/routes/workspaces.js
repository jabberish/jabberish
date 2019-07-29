const { Router } = require('express');
const Workspace = require('../models/Workspace');
const UserByWorkspace = require('../models/UserByWorkspace');
const User = require('../models/User');
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
  .post('/add-user/:id', ensureAuth, (req, res, next) => {
    const { username } = req.body;

    Workspace
      .findById(req.params.id)
      .then(workspace => {
        if(!workspace) {
          const err = new Error('Workspace not found');
          err.status = 404;
          return next(err);
        } else if(workspace.owner.toString() !== req.user._id.toString()) {
          const err = new Error('You are not allowed to add users to this workspace');
          err.status = 403;
          return next(err);
        }
        return User
          .findOne({ username: username });
      })
      .then(user => {
        return UserByWorkspace
          .create({ userId: user._id, workspaceId: req.params.id });
      })
      .then(rel => {
        res.send(rel);
      })
      .catch(next);
  })
  .get('/owner', ensureAuth, (req, res, next) => {
    Workspace
      .find({ owner: req.user._id })
      .then(workspaces => res.send(workspaces))
      .catch(next);
  });
