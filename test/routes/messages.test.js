const { getToken, getChannels } = require('../data-helpers');
const io = require('socket.io-client');

describe('auth routes', () => {
  it('connects to a socket and sends a message', async(done) => {
    const token = getToken();
    const channel = getChannels()[0];
    const socket = io.connect('http://localhost:3000', {
      extraHeaders: { Cookie: token },
      'reconnection delay' : 0, 
      'reopen delay' : 0, 
      'force new connection' : true, 
      transports: ['websocket']
    });
    socket.on('history', (msg) => {
      expect(msg).toEqual(expect.any(Array));
      done();
    });
    socket.emit('join', channel._id);
  });
});
