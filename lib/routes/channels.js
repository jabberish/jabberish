const { Router } = require('express');
const Channel = require('../models/Channel');
const Message = require('../models/Message');
const UserByWorkspace = require('../models/UserByWorkspace');
const ensureAuth = require('../middleware/ensure-auth');

module.exports = Router()
  .post('/', ensureAuth, (req, res, next) => {
    const { name, workspace } = req.body;
    UserByWorkspace.findOne({ user: req.user.id, workspace })
      .then(rel => {
        if (!rel) {
          const err = new Error('You must be a member of a workspace to add a channel');
          err.status = 403;
          return next(err);
        }

        return Channel.create({ name, workspace });
      })
      .then(channel => res.send(channel))
      .catch(next);
  })
  .get('/active', ensureAuth, (req, res, next) => {
    Message.getTopActiveChannels()
      .then(channels => res.send(channels))
      .catch(next);
  })
  .get('/unique', ensureAuth, (req, res, next) => {
    Message.getTopChannelsByUniqueUsers()
      .then(channels => res.send(channels))
      .catch(next);
  })
  .get('/:id', ensureAuth, (req, res, next) => {
    UserByWorkspace.findOne({ user: req.user.id, workspace: req.params.id })
      .then(rel => {
        if (!rel) {
          const err = new Error('You must be a member of a workspace to view its channels');
          err.status = 403;
          return next(err);
        }
        return Channel.find({ workspace: req.params.id });
      })
      .then(channels => res.send(channels))
      .catch(next);
  })
  .delete('/:channelId/:workspaceId', ensureAuth, (req, res, next) => {
    UserByWorkspace.findOne({ user: req.user.id, workspace: req.params.workspaceId })
      .then(rel => {
        if (!rel) {
          const err = new Error('You must be a member of a workspace to add a channel');
          err.status = 403;
          return next(err);
        }
        return Message.deleteMany({ channel: req.params.channelId });
      })
      .then(response => {
        if (!response.ok) throw new Error('Error deleting messages');
        return Channel.findByIdAndDelete(req.params.channelId);
      })
      .then(channel => res.send(channel))
      .catch(next);
  });
