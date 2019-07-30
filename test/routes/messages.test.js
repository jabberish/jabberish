const { getToken, getChannels } = require('../data-helpers');
const io = require('socket.io-client');
const http = require('../../lib/app');

describe('auth routes', () => {
  beforeEach(() => {
    http.listen(3001);
  });

  afterAll(() => {
    http.close();
  });
  
  it('connects to a socket and sends a message', (done) => {
    const token = getToken();
    const channel = getChannels()[0];
    const socket = io.connect('http://localhost:3001', {
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
