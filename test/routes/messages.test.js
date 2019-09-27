const { getToken, getUsers, getChannels, getWorkspaces } = require('../data-helpers');
const io = require('socket.io-client');
const { http } = require('../../lib/app');

describe('auth routes', () => {
  let socket;
  let user;
  let channel;
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
  });

  afterAll(() => {
    http.close();
  });

  it('connects to a room and returns the chat history', (done) => {
    socket.on('history', (msgs) => {
      expect(msgs).toEqual(expect.any(Array));
      expect(msgs[0]).toEqual({
        _id: expect.any(String),
        user: expect.any(Object),
        channel: channel._id,
        workspace: workspace._id,
        text: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        __v: 0
      });
      socket.close();
      done();
    });
    socket.emit('join', { channel: channel._id, workspace: workspace._id, user });
    socket.emit('leave', channel._id);
  });
});
