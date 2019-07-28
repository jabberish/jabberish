require('../data-helpers');
const request = require('supertest');
const app = require('../../lib/app');

describe('auth routes', () => {
  it('creates and returns a user', () => {
    return request(app)
      .post('/api/v1/auth/signup')
      .send({ username: 'test', password: 'password' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          username: 'test',
          profileImage: 'https://i.pravatar.cc/150?u=fake@pravatar.com'
        });
      });
  });
});
