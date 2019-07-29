const { getAgent, getWorkspaces } = require('../data-helpers');

describe('channels routes', () => {
  it('creates a channel in a workspace the user is a member of', () => {
    const workspace = getWorkspaces()[0];
    return getAgent()
      .post('/api/v1/channels')
      .send({ name: 'test-channel', workspace: workspace._id })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'test-channel',
          workspace: workspace._id
        });
      });
  });

  it('returns a list of all channels in workspace the user is a member of', () => {
    const workspace = getWorkspaces()[0];
    return getAgent()
      .get(`/api/v1/channels/${workspace._id}`)
      .then(res => {
        expect(res.body).toEqual(expect.any(Array));
        res.body.forEach(channel => {
          expect(channel).toEqual({
            _id: expect.any(String),
            name: expect.any(String),
            workspace: expect.any(String)
          });
        });
      });
  });
});
