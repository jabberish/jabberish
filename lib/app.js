const express = require('express');
const cors = require('cors');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const cookie = require('cookie');
const cookieParser = require('cookie-parser');

const User = require('./models/User');
const Message = require('./models/Message');
const UserByWorkspace = require('./models/UserByWorkspace');

app.use(cookieParser());
app.use(express.json());
app.use(cors({
  origin: true,
  credentials: true 
}));

app.use(express.static('public'));

io.origins('*:*');

io.use(function(socket, next) {
  const token = cookie.parse(socket.handshake.headers.cookie).session;
  if(!token) {
    const err = new Error('No session cookie');
    err.status = 401;
    return next(err);
  }
  User
    .findByToken(token)
    .then(user => {
      if(!user) {
        const err = new Error('Invalid token');
        err.status = 401;
        return next(err);
      }
      socket.user = user;
      next();
    })
    .catch(next);
})
  .on('connection', function(socket, next) {
    console.log('user connected');
    socket.on('join', function(data) {
      UserByWorkspace
        .findOne({ user: data.user, workspace: data.workspace })
        .then(rel => {
          if(!rel._id) throw new Error('You must be a member of the workspace to join this channel');
          return Message
            .find({ channel: data.channel })
            .populate('user')
            .sort({ date: -1 });
        })
        .then(messages => {
          socket.join(data.channel);
          console.log('user joined channel');
          socket.emit('history', messages);
        })
        .catch(next);
    });

    socket.on('leave', function(channel) {
      console.log('user left channel');
      socket.leave(channel);
    });

    socket.on('chat message', function(data) {
      console.log('chat message:', data);
      Message
        .create({ 
          user: data.user, 
          channel: data.channel, 
          workspace: data.workspace, 
          text: data.message
        })
        .then(message => {
          message.user = socket.user;
          io.to(data.channel).emit('chat message', message);
        })
        .catch(next);
    });
  });

app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/users', require('./routes/users'));
app.use('/api/v1/workspaces', require('./routes/workspaces'));
app.use('/api/v1/channels', require('./routes/channels'));

app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = http;
