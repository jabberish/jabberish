const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  channel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Channel',
    required: true
  },
  workspace: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workspace',
    required: true
  },
  text: {
    type: String,
    required: true,
    default: ''
  }
}, { 
  timestamps: true
}, {
  toJSON: {
    transform: function(doc, ret) {
      delete ret.__v;
    }
  }
});

messageSchema.statics.getTopActiveUsers = function() {
  return this.aggregate([
    { $group: { _id: '$user', count: { $sum: 1 } } }, 
    { $sort: { count: -1 } }, 
    { $limit: 10 }, 
    { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } }, 
    { $unwind: { path: '$user' } }, 
    { $project: { count: true, username: '$user.username', profileImage: '$user.profileImage' } }]);
};

messageSchema.statics.getTopActiveWorkspaces = function() {
  return this.aggregate([
    { $group: { _id: '$workspace', count: { $sum: 1 } } }, 
    { $sort: { count: -1 } }, 
    { $limit: 10 }, 
    { $lookup: { from: 'workspaces', localField: '_id', foreignField: '_id', as: 'workspace' } }, 
    { $unwind: { path: '$workspace', } }, 
    { $project: { count: true, workspace: '$workspace.name', owner: '$workspace.owner' } }]);
};

messageSchema.statics.getTopActiveChannels = function() {
  return this.aggregate([
    { $group: { _id: '$channel', count: { $sum: 1 } } }, 
    { $sort: { count: -1 } }, 
    { $limit: 10 }, 
    { $lookup: { from: 'channels', localField: '_id', foreignField: '_id', as: 'channel' } }, 
    { $unwind: { path: '$channel', } }, 
    { $project: { count: true, channel: '$channel.name', workspace: '$channel.workspace' } }]);
};


module.exports = mongoose.model('Message', messageSchema);
