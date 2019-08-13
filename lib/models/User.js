const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  profileImage: {
    type: String,
    required: true,
    default: 'https://i.pravatar.cc/150?u=fake@pravatar.com'
  },
  passwordHash: String
}, {
  toJSON: {
    transform: function(doc, ret) {
      delete ret.passwordHash;
      delete ret.__v;
    }
  }
});

userSchema.virtual('password').set(function(clearPassword) {
  this.passwordHash = bcrypt.hashSync(clearPassword);
});

userSchema.methods.compare = function(clearPassword) {
  return bcrypt.compareSync(clearPassword, this.passwordHash);
};

userSchema.methods.authToken = function() {
  return jwt.sign(this.toJSON(), process.env.APP_SECRET, { expiresIn: '24h' });
};

userSchema.statics.findByToken = function(token) {
  try {
    const userPayload = jwt.verify(token, process.env.APP_SECRET);
    return this
      .findById(userPayload._id);
  } 
  catch(err) {
    throw new Error('invalid token');
  }
};

module.exports = mongoose.model('User', userSchema);
