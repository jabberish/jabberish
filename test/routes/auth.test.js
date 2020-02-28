process.env.NODE_ENV = 'test';
const { getUsers, getAgent } = require('../data-helpers');
const request = require('supertest');
const { http } = require('../../lib/app');

describe('auth routes', () => {
  it('creates and returns a user', () => {
    return request(http)
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

  it('can signin a user', () => {
    const user = getUsers()[1];
    return request(http)
      .post('/api/v1/auth/signin')
      .send({ username: user.username, password: 'password' })
      .then(res => {
        expect(res.body).toEqual({
          _id: user._id,
          username: user.username,
          profileImage: user.profileImage
        });
      });
  });

  it('can block a user from using an incorrect password', () => {
    const user = getUsers()[1];
    return request(http)
      .post('/api/v1/auth/signin')
      .send({ username: user.username, password: 'not-it' })
      .then(res => {
        expect(res.body).toEqual({
          status: 401,
          message: 'Invalid username/password'
        });
      });
  });

  it('can block a user from using an incorrect username and password', () => {
    return request(http)
      .post('/api/v1/auth/signin')
      .send({ username: 'not-it', password: 'not-it' })
      .then(res => {
        expect(res.body).toEqual({
          status: 401,
          message: 'Invalid username/password'
        });
      });
  });

  it('can verify that a user is signed in', () => {
    // create a user
    const user = getUsers()[0];
    // signin a user
    return getAgent()
      .get('/api/v1/auth/verify')
      .then(res => {
        expect(res.body).toEqual({
          _id: user._id,
          username: user.username,
          profileImage: user.profileImage
        });
      });
  });
});
