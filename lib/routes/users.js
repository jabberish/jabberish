const { Router } = require('express');
const UserByWorkspace = require('../models/UserByWorkspace');
const Workspace = require('../models/Workspace');
const Message = require('../models/Message');
const ensureAuth = require('../middleware/ensure-auth');

module.exports = Router()
  .delete('/workspace/:id', ensureAuth, (req, res, next) => {
    Workspace
      .findById(req.params.id)
      .then(workspace => {
        if(workspace.owner === req.user._id) {
          throw new Error('You may not leave a workspace which you own');
        }
        return UserByWorkspace
          .findOneAndDelete({ user: req.user._id, workspace: req.params.id });
      })
      .then(rel => res.send(rel))
      .catch(next);
  })
  .get('/active', ensureAuth, (req, res, next) => {
    Message.getTopActiveUsers()
      .then(active => res.send(active))
      .catch(next);
  });
