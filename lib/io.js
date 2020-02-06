const Message = require('./models/Message');
const UserByWorkspace = require('./models/UserByWorkspace');

module.exports = (io, socket, next) => {
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
        socket.emit('history', messages);
      })
      .catch(next);
  });

  socket.on('leave', function(channel) {
    socket.leave(channel);
  });

  socket.on('chat message', function(data) {
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
};
