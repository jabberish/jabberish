const express = require('express');
const cors = require('cors');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const cookie = require('cookie');
const cookieParser = require('cookie-parser');
const User = require('./models/User');

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

      next();
    });
})
  .on('connection', function(socket) {
    console.log('a user connected');

    socket.on('chat message', function(msg) {
      console.log('message: ' + msg);
      io.emit('chat message', msg);
    });

    socket.on('disconnect', function() {
      console.log('user disconnected');
    });

  });

app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/workspaces', require('./routes/workspaces'));

app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = http;
