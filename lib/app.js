const express = require('express');
const cors = require('cors');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const cookie = require('cookie');
const cookieParser = require('cookie-parser');

const User = require('./models/User');
const Message = require('./models/Message');

app.use(cookieParser());
app.use(express.json());
app.use(cors());

app.use(express.static('public'));

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

    socket.on('join', function(room) {
      socket.join(room);
      Message
        .find({ channel: room })
        .populate('user')
        .sort({ date: -1 })
        .then(messages => {
          socket.emit('history', messages);
        })
        .catch(next);
    });

    socket.on('leave', function(room) {
      socket.leave(room);
    });

    socket.on('chat message', function(data) {
      Message
        .create({ user: data.user._id, channel: data.room, text: data.message })
        .then(message => {
          message.user = socket.user;
          io.to(data.room).emit('chat message', message);
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
