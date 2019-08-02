const mongoose = require('mongoose');

const channelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  workspace: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workspace',
    required: true
  }
}, {
  toJSON: {
    transform: function(doc, ret) {
      delete ret.__v;
    }
  }
});

module.exports = mongoose.model('Channel', channelSchema);
