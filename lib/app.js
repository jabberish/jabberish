const express = require('express');
const cors = require('cors');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const cookie = require('cookie');
const cookieParser = require('cookie-parser');
const handler = require('./io');
const morgan = require('morgan');

const User = require('./models/User');

app.use(cookieParser());
app.use(express.json());
if(process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}
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
  .on('connection', (socket, next) => handler(io, socket, next));

app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/users', require('./routes/users'));
app.use('/api/v1/workspaces', require('./routes/workspaces'));
app.use('/api/v1/channels', require('./routes/channels'));

app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = { http };
