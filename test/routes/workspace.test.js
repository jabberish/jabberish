const { getAgent, getUsers } = require('../data-helpers');
// const request = require('supertest');
// const app = require('../../lib/app');

describe('workspace routes', () => {
  it('creates and returns a workspace', () => {
    const user = getUsers()[0];
    return getAgent()
      .post('/api/v1/workspaces')
      .send({ name: 'test-workspace' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'test-workspace',
          owner: user._id
        });
      });
  });
});
