const { getToken, getUsers, getChannels, getWorkspaces } = require('../data-helpers');
const io = require('socket.io-client');
const http = require('../../lib/app');

const Message = require('../../lib/models/Message');

describe('auth routes', () => {
  let socket;
  let user;
  let channel;
  let messages;
  let workspace;
  beforeEach(async() => {
    http.listen(3001);

    const token = getToken();
    user = getUsers()[0];
    channel = getChannels()[0];
    workspace = getWorkspaces()[0];

    socket = io.connect('http://localhost:3001', {
      extraHeaders: { Cookie: token },
      'reconnection delay' : 0, 
      'reopen delay' : 0, 
      'force new connection' : true, 
      transports: ['websocket']
    });

    const seedMessages = ['message 1', 'message 2', 'message 3'];
    messages = await Message.create(seedMessages.map(message => {
      return {
        user: user._id,
        channel: channel._id,
        workspace: workspace._id,
        text: message
      };
    }));
  });

  afterAll(() => {
    http.close();
  });

  it('connects to a socket and sends a message', (done) => {
    socket.on('history', (msgs) => {
      expect(msgs).toHaveLength(3);
      const JSONmessages = JSON.parse(JSON.stringify(messages));
      JSONmessages.forEach(message => {
        message.user = user;
        expect(msgs).toContainEqual(message);
      });
      socket.close();
      done();
    });
    socket.emit('join', { channel: channel._id, workspace: workspace._id, user });
    socket.emit('leave', channel._id);
  });
});
