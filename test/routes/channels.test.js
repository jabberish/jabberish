const { getAgent, getWorkspaces, getChannels } = require('../data-helpers');
const request = require('supertest');
const { http } = require('../../lib/app');

process.env.NODE_ENV = 'test';

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

  it('fails to create a workspace because no token', () => {
    const workspace = getWorkspaces()[0];
    return request(http)
      .post('/api/v1/channels')
      .send({ name: 'test-channel', workspace: workspace._id })
      .then(res => {
        expect(res.body).toEqual({
          status: 401,
          message: 'No session cookie'
        })
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

  it('deletes a channel by a member of it`s workspace', () => {
    const channel = getChannels()[0];
    return getAgent()
      .delete(`/api/v1/channels/${channel._id}/${channel.workspace}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: channel._id,
          name: channel.name,
          workspace: channel.workspace
        });
      });
  });

  it('returns a list of the top active channels by how many messages they have', () => {
    return getAgent()
      .get('/api/v1/channels/active')
      .then(res => {
        expect(res.body).toHaveLength(10);
        res.body.slice(0, 9).forEach((workspace, i) => {
          expect(res.body[i].count).toBeGreaterThanOrEqual(res.body[i + 1].count);
        });
      });
  });

  it('returns the top channels by the most unique active users', () => {
    return getAgent()
      .get('/api/v1/channels/unique')
      .then(res => {
        expect(res.body).toHaveLength(10);
        res.body.slice(0, 9).forEach((workspace, i) => {
          expect(res.body[i].users).toBeGreaterThanOrEqual(res.body[i + 1].users);
        });
      });
  });
});
